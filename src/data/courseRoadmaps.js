export const COURSE_ROADMAPS = {
  'crs-mech-1': {
    courseId: 'crs-mech-1',
    courseName: 'Mechanical Engineering',
    dept: 'MECH',
    color: '#3b82f6',
    accentColor: '#60a5fa',
    tagline: 'Engineer the machines of tomorrow',
    totalDuration: '4 Years (8 Semesters)',
    milestones: [
      {
        id: 'mech-m1',
        phase: 1,
        title: 'Engineering Foundations',
        subtitle: 'Core Mathematics & Physics',
        duration: 'Semester 1–2',
        icon: '🔬',
        status: 'foundation',
        topics: ['Applied Mathematics', 'Engineering Physics', 'Engineering Chemistry', 'Technical Drawing', 'Workshop Practice', 'Computer Programming Basics'],
        tools: ['AutoCAD (Basic)', 'MATLAB Introduction', 'MS Office'],
        outcomes: 'Build strong analytical and computational foundation for engineering problem-solving.'
      },
      {
        id: 'mech-m2',
        phase: 2,
        title: 'Mechanical Core I',
        subtitle: 'Thermodynamics & Materials',
        duration: 'Semester 3',
        icon: '⚙️',
        status: 'core',
        topics: ['Thermodynamics', 'Fluid Mechanics', 'Engineering Materials', 'Mechanics of Solids', 'Manufacturing Processes I'],
        tools: ['ANSYS (Intro)', 'AutoCAD 2D', 'SolidWorks Basic'],
        outcomes: 'Understand heat, fluid and material behavior in mechanical systems.'
      },
      {
        id: 'mech-m3',
        phase: 3,
        title: 'Mechanical Core II',
        subtitle: 'Design & Analysis',
        duration: 'Semester 4',
        icon: '📐',
        status: 'core',
        topics: ['Machine Design', 'Theory of Machines', 'Heat Transfer', 'Manufacturing Processes II', 'Metrology & Quality Control'],
        tools: ['SolidWorks Pro', 'AutoCAD 3D', 'ANSYS Structural'],
        outcomes: 'Design mechanical components with strength, motion and manufacturing constraints.'
      },
      {
        id: 'mech-m4',
        phase: 4,
        title: 'CAD / CAM Specialization',
        subtitle: 'Digital Design & Manufacturing',
        duration: 'Semester 5',
        icon: '🖥️',
        status: 'specialization',
        topics: ['CAD/CAM Integration', 'CNC Programming', 'FEM Analysis', 'Product Design', 'Industrial Automation Intro'],
        tools: ['SolidWorks Advanced', 'CATIA V5', 'Mastercam', 'ANSYS Workbench'],
        outcomes: 'Master digital design-to-manufacturing workflows used in automotive and aerospace.'
      },
      {
        id: 'mech-m5',
        phase: 5,
        title: 'Robotics & Automation',
        subtitle: 'Industry 4.0 Track',
        duration: 'Semester 6',
        icon: '🤖',
        status: 'specialization',
        topics: ['Industrial Robotics', 'PLC Programming', 'Hydraulics & Pneumatics', 'IoT for Manufacturing', 'Lean Manufacturing'],
        tools: ['ROS (Robot OS)', 'Siemens S7 PLC', 'LabVIEW', 'Arduino/Raspberry Pi'],
        outcomes: 'Program and deploy automated manufacturing cells in real industry environments.'
      },
      {
        id: 'mech-m6',
        phase: 6,
        title: 'Industry Internship',
        subtitle: 'Live Project Exposure',
        duration: 'Semester 7 (6 Months)',
        icon: '🏭',
        status: 'internship',
        topics: ['On-the-job training at partner companies', 'Industry mentor guidance', 'Project documentation', 'Technical report writing'],
        tools: ['Company-specific CAD tools', 'ERP Systems', 'MS Project'],
        outcomes: 'Apply engineering knowledge in real manufacturing / automotive / infrastructure companies.'
      },
      {
        id: 'mech-m7',
        phase: 7,
        title: 'Capstone & Placement',
        subtitle: 'Final Project + Job Ready',
        duration: 'Semester 8',
        icon: '🎓',
        status: 'capstone',
        topics: ['Final Year Project (FYP)', 'Technical Paper Presentation', 'Campus Placement Drives', 'Mock Interviews', 'Salary Negotiation'],
        tools: ['Full CAD/CAM/FEM stack', 'Portfolio builder', 'LinkedIn optimization'],
        outcomes: 'Graduate with a portfolio, project evidence and job offer from campus placements.'
      }
    ]
  },

  'crs-civil-1': {
    courseId: 'crs-civil-1',
    courseName: 'Civil Engineering',
    dept: 'CIVIL',
    color: '#10b981',
    accentColor: '#34d399',
    tagline: 'Build the infrastructure of smart cities',
    totalDuration: '4 Years (8 Semesters)',
    milestones: [
      {
        id: 'civil-m1',
        phase: 1,
        title: 'Engineering Foundations',
        subtitle: 'Mathematics & Science Core',
        duration: 'Semester 1–2',
        icon: '📚',
        status: 'foundation',
        topics: ['Engineering Mathematics', 'Engineering Physics', 'Basic Civil Engineering', 'Technical Drawing & Surveying', 'Environmental Science', 'Computer Applications'],
        tools: ['AutoCAD Basic', 'MS Office', 'Google Earth'],
        outcomes: 'Develop quantitative reasoning and basic site visualization skills.'
      },
      {
        id: 'civil-m2',
        phase: 2,
        title: 'Structural Analysis',
        subtitle: 'Loads, Forces & Structural Behavior',
        duration: 'Semester 3',
        icon: '🏗️',
        status: 'core',
        topics: ['Strength of Materials', 'Structural Analysis I', 'Fluid Mechanics', 'Concrete Technology', 'Engineering Geology'],
        tools: ['STAAD Pro (Basic)', 'AutoCAD 2D', 'Excel Structural'],
        outcomes: 'Analyze beams, frames and trusses under real-world loading conditions.'
      },
      {
        id: 'civil-m3',
        phase: 3,
        title: 'Design & Construction',
        subtitle: 'RCC, Steel & Site Management',
        duration: 'Semester 4–5',
        icon: '🏢',
        status: 'core',
        topics: ['RCC Design', 'Steel Structure Design', 'Geotechnical Engineering', 'Construction Management', 'Quantity Surveying', 'Environmental Engineering'],
        tools: ['STAAD Pro Advanced', 'AutoCAD 3D', 'Primavera P6'],
        outcomes: 'Design reinforced concrete structures and manage construction projects.'
      },
      {
        id: 'civil-m4',
        phase: 4,
        title: 'BIM & Smart Infrastructure',
        subtitle: 'Digital Twin & Smart Cities',
        duration: 'Semester 6',
        icon: '🌆',
        status: 'specialization',
        topics: ['Building Information Modeling (BIM)', 'Smart City Infrastructure', 'GIS Applications', 'Sustainable Design', 'Green Building (LEED/GRIHA)'],
        tools: ['Autodesk Revit', 'ArcGIS', 'Navisworks', 'Dynamo BIM'],
        outcomes: 'Create digital-twin building models and integrate smart city sensor data.'
      },
      {
        id: 'civil-m5',
        phase: 5,
        title: 'Transportation & Water',
        subtitle: 'Urban Infrastructure Systems',
        duration: 'Semester 6 (Elective)',
        icon: '🛣️',
        status: 'specialization',
        topics: ['Highway Engineering', 'Traffic Engineering', 'Water Supply & Sanitation', 'Irrigation Engineering', 'Coastal Engineering'],
        tools: ['Civil 3D (Autodesk)', 'HEC-RAS (Hydrology)', 'Google Maps API'],
        outcomes: 'Plan and design road networks, drainage and water infrastructure for smart cities.'
      },
      {
        id: 'civil-m6',
        phase: 6,
        title: 'Site Internship',
        subtitle: 'Live Construction Exposure',
        duration: 'Semester 7 (6 Months)',
        icon: '🔧',
        status: 'internship',
        topics: ['On-site construction supervision', 'Safety management', 'Quality control on site', 'Contractor coordination'],
        tools: ['Field instruments', 'Primavera', 'AutoCAD Mobile'],
        outcomes: 'Gain hands-on exposure at L&T, Afcons, DLF and partner construction firms.'
      },
      {
        id: 'civil-m7',
        phase: 7,
        title: 'Capstone & Campus Drive',
        subtitle: 'Final Project + Job Placement',
        duration: 'Semester 8',
        icon: '🎓',
        status: 'capstone',
        topics: ['Major project: Design & DPR of a real structure', 'Research paper', 'Campus placement drives', 'GATE coaching support'],
        tools: ['Full BIM/STAAD/AutoCAD stack', 'Portfolio & documentation'],
        outcomes: 'Graduate with a real-world project portfolio, job offers from top infra firms.'
      }
    ]
  },

  'crs-it-1': {
    courseId: 'crs-it-1',
    courseName: 'MERN Stack with Gen-AI',
    dept: 'IT',
    color: '#8b5cf6',
    accentColor: '#a78bfa',
    tagline: 'Build intelligent full-stack apps powered by AI',
    totalDuration: '18 Months (6 Modules)',
    milestones: [
      {
        id: 'mern-m1',
        phase: 1,
        title: 'Web Fundamentals',
        subtitle: 'HTML, CSS & JavaScript Mastery',
        duration: 'Month 1–2',
        icon: '🌐',
        status: 'foundation',
        topics: ['HTML5 Semantic Markup', 'CSS3 & Flexbox/Grid', 'JavaScript ES6+', 'DOM Manipulation', 'Responsive Design', 'Git & GitHub basics'],
        tools: ['VS Code', 'Chrome DevTools', 'GitHub', 'Figma (Basic)'],
        outcomes: 'Build responsive, interactive websites from scratch with modern JS.'
      },
      {
        id: 'mern-m2',
        phase: 2,
        title: 'Node.js Backend',
        subtitle: 'Server-Side Engineering',
        duration: 'Month 3–4',
        icon: '⚡',
        status: 'core',
        topics: ['Node.js Runtime', 'Express.js Framework', 'REST API Design', 'Middleware & Authentication', 'JWT & OAuth 2.0', 'Error Handling & Logging'],
        tools: ['Node.js', 'Express', 'Postman', 'JWT', 'Nodemon'],
        outcomes: 'Build secure, scalable REST APIs that power real-world applications.'
      },
      {
        id: 'mern-m3',
        phase: 3,
        title: 'React Frontend',
        subtitle: 'Modern UI Engineering',
        duration: 'Month 5–6',
        icon: '⚛️',
        status: 'core',
        topics: ['React 18 & Hooks', 'State Management (Redux Toolkit)', 'React Router v6', 'Component Design Patterns', 'Performance Optimization', 'Testing with React Testing Library'],
        tools: ['React', 'Vite', 'Redux Toolkit', 'TailwindCSS', 'Storybook'],
        outcomes: 'Build enterprise-grade React applications with advanced state management.'
      },
      {
        id: 'mern-m4',
        phase: 4,
        title: 'MongoDB & Database',
        subtitle: 'NoSQL Data Engineering',
        duration: 'Month 7–8',
        icon: '🍃',
        status: 'core',
        topics: ['MongoDB Fundamentals', 'Mongoose ODM', 'Aggregation Pipeline', 'Database Design Patterns', 'Redis Caching', 'Database Security & Indexing'],
        tools: ['MongoDB Atlas', 'Mongoose', 'Redis', 'MongoDB Compass', 'Studio 3T'],
        outcomes: 'Design and query NoSQL databases efficiently at production scale.'
      },
      {
        id: 'mern-m5',
        phase: 5,
        title: 'Gen-AI Integration',
        subtitle: 'Build AI-Powered Features',
        duration: 'Month 9–12',
        icon: '🤖',
        status: 'specialization',
        topics: ['OpenAI API & GPT Integration', 'Prompt Engineering', 'LangChain Framework', 'RAG (Retrieval Augmented Generation)', 'AI Chatbots & Assistants', 'Vector Databases (Pinecone)', 'Fine-tuning models', 'AI Safety & Ethics'],
        tools: ['OpenAI API', 'LangChain', 'Pinecone', 'Hugging Face', 'Python (AI scripts)', 'LlamaIndex'],
        outcomes: 'Embed LLM-powered features into MERN apps: chatbots, AI search, content generation.'
      },
      {
        id: 'mern-m6',
        phase: 6,
        title: 'DevOps & Cloud Deploy',
        subtitle: 'Ship to Production',
        duration: 'Month 13–15',
        icon: '☁️',
        status: 'specialization',
        topics: ['Docker & Containerization', 'CI/CD Pipelines', 'AWS EC2/S3/Lambda', 'Nginx & Load Balancing', 'Monitoring with Grafana', 'Microservices Architecture'],
        tools: ['Docker', 'GitHub Actions', 'AWS', 'Vercel', 'Nginx', 'Grafana'],
        outcomes: 'Deploy production-grade MERN + AI apps to cloud with monitoring and CI/CD.'
      },
      {
        id: 'mern-m7',
        phase: 7,
        title: 'Capstone Project & Placement',
        subtitle: 'Real Product + Job Ready',
        duration: 'Month 16–18',
        icon: '🚀',
        status: 'capstone',
        topics: ['Build a full MERN + Gen-AI product', 'Code review & architecture mentorship', 'Tech interview prep (DSA)', 'Mock interviews with industry experts', 'LinkedIn & portfolio optimization', 'Campus & off-campus drives'],
        tools: ['Full MERN + AI stack', 'LeetCode', 'System Design resources', 'Portfolio hosting'],
        outcomes: 'Launch a real AI product, ace technical interviews and land ₹8–25 LPA job offers.'
      }
    ]
  },

  'crs-it-2': {
    courseId: 'crs-it-2',
    courseName: 'Digital Marketing with AI Automation',
    dept: 'IT',
    color: '#ec4899',
    accentColor: '#f472b6',
    tagline: 'Automate growth with AI-powered marketing',
    totalDuration: '12 Months (5 Modules)',
    milestones: [
      {
        id: 'dm-m1',
        phase: 1,
        title: 'Marketing Fundamentals',
        subtitle: 'Brand, Audience & Strategy',
        duration: 'Month 1–2',
        icon: '🎯',
        status: 'foundation',
        topics: ['Marketing Psychology', 'Brand Identity & Positioning', 'Customer Persona Building', 'Marketing Funnel Strategy', 'Competitor Analysis', 'Content Calendar Planning'],
        tools: ['Canva', 'HubSpot CRM (Free)', 'Google Analytics 4', 'SimilarWeb'],
        outcomes: 'Build a complete brand strategy and marketing plan for a real business.'
      },
      {
        id: 'dm-m2',
        phase: 2,
        title: 'SEO & Paid Ads',
        subtitle: 'Search Engine Domination',
        duration: 'Month 3–4',
        icon: '🔍',
        status: 'core',
        topics: ['On-Page & Off-Page SEO', 'Technical SEO & Core Web Vitals', 'Google Ads (Search & Display)', 'YouTube Ads', 'Meta Ads Manager', 'Keyword Research & Bid Strategy'],
        tools: ['SEMrush', 'Ahrefs', 'Google Ads', 'Meta Ads Manager', 'Google Search Console', 'Screaming Frog'],
        outcomes: 'Run profitable Google and Meta ad campaigns, rank websites on page 1.'
      },
      {
        id: 'dm-m3',
        phase: 3,
        title: 'Social Media & Content',
        subtitle: 'Grow & Engage at Scale',
        duration: 'Month 5–6',
        icon: '📱',
        status: 'core',
        topics: ['Instagram & LinkedIn Growth', 'YouTube Strategy & Shorts', 'Influencer Marketing', 'Video Editing for Reels', 'Community Building', 'Email Marketing & Automation'],
        tools: ['Buffer / Hootsuite', 'CapCut', 'Mailchimp', 'Notion (Content OS)', 'Canva Pro', 'LinkedIn Campaign Manager'],
        outcomes: 'Grow brand accounts organically and run multi-platform content strategies.'
      },
      {
        id: 'dm-m4',
        phase: 4,
        title: 'AI Automation & Tools',
        subtitle: 'Work 10x Faster with AI',
        duration: 'Month 7–9',
        icon: '🤖',
        status: 'specialization',
        topics: ['ChatGPT for Marketing Copy', 'AI Image Generation (Midjourney/DALL-E)', 'Automated Lead Generation', 'AI-Powered Email Sequences', 'Chatbot Building (ManyChat)', 'n8n / Zapier Workflow Automation', 'AI Analytics & Reporting'],
        tools: ['ChatGPT / Claude', 'Midjourney', 'n8n', 'ManyChat', 'Make.com (Integromat)', 'Jasper AI'],
        outcomes: 'Automate 80% of repetitive marketing tasks and build AI-powered growth engines.'
      },
      {
        id: 'dm-m5',
        phase: 5,
        title: 'Analytics & Performance',
        subtitle: 'Data-Driven Decision Making',
        duration: 'Month 10',
        icon: '📊',
        status: 'specialization',
        topics: ['Google Analytics 4 Advanced', 'Conversion Rate Optimization (CRO)', 'A/B Testing', 'Attribution Modeling', 'Marketing Dashboard Building', 'ROI Measurement & Reporting'],
        tools: ['GA4', 'Hotjar', 'Google Looker Studio', 'Power BI', 'Optimizely'],
        outcomes: 'Measure, optimize and report marketing performance to leadership with data.'
      },
      {
        id: 'dm-m6',
        phase: 6,
        title: 'Live Campaign & Placement',
        subtitle: 'Real Campaign + Job Ready',
        duration: 'Month 11–12',
        icon: '🚀',
        status: 'capstone',
        topics: ['Manage a live ₹50,000 ad budget campaign', 'Client project: End-to-end digital marketing', 'Portfolio: 5 case studies', 'Freelancing & agency career paths', 'Interview prep & resume optimization', 'Campus & agency placement drives'],
        tools: ['Full digital marketing stack', 'Portfolio builder', 'Fiverr / Upwork setup'],
        outcomes: 'Graduate with real campaign results, certifications and ₹4–15 LPA job or freelance income.'
      }
    ]
  }
};
