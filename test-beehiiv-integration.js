// Test script to verify Beehiiv newsletter integration
require('dotenv').config({ path: '.env.local' });

async function testBeehiivIntegration() {
  console.log('📧 Testing Beehiiv newsletter integration...');
  
  // Check if Beehiiv credentials are configured
  if (!process.env.BEEHIIV_API_KEY) {
    console.log('⚠️ BEEHIIV_API_KEY not found in environment variables');
    console.log('💡 Add your Beehiiv API key to .env.local to test newsletter integration');
    return;
  }
  
  if (!process.env.BEEHIIV_PUBLICATION_ID) {
    console.log('⚠️ BEEHIIV_PUBLICATION_ID not found in environment variables');
    console.log('💡 Add your Beehiiv publication ID to .env.local to test newsletter integration');
    return;
  }

  console.log('✅ Beehiiv credentials found');
  console.log(`📰 Publication ID: ${process.env.BEEHIIV_PUBLICATION_ID}`);
  
  const testData = {
    name: 'Newsletter Test User',
    email: 'test+newsletter@example.com', // Using + notation for easy cleanup
    experience: 'This is a test submission to verify both Notion and Beehiiv integrations are working correctly. I play primarily online cash games and am excited about PokerPal.',
    training: ['hand-solver-analysis', 'meditation'],
    trainingOther: '',
    highlight: 'Successfully testing the complete integration flow including newsletter subscription.',
    success: 'Success means seamless automation that helps founders focus on what matters most.',
    alignment: 'I believe in testing thoroughly before launching to ensure the best user experience for potential founding members.',
  };

  try {
    console.log('📤 Sending test submission with Beehiiv integration...');
    
    const response = await fetch('http://localhost:3000/api/submit-application', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Form submission successful!');
      console.log(`📄 Notion page ID: ${result.notionPageId}`);
      console.log(`📧 Newsletter subscribed: ${result.newsletterSubscribed ? 'Yes' : 'No'}`);
      
      if (result.newsletterSubscribed) {
        console.log('\n🎉 SUCCESS! The integration is working perfectly:');
        console.log('  ✅ Form data saved to Notion');
        console.log('  ✅ Formatted document created');
        console.log('  ✅ Email added to Beehiiv newsletter');
        console.log('\n📧 Check your Beehiiv dashboard - you should see the new subscriber!');
        console.log('💡 Subscriber will have these custom fields:');
        console.log('  • Application Date');
        console.log('  • Applicant Name'); 
        console.log('  • Application Status: pending_review');
        console.log('  • UTM tracking for analytics');
      } else {
        console.log('\n⚠️ Newsletter subscription failed but form submission succeeded');
        console.log('💡 Check the server logs for Beehiiv error details');
      }
    } else {
      console.log('❌ Form submission failed');
      console.log('📝 Response:', result);
      console.log('🔍 Status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure your Next.js dev server is running:');
      console.error('   npm run dev');
    }
  }
}

console.log('🧪 Beehiiv Integration Test');
console.log('==========================');
testBeehiivIntegration();
