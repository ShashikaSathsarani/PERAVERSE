// Test direct query to API
async function testDepartmentQuery() {
  console.log('\n🔍 Testing "What are the departments?" query...\n');
  
  const response = await fetch('http://localhost:3004/api/knowledge-base/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'What are the departments?' })
  });
  
  const data = await response.json();
  
  console.log('Success:', data.success);
  console.log('Results found:', data.data?.length || 0);
  console.log('\nResults:');
  
  if (data.data && data.data.length > 0) {
    data.data.forEach((item, i) => {
      console.log(`\n${i + 1}. ${item.title}`);
      console.log('   Category:', item.category);
      console.log('   Keywords:', item.keywords);
      console.log('   Content preview:', item.content.substring(0, 100) + '...');
    });
  } else {
    console.log('❌ No results found!');
  }
}

testDepartmentQuery();
