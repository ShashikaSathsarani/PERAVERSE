-- ================================================================
-- CAMPUS LOCATIONS AND BUILDINGS UPDATE
-- Faculty of Engineering, University of Peradeniya
-- Based on official campus map and eng.pdn.ac.lk
-- ================================================================

-- First, let's add all detailed campus locations based on the map

-- Zone A Buildings
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Buildings',
    'Zone A - Central Area Buildings',
    'Zone A is the central hub of the Faculty containing:
• Building 22: Main Administrative Building
• Building 23: Corridor connecting different zones
• Building 24-26: Academic and research facilities
• Building 28: Central facilities building
• Building 29: Faculty support services

Zone A provides easy access to all other zones (B, C, D, E, F) and is the central meeting point of the campus.',
    ARRAY['zone a', 'central area', 'building 22', 'building 23', 'building 24', 'building 25', 'building 26', 'building 28', 'building 29', 'central hub', 'administrative'],
    5,
    true
);

-- Zone B Buildings (North Area)
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Buildings',
    'Zone B - North Campus Area',
    'Zone B is located in the northern part of the campus and includes:
• Building 1: Academic facilities
• Building 2: Department laboratories
• Building 3: Research labs

This zone is accessible from the main entrance and connects to the central Zone A.',
    ARRAY['zone b', 'north area', 'building 1', 'building 2', 'building 3', 'northern campus', 'labs', 'research'],
    5,
    true
);

-- Zone C Buildings (West Area)
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Buildings',
    'Zone C - West Campus Area',
    'Zone C is the western section featuring:
• Building 8: Department facilities
• Building 9: Laboratory complex
• Building 10: Workshop area
• Building 11: Technical facilities
• Building 12: Academic spaces
• Building 13: Large lecture halls and labs

Zone C houses major workshops and laboratory facilities, essential for practical engineering education.',
    ARRAY['zone c', 'west area', 'building 8', 'building 9', 'building 10', 'building 11', 'building 12', 'building 13', 'workshops', 'labs', 'western campus'],
    5,
    true
);

-- Zone D Buildings (Southwest Area)
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Buildings',
    'Zone D - Southwest Campus Area',
    'Zone D in the southwest contains:
• Building 15: Academic building
• Building 16: Department facilities
• Building 17: Specialized labs
• Building 18: Research and development area
• Building 20: Technical workshops
• Building 21: Support facilities

This zone is known for specialized technical facilities and research laboratories.',
    ARRAY['zone d', 'southwest area', 'building 15', 'building 16', 'building 17', 'building 18', 'building 20', 'building 21', 'southwest campus', 'technical'],
    5,
    true
);

-- Zone E Buildings (Northeast Area)
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Buildings',
    'Zone E - Northeast Campus Area',
    'Zone E is located in the northeast section near Rock Area featuring:
• Building 4: Major academic facility
• Building 5: Department headquarters
• Building 6: Research laboratories
• Building 25: Additional academic spaces

Zone E is adjacent to the scenic Rock Area and provides a quiet study environment.',
    ARRAY['zone e', 'northeast area', 'building 4', 'building 5', 'building 6', 'building 25', 'rock area', 'northeast campus'],
    5,
    true
);

-- Zone F Buildings (East Area)
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Buildings',
    'Zone F - East Campus Area',
    'Zone F extends along the eastern edge near Rock Area:
• Building 27: Engineering facilities
• Access to Rock Area (scenic viewpoint)
• Connection to main road and parking areas

This zone provides access to the Rock Area, a popular spot for students to relax and study.',
    ARRAY['zone f', 'east area', 'building 27', 'rock area', 'eastern campus', 'parking'],
    5,
    true
);

-- Detailed Department Locations
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Departments',
    'Department Locations on Campus',
    'Department buildings according to the campus map:

