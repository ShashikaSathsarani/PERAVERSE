const express = require('express');
const cors = require('cors');
const supabase = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.KB_API_PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * GET /api/knowledge-base/search
 * Search knowledge base by keywords or category
 * Query params: q (search term), category (filter by category)
 */
app.get('/api/knowledge-base/search', async (req, res) => {
    try {
        const { q, category } = req.query;
        
        let query = supabase
            .from('knowledge_base')
            .select('*')
            .eq('is_active', true);

        // Filter by category if provided
        if (category) {
            query = query.eq('category', category.toUpperCase());
        }

        // Search by keywords if query provided
        if (q) {
            const searchTerms = q.toLowerCase().split(' ');
            query = query.or(
                searchTerms.map(term => 
                    `keywords.cs.{${term}},title.ilike.%${term}%,content.ilike.%${term}%`
                ).join(',')
            );
        }

        // Order by priority
        query = query.order('priority', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        res.json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/knowledge-base/category/:category
 * Get all items from a specific category
 */
app.get('/api/knowledge-base/category/:category', async (req, res) => {
    try {
        const { category } = req.params;

        const { data, error } = await supabase
            .from('knowledge_base')
            .select('*')
            .eq('category', category.toUpperCase())
            .eq('is_active', true)
            .order('priority', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            category: category.toUpperCase(),
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('Category fetch error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/knowledge-base/all
 * Get all knowledge base entries
 */
app.get('/api/knowledge-base/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('knowledge_base')
            .select('*')
            .eq('is_active', true)
            .order('category')
            .order('priority', { ascending: false });

        if (error) throw error;

        // Group by category
        const grouped = data.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        res.json({
            success: true,
            total: data.length,
            categories: Object.keys(grouped),
            data: grouped
        });
    } catch (error) {
        console.error('Fetch all error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/knowledge-base/query
 * Intelligent query to find most relevant information
 */
app.post('/api/knowledge-base/query', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        // Extract keywords from query
        const keywords = query.toLowerCase()
            .split(' ')
            .filter(word => word.length > 2); // Filter out short words

        // Search using keywords
        const { data, error } = await supabase
            .from('knowledge_base')
            .select('*')
            .eq('is_active', true)
            .or(
                keywords.map(keyword => 
                    `keywords.cs.{${keyword}},title.ilike.%${keyword}%,content.ilike.%${keyword}%`
                ).join(',')
            )
            .order('priority', { ascending: false })
            .limit(5); // Return top 5 most relevant

        if (error) throw error;

        res.json({
            success: true,
            query: query,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/conversations/save
 * Save a conversation to database
 */
app.post('/api/conversations/save', async (req, res) => {
    try {
        const { session_id, user_message, bot_response, kb_items_used } = req.body;

        const { data, error } = await supabase
            .from('chatbot_conversations')
            .insert([{
                session_id,
                user_message,
                bot_response,
                kb_items_used: kb_items_used || []
            }])
            .select();

        if (error) throw error;

        res.json({
            success: true,
            data: data[0]
        });
    } catch (error) {
        console.error('Save conversation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/conversations/session/:sessionId
 * Get conversation history for a session
 */
app.get('/api/conversations/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const { data, error } = await supabase
            .from('chatbot_conversations')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.json({
            success: true,
            session_id: sessionId,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('Fetch conversation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'EngEx Knowledge Base API is running',
        timestamp: new Date().toISOString()
    });
});


// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🤖 EngEx Knowledge Base API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/knowledge-base/search`);
    console.log(`✅ Server successfully bound to port ${PORT}`);
});

server.on('error', (error) => {
    console.error('❌ Server error:', error);
    process.exit(1);
});

server.on('listening', () => {
    const addr = server.address();
    console.log(`🎯 Server is actively listening on ${addr.address}:${addr.port}`);
});

// Catch uncaught errors
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Keep the process alive
console.log('🔄 Server process started, keeping alive...');

module.exports = app;


