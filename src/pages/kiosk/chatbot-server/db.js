const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client for chatbot knowledge base
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
