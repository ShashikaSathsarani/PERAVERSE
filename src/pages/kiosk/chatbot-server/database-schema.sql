-- EngEx Knowledge Base Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- 1. Create knowledge_base table for storing all EngEx information
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT[], -- Array of searchable keywords
    priority INTEGER DEFAULT 0, -- Higher priority items shown first
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create index for faster searches
CREATE INDEX idx_kb_category ON knowledge_base(category);
CREATE INDEX idx_kb_keywords ON knowledge_base USING GIN(keywords);
CREATE INDEX idx_kb_active ON knowledge_base(is_active);

-- 3. Create chatbot_conversations table to store chat history
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    kb_items_used INTEGER[], -- IDs of knowledge base items used
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create index for chat history
CREATE INDEX idx_conv_session ON chatbot_conversations(session_id);
CREATE INDEX idx_conv_created ON chatbot_conversations(created_at);

-- 5. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create trigger for automatic timestamp update
CREATE TRIGGER update_kb_updated_at BEFORE UPDATE ON knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert initial data from engexKnowledgeBase.md

-- About EngEx Exhibition
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority) VALUES
('ENGEX', 'About', 'What is EngEx?', 
'EngEx (Engineering Exhibition) is the flagship annual event organized by the Faculty of Engineering, University of Peradeniya. It showcases innovative engineering projects, research work, and technological advancements by undergraduate students from all engineering departments.',
ARRAY['engex', 'exhibition', 'what is', 'about', 'event', 'annual'],
100),

('ENGEX', 'Features', 'EngEx Key Features',
'Student project exhibitions from all 8 engineering departments
Industry partnerships and collaborations
Technical demonstrations and interactive displays
Robotics competitions and demonstrations
Keynote speeches by industry leaders
Career fair with leading engineering companies
Innovation awards and competitions
Research poster presentations
Hands-on workshops and seminars',
ARRAY['features', 'what to see', 'attractions', 'activities', 'exhibits'],
90),

('ENGEX', 'Departments', 'Exhibition Departments',
'1. Civil Engineering - Infrastructure, construction, and sustainable development projects
2. Mechanical Engineering - Robotics, automation, and manufacturing innovations
3. Electrical & Electronic Engineering - Power systems, electronics, and renewable energy
4. Computer Engineering - AI/ML, software systems, and embedded systems
5. Chemical & Process Engineering - Process optimization and chemical innovations
6. Production Engineering - Manufacturing systems and industrial engineering
7. Materials Engineering - Advanced materials and nanotechnology
8. Engineering Mathematics - Computational methods and data science',
ARRAY['departments', 'engineering', 'civil', 'mechanical', 'electrical', 'computer', 'chemical', 'materials', 'production'],
95);

-- Faculty Information
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority) VALUES
('FACULTY', 'History', 'University of Peradeniya Engineering Faculty History',
'Founded in 1950 - Pioneer and first Engineering Faculty in Sri Lanka
Shifted to current Peradeniya location in 1964
#1 ranked Engineering Faculty in Sri Lanka
Part of University of Peradeniya - Most prestigious university in Sri Lanka
Located in Peradeniya, Kandy District (5km from Kandy city)
Idyllic setting on banks of Mahaweli River at foothills of Hantana mountain range
Over 6000+ students have graduated from this faculty',
ARRAY['faculty', 'history', 'university', 'peradeniya', 'founded', 'established', '1950', '1964'],
100),

('FACULTY', 'Contact', 'Faculty Contact Information',
'Dean''s Office: +94 81 239 3302
AR Office: +94 81 239 3305
Email: deanoffice@eng.pdn.ac.lk
Website: https://eng.pdn.ac.lk/
Address: Faculty of Engineering, University of Peradeniya, Peradeniya, Sri Lanka',
ARRAY['contact', 'phone', 'email', 'address', 'location', 'dean'],
85),

('FACULTY', 'Programs', 'Academic Programs',
'4-year BSc Engineering Honours in 8 disciplines
Annual intake: 550-600 students
Postgraduate: MEng, MPhil, PhD programs
Medium: English
Nearly 100% employability rate for graduates',
ARRAY['programs', 'courses', 'degrees', 'undergraduate', 'postgraduate', 'admission'],
80);

-- Campus Map and Locations
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority) VALUES
('CAMPUS', 'Map', 'Campus Map Zones',
'Zone A: Main academic area
Zone B: Building 1 (Chemical & Process Engineering)
Zone C: Buildings 8, 11, 12, 13 (Central academic buildings)
Zone D: Buildings 16, 17, 18, 22, 23 (Department labs and workshops)
Zone E: Buildings 2, 3 (Engineering Mathematics, Computer labs)
Zone F: Building 25 area (Eastern section)
Main entrance at bottom right, with EXIT points on left and top right',
ARRAY['map', 'campus', 'zones', 'buildings', 'location', 'where'],
100),

