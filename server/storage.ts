import { type ContactRequest } from "@shared/schema";
import { NotionService } from "./notion-service";

export interface IStorage {
  saveContactRequest(contact: ContactRequest): Promise<void>;
}

export class MemStorage implements IStorage {
  private contacts: ContactRequest[] = [];

  async saveContactRequest(contact: ContactRequest): Promise<void> {
    // Store the contact request (in a real app, this would be saved to a database)
    this.contacts.push({
      ...contact,
      timestamp: new Date().toISOString()
    } as any);
    
    console.log(`Contact request saved: ${contact.name} from ${contact.company}`);
  }
}

// Use Notion as storage if database ID is provided, otherwise fallback to memory
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

export const storage: IStorage = NOTION_DATABASE_ID 
  ? new NotionService(NOTION_DATABASE_ID)
  : new MemStorage();
