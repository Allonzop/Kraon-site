import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { contactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = contactSchema.parse(req.body);
      
      // Save to storage
      await storage.saveContactRequest(validatedData);

      // Send email using Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER || process.env.EMAIL_USER,
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
        },
      });

      const emailHtml = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #3D9BE9; border-bottom: 2px solid #3D9BE9; padding-bottom: 10px;">
                New Contact Form Submission - KRAON
              </h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #7A3DE9;">Contact Details</h3>
                <p><strong>Name:</strong> ${validatedData.name}</p>
                <p><strong>Company:</strong> ${validatedData.company}</p>
                <p><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                ${validatedData.phone ? `<p><strong>Phone:</strong> <a href="tel:${validatedData.phone}">${validatedData.phone}</a></p>` : ''}
              </div>
              
              <div style="background: #fff; padding: 20px; border-left: 4px solid #3D9BE9; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">Message</h3>
                <p style="white-space: pre-wrap;">${validatedData.message}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                <p>This message was sent from the KRAON website contact form.</p>
                <p>Timestamp: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"KRAON Contact Form" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
        to: "allonzopensa@gmail.com",
        subject: `New Contact Form Submission from ${validatedData.name} - ${validatedData.company}`,
        html: emailHtml,
        replyTo: validatedData.email,
      });

      res.json({ 
        success: true, 
        message: "Message sent successfully. We'll get back to you within 24 hours." 
      });

    } catch (error) {
      console.error("Contact form error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again later."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
