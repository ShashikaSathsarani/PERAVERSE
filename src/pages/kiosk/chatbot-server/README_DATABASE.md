# EngEx Knowledge Base Database Implementation

## 📚 Overview

This implementation converts the EngEx knowledge base from a static Markdown file to a dynamic **Supabase database** with a REST API. This allows for:

- ✅ Real-time content updates without redeploying
- ✅ Fast keyword and full-text search
- ✅ Conversation analytics and tracking
- ✅ Multi-user content management
- ✅ Scalable architecture

## 🏗️ Architecture

```
┌─────────────────┐
│  React Chatbot  │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│  Knowledge Base │
│   API Server    │
│  (Node.js/Express)
└────────┬────────┘
         │
         │ Supabase Client
         ▼
┌─────────────────┐
│   Supabase      │
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

## 📁 Files Created

| File | Purpose |
|------|---------|
| `database-schema.sql` | SQL script to create tables and initial data |
| `db.js` | Supabase client configuration |
| `knowledge-base-api.js` | Express API server for knowledge base |
| `knowledgeBaseService.ts` | TypeScript service for frontend integration |
| `DATABASE_SETUP.md` | Detailed setup instructions |
| `README_DATABASE.md` | This file |

## 🚀 Quick Start

### 1. Set Up Supabase (5 minutes)

```bash
# 1. Create Supabase account at https://supabase.com
# 2. Create new project
# 3. Go to SQL Editor
# 4. Run database-schema.sql script
# 5. Copy your project credentials
```

### 2. Configure Environment (.env)

```env
# Add to your .env file
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
KB_API_PORT=3004
```

### 3. Install Dependencies

```bash
cd src/pages/kiosk/chatbot-server
npm install
```

### 4. Start the API

```bash
npm start
# or
npm run dev  # for auto-reload during development
```

### 5. Verify Installation

```bash
# Test health endpoint
curl http://localhost:3004/health

# Search for "map"
curl "http://localhost:3004/api/knowledge-base/search?q=map"
```

## 💡 Usage Examples

### Example 1: Search for Campus Information

```typescript
import knowledgeBaseService from './utils/knowledgeBaseService';

// Search for map-related info
const results = await knowledgeBaseService.search('map');
console.log(results);
```

### Example 2: Get Schedule Information

```typescript
// Get all schedule entries
const schedule = await knowledgeBaseService.getByCategory('SCHEDULE');
```

### Example 3: Enhance AI Responses

```typescript
// Get relevant context for AI
const userMessage = "Where is the canteen?";
const context = await knowledgeBaseService.getContextForAI(userMessage);

// Use context in your AI prompt
const aiPrompt = `${context}\n\nUser: ${userMessage}`;
```

### Example 4: Track Conversations

```typescript
// Save conversation for analytics
await knowledgeBaseService.saveConversation(
  "Where is the library?",
  "The library is in Building 27...",
  [15, 22]  // IDs of knowledge base items used
);
```

## 🔌 API Endpoints

### Search Knowledge Base
```http
GET /api/knowledge-base/search?q=robotics&category=ENGEX
```

Response:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 12,
      "category": "SCHEDULE",
      "title": "03:30 PM - Robotics Competition",
      "content": "Location: Sports Ground...",
      "keywords": ["robotics", "competition", "3:30pm"],
      "priority": 95
    }
  ]
}
```

### Get by Category
```http
GET /api/knowledge-base/category/CAMPUS
```

### Intelligent Query
```http
POST /api/knowledge-base/query
Content-Type: application/json

{
  "query": "how to get to library"
}
```

### Save Conversation
```http
POST /api/conversations/save
Content-Type: application/json

{
  "session_id": "session_123",
  "user_message": "Where is the canteen?",
  "bot_response": "The canteen is located...",
  "kb_items_used": [5, 12]
}
```

## 📊 Database Schema

### knowledge_base Table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| category | VARCHAR(100) | ENGEX, FACULTY, CAMPUS, SCHEDULE, FACILITIES, SUPPORT |
| subcategory | VARCHAR(100) | Optional subcategory |
| title | VARCHAR(255) | Entry title |
| content | TEXT | Main content |
| keywords | TEXT[] | Searchable keywords array |
| priority | INTEGER | Display priority (higher = more important) |
| is_active | BOOLEAN | Active/inactive flag |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### chatbot_conversations Table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| session_id | VARCHAR(100) | User session identifier |
| user_message | TEXT | User's question |
| bot_response | TEXT | Bot's answer |
| kb_items_used | INTEGER[] | Knowledge base IDs referenced |
| created_at | TIMESTAMP | Conversation timestamp |

## 🔧 Integration with Existing Chatbot

