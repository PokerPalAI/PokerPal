import { Client } from '@notionhq/client';

// Simple test function to verify Notion connection
export async function testNotionConnection() {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    const databaseId = process.env.NOTION_DATABASE_ID || '27db423ee4cf4c9b91848fb2602d7886';

    // Try to retrieve the database to test connection
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    console.log('✅ Notion connection successful!');
    console.log(`Database name: ${'title' in database ? database.title[0]?.plain_text || 'Unknown' : 'Unknown'}`);
    console.log(`Database ID: ${database.id}`);
    
    return { success: true, database };
  } catch (error) {
    console.error('❌ Notion connection failed:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Test function for development
export async function createTestEntry() {
  try {
    const response = await fetch('/api/submit-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        experience: 'This is a test submission to verify the Notion integration is working correctly. I play mostly online cash games at 50NL and 100NL stakes.',
        training: ['hand-solver-analysis', 'book-reading', 'meditation'],
        trainingOther: '',
        highlight: 'Successfully moved up from 25NL to 100NL over the past year through dedicated study and bankroll management.',
        success: 'Success to me means consistent improvement in my decision-making process and maintaining a healthy work-life balance while playing poker professionally.',
        alignment: 'I believe poker is a sport because it requires the same mental discipline, preparation, and continuous improvement as traditional sports. I train daily, analyze my play, and maintain physical fitness to support my mental game.',
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test submission successful!', result);
      return { success: true, result };
    } else {
      console.error('❌ Test submission failed:', result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('❌ Test submission error:', error);
    return { success: false, error: (error as Error).message };
  }
}
