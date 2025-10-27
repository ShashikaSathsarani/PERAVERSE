# EngEx Knowledge Base Database - Setup Checklist

Use this checklist to track your progress setting up the database system.

## 📋 Pre-Setup Checklist

- [ ] I have a Supabase account (create at https://supabase.com)
- [ ] I have Node.js installed (check with `node --version`)
- [ ] I have access to the project's .env file
- [ ] I understand the difference between markdown file and database approach

## ✅ Step-by-Step Setup

### Phase 1: Supabase Database Setup (10 minutes)

- [ ] **1.1** Logged into Supabase dashboard
- [ ] **1.2** Created new project OR selected existing project
- [ ] **1.3** Went to "SQL Editor" in left sidebar
- [ ] **1.4** Opened `database-schema.sql` file in VS Code
- [ ] **1.5** Copied ALL SQL code from the file
- [ ] **1.6** Pasted into Supabase SQL Editor
- [ ] **1.7** Clicked "Run" button (▶️)
- [ ] **1.8** Saw "Success. No rows returned" message
- [ ] **1.9** Went to "Table Editor" in Supabase
- [ ] **1.10** Verified `knowledge_base` table exists
- [ ] **1.11** Verified `chatbot_conversations` table exists
- [ ] **1.12** Clicked on `knowledge_base` table
- [ ] **1.13** Confirmed there are 16+ rows of data

### Phase 2: Get Supabase Credentials (5 minutes)

- [ ] **2.1** In Supabase dashboard, clicked "Settings" (gear icon)
- [ ] **2.2** Clicked "API" in settings menu
- [ ] **2.3** Found "Project URL" section
- [ ] **2.4** Copied Project URL (format: `https://xxxxx.supabase.co`)
- [ ] **2.5** Saved URL in secure location
- [ ] **2.6** Found "Project API keys" section
- [ ] **2.7** Located "service_role" key (marked "secret")
- [ ] **2.8** Clicked "Reveal" button
- [ ] **2.9** Copied service_role key
- [ ] **2.10** Saved key in secure location

### Phase 3: Configure Environment (5 minutes)

- [ ] **3.1** Located project root directory
- [ ] **3.2** Found `.env` file (or created new one)
- [ ] **3.3** Opened `.env` in editor
- [ ] **3.4** Added or updated `SUPABASE_URL=` with Project URL
- [ ] **3.5** Added or updated `SUPABASE_SERVICE_KEY=` with service key
- [ ] **3.6** Added `KB_API_PORT=3004` (or different port)
- [ ] **3.7** Saved `.env` file
- [ ] **3.8** Verified no extra spaces or quotes in values
- [ ] **3.9** Verified .env is in .gitignore (security!)

### Phase 4: Install Dependencies (5 minutes)

- [ ] **4.1** Opened PowerShell/Terminal
- [ ] **4.2** Navigated to `src/pages/kiosk/chatbot-server`
- [ ] **4.3** Ran `npm install`
- [ ] **4.4** Waited for installation to complete
- [ ] **4.5** Verified no error messages
- [ ] **4.6** Confirmed `node_modules` folder created
- [ ] **4.7** Checked `package-lock.json` exists

### Phase 5: Start API Server (5 minutes)

- [ ] **5.1** In chatbot-server directory
- [ ] **5.2** Ran `npm start` OR `.\start-knowledge-base.ps1`
- [ ] **5.3** Saw server start message
- [ ] **5.4** Confirmed port 3004 message
- [ ] **5.5** No error messages displayed
- [ ] **5.6** Server is running and waiting

### Phase 6: Test API Endpoints (10 minutes)

**Open a NEW PowerShell window** (keep server running in first window)

- [ ] **6.1** Opened second PowerShell window
- [ ] **6.2** **Test 1 - Health Check:**
  ```powershell
  curl http://localhost:8080/health

  curl "http://localhost:8080/api/knowledge-base/search?q=map"

  curl http://localhost:8080/api/knowledge-base/category/SCHEDULE

  curl http://localhost:8080/api/knowledge-base/all

  curl -X POST http://localhost:8080/api/knowledge-base/query -H "Content-Type: application/json" -d "{\"query\": \"where is canteen\"}"

- [ ] **6.6** **Test 3 - Get schedule:**
  ```powershell
  curl http://localhost:8080/api/knowledge-base/category/SCHEDULE
  ```
- [ ] **6.7** Got response with event timings

- [ ] **6.8** **Test 4 - Get all data:**
  ```powershell
  curl http://localhost:8080/api/knowledge-base/all
  ```
- [ ] **6.9** Got response with all categories

- [ ] **6.10** **Test 5 - Intelligent query:**
  ```powershell
  curl -X POST http://localhost:8080/api/knowledge-base/query -H "Content-Type: application/json" -d "{\"query\": \"where is canteen\"}"
  ```
- [ ] **6.11** Got response with canteen location

### Phase 7: Verify Database (5 minutes)

**In Supabase Dashboard:**

- [ ] **7.1** Went to "Table Editor"
- [ ] **7.2** Clicked `knowledge_base` table
- [ ] **7.3** Verified these categories exist:
  - [ ] ENGEX
  - [ ] FACULTY
  - [ ] CAMPUS
  - [ ] SCHEDULE
  - [ ] FACILITIES
  - [ ] SUPPORT
- [ ] **7.4** Clicked on a row to see full content
- [ ] **7.5** Verified keywords array has values
- [ ] **7.6** Verified priority numbers are set
- [ ] **7.7** Checked `is_active` is true for all rows

### Phase 8: Integration (Optional - 15 minutes)

- [ ] **8.1** Opened `src/pages/kiosk/utils/geminiService.ts`
- [ ] **8.2** Imported knowledgeBaseService at top
- [ ] **8.3** Modified `generateResponse` to use database
- [ ] **8.4** Tested chatbot with "show me the map"
- [ ] **8.5** Verified chatbot shows database content
- [ ] **8.6** Tested saving conversations

## 🎯 Verification Tests

### Test A: Database Content
- [ ] Can see all 16+ entries in Supabase dashboard
- [ ] Each entry has title, content, keywords
- [ ] Categories are properly set

### Test B: API Responses
- [ ] Health check returns success
- [ ] Search finds relevant results
- [ ] Category filter works
- [ ] Query endpoint returns data

### Test C: Search Functionality
- [ ] Searching "map" finds campus map
- [ ] Searching "robot" finds robotics event
- [ ] Searching "food" finds canteen info
- [ ] Searching "contact" finds phone numbers

### Test D: Analytics (Optional)
- [ ] Conversations are being saved
- [ ] Can view conversation history in Supabase
- [ ] kb_items_used array is populated

## 🐛 Troubleshooting Checklist

If something doesn't work:

### Problem: API won't start
- [ ] Checked .env file exists and has correct values
- [ ] Verified SUPABASE_URL starts with `https://`
- [ ] Verified SUPABASE_SERVICE_KEY is not empty
- [ ] Checked port 3004 is not already in use
- [ ] Ran `npm install` in chatbot-server directory

### Problem: No data returned from API
- [ ] Verified database-schema.sql was run successfully
- [ ] Checked Table Editor shows knowledge_base table
- [ ] Confirmed rows exist in knowledge_base table
- [ ] Verified is_active = true for all rows
- [ ] Checked Supabase project is not paused

### Problem: Search returns empty results
- [ ] Verified keywords array is populated
- [ ] Checked search term matches keywords
- [ ] Tried searching by category
- [ ] Checked database has data (run Test A above)

### Problem: Connection errors
- [ ] Verified internet connection
- [ ] Checked Supabase project is active
- [ ] Verified credentials are correct
- [ ] Tried restarting API server
- [ ] Checked firewall settings

## 📊 Success Criteria

You've successfully set up the system when:

- [x] **Database**: Supabase has 2 tables with data
- [x] **API**: Server runs on port 3004 without errors
- [x] **Health**: Health endpoint returns success
- [x] **Search**: Can find information by keywords
- [x] **Categories**: Can retrieve data by category
- [x] **Query**: Intelligent query returns relevant results

## 🎓 Learning Checklist

I understand:

- [ ] Why we use a database instead of markdown file
- [ ] How the API server connects to Supabase
- [ ] How to search the knowledge base
- [ ] How to add new information to database
- [ ] How to update existing entries
- [ ] How conversations are tracked
- [ ] How to view analytics in Supabase

## 📚 Documentation Review

I have read:

- [ ] **SETUP_SUMMARY.md** - Quick start guide
- [ ] **DATABASE_SETUP.md** - Detailed setup instructions
- [ ] **README_DATABASE.md** - Full documentation
- [ ] **ARCHITECTURE.md** - System architecture
- [ ] **This checklist** - Setup verification

## 🚀 Next Steps After Setup

- [ ] Add more knowledge base entries
- [ ] Customize categories for your needs
- [ ] Set up analytics dashboard
- [ ] Integrate with chatbot fully
- [ ] Test with real users
- [ ] Monitor conversation logs
- [ ] Update content as needed

## 💡 Tips

- ✅ Keep `.env` file secure (never commit to Git)
- ✅ Use Supabase dashboard to update content
- ✅ Test search with different keywords
- ✅ Review conversation logs regularly
- ✅ Backup your database periodically
- ✅ Monitor API server logs for errors

---

## ✨ Setup Complete!

When all checkboxes are marked:

```
┌────────────────────────────────────────┐
│  🎉 CONGRATULATIONS! 🎉                │
│                                        │
│  Your EngEx Knowledge Base Database    │
│  is fully operational!                 │
│                                        │
│  🚀 Ready to serve users!              │
└────────────────────────────────────────┘
```

**Total Setup Time**: ~30-45 minutes

**Current Status**:
- Total Checkboxes: 100+
- Completed: ____ / 100+
- Percentage: ____%

Keep this file handy for future reference and troubleshooting!
