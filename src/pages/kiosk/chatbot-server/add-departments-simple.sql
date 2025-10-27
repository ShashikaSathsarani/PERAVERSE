-- ================================================================
-- ADD ALL 8 DEPARTMENTS TO DATABASE
-- Simple INSERT to add complete department information
-- Copy this ENTIRE file and run in Supabase SQL Editor
-- ================================================================

-- Insert complete information about all 8 departments
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
VALUES 
(
    'DEPARTMENTS',
    'All Departments',
    'The 8 Engineering Departments at Faculty of Engineering',
    'The Faculty of Engineering at University of Peradeniya has 8 Engineering Departments:

1. Civil Engineering
   • Infrastructure and construction projects
   • Sustainable development solutions
   • Structural engineering designs
   • Transportation systems
   • Environmental engineering

2. Mechanical Engineering
   • Robotics and automation
   • Manufacturing innovations
   • Thermodynamics and heat transfer
   • CAD/CAM and design
   • Machine design and mechanics

3. Electrical & Electronic Engineering
   • Power systems and generation
   • Electronics and circuit design
   • Renewable energy solutions
   • Control systems and automation
   • Telecommunications

4. Computer Engineering
   • AI and Machine Learning
   • Software development and systems
   • Embedded systems and IoT
   • Computer networks
   • Mobile and web applications

5. Chemical & Process Engineering
   • Chemical process optimization
   • Chemical innovations and research
   • Environmental solutions
   • Polymer science and materials
   • Industrial chemistry

6. Production Engineering (Manufacturing & Industrial Engineering)
   • Manufacturing systems and processes
   • Industrial automation
   • Quality control and assurance
   • Supply chain optimization
   • Operations management

7. Materials Engineering
   • Advanced materials research
   • Nanotechnology applications
   • Material characterization and testing
   • Sustainable materials development
   • Metallurgy and ceramics

8. Engineering Mathematics
   • Computational methods
   • Data science and analytics
   • Mathematical modeling
   • Statistical analysis
   • Numerical methods

All 8 departments participate in EngEx exhibition and offer BSc Engineering Honours degrees.',
    ARRAY['departments', '8 departments', 'eight departments', 'what departments', 'all departments', 'list departments', 'civil', 'mechanical', 'electrical', 'electronic', 'computer', 'chemical', 'production', 'manufacturing', 'materials', 'mathematics', 'engineering departments', 'faculty departments', 'which departments', 'what are the departments'],
    100,
    true
);

-- Show success message
SELECT 
    'Departments added successfully! Row ID: ' || id as status,
    title,
    category
FROM knowledge_base
WHERE category = 'DEPARTMENTS'
ORDER BY id DESC
LIMIT 1;
