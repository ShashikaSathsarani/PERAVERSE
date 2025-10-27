-- ================================================================
-- FIX DEPARTMENTS - Complete Information
-- This will UPDATE row 25 with complete department information
-- OR add a new row if row 25 doesn't exist
-- ================================================================

-- Option 1: Update existing row 25 if it exists
UPDATE knowledge_base
SET 
    category = 'DEPARTMENTS',
    subcategory = 'All Departments',
    title = 'The 8 Engineering Departments at Faculty of Engineering',
    content = 'The Faculty of Engineering at University of Peradeniya has 8 Engineering Departments:

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

All departments participate in EngEx exhibition and offer BSc Engineering Honours degrees.',
    keywords = ARRAY['departments', '8 departments', 'eight departments', 'what departments', 'all departments', 'civil', 'mechanical', 'electrical', 'electronic', 'computer', 'chemical', 'production', 'manufacturing', 'materials', 'mathematics', 'engineering departments', 'faculty departments', 'list of departments'],
    priority = 100,
    is_active = true,
    updated_at = NOW()
WHERE id = 25;

-- Option 2: If row 25 doesn't exist or if you want to add a backup row
INSERT INTO knowledge_base (category, subcategory, title, content, keywords, priority, is_active)
SELECT 
    'DEPARTMENTS',
    'All Departments',
    'Complete List of 8 Engineering Departments',
    'Faculty of Engineering - 8 Departments:

🏗️ 1. CIVIL ENGINEERING
   • Building and infrastructure design
   • Structural analysis and design
   • Transportation engineering
   • Water resources and environmental engineering
   • Geotechnical engineering

⚙️ 2. MECHANICAL ENGINEERING
   • Robotics and automation
   • Thermodynamics and energy systems
   • Manufacturing and production
   • Machine design and CAD
   • Automotive engineering

⚡ 3. ELECTRICAL & ELECTRONIC ENGINEERING
   • Power generation and distribution
   • Electronic circuit design
   • Renewable energy systems
   • Control and automation
   • Telecommunications and signal processing

💻 4. COMPUTER ENGINEERING
   • Artificial Intelligence and Machine Learning
   • Software engineering
   • Embedded systems and IoT
   • Computer networks and security
   • Mobile and web development

🧪 5. CHEMICAL & PROCESS ENGINEERING
   • Chemical process design
   • Industrial chemistry
   • Environmental engineering
   • Polymer science
   • Biochemical engineering

🏭 6. PRODUCTION ENGINEERING (Manufacturing & Industrial)
   • Manufacturing systems
   • Industrial automation and robotics
   • Quality management
   • Supply chain and logistics
   • Operations research

🔬 7. MATERIALS ENGINEERING
   • Materials science and characterization
   • Nanotechnology
   • Metallurgy and ceramics
   • Composite materials
   • Sustainable materials

📐 8. ENGINEERING MATHEMATICS
   • Computational mathematics
   • Data science and statistics
   • Mathematical modeling
   • Numerical analysis
   • Operations research

Each department offers 4-year BSc Engineering Honours programs and participates in the annual EngEx exhibition.',
    ARRAY['departments', 'all departments', '8 departments', 'eight departments', 'list departments', 'what departments', 'engineering departments', 'faculty departments', 'civil', 'mechanical', 'electrical', 'computer', 'chemical', 'production', 'materials', 'mathematics', 'which departments'],
    100,
    true
WHERE NOT EXISTS (
    SELECT 1 FROM knowledge_base 
    WHERE category = 'DEPARTMENTS' 
    AND title LIKE '%8 Engineering Departments%'
);

-- Verify the update/insert
SELECT 
    id, 
    category, 
    title, 
    LEFT(content, 100) as content_preview,
    array_length(keywords, 1) as keyword_count
FROM knowledge_base
WHERE category = 'DEPARTMENTS' 
OR title LIKE '%department%'
ORDER BY id;