### Option 1: Replace geminiService (Recommended)

Update `geminiService.ts`:

```typescript
import knowledgeBaseService from './knowledgeBaseService';

async generateResponse(prompt: string): Promise<string> {
  // Get relevant knowledge from database
  const context = await knowledgeBaseService.getContextForAI(prompt);
  
  // Combine with your existing Gemini prompt
  const enhancedPrompt = `${context}\n\nUser: ${prompt}`;
  
  // Continue with Gemini API call
  const result = await this.model.generateContent(enhancedPrompt);
  const response = await result.response.text();
  
  // Save conversation for analytics
  await knowledgeBaseService.saveConversation(prompt, response);
  
  return response;
}
```

### Option 2: Fallback Mode

Use database when Gemini API is unavailable:

```typescript
async generateResponse(prompt: string): Promise<string> {
  if (!this.model) {
    // Use database-only mode
    const knowledge = await knowledgeBaseService.queryKnowledge(prompt);
    return knowledge || this.getFallbackResponse(prompt);
  }
  
  // Use Gemini with database context
  // ...
}
```

## 📈 Analytics Queries

### Most Asked Topics
```sql
SELECT 
  kb.title,
  COUNT(conv.id) as mentions
FROM knowledge_base kb
JOIN chatbot_conversations conv 
  ON kb.id = ANY(conv.kb_items_used)
GROUP BY kb.id, kb.title
ORDER BY mentions DESC
LIMIT 10;
```

### Peak Usage Times
```sql
SELECT 
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as conversations
FROM chatbot_conversations
WHERE created_at >= NOW() - INTERVAL '1 day'
GROUP BY hour
ORDER BY hour;
```

### Unanswered Questions
```sql
SELECT 
  user_message,
  COUNT(*) as times_asked
FROM chatbot_conversations
WHERE kb_items_used = '{}'
GROUP BY user_message
ORDER BY times_asked DESC
LIMIT 20;
```

## 🛠️ Maintenance

### Add New Knowledge Entry

```sql
INSERT INTO knowledge_base (
  category, subcategory, title, content, keywords, priority
) VALUES (
  'ENGEX',
  'Activities',
  'Drone Show',
  'Experience an amazing drone light show at 6:00 PM on the front lawn...',
  ARRAY['drone', 'show', 'evening', '6pm', 'light show'],
  90
);
```

### Update Existing Entry

```sql
UPDATE knowledge_base
SET 
  content = 'Updated information about the robotics competition...',
  keywords = ARRAY['robotics', 'competition', 'updated', 'new'],
  updated_at = NOW()
WHERE id = 12;
```

### Bulk Import from CSV

```sql
COPY knowledge_base (category, title, content, keywords, priority)
FROM '/path/to/knowledge.csv'
DELIMITER ','
CSV HEADER;
```

## 🐛 Troubleshooting

### API not responding
```bash
# Check if server is running
curl http://localhost:3004/health

# Check logs
npm run dev  # Shows console logs
```

### No data returned
```sql
-- Verify data exists
SELECT COUNT(*) FROM knowledge_base;

-- Check specific category
SELECT * FROM knowledge_base WHERE category = 'ENGEX';
```

### Connection errors
```bash
# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test Supabase connection
node -e "const s=require('@supabase/supabase-js'); const c=s.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY); c.from('knowledge_base').select('count').then(console.log)"
```

## 🎯 Benefits Over Markdown File

| Feature | Markdown File | Database |
|---------|--------------|----------|
| Update content | Requires code deployment | Instant via SQL/API |
| Search speed | Slow (linear) | Fast (indexed) |
| Multi-language | Difficult | Easy (add language column) |
| Analytics | None | Built-in tracking |
| Collaboration | Git conflicts | Concurrent editing |
| Versioning | Git history | Timestamps + audit log |
| Scale | Memory limited | Virtually unlimited |
| API access | None | RESTful API |

## 📚 Next Steps

1. ✅ Complete database setup
2. ✅ Test all API endpoints
3. 🔄 Integrate with chatbot
4. 🔄 Add more knowledge entries
5. 🔄 Set up analytics dashboard
6. 🔄 Enable multi-language support
7. 🔄 Add admin panel for content management

## 🤝 Contributing

To add new knowledge to the database:

1. Use the API or Supabase dashboard
2. Follow the category structure
3. Add relevant keywords for search
4. Set appropriate priority
5. Test search functionality

## 📞 Support

For issues or questions:
- Check `DATABASE_SETUP.md` for detailed instructions
- Review API endpoint documentation
- Test with curl commands
- Check Supabase dashboard for data

---

**Ready to go!** 🚀 Your EngEx knowledge base is now database-powered and ready for dynamic updates!
