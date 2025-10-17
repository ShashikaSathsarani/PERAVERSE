-- ================================================================
-- EXHIBITION EVENTS KNOWLEDGE BASE UPDATE
-- Faculty of Engineering Exhibition - 5-Day Schedule
-- This adds all event information to the knowledge_base table
-- ================================================================

-- Overview of the Exhibition
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Exhibition Overview',
    'Faculty of Engineering Exhibition - 5 Day Schedule',
    'The Faculty of Engineering is hosting a comprehensive 5-day exhibition featuring:

📅 Duration: 5 consecutive days
📊 Total Events: 35+ events
🏢 Locations: All campus zones (A-F), Buildings 1-29

Daily Themes:
• Day 1: Opening Day & Technology Showcase
• Day 2: Innovation & Design Day
• Day 3: Sustainability & Environment Day
• Day 4: Career & Networking Day
• Day 5: Closing Day & Technology Competitions

The exhibition includes workshops, competitions, career fairs, cultural events, and continuous exhibitions from all 8 engineering departments. Events run from 8:00 AM to 8:30 PM daily.

For specific event details, ask about individual days or event types!',
    ARRAY['exhibition', 'events', '5 days', 'schedule', 'engineering exhibition', 'faculty events', 'what events', 'when events', 'exhibition schedule'],
    10,
    true
);

-- DAY 1 EVENTS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Day 1',
    'Day 1: Opening Day & Technology Showcase Events',
    'Day 1 features the grand opening and technology highlights:

🎉 Grand Opening Ceremony
Time: 9:00 AM - 10:30 AM
Location: Main Auditorium - Building 4
Details: Official inauguration with keynote speeches from the Dean, distinguished guests, and industry leaders. Ribbon cutting ceremony followed by exhibition zone tours.
Expected Attendance: 250 people

🤖 Robotics Competition Finals
Time: 11:00 AM - 1:00 PM
Location: Zone C - Building 9 (Computer Engineering)
Details: Watch teams compete in autonomous navigation, obstacle courses, and problem-solving tasks. Prizes for top 3 teams. Open to all visitors.
Expected Attendance: 180 people

🧠 AI & Machine Learning Workshop
Time: 2:00 PM - 4:00 PM
Location: Computer Lab - Building 3
Details: Hands-on workshop on artificial intelligence and machine learning fundamentals. Learn about neural networks, deep learning, and practical applications. Laptops recommended. Limited seats available.
Expected Attendance: 150 people

💼 Industry Panel Discussion: Future of Engineering
Time: 4:30 PM - 6:00 PM
Location: Main Auditorium - Building 4
Details: Panel of industry experts from leading tech companies discuss emerging trends, career opportunities, and the future of engineering in Sri Lanka. Q&A session included.
Expected Attendance: 200 people',
    ARRAY['day 1', 'opening day', 'first day', 'opening ceremony', 'robotics competition', 'ai workshop', 'machine learning', 'industry panel', 'technology showcase'],
    9,
    true
);

-- DAY 2 EVENTS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Day 2',
    'Day 2: Innovation & Design Day Events',
    'Day 2 celebrates innovation and creativity:

🎨 Student Project Exhibition Opening
Time: 9:00 AM - 5:00 PM
Location: All Zones - Buildings 22-29
Details: Explore over 100 innovative student projects from all 8 engineering departments. Projects include IoT devices, renewable energy solutions, mobile apps, and civil engineering designs.
Expected Attendance: 320 people

🖨️ 3D Printing & Fabrication Demo
Time: 10:00 AM - 12:00 PM
Location: Workshop - Building 21 (Mechanical Engineering)
Details: Live demonstrations of 3D printing technology, CNC machining, and modern fabrication techniques. Visitors can design and print small souvenirs. First-come, first-served.
Expected Attendance: 120 people

💡 From Engineer to Entrepreneur: Success Stories
Time: 1:00 PM - 2:30 PM
Location: Seminar Hall - Building 25
Details: Inspiring talks from successful engineering entrepreneurs who built startups from their university projects. Learn about funding, pitching, and turning ideas into businesses.
Expected Attendance: 140 people

🚁 Drone Racing Competition
Time: 3:00 PM - 5:00 PM
Location: Open Ground - Near Rock Area (Zone F)
Details: Thrilling FPV drone racing through obstacle courses. Teams compete for fastest lap times. Spectators welcome. Prizes for top 3 racers. Safety gear provided.
Expected Attendance: 160 people