1. Department of Chemical and Process Engineering - Building 1 (Zone B)
2. Department Engineering Mathematics/Computer Center - Buildings 2-3 (Zone B)
3. Drawing Office 1 - Building 3 (Zone B)
4. Professor E.O.E. Pereira Theatre - Building 4 (Zone E)
5. Administrative Building - Building 5 (Zone E)
6. Security Unit - Building 6 (Zone E)
7. Electronic Lab - Building 7 (near Zone C)
8. Department of Electrical and Electronic Engineering - Building 8 (Zone C)
9. Department of Computer Engineering - Building 9 (Zone C)
10. Electrical and Electronic Workshop - Building 10 (Zone C)
11. Surveying Lab - Building 11 (Zone C)
12. Soil Lab - Building 12 (Zone C)
13. Materials Lab - Building 13 (Zone C)
14. Environmental Lab - Building 14 (between Zones C & D)
15. Fluids Lab - Building 15 (Zone D)
16. New Mechanics Lab - Building 16 (Zone D)
17. Applied Mechanics Lab - Building 17 (Zone D)
18. Thermodynamics Lab - Building 18 (Zone D)
19. Generator Room - Building 19 (Zone D)
20. Engineering Workshop - Building 20 (Zone D)
21. Engineering Carpentry Shop - Building 21 (Zone D)
22. Drawing Office 2 - Building 22 (Zone A)
23. Corridor - Building 23 (Zone A)
24. Lecture Room (middle-right) - Building 24 (Zone A/E)
25. Structures Laboratory - Building 25 (Zone E)
26. Lecture Room (bottom-right) - Building 26 (Zone A/E)
27. Engineering Library - Building 27 (Zone F)
28. Department of Manufacturing and Industrial Engineering - Building 28 (Zone A)
29. Faculty Canteen - Building 29 (Zone A)',
    ARRAY['departments', 'buildings', 'locations', 'campus map', 'where is', 'find department', 'building numbers', 'zones', 'labs', 'facilities'],
    10,
    true
);

-- Main Facilities and Services
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Facilities',
    'Main Campus Facilities and Their Locations',
    'KEY FACILITIES:

🏛️ ACADEMIC:
• Professor E.O.E. Pereira Theatre - Building 4 (Main auditorium)
• Lecture Rooms - Buildings 24 & 26
• Drawing Offices - Buildings 3 & 22
• Engineering Library - Building 27 (Zone F)

🔬 LABORATORIES:
• Electronic Lab - Building 7
• Surveying Lab - Building 11
• Soil Lab - Building 12
• Materials Lab - Building 13
• Environmental Lab - Building 14
• Fluids Lab - Building 15
• New Mechanics Lab - Building 16
• Applied Mechanics Lab - Building 17
• Thermodynamics Lab - Building 18
• Structures Laboratory - Building 25

🏭 WORKSHOPS:
• Electrical and Electronic Workshop - Building 10 (Zone C)
• Engineering Workshop - Building 20 (Zone D)
• Engineering Carpentry Shop - Building 21 (Zone D)

🍽️ SERVICES:
• Faculty Canteen - Building 29 (Zone A, central location)
• Administrative Building - Building 5
• Security Unit - Building 6
• Generator Room - Building 19',
    ARRAY['facilities', 'services', 'labs', 'workshops', 'canteen', 'library', 'theatre', 'auditorium', 'where to find', 'campus services'],
    8,
    true
);

-- Campus Navigation and Zones
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Navigation',
    'How to Navigate the Campus',
    'CAMPUS LAYOUT:

The Faculty campus is divided into 6 main zones (A-F):

📍 ZONE A (CENTER): Main hub, administrative area, canteen
📍 ZONE B (NORTH): Chemical Engineering, Computer Center
📍 ZONE C (WEST): Electrical, Computer departments, workshops
📍 ZONE D (SOUTHWEST): Mechanical labs, workshops
📍 ZONE E (NORTHEAST): Administrative, theatre, structures lab
📍 ZONE F (EAST): Library, Rock Area

ENTRANCES & EXITS:
• Main ENTER gate: Bottom right (from main road)
• EXIT gates: Top left and bottom right

LANDMARKS:
• Rock Area: Eastern edge (Zone F) - scenic viewpoint
• Faculty Canteen: Building 29, center of campus (Zone A)
• Professor E.O.E. Pereira Theatre: Building 4 (Zone E)
• Engineering Library: Building 27 (Zone F)

GETTING AROUND:
The campus is designed for easy walking access. Most buildings are connected through Zone A (central corridor). Follow the numbered buildings and zone markers for navigation.',
    ARRAY['navigation', 'how to get to', 'directions', 'campus map', 'zones', 'entrances', 'exits', 'landmarks', 'getting around', 'walking'],
    7,
    true
);

-- Contact Information Update
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CONTACT',
    'Information',
    'Faculty Contact Information',
    'MAIN CONTACT DETAILS:

📞 Dean''s Office: +94 81 239 3302
📞 AR Office: +94 81 239 3305
📧 Email: deanoffice@eng.pdn.ac.lk

