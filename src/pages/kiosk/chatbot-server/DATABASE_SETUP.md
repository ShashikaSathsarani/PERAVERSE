# EngEx Knowledge Base Database Setup Guide

This guide will help you set up the EngEx knowledge base in a Supabase database.

## Prerequisites

- Supabase account (create one at https://supabase.com)
- Node.js installed
- Your Supabase project URL and service key

## Step 1: Set Up Supabase Database

1. **Go to your Supabase project**
   - Navigate to https://app.supabase.com
   - Select your project or create a new one

2. **Run the database schema**
   - Go to the SQL Editor in Supabase dashboard
   - Open the file `database-schema.sql`
   - Copy and paste the entire SQL script
   - Click "Run" to execute
   
   This will create:
   - `knowledge_base` table with all EngEx information
   - `chatbot_conversations` table for chat history
   - Indexes for fast searches
   - Initial data from your engexKnowledgeBase.md

3. **Verify tables were created**
   - Go to "Table Editor" in Supabase
   - You should see `knowledge_base` and `chatbot_conversations` tables
   - The knowledge_base table should have ~20+ rows of initial data

## Step 2: Configure Environment Variables

Create or update `.env` file in your project root:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Knowledge Base API Port (optional)
KB_API_PORT=3004
```

**How to get these values:**
1. Go to your Supabase project settings
2. Click "API" in the left sidebar
3. Copy "Project URL" → This is your `SUPABASE_URL`
4. Copy "service_role" key → This is your `SUPABASE_SERVICE_KEY`

## Step 3: Install Dependencies

```bash
cd src/pages/kiosk/chatbot-server
npm install
```

This installs:
- express - Web server
- cors - Enable cross-origin requests
- dotenv - Load environment variables
- @supabase/supabase-js - Supabase client

## Step 4: Start the Knowledge Base API

```bash
npm start
# or for development with auto-reload
npm run dev
```

You should see:
```
🤖 EngEx Knowledge Base API running on port 3004
📊 Health check: http://localhost:3004/health
🔍 Search endpoint: http://localhost:3004/api/knowledge-base/search
```

## Step 5: Test the API

### Test 1: Health Check
```bash
curl http://localhost:3004/health
```

Expected response:
```json
{
  "success": true,
  "message": "EngEx Knowledge Base API is running",
  "timestamp": "2025-10-17T..."
}
```

### Test 2: Search for "map"
```bash
curl "http://localhost:3004/api/knowledge-base/search?q=map"
```

Expected: Returns campus map information

### Test 3: Get all EngEx information
```bash
curl http://localhost:3004/api/knowledge-base/category/ENGEX
```

Expected: Returns all EngEx-related entries

### Test 4: Intelligent query
```bash
curl -X POST http://localhost:3004/api/knowledge-base/query \
  -H "Content-Type: application/json" \
  -d '{"query": "where is the canteen"}'
```

Expected: Returns relevant information about canteen location

## API Endpoints Reference

### 1. Search Knowledge Base
**GET** `/api/knowledge-base/search?q={query}&category={category}`

Query parameters:
- `q` - Search term (searches in title, content, keywords)
- `category` - Filter by category (ENGEX, FACULTY, CAMPUS, SCHEDULE, FACILITIES, SUPPORT)

Example:
```
GET /api/knowledge-base/search?q=robotics
GET /api/knowledge-base/search?category=SCHEDULE
```

### 2. Get by Category
**GET** `/api/knowledge-base/category/{category}`

Categories:
- ENGEX - Exhibition information
- FACULTY - University/Faculty details
- CAMPUS - Map and building locations
- SCHEDULE - Event timings
- FACILITIES - Food, washrooms, services
- SUPPORT - Emergency contacts

Example:
```
GET /api/knowledge-base/category/CAMPUS
```

### 3. Get All Data
**GET** `/api/knowledge-base/all`

Returns all knowledge base entries grouped by category

### 4. Intelligent Query
**POST** `/api/knowledge-base/query`

Body:
```json
{
  "query": "how do I get to the library"
}
```

Returns top 5 most relevant results

### 5. Save Conversation
**POST** `/api/conversations/save`

Body:
```json
{
  "session_id": "user-session-123",
  "user_message": "Where is the canteen?",
  "bot_response": "The canteen is...",
  "kb_items_used": [1, 5, 8]
}
```

### 6. Get Conversation History
**GET** `/api/conversations/session/{sessionId}`

Returns all conversations for a session

## Step 6: Update Your Chatbot to Use Database

Update your `geminiService.ts` or chatbot logic to call the API:

```typescript
// Example: Query knowledge base before generating response
async function getKnowledgeBaseContext(userMessage: string) {
  const response = await fetch('http://localhost:3004/api/knowledge-base/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: userMessage })
  });
  
  const result = await response.json();
  
  if (result.success && result.data.length > 0) {
    // Use this context in your AI prompt
    return result.data.map(item => item.content).join('\n\n');
  }
  
  return '';
}
```

## Database Maintenance

### Add New Knowledge Base Entry

```sql
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority)
VALUES (
  'ENGEX',
  'New Feature',
  'VR Demonstrations',
  'Experience virtual reality demonstrations in Zone C...',
  ARRAY['vr', 'virtual reality', 'demo', 'zone c'],
  85
);
```

### Update Existing Entry

```sql
UPDATE knowledge_base
SET content = 'Updated information...',
    keywords = ARRAY['new', 'keywords'],
    updated_at = NOW()
WHERE id = 1;
```

### Deactivate Entry (Don't Delete)

```sql
UPDATE knowledge_base
SET is_active = false
WHERE id = 5;
```

## Analytics Queries

### Most Searched Topics
```sql
SELECT 
  kb.title,
  kb.category,
  COUNT(conv.id) as times_referenced
FROM knowledge_base kb
JOIN chatbot_conversations conv 
  ON kb.id = ANY(conv.kb_items_used)
GROUP BY kb.id, kb.title, kb.category
ORDER BY times_referenced DESC
LIMIT 10;
```

### Popular Question Times
```sql
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as questions
FROM chatbot_conversations
GROUP BY hour
ORDER BY hour DESC;
```

## Troubleshooting

### Issue: "Connection refused"
- Check if Supabase URL and key are correct in .env
- Verify your Supabase project is active

### Issue: "No data returned"
- Verify the database-schema.sql was run successfully
- Check if data exists: `SELECT * FROM knowledge_base LIMIT 5;`

### Issue: Port already in use
- Change `KB_API_PORT` in .env to a different port
- Or stop the process using port 3004

## Benefits of Database Approach

✅ **Easy Updates** - Update knowledge without redeploying code
✅ **Searchable** - Fast keyword and full-text search
✅ **Scalable** - Can handle thousands of entries
✅ **Analytics** - Track what users ask about
✅ **Multi-language** - Easy to add translations
✅ **Version Control** - Track when information was updated
✅ **Collaborative** - Multiple people can update content
✅ **API-based** - Can be used by multiple applications

## Next Steps

1. ✅ Set up Supabase database
2. ✅ Run schema SQL script
3. ✅ Configure environment variables
4. ✅ Start Knowledge Base API
5. ✅ Test API endpoints
6. 🔄 Integrate with your chatbot
7. 🔄 Add more knowledge base entries
8. 🔄 Set up analytics dashboard

Need help? Contact the development team!