🎭 Cultural Night - Engineering Fusion
Time: 6:00 PM - 8:30 PM
Location: Main Auditorium - Building 4
Details: Evening of music, dance, and entertainment celebrating the diversity of engineering students. Live band performances, traditional dances, and talent show. Food stalls available.
Expected Attendance: 280 people',
    ARRAY['day 2', 'second day', 'innovation day', 'design day', 'student projects', '3d printing', 'drone racing', 'cultural night', 'entrepreneurship'],
    9,
    true
);

-- DAY 3 EVENTS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Day 3',
    'Day 3: Sustainability & Environment Day Events',
    'Day 3 focuses on sustainable engineering solutions:

☀️ Renewable Energy Showcase
Time: 9:30 AM - 11:30 AM
Location: Zone D - Buildings 15-21 (Mechanical & Civil)
Details: Exhibition of solar panel systems, wind turbines, and hydroelectric models. Learn about sustainable energy solutions for Sri Lanka. Interactive displays and experiments.
Expected Attendance: 170 people

💧 Smart Water Management & Irrigation Systems
Time: 11:00 AM - 1:00 PM
Location: Civil Engineering Lab - Building 18
Details: Demonstrations of IoT-enabled water monitoring, smart irrigation systems, and water quality testing. Focus on solutions for agriculture and urban water management.
Expected Attendance: 110 people

🏗️ Green Building Design Workshop
Time: 2:00 PM - 4:00 PM
Location: Structures Lab - Building 25
Details: Learn principles of sustainable architecture, energy-efficient building design, and eco-friendly construction materials. Hands-on design challenge with prizes.
Expected Attendance: 95 people

🌍 Engineering for Climate Change: Solutions & Challenges
Time: 4:30 PM - 6:00 PM
Location: Seminar Hall - Building 25
Details: Experts discuss how engineering can combat climate change through innovative technologies, sustainable practices, and policy advocacy. Case studies from Sri Lanka and abroad.
Expected Attendance: 130 people',
    ARRAY['day 3', 'third day', 'sustainability', 'environment day', 'renewable energy', 'solar', 'water management', 'green building', 'climate change'],
    9,
    true
);

-- DAY 4 EVENTS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Day 4',
    'Day 4: Career & Networking Day Events',
    'Day 4 is dedicated to career development and professional networking:

💼 Career Fair - Meet the Employers
Time: 9:00 AM - 4:00 PM
Location: Zone A - Buildings 22-29 (Central Hub)
Details: Over 30 leading companies from IT, construction, manufacturing, and engineering sectors. On-spot interviews, internship opportunities, and career guidance. Bring your CV!
Expected Attendance: 400 people

📝 Resume Building & Interview Skills Workshop
Time: 10:00 AM - 12:00 PM
Location: Computer Lab - Building 3
Details: Professional career counselors teach how to craft winning resumes, write cover letters, and ace technical interviews. Mock interview sessions available.
Expected Attendance: 85 people

🤝 Alumni Networking Session: Connect & Grow
Time: 1:00 PM - 3:00 PM
Location: Canteen Area - Building 29
Details: Meet successful alumni working in top companies worldwide. Network, seek mentorship, and learn from their career journeys. Refreshments provided.
Expected Attendance: 190 people

🚀 Startup Pitch Competition
Time: 3:30 PM - 5:30 PM
Location: Main Auditorium - Building 4
Details: Student teams pitch their startup ideas to a panel of investors and entrepreneurs. Winner receives seed funding and mentorship. Open to all engineering students.
Expected Attendance: 220 people

💻 Freelancing & Remote Work: Engineering in the Digital Age
Time: 6:00 PM - 7:30 PM
Location: Seminar Hall - Building 25
Details: Learn how to build a successful freelance career, find clients on platforms like Upwork and Fiverr, and manage remote engineering projects. Tips for pricing and negotiation.
Expected Attendance: 105 people',
    ARRAY['day 4', 'fourth day', 'career day', 'networking', 'career fair', 'job fair', 'companies', 'resume workshop', 'alumni', 'startup competition', 'freelancing'],
    9,
    true
);

-- DAY 5 EVENTS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Day 5',
    'Day 5: Closing Day & Technology Competitions Events',
    'Day 5 concludes the exhibition with exciting competitions and awards:

💻 24-Hour Hackathon Grand Finale
Time: 9:00 AM - 11:00 AM
Location: Computer Lab - Building 9
Details: Final presentations from teams who coded for 24 hours straight! Judging by industry experts. Categories: Best Innovation, Best Design, Best Social Impact. Cash prizes.
Expected Attendance: 240 people