📍 ADDRESS:
Faculty of Engineering
University of Peradeniya
Peradeniya, Sri Lanka

🌐 WEBSITE: https://eng.pdn.ac.lk/

🎓 UNIVERSITY CONTACT:
Main University: +94 81 238 9001
www.pdn.ac.lk

📚 ONLINE SERVICES:
• LMS (Learning Management System): feels.pdn.ac.lk
• Course Registration: FECoMS portal
• e-Learning platform
• Library services

🚨 EMERGENCY CONTACTS:
Security Unit: Building 6
Emergency Line: Available 24/7',
    ARRAY['contact', 'phone', 'email', 'address', 'dean', 'office', 'emergency', 'website', 'online services', 'lms'],
    9,
    true
);

-- Faculty History and Achievements
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'FACULTY',
    'History',
    'Faculty of Engineering - History and Achievements',
    'FACULTY HISTORY:

🎓 FOUNDING:
• Established: 1950
• First Engineering Faculty in Sri Lanka
• Moved to Peradeniya: 1964
• Current Location: Banks of Mahaweli River, foothills of Hantana mountain range

📊 CURRENT STATISTICS:
• 8 Engineering Departments
• 600+ Staff members
• Approximately 550-600 students annually
• 95%+ Graduate Employability Rate

🏆 ACHIEVEMENTS:
• #1 Ranked Engineering Faculty in Sri Lanka
• Most prestigious university in Sri Lanka
• Alumni work at top companies (Google, Microsoft, etc.)
• Strong industry partnerships
• Excellence in research and innovation

🌍 LOCATION:
Part of the University of Peradeniya, set in an idyllic environment along the Mahaweli River with scenic mountain views, providing an ideal atmosphere for learning and research.',
    ARRAY['history', 'founded', '1950', '1964', 'first faculty', 'ranking', 'achievements', 'statistics', 'employability', 'mahaweli', 'peradeniya', 'about faculty'],
    9,
    true
);

-- Academic Programs Details
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'ACADEMIC',
    'Programs',
    'Academic Programs at Faculty of Engineering',
    'UNDERGRADUATE PROGRAMS:

The Faculty offers Bachelor of Science in Engineering Honours degrees in 8 specializations:

1. Civil Engineering
2. Mechanical Engineering
3. Electrical & Electronic Engineering
4. Computer Engineering
5. Chemical & Process Engineering
6. Production Engineering (Manufacturing & Industrial Engineering)
7. Materials Engineering
8. Engineering Mathematics & Computing

📚 PROGRAM DETAILS:
• Duration: 4 years
• Honours degree program
• Hands-on practical training
• Industry exposure
• Research opportunities
• Final year projects

POSTGRADUATE PROGRAMS:

The Faculty also offers various postgraduate programs:
• Master''s degrees (MSc, MEng)
• Doctoral programs (PhD)
• Specialized research areas

🎓 ADMISSIONS:
Highly competitive - based on national A-Level examinations
Limited intake: approximately 550-600 students per year

More details at: eng.pdn.ac.lk/undergraduate-programme-2/',
    ARRAY['programs', 'undergraduate', 'postgraduate', 'degrees', 'courses', 'admissions', 'study', 'bachelor', 'masters', 'phd', 'academic'],
    8,
    true
);

-- Rock Area (Scenic Spot)
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'CAMPUS',
    'Landmarks',
    'Rock Area - Scenic Campus Landmark',
    'ROCK AREA 🏔️

The Rock Area is a popular scenic landmark located on the eastern edge of the campus (Zone F).

FEATURES:
• Natural rock formation
• Scenic viewpoint overlooking the campus
• Popular student relaxation spot
• Study area with natural ambiance
• Adjacent to Engineering Library (Building 27)

ACCESS:
• Located in Zone F (East side)
• Near Building 27 (Engineering Library)
• Accessible from main campus paths
• Visible on the campus map as "Rock Area"

ACTIVITIES:
• Popular for study breaks
• Peaceful environment for reading
• Social gathering spot
• Photography location
• Enjoying campus views

The Rock Area provides a natural retreat within the engineering campus, offering students a peaceful environment away from academic buildings.',
    ARRAY['rock area', 'scenic spot', 'landmark', 'viewpoint', 'relaxation', 'study spot', 'zone f', 'natural area'],
    6,
    true
);

-- Success message
SELECT 'Campus locations data successfully added! Total new records: 11' as status;
