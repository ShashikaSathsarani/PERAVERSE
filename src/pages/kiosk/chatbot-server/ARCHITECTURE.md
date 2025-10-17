# EngEx Knowledge Base Database - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         React Chatbot (ChatBotPage.tsx)                  │  │
│  │  - User types message                                     │  │
│  │  - Displays chat bubbles                                  │  │
│  │  - Shows campus map image                                 │  │
│  └────────────┬─────────────────────────────────────────────┘  │
│               │                                                  │
└───────────────┼──────────────────────────────────────────────────┘
                │
                │ TypeScript Service Call
                ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND SERVICES LAYER                             │
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────┐    │
│  │  geminiService.ts         │  │ knowledgeBaseService.ts  │    │
│  │  - Google Gemini AI       │  │ - Query database          │    │
│  │  - Enhanced prompts       │  │ - Search knowledge        │    │
│  │  - Fallback responses     │  │ - Save conversations      │    │
│  └──────────┬───────────────┘  └──────────┬───────────────┘    │
│             │                               │                     │
└─────────────┼───────────────────────────────┼─────────────────────┘
              │                               │
              │ Google Gemini API             │ HTTP REST API
              ▼                               ▼
┌───────────────────────┐    ┌────────────────────────────────────┐
│   Google Gemini 2.0   │    │    KNOWLEDGE BASE API SERVER       │
│   Flash (External)    │    │   (knowledge-base-api.js)          │
└───────────────────────┘    │                                    │
                              │  Port: 3004                        │
                              │                                    │
                              │  Endpoints:                        │
                              │  - GET  /health                    │
                              │  - GET  /api/knowledge-base/search │
                              │  - GET  /api/knowledge-base/category/:cat │
                              │  - GET  /api/knowledge-base/all    │
                              │  - POST /api/knowledge-base/query  │
                              │  - POST /api/conversations/save    │
                              │  - GET  /api/conversations/session/:id │
                              │                                    │
                              └──────────────┬─────────────────────┘
                                             │
                                             │ Supabase Client
                                             │ (@supabase/supabase-js)
                                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE CLOUD DATABASE                        │
│                   (PostgreSQL)                                   │
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────┐    │
│  │  knowledge_base table     │  │ chatbot_conversations    │    │
│  │  ────────────────────     │  │ ──────────────────────   │    │
│  │  • id (primary key)       │  │ • id (primary key)       │    │
│  │  • category (ENGEX, etc)  │  │ • session_id             │    │
│  │  • subcategory            │  │ • user_message           │    │
│  │  • title                  │  │ • bot_response           │    │
│  │  • content (TEXT)         │  │ • kb_items_used[]        │    │
│  │  • keywords[] (array)     │  │ • created_at             │    │
│  │  • priority (int)         │  │                          │    │
│  │  • is_active (boolean)    │  │  For Analytics & Tracking│    │
│  │  • created_at             │  │                          │    │
│  │  • updated_at             │  │                          │    │
│  │                           │  │                          │    │
│  │  16+ pre-loaded entries   │  │  Stores all chats        │    │
│  └──────────────────────────┘  └──────────────────────────┘    │
│                                                                  │
│  Indexes:                                                        │
│  - idx_kb_category  (fast category lookup)                      │
│  - idx_kb_keywords  (GIN index for array search)                │
│  - idx_kb_active    (filter active entries)                     │
│  - idx_conv_session (find chats by session)                     │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Example 1: User Asks "Where is the map?"

```
1. User types: "show me the map"
   ↓
2. ChatBotPage.tsx captures message
   ↓
3. Calls knowledgeBaseService.queryKnowledge("show me the map")
   ↓
4. knowledgeBaseService sends POST to:
   http://localhost:3004/api/knowledge-base/query
   Body: {"query": "show me the map"}
   ↓
5. knowledge-base-api.js receives request
   ↓
6. Extracts keywords: ["show", "map"]
   ↓
7. Queries Supabase:
   SELECT * FROM knowledge_base
   WHERE keywords @> ARRAY['map']
   OR title ILIKE '%map%'
   OR content ILIKE '%map%'
   ORDER BY priority DESC
   LIMIT 5
   ↓
8. Supabase returns matching entries:
   - "Campus Map Zones" (priority 100)
   - "Key Campus Buildings" (priority 90)
   ↓
9. API formats response and sends back to frontend
   ↓
10. ChatBotPage displays:
    - Text response with map info
    - Campus map image (map.jpg)
   ↓
11. knowledgeBaseService saves conversation to database
```

### Example 2: User Asks "What time is the robotics competition?"

```
1. User types: "What time is the robotics competition?"
   ↓
2. knowledgeBaseService.queryKnowledge()
   ↓
3. Keywords extracted: ["time", "robotics", "competition"]
   ↓
4. Supabase query finds:
   category = 'SCHEDULE'
   keywords contains 'robotics' OR 'competition'
   ↓
5. Returns:
   "03:30 PM - Robotics Competition"
   Location: Sports Ground
   Route: From auditorium rear exit...
   ↓
6. Response displayed to user
   ↓
7. Conversation saved with kb_items_used = [12]
```

## Category Structure