🌉 Bridge Building Competition
Time: 11:00 AM - 1:00 PM
Location: Structures Lab - Building 25
Details: Civil and Mechanical engineering students compete to build the strongest bridge using limited materials. Load testing and failure analysis. Educational and entertaining!
Expected Attendance: 155 people

📚 Undergraduate Research Paper Presentations
Time: 1:30 PM - 3:30 PM
Location: Seminar Hall - Building 25
Details: Final-year students present their research projects and findings. Topics include AI, IoT, materials science, structural engineering, and more. Awards for best presentations.
Expected Attendance: 125 people

🧩 Engineering & Technology Quiz Challenge
Time: 3:00 PM - 4:30 PM
Location: Main Auditorium - Building 4
Details: Test your knowledge in engineering, science, and technology! Team-based quiz competition with buzzer rounds, rapid-fire questions, and visual rounds. Prizes for winners.
Expected Attendance: 175 people

🏆 Closing Ceremony & Awards Night
Time: 5:00 PM - 7:00 PM
Location: Main Auditorium - Building 4
Details: Grand finale of the 5-day exhibition! Awards for best projects, competitions, and outstanding participants. Thank you speech from organizers, photo session, and farewell.
Expected Attendance: 350 people',
    ARRAY['day 5', 'fifth day', 'closing day', 'final day', 'hackathon', 'bridge competition', 'research presentations', 'quiz competition', 'closing ceremony', 'awards'],
    9,
    true
);

-- CONTINUOUS EVENTS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Continuous Events',
    'Continuous Events Running Throughout All 5 Days',
    'These events and facilities are available every day throughout the exhibition:

🎪 Department Exhibitions - All 8 Departments
Time: 9:00 AM - 5:00 PM (Daily for 5 days)
Location: All Zones - Campus Wide
Details: Explore exhibitions from Civil, Mechanical, Electrical, Electronic, Computer, Chemical, Materials, and Manufacturing Engineering departments. Interactive displays open daily.
Expected Attendance: 500 people

🥽 VR Experience Zone - Engineering Simulations
Time: 10:00 AM - 4:00 PM (Daily for 5 days)
Location: Zone C - Building 9
Details: Try VR headsets and experience engineering simulations: fly drones, operate machinery, explore 3D models of buildings, and play educational games. Open all 5 days.
Expected Attendance: 280 people

🍛 Food Stalls & Refreshments
Time: 8:00 AM - 7:00 PM (Daily for 5 days)
Location: Canteen Area - Building 29
Details: Variety of food stalls offering Sri Lankan cuisine, snacks, beverages, and desserts. Seating areas available. Open throughout the exhibition hours.
Expected Attendance: 450 people',
    ARRAY['continuous events', 'daily events', 'all days', 'department exhibitions', 'vr zone', 'virtual reality', 'food stalls', 'refreshments', 'canteen'],
    8,
    true
);

-- DAILY WORKSHOPS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Daily Workshops',
    'Daily Workshops - Repeated Each Day',
    'These workshops are conducted daily throughout the exhibition:

⚡ Arduino & Electronics Basics
Time: 10:00 AM - 12:00 PM (Days 1, 2, 3)
Location: Electronics Lab - Building 8
Details: Learn Arduino programming and basic electronics. Build simple circuits and control LEDs, motors, and sensors. Kits provided. Suitable for beginners.
Expected Attendance: 65-70 people per session

🧪 Chemical Engineering Experiments
Time: 2:00 PM - 3:00 PM (Days 1, 2)
Location: Zone B - Building 1 (Chemical Engineering)
Details: Live chemistry demonstrations showing reactions, distillation processes, and polymer synthesis. Safety goggles provided. Educational and visually stunning!
Expected Attendance: 85-90 people per session',
    ARRAY['daily workshops', 'arduino', 'electronics', 'chemical experiments', 'repeated daily', 'workshop schedule'],
    7,
    true
);

-- COMPETITIONS SUMMARY
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Competitions',
    'All Competitions During the Exhibition',
    'The exhibition features several exciting competitions:

🤖 Robotics Competition Finals
Day 1, 11:00 AM - 1:00 PM
Location: Zone C - Building 9
Prize: Awards for top 3 teams
Details: Autonomous navigation and problem-solving challenges

