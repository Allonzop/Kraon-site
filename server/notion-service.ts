import { Client } from '@notionhq/client';
import { type ContactRequest } from "@shared/schema";

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=notion',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Notion not connected');
  }
  return accessToken;
}

async function getUncachableNotionClient() {
  const accessToken = await getAccessToken();
  return new Client({ auth: accessToken });
}

export class NotionService {
  private databaseId: string;

  constructor(databaseId: string) {
    this.databaseId = databaseId;
  }

  async saveContactRequest(contact: ContactRequest): Promise<void> {
    try {
      const notion = await getUncachableNotionClient();
      
      await notion.pages.create({
        parent: {
          database_id: this.databaseId,
        },
        properties: {
          "Nom": {
            title: [
              {
                text: {
                  content: contact.name,
                },
              },
            ],
          },
          "Company": {
            rich_text: [
              {
                text: {
                  content: contact.company,
                },
              },
            ],
          },
          "E-mail": {
            email: contact.email,
          },
          "Téléphone": {
            phone_number: contact.phone || null,
          },
          "Message": {
            rich_text: [
              {
                text: {
                  content: contact.message,
                },
              },
            ],
          },
        },
      });

      console.log(`Contact request saved to Notion: ${contact.name} from ${contact.company}`);
    } catch (error) {
      console.error("Error saving contact to Notion:", error);
      throw new Error("Failed to save contact to Notion");
    }
  }
}