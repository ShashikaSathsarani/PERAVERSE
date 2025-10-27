// Comprehensive Chatbot-Database Connection Test
console.log('\n🧪 Testing Chatbot-Database Integration\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function testChatbotDatabase() {
    const tests = [];
    
    // Test 1: Knowledge Base API Health
    console.log('1️⃣ Testing Knowledge Base API Health...');
    try {
    const healthRes = await fetch('http://localhost:8080/health');
        const healthData = await healthRes.json();
        console.log(`   ✅ API Status: ${healthData.message}`);
        console.log(`   📅 Timestamp: ${healthData.timestamp}`);
        tests.push({ name: 'API Health', status: 'PASS' });
    } catch (error) {
        console.log(`   ❌ API Health Check Failed: ${error.message}`);
        tests.push({ name: 'API Health', status: 'FAIL', error: error.message });
        return;
    }
    
    // Test 2: Database Query - Search
    console.log('\n2️⃣ Testing Database Search (searching for "department")...');
    try {
    const searchRes = await fetch('http://localhost:8080/api/knowledge-base/search?q=department');
        const searchData = await searchRes.json();
        console.log(`   ✅ Search Results: Found ${searchData.count} entries`);
        if (searchData.data && searchData.data.length > 0) {
            console.log(`   📝 Sample: "${searchData.data[0].title}"`);
        }
        tests.push({ name: 'Database Search', status: 'PASS', results: searchData.count });
    } catch (error) {
        console.log(`   ❌ Search Failed: ${error.message}`);
        tests.push({ name: 'Database Search', status: 'FAIL', error: error.message });
    }
    
    // Test 3: Intelligent Query (like chatbot uses)
    console.log('\n3️⃣ Testing Intelligent Query (like chatbot)...');
    try {
    const queryRes = await fetch('http://localhost:8080/api/knowledge-base/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: 'What departments are there?' })
        });
        const queryData = await queryRes.json();
        console.log(`   ✅ Query Response: Found ${queryData.count} relevant entries`);
        if (queryData.data && queryData.data.length > 0) {
            console.log(`   📝 Most relevant: "${queryData.data[0].title}"`);
            console.log(`   📄 Content preview: ${queryData.data[0].content.substring(0, 100)}...`);
        }
        tests.push({ name: 'Intelligent Query', status: 'PASS', results: queryData.count });
    } catch (error) {
        console.log(`   ❌ Query Failed: ${error.message}`);
        tests.push({ name: 'Intelligent Query', status: 'FAIL', error: error.message });
    }
    
    // Test 4: Get All Categories
    console.log('\n4️⃣ Testing All Categories Retrieval...');
    try {
    const allRes = await fetch('http://localhost:8080/api/knowledge-base/all');
        const allData = await allRes.json();
        console.log(`   ✅ Total Entries: ${allData.total}`);
        console.log(`   📂 Categories: ${allData.categories.join(', ')}`);
        tests.push({ name: 'All Categories', status: 'PASS', categories: allData.categories.length });
    } catch (error) {
        console.log(`   ❌ Get All Failed: ${error.message}`);
        tests.push({ name: 'All Categories', status: 'FAIL', error: error.message });
    }
    
    // Test 5: Frontend Accessibility
    console.log('\n5️⃣ Testing Frontend Server...');
    try {
        const frontendRes = await fetch('http://localhost:5173');
        if (frontendRes.ok) {
            console.log(`   ✅ Frontend is accessible at http://localhost:5173`);
            tests.push({ name: 'Frontend Server', status: 'PASS' });
        }
    } catch (error) {
        console.log(`   ❌ Frontend Not Accessible: ${error.message}`);
        tests.push({ name: 'Frontend Server', status: 'FAIL', error: error.message });
    }
    
    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 TEST SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const passed = tests.filter(t => t.status === 'PASS').length;
    const failed = tests.filter(t => t.status === 'FAIL').length;
    
    tests.forEach(test => {
        const icon = test.status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${test.name}: ${test.status}`);
    });
    
    console.log(`\n📈 Results: ${passed}/${tests.length} tests passed`);
    
    if (failed === 0) {
        console.log('\n🎉 SUCCESS! Chatbot is fully connected to database!');
        console.log('\n📱 You can now use the chatbot at:');
        console.log('   🌐 http://localhost:5173 (then navigate to ChatBot page)\n');
    } else {
        console.log(`\n⚠️  ${failed} test(s) failed. Please check the errors above.\n`);
    }
}

testChatbotDatabase();