```
knowledge_base/
├── ENGEX (Exhibition Info)
│   ├── About → "What is EngEx?"
│   ├── Features → "Key Features"
│   └── Departments → "8 Engineering Departments"
│
├── FACULTY (University Info)
│   ├── History → "Founded in 1950..."
│   ├── Contact → "Phone numbers, email"
│   └── Programs → "BSc Engineering, MEng..."
│
├── CAMPUS (Location Info)
│   ├── Map → "Zone A-F, Buildings"
│   └── Buildings → "Building 1-29 details"
│
├── SCHEDULE (Event Timing)
│   ├── Morning → "09:00 Registration, 10:00 Opening"
│   ├── Afternoon → "02:00 Presentations, 03:30 Robotics"
│   └── Evening → "Awards, Networking"
│
├── FACILITIES (Services)
│   ├── Food → "Canteen, Food Court, Coffee Shop"
│   ├── Washrooms → "Ground/First/Second floor locations"
│   └── Services → "Parking, ATM, First Aid"
│
└── SUPPORT (Help)
    └── Emergency → "Contact numbers"
```

## Search Algorithm Flow

```
User Query: "How to get to library?"
                ↓
┌───────────────────────────────────────┐
│  1. Extract Keywords                  │
│     ["how", "get", "library"]         │
│     Filter: length > 2                │
│     Result: ["get", "library"]        │
└───────────────┬───────────────────────┘
                ↓
┌───────────────────────────────────────┐
│  2. Database Search (3 methods)       │
│     a) keywords array contains term   │
│        keywords @> ARRAY['library']   │
│     b) Title contains term            │
│        title ILIKE '%library%'        │
│     c) Content contains term          │
│        content ILIKE '%library%'      │
└───────────────┬───────────────────────┘
                ↓
┌───────────────────────────────────────┐
│  3. Filter & Sort Results             │
│     WHERE is_active = true            │
│     ORDER BY priority DESC            │
│     LIMIT 5                           │
└───────────────┬───────────────────────┘
                ↓
┌───────────────────────────────────────┐
│  4. Return Matches                    │
│     Match 1: "Key Campus Buildings"   │
│       Building 27: Engineering Library│
│       priority: 90                    │
│                                       │
│     Match 2: "Campus Map Zones"       │
│       Zone references library         │
│       priority: 100                   │
└───────────────┬───────────────────────┘
                ↓
┌───────────────────────────────────────┐
│  5. Format Response                   │
│     Combine content from matches      │
│     Add to AI context or direct reply │
└───────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│           FRONTEND                      │
│  • React 19.1.1                         │
│  • TypeScript                           │
│  • Vite 7.1.5                           │
│  • Tailwind CSS                         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           SERVICES                      │
│  • Google Gemini 2.0 Flash              │
│  • @google/generative-ai SDK            │
│  • Custom knowledgeBaseService          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           API SERVER                    │
│  • Node.js                              │
│  • Express.js 4.18.2                    │
│  • CORS enabled                         │
│  • dotenv for config                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           DATABASE                      │
│  • Supabase (PostgreSQL)                │
│  • @supabase/supabase-js 2.39.0         │
│  • Row Level Security (RLS)             │
│  • Real-time capabilities               │
└─────────────────────────────────────────┘
```

## File Structure

```
PERAVERSE/
│
├── src/pages/kiosk/
│   ├── ChatBotPage.tsx         ← Main chatbot UI
│   ├── kioskAssets/
│   │   └── map.jpg             ← Campus map image
│   │
│   ├── utils/
│   │   ├── geminiService.ts    ← Google Gemini integration
│   │   ├── knowledgeBaseService.ts  ← NEW! Database service
│   │   └── engexKnowledgeBase.md    ← Original markdown (kept as backup)
│   │
│   └── chatbot-server/
│       ├── database-schema.sql      ← SQL to create tables
│       ├── db.js                    ← Supabase connection
│       ├── knowledge-base-api.js    ← Express API server
│       ├── package.json             ← Dependencies
│       ├── start-knowledge-base.ps1 ← Quick start script
│       ├── DATABASE_SETUP.md        ← Setup guide
│       ├── README_DATABASE.md       ← Full documentation
│       ├── SETUP_SUMMARY.md         ← Quick reference
│       └── ARCHITECTURE.md          ← This file
│
├── .env                        ← Environment variables
│   SUPABASE_URL=...
│   SUPABASE_SERVICE_KEY=...
│   KB_API_PORT=3004
│
└── package.json                ← Main project dependencies
```

## Deployment Architecture

```
DEVELOPMENT:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │───→│   KB API     │───→│   Supabase   │
│ localhost:   │    │ localhost:   │    │   Cloud      │
│   5173       │    │   3004       │    │              │
└──────────────┘    └──────────────┘    └──────────────┘

PRODUCTION:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Vercel     │───→│   Render/    │───→│   Supabase   │
│   (Frontend) │    │   Railway    │    │   Production │
│              │    │   (API)      │    │   Database   │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────┐
│  1. Frontend Request                    │
│     No authentication required          │
│     Public API endpoints                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  2. API Server                          │
│     CORS enabled for localhost:5173     │
│     Rate limiting (optional)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  3. Supabase Client                     │
│     Uses SERVICE_KEY (server-side only) │
│     Never exposed to frontend           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  4. Database (RLS Policies)             │
│     ✅ Public READ on knowledge_base    │
│        WHERE is_active = true           │
│     ✅ Public INSERT on conversations   │
│     ❌ No public UPDATE/DELETE          │
└─────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ **Scalability** - Handle thousands of users
- ✅ **Performance** - Fast indexed searches
- ✅ **Maintainability** - Update content without code changes
- ✅ **Analytics** - Track user interactions
- ✅ **Security** - Row-level security policies
- ✅ **Reliability** - Cloud-based database (99.9% uptime)