🚁 Drone Racing Competition
Day 2, 3:00 PM - 5:00 PM
Location: Near Rock Area (Zone F)
Prize: Awards for top 3 racers
Details: FPV racing through obstacle courses

🚀 Startup Pitch Competition
Day 4, 3:30 PM - 5:30 PM
Location: Main Auditorium - Building 4
Prize: Seed funding and mentorship
Details: Student teams pitch startup ideas to investors

💻 24-Hour Hackathon Grand Finale
Day 5, 9:00 AM - 11:00 AM
Location: Computer Lab - Building 9
Prize: Cash prizes for Best Innovation, Design, Social Impact
Details: Teams present after coding 24 hours straight

🌉 Bridge Building Competition
Day 5, 11:00 AM - 1:00 PM
Location: Structures Lab - Building 25
Details: Build strongest bridge with limited materials

🧩 Engineering & Technology Quiz Challenge
Day 5, 3:00 PM - 4:30 PM
Location: Main Auditorium - Building 4
Prize: Awards for winning team
Details: Team-based quiz with buzzer rounds',
    ARRAY['competitions', 'contests', 'robotics', 'drones', 'hackathon', 'startup pitch', 'bridge building', 'quiz', 'prizes', 'compete'],
    8,
    true
);

-- WORKSHOPS SUMMARY
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Workshops',
    'All Workshops During the Exhibition',
    'Interactive learning workshops throughout the exhibition:

Day 1:
• AI & Machine Learning Workshop (2:00 PM - 4:00 PM, Building 3)

Day 2:
• 3D Printing & Fabrication Demo (10:00 AM - 12:00 PM, Building 21)

Day 3:
• Green Building Design Workshop (2:00 PM - 4:00 PM, Building 25)

Day 4:
• Resume Building & Interview Skills Workshop (10:00 AM - 12:00 PM, Building 3)

Daily (Days 1-3):
• Arduino & Electronics Basics (10:00 AM - 12:00 PM, Building 8)

Daily (Days 1-2):
• Chemical Engineering Experiments (2:00 PM - 3:00 PM, Building 1)

All workshops are hands-on and include practical demonstrations. Some require advance registration or have limited seats. Workshops are conducted by experienced faculty and industry professionals.',
    ARRAY['workshops', 'learning', 'hands-on', 'ai workshop', '3d printing', 'arduino', 'green building', 'resume workshop', 'chemical experiments', 'training'],
    8,
    true
);

-- CAREER EVENTS SUMMARY
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Career Events',
    'Career Development & Networking Events',
    'Day 4 is Career & Networking Day with these opportunities:

💼 Career Fair - Meet the Employers
9:00 AM - 4:00 PM, Zone A (Buildings 22-29)
• Over 30 leading companies
• IT, construction, manufacturing, and engineering sectors
• On-spot interviews available
• Internship opportunities
• Career guidance sessions
• Bring your CV!

📝 Resume Building & Interview Skills Workshop
10:00 AM - 12:00 PM, Building 3
• Professional career counselors
• Resume and cover letter writing
• Technical interview preparation
• Mock interview sessions

🤝 Alumni Networking Session
1:00 PM - 3:00 PM, Canteen Area (Building 29)
• Meet successful alumni from top companies worldwide
• Networking opportunities
• Mentorship discussions
• Career journey insights
• Refreshments provided

💻 Freelancing & Remote Work Seminar
6:00 PM - 7:30 PM, Building 25
• Building freelance career
• Finding clients (Upwork, Fiverr)
• Remote project management
• Pricing and negotiation tips',
    ARRAY['career', 'jobs', 'career fair', 'companies', 'internships', 'interviews', 'resume', 'alumni', 'networking', 'freelancing', 'employment'],
    8,
    true
);

-- SPECIAL EVENTS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Special Events',
    'Special Ceremonies and Cultural Events',
    'Special highlight events during the exhibition:

🎉 Grand Opening Ceremony
Day 1, 9:00 AM - 10:30 AM
Location: Main Auditorium - Building 4
• Keynote speeches from the Dean
• Distinguished guests and industry leaders
• Ribbon cutting ceremony
• Exhibition zone tours
Expected Attendance: 250 people

🎭 Cultural Night - Engineering Fusion
Day 2, 6:00 PM - 8:30 PM
Location: Main Auditorium - Building 4
• Music, dance, and entertainment
• Live band performances
• Traditional dances
• Talent show
• Food stalls available
Expected Attendance: 280 people

