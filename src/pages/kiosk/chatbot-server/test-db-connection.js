// Quick test to verify Supabase connection
const supabase = require('./db');

async function testConnection() {
    console.log('🔍 Testing Supabase connection...');
    
    try {
        const { data, error } = await supabase
            .from('knowledge_base')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase error:', error);
            process.exit(1);
        }
        
        console.log('✅ Successfully connected to Supabase!');
        console.log('📊 Data:', data);
        
        // Try to get all records
        const { data: allData, error: allError } = await supabase
            .from('knowledge_base')
            .select('*')
            .eq('is_active', true);
        
        if (allError) {
            console.error('❌ Error fetching data:', allError);
            process.exit(1);
        }
        
        console.log(`✅ Found ${allData.length} active knowledge base entries`);
        process.exit(0);
        
    } catch (err) {
        console.error('💥 Exception:', err);
        process.exit(1);
    }
}

testConnection();
