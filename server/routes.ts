import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import nodemailer from "nodemailer";
import { saveContactRequest, saveLead } from "./storage";
import { contactSchema, leadSchema, type ContactRequest } from "@shared/schema";

const NOTIFY_TO = process.env.CONTACT_NOTIFY_TO || "allonzopensa@gmail.com";

function buildEmailHtml(data: ContactRequest): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3D9BE9; border-bottom: 2px solid #3D9BE9; padding-bottom: 10px;">
            Nouveau message — Formulaire KRAON
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #7A3DE9;">Coordonnées</h3>
            <p><strong>Nom :</strong> ${data.name}</p>
            <p><strong>Société :</strong> ${data.company}</p>
            <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.phone ? `<p><strong>Téléphone :</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ""}
          </div>
          <div style="background: #fff; padding: 20px; border-left: 4px solid #3D9BE9; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Envoyé depuis le formulaire de contact du site KRAON.</p>
            <p>Horodatage : ${new Date().toLocaleString("fr-FR")}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send the notification email. Never throws — returns a status so a mail
 * failure (or missing SMTP config) can't break lead capture.
 */
async function sendNotificationEmail(data: ContactRequest): Promise<"ok" | "failed" | "skipped"> {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("[leads] SMTP not configured (SMTP_USER/SMTP_PASS) — skipping notification email.");
    return "skipped";
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"KRAON Contact" <${user}>`,
      to: NOTIFY_TO,
      subject: `Nouveau lead : ${data.name} — ${data.company}`,
      html: buildEmailHtml(data),
      replyTo: data.email,
    });
    return "ok";
  } catch (error) {
    console.error("[leads] Email send failed (continuing):", error instanceof Error ? error.message : error);
    return "failed";
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    // Validation errors are the only thing that should reject the request.
    let data: ContactRequest;
    try {
      data = contactSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      }
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    // Persist + notify independently; neither can take the other down.
    const save = await saveContactRequest(data);
    const email = await sendNotificationEmail(data);

    console.log(
      `[leads] ${data.email} — fallback:${save.fallback} notion:${save.notion} email:${email}`,
    );

    // Only fail if the lead landed nowhere durable at all.
    if (!save.persisted && email !== "ok") {
      return res.status(500).json({
        success: false,
        message: "Impossible d'enregistrer votre demande pour le moment. Merci de réessayer ou de nous écrire directement.",
      });
    }

    res.json({
      success: true,
      message: "Message envoyé. Nous revenons vers vous sous 24 h.",
    });
  });

  // Lightweight lead capture (free scorecard tool, etc.)
  app.post("/api/lead", async (req, res) => {
    let data;
    try {
      data = leadSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      }
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const { persisted } = await saveLead(data);
    console.log(`[leads] lead ${data.email} — source:${data.source} score:${data.score ?? "-"} persisted:${persisted}`);

    if (!persisted) {
      return res.status(500).json({ success: false, message: "Impossible d'enregistrer votre demande. Merci de réessayer." });
    }
    res.json({ success: true, message: "C'est noté ! Votre plan d'action arrive." });
  });

  const httpServer = createServer(app);
  return httpServer;
}