('CAMPUS', 'Buildings', 'Key Campus Buildings',
'Building 1: Chemical and Process Engineering
Buildings 2-3: Engineering Mathematics/Computer Center
Building 4: Professor E.O.E. Pereira Theatre
Building 5: Administrative Building
Building 7: Electronic Lab
Buildings 8-9: Electrical & Computer Engineering
Building 27: Engineering Library
Building 29: Faculty Canteen
Building 20-21: Engineering Workshop & Carpentry',
ARRAY['buildings', 'departments', 'library', 'canteen', 'workshop', 'labs'],
90);

-- Event Schedule
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority) VALUES
('SCHEDULE', 'Morning', '09:00 AM - Registration',
'Location: Main Entrance Lobby, Ground Floor
Route: Enter through main gate → Registration desk on right side
What to expect: Collect visitor badge, receive event brochure, get wristband',
ARRAY['registration', '9am', 'morning', 'welcome', 'entry', 'badge'],
100),

('SCHEDULE', 'Morning', '10:00 AM - Opening Ceremony',
'Location: Main Auditorium, Central Building, Ground Floor
Capacity: 800 seats
Route from Main Entrance: Enter lobby → Straight 50m → Left at Faculty Office → Right 20m (2-3 mins)
Program: Chief Guest speech, Dean''s Address, Department presentations',
ARRAY['opening', 'ceremony', '10am', 'auditorium', 'morning'],
95),

('SCHEDULE', 'Afternoon', '02:00 PM - Student Project Presentations',
'Location: Main Auditorium (same as Opening Ceremony)
Program: Best Project Competition finals, Live demos, Q&A sessions',
ARRAY['presentations', '2pm', 'afternoon', 'projects', 'competition'],
90),

('SCHEDULE', 'Afternoon', '03:30 PM - Robotics Competition',
'Location: Sports Ground, Behind Main Building (Outdoor)
Route from Auditorium: Rear exit → Back stairs → Outside → Ground 50m ahead (3 mins)
Features: Line following, Maze solving, Sumo battles, Spectator seating',
ARRAY['robotics', 'competition', '3:30pm', 'robots', 'sports ground'],
95);

-- Facilities
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority) VALUES
('FACILITIES', 'Food', 'Food and Dining Locations',
'Main Canteen - Student Center, West Wing (7 AM - 8 PM)
  Menu: Rice & curry, Short eats, Beverages
  Capacity: 200+ seats, Cash/Cards accepted
  
Food Court - Near Exhibition Hall B (10 AM - 7 PM)
  Quick bites and snacks
  
Coffee Shop - Library Building (8 AM - 6 PM)
  Coffee, Tea, Pastries, Quiet atmosphere',
ARRAY['food', 'canteen', 'eat', 'lunch', 'dinner', 'hungry', 'restaurant', 'cafe'],
100),

('FACILITIES', 'Washrooms', 'Washroom Locations',
'Ground Floor: Near main entrance (right side of lobby)
Ground Floor: Near registration area (behind desk)
Ground Floor: Near Main Canteen (adjacent to Student Center)
First Floor: Both East & West wings (next to elevators)
Second Floor: Near Conference Hall (beside seminar rooms)
All include accessible washrooms with clear signage',
ARRAY['washroom', 'restroom', 'toilet', 'bathroom', 'facilities'],
85),

('FACILITIES', 'Services', 'Campus Services',
'Information Desks: Main entrance, Exhibition Halls A & B
First Aid: Near main canteen (red cross sign)
Parking: Front & rear lots (free)
ATM: Main building, ground floor
Medical Center: +94 81 239 2361
Security: +94 81 239 4914',
ARRAY['services', 'help', 'parking', 'atm', 'first aid', 'emergency'],
80);

-- Emergency Contacts
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority) VALUES
('SUPPORT', 'Emergency', 'Emergency Contact Numbers',
'Event Coordinators: +94 81 239 3000
Technical Support: +94 81 239 3001
Security: +94 81 239 4914
Medical Center: +94 81 239 2361
Dean''s Office: +94 81 239 3302',
ARRAY['emergency', 'contact', 'help', 'phone', 'support', 'call'],
100);

-- Enable Row Level Security (RLS)
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to knowledge base
CREATE POLICY "Allow public read access to knowledge_base"
    ON knowledge_base FOR SELECT
    USING (is_active = true);

-- Create policy to allow public insert to conversations
CREATE POLICY "Allow public insert to conversations"
    ON chatbot_conversations FOR INSERT
    WITH CHECK (true);

COMMENT ON TABLE knowledge_base IS 'Stores all EngEx exhibition and faculty information for chatbot';
COMMENT ON TABLE chatbot_conversations IS 'Stores chatbot conversation history for analytics';
