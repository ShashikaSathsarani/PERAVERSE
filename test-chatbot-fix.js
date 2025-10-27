// Test script to verify chatbot integration

async function testChatbot() {
  console.log('\n🧪 Testing Chatbot Integration...\n');
  
  // Test 1: Health check
  console.log('1️⃣ Testing API Health...');
  try {
    const healthRes = await fetch('http://localhost:8080/health');
    const healthData = await healthRes.json();
    console.log('✅ API Health:', healthData);
  } catch (error) {
    console.log('❌ API Health Error:', error.message);
    return;
  }
  
  // Test 2: Query database
  console.log('\n2️⃣ Testing Database Query...');
  try {
    const queryRes = await fetch('http://localhost:8080/api/knowledge-base/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What are the departments?' })
    });
    const queryData = await queryRes.json();
    console.log('✅ Query Results:', queryData.data?.length || 0, 'records found');
    if (queryData.data?.[0]) {
      console.log('   First result:', queryData.data[0].title);
      console.log('   Keywords:', queryData.data[0].keywords);
    }
  } catch (error) {
    console.log('❌ Query Error:', error.message);
  }
  
  // Test 3: Get all records
  console.log('\n3️⃣ Testing Get All Records...');
  try {
    const allRes = await fetch('http://localhost:8080/api/knowledge-base/all');
    const allData = await allRes.json();
    console.log('✅ Total Records:', allData.data?.length || 0);
    if (allData.data?.length > 0) {
      console.log('   Sample records:');
      allData.data.slice(0, 3).forEach((record, i) => {
        console.log(`   ${i + 1}. ${record.title}`);
      });
    }
  } catch (error) {
    console.log('❌ Get All Error:', error.message);
  }
  
  console.log('\n✨ Test Complete!\n');
}

testChatbot();