💼 Industry Panel Discussion: Future of Engineering
Day 1, 4:30 PM - 6:00 PM
Location: Main Auditorium - Building 4
• Panel of industry experts
• Leading tech companies
• Emerging trends discussion
• Career opportunities
• Q&A session included
Expected Attendance: 200 people

🏆 Closing Ceremony & Awards Night
Day 5, 5:00 PM - 7:00 PM
Location: Main Auditorium - Building 4
• Awards for best projects and competitions
• Thank you speeches
• Photo session
• Grand finale farewell
Expected Attendance: 350 people',
    ARRAY['special events', 'opening ceremony', 'cultural night', 'panel discussion', 'closing ceremony', 'awards night', 'ceremonies'],
    8,
    true
);

-- EVENT LOCATIONS GUIDE
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Event Locations',
    'Exhibition Event Locations Guide',
    'Events are held throughout the campus in these key locations:

🏛️ Main Auditorium - Building 4
• Grand Opening Ceremony
• Industry Panel Discussion
• Cultural Night
• Startup Pitch Competition
• Technology Quiz
• Closing Ceremony & Awards
(Most major ceremonies and large gatherings)

💻 Computer Labs - Buildings 3 & 9
• AI & Machine Learning Workshop
• Resume Building Workshop
• Hackathon Finale
• VR Experience Zone

🔧 Workshops & Labs
• Building 21: 3D Printing & Fabrication
• Building 8: Arduino & Electronics
• Building 18: Water Management
• Building 25: Green Building, Research Presentations

🏗️ Structures & Testing
• Building 25: Bridge Building Competition

🎪 Exhibition Zones
• Zone A (Buildings 22-29): Career Fair, Department Exhibitions
• Zone B (Building 1): Chemical Engineering Experiments
• Zone C (Building 9): Robotics Competition, VR Zone
• Zone D (Buildings 15-21): Renewable Energy
• Zone F (Rock Area): Drone Racing

🍛 Canteen Area - Building 29
• Food Stalls & Refreshments (all 5 days)
• Alumni Networking Session

All locations are accessible from the main campus entrance and are connected through the central Zone A.',
    ARRAY['event locations', 'where events', 'event venues', 'building 4', 'auditorium', 'labs', 'workshops', 'zones', 'map'],
    7,
    true
);

-- EVENT TIMINGS
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'EVENTS',
    'Timings',
    'Exhibition Event Timings and Schedule',
    'Exhibition operating hours and event timing patterns:

⏰ Daily Operating Hours:
• Earliest Event: 8:00 AM (Food Stalls)
• Latest Event: 8:30 PM (Cultural Night on Day 2)
• Most Events: 9:00 AM - 7:00 PM
• Peak Hours: 10:00 AM - 5:00 PM

⏰ Event Duration Patterns:
• Short Sessions: 1 hour (Chemical experiments)
• Standard Events: 2 hours (Most workshops)
• Half-Day Events: 3-4 hours (Competitions, seminars)
• Full-Day Events: 7-8 hours (Career Fair, Department Exhibitions)
• Multi-Day: 5 days continuous (VR Zone, Food Stalls)

⏰ Time Slot Categories:
Morning (9:00 AM - 12:00 PM):
• Opening ceremonies
• Career fair starts
• Workshops begin
• Competitions

Afternoon (1:00 PM - 5:00 PM):
• Main workshops
• Competitions continue
• Networking events
• Exhibitions peak

Evening (5:00 PM - 8:30 PM):
• Panel discussions
• Closing ceremonies
• Cultural events
• Special programs

💡 Planning Tips:
• Arrive early for popular events (limited seating)
• Career Fair on Day 4 runs all day
• Cultural Night on Day 2 is evening only
• Multiple events often run simultaneously in different zones',
    ARRAY['timings', 'schedule', 'when', 'time', 'hours', 'operating hours', 'event time', 'duration', 'morning', 'afternoon', 'evening'],
    7,
    true
);

-- ================================================================
-- END OF EXHIBITION EVENTS KNOWLEDGE BASE
-- ================================================================
-- Total Records Added: 14 comprehensive event entries
-- Coverage: All days, competitions, workshops, locations, timings
-- Keywords: Optimized for natural chatbot queries
-- ================================================================

-- To verify insertion:
-- SELECT title FROM knowledge_base WHERE category = 'EVENTS' ORDER BY priority DESC;
-- SELECT COUNT(*) as event_records FROM knowledge_base WHERE category = 'EVENTS';
