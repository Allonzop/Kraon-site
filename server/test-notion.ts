import { NotionService } from './notion-service';

async function testNotionIntegration() {
  // Pour obtenir l'ID de votre base de données "Base Email" :
  // 1. Ouvrez votre base "Base Email" dans Notion
  // 2. Copiez l'URL (ex: https://www.notion.so/workspace/Base-Email-1234567890abcdef...)
  // 3. L'ID est la partie après le dernier tiret et avant le "?" (ex: 1234567890abcdef...)
  
  const DATABASE_ID = process.env.NOTION_DATABASE_ID || "YOUR_DATABASE_ID_HERE";
  
  if (DATABASE_ID === "YOUR_DATABASE_ID_HERE") {
    console.log(`
    ⚠️  Pour tester l'intégration Notion:
    
    1. Allez dans votre base "Base Email" sur Notion
    2. Copiez l'URL de la page
    3. L'ID de la base de données est dans l'URL:
       https://notion.so/workspace/Base-Email-[ID_ICI]?...
    4. Ajoutez cet ID comme variable d'environnement:
       NOTION_DATABASE_ID=votre_id_ici
    5. Relancez ce script
    `);
    return;
  }

  console.log(`Testing Notion integration with database ID: ${DATABASE_ID}`);
  
  const notionService = new NotionService(DATABASE_ID);
  
  const testContact = {
    name: "Test Contact",
    company: "Test Company",
    email: "test@example.com",
    phone: "+33123456789",
    message: "Ceci est un test d'intégration Notion",
    consent: true
  };

  try {
    await notionService.saveContactRequest(testContact);
    console.log("✅ Test réussi ! Le contact a été ajouté dans votre base Notion.");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

testNotionIntegration();