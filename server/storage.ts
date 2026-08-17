import { type ContactRequest, type LeadData } from "@shared/schema";
import { NotionService } from "./notion-service";
import { promises as fs } from "fs";
import path from "path";

/** Outcome of persisting a lead across the available channels. */
export interface SaveResult {
  /** True if the lead was durably stored in at least one place. */
  persisted: boolean;
  notion: "ok" | "failed" | "skipped";
  fallback: "ok" | "failed";
}

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const notion = NOTION_DATABASE_ID ? new NotionService(NOTION_DATABASE_ID) : null;

// Local append-only backup so a lead is NEVER lost, even if Notion/email fail.
const LEADS_FILE = path.resolve(process.cwd(), ".data", "leads.jsonl");

async function appendFallback(record: Record<string, unknown>): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    const line = JSON.stringify({ ...record, receivedAt: new Date().toISOString() }) + "\n";
    await fs.appendFile(LEADS_FILE, line, "utf8");
    return true;
  } catch (error) {
    console.error("[leads] Local fallback write failed:", error);
    return false;
  }
}

/**
 * Persist a contact request as robustly as possible. Never throws: the local
 * backup and Notion are attempted independently so one failing channel can't
 * take the whole submission down.
 */
export async function saveContactRequest(contact: ContactRequest): Promise<SaveResult> {
  const fallbackOk = await appendFallback({ type: "contact", ...contact });

  let notionStatus: SaveResult["notion"] = "skipped";
  if (notion) {
    try {
      await notion.saveContactRequest(contact);
      notionStatus = "ok";
    } catch (error) {
      notionStatus = "failed";
      console.error(
        "[leads] Notion save failed (continuing):",
        error instanceof Error ? error.message : error,
      );
    }
  }

  return {
    persisted: fallbackOk || notionStatus === "ok",
    notion: notionStatus,
    fallback: fallbackOk ? "ok" : "failed",
  };
}

/**
 * Persist a captured lead (email + optional score/details) to the durable
 * local backup. Never throws.
 */
export async function saveLead(lead: LeadData): Promise<{ persisted: boolean }> {
  const ok = await appendFallback({ type: "lead", ...lead });
  return { persisted: ok };
}
