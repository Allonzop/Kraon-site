import { type ContactRequest } from "@shared/schema";

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

export const storage = new MemStorage();
