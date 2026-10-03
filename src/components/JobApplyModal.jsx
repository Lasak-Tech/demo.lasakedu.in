import React, { useState } from 'react';
import {
  X,
  Building,
  Briefcase,
  MapPin,
  Users,
  Award,
  Calendar,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Layers,
  Clock,
  ArrowUpRight,
  Info
} from 'lucide-react';

// Detailed data map for specific companies & roles
const COMPANY_EXTENDED_INFO = {
  'Google Cloud India': {
    color: '#4285F4',
    logoText: 'G',
    portalUrl: 'https://www.google.com/about/careers/applications/jobs/results/?q=software+engineer+india',
    summary: 'Join Google Cloud engineering team building scalable cloud-native architectures, enterprise backend services, and generative AI developer integrations.',
    skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Google Cloud Platform (GCP)', 'Generative AI APIs', 'System Design', 'Docker'],
    eligibility: 'B.E. / B.Tech / MCA in CS / IT / related engineering branches with 65%+ or 6.5+ CGPA. Freshers & 2024-2026 batches eligible.',
    workMode: 'Hybrid (3 days in Bengaluru office, 2 days remote)',
    rounds: [
      { step: '1', title: 'Online Assessment', desc: 'DSA, Algorithms, and Core JavaScript problem solving on Google HackerRank platform.' },
      { step: '2', title: 'System & Architecture Review', desc: 'Frontend/backend design patterns, state management, and API design.' },
      { step: '3', title: 'Technical Problem Solving', desc: 'Live coding session with Google Cloud engineers.' },
      { step: '4', title: 'Googler Culture & Fitment', desc: 'Team collaboration, problem ownership, and HR discussion.' }
    ]
  },
  'Microsoft India': {
    color: '#00a4ef',
    logoText: 'MS',
    portalUrl: 'https://careers.microsoft.com/v2/global/en/home.html',
    summary: 'Build high-performance web applications and Copilot-powered features across Microsoft Azure, enterprise developer productivity tools, and full stack systems.',
    skills: ['JavaScript / TypeScript', 'React', 'Node.js', 'Azure OpenAI', 'RESTful APIs', 'Vector DBs', 'CI/CD Pipelines'],
    eligibility: 'Open to B.E. / B.Tech / MCA / M.Sc graduates with minimum 70% in graduation. Strong foundation in data structures.',
    workMode: 'Flexible / Hybrid (Hyderabad Campus)',
    rounds: [
      { step: '1', title: 'Codility Technical Challenge', desc: '3 algorithmic problems on data structures and algorithmic complexity.' },
      { step: '2', title: 'Full-Stack Project Deep Dive', desc: 'In-depth code walkthrough of candidate MERN & AI projects.' },
      { step: '3', title: 'Technical Architecture Round', desc: 'Scalability, microservices, and database optimization.' },
      { step: '4', title: 'Leadership Principles & HR', desc: 'Final interview with Engineering Director.' }
    ]
  },
  'Zoho Corporation': {
    color: '#e11d48',
    logoText: 'Z',
    portalUrl: 'https://www.zoho.com/careers/',
    summary: 'Develop mission-critical enterprise web apps and cloud SaaS products used by over 100 million global business users.',
    skills: ['Core JavaScript (ES6+)', 'React.js', 'Node.js', 'NoSQL & SQL', 'DOM Manipulation', 'Web Performance', 'REST APIs'],
    eligibility: 'Open to all graduates and branches. Skill and coding ability given highest priority over CGPA.',
    workMode: 'Onsite (Chennai / Tenkasi / Salem / Coimbatore campuses)',
    rounds: [
      { step: '1', title: 'Aptitude & C/JS Basics', desc: 'General aptitude and core programming logic multiple-choice test.' },
      { step: '2', title: 'Advanced Coding Round', desc: '5 coding problems to test logic, recursion, and edge cases.' },
      { step: '3', title: 'App Development Round', desc: 'Develop a small working module/feature in vanilla JS or React within 3 hours.' },
      { step: '4', title: 'Technical & HR Viva', desc: 'Deep dive into solution choices, attitude, and team culture.' }
    ]
  },
  'HubSpot Digital': {
    color: '#ff7a59',
    logoText: 'HS',
    portalUrl: 'https://www.hubspot.com/careers',
    summary: 'Lead AI-automated growth marketing, customer lifecycle automation, and high-converting performance marketing funnels.',
    skills: ['AI Content Automation', 'SEO / SEM', 'Meta & Google Ads', 'HubSpot Marketing Hub', 'Zapier / Make Automation', 'Google Analytics 4'],
    eligibility: 'Graduates with hands-on portfolio in digital growth, SEO, paid marketing, or AI workflow automation.',
    workMode: 'Remote / Bengaluru Office',
    rounds: [
      { step: '1', title: 'Portfolio & Strategy Review', desc: 'Review of past campaigns, content automation workflows, and case studies.' },
      { step: '2', title: 'Live Growth Case Study', desc: 'Present a 30-day marketing acquisition plan using AI automation tools.' },
      { step: '3', title: 'Tools & Analytics Round', desc: 'Hands-on check of CRM automation, GA4 data analysis, and attribution.' },
      { step: '4', title: 'Cultural Fit & Offer', desc: 'HR discussion and compensation finalization.' }
    ]
  },
  'Accenture Interactive': {
    color: '#a100ff',
    logoText: 'AC',
    portalUrl: 'https://www.accenture.com/in-en/careers',
    summary: 'Drive data-backed marketing intelligence, generative content strategy, and omnichannel campaigns for Fortune 500 brands.',
    skills: ['Performance Marketing', 'Generative Media AI', 'Python for Marketing', 'Tableau / Looker Studio', 'Social Media Analytics'],
    eligibility: 'B.Tech / BBA / BCA / Any degree with strong analytical mindset and data communication skills.',
    workMode: 'Hybrid (Bengaluru / Gurugram)',
    rounds: [
      { step: '1', title: 'Cognitive & Technical Test', desc: 'Analytical reasoning, verbal ability, and digital marketing fundamentals.' },
      { step: '2', title: 'Marketing Analytics Viva', desc: 'Data interpretation, conversion rate optimization, and ROI calculations.' },
      { step: '3', title: 'Client Scenario Simulation', desc: 'Pitching digital marketing solutions to virtual enterprise client briefs.' },
      { step: '4', title: 'HR Discussion', desc: 'Salary, location preference, and onboarding dates.' }
    ]
  },
  'Tata Motors R&D': {
    color: '#1e40af',
    logoText: 'TM',
    portalUrl: 'https://www.tatamotors.com/careers/',
    summary: 'Design next-generation EV powertrain systems, battery integration modules, and CAD simulation frameworks for commercial & passenger EVs.',
    skills: ['Electric Vehicle Powertrain', 'Battery Management Systems (BMS)', 'SolidWorks', 'CATIA V5', 'MATLAB / Simulink', 'Thermal Analysis'],
    eligibility: 'B.E. / B.Tech in Mechanical / Automobile / Production Engineering with minimum 60% or 6.0 CGPA.',
    workMode: 'Onsite (Pune Tech Park R&D Centre)',
    rounds: [
      { step: '1', title: 'Core Mechanical & Aptitude Test', desc: 'Strength of materials, thermodynamics, fluid dynamics, and reasoning.' },
      { step: '2', title: 'EV & CAD Technical Round', desc: '3D modeling, GD&T, and powertrain calculation problems.' },
      { step: '3', title: 'Design Project Review', desc: 'Presentation on academic final-year project and mechanical portfolio.' },
      { step: '4', title: 'Technical Manager & HR', desc: 'Culture fit, career roadmap, and offer issuance.' }
    ]
  },
  'Bosch Automotive': {
    color: '#dc2626',
    logoText: 'B',
    portalUrl: 'https://www.bosch.in/careers/',
    summary: 'Engineer cutting-edge industrial robotics, sensor control units, and automated manufacturing lines for smart industry 4.0 factories.',
    skills: ['Industrial Robotics', 'PLC Programming', 'Mechatronics', 'Microcontrollers & Sensors', 'Automated Control Systems', 'AutoCAD'],
    eligibility: 'B.E. / B.Tech in Mechanical, Mechatronics, or Robotics Engineering with 65% aggregate.',
    workMode: 'Onsite (Bengaluru Tech Centre)',
    rounds: [
      { step: '1', title: 'Online Technical Exam', desc: 'Robotics kinematics, electronics fundamentals, and logical aptitude.' },
      { step: '2', title: 'Automation & Controls Round', desc: 'PLC logic design, sensor interfacing, and hydraulic/pneumatic circuits.' },
      { step: '3', title: 'Practical Troubleshooting', desc: 'Hardware/software integration scenario testing.' },
      { step: '4', title: 'Leadership & HR Round', desc: 'Background verification and appointment details.' }
    ]
  },
  'L&T Construction': {
    color: '#0284c7',
    logoText: 'LT',
    portalUrl: 'https://www.larsentoubro.com/corporate/careers/',
    summary: 'Manage structural analysis, smart building BIM designs, and large-scale metro/infrastructure site construction projects.',
    skills: ['Structural Analysis', 'STAAD Pro', 'ETABS', 'AutoCAD', 'Revit BIM', 'Reinforced Concrete Design', 'Project Estimation'],
    eligibility: 'B.E. / B.Tech in Civil Engineering with minimum 65% marks. Good command of structural drawings.',
    workMode: 'Site & Engineering Office (Mumbai / Chennai / Kolkata)',
    rounds: [
      { step: '1', title: 'L&T All-India Test', desc: 'Core civil engineering fundamentals, structural mechanics, and surveyor logic.' },
      { step: '2', title: 'Structural Technical Interview', desc: 'RCC beam/column design, load calculations, and IS code provisions.' },
      { step: '3', title: 'Drawing & Software Viva', desc: 'AutoCAD & STAAD Pro model interpretation and practical site challenges.' },
      { step: '4', title: 'HR & Medical Verification', desc: 'Fitness check and final appointment offer.' }
    ]
  },
  'Shapoorji Pallonji': {
    color: '#0f766e',
    logoText: 'SP',
    portalUrl: 'https://www.shapoorjipallonji.com/careers',
    summary: 'Design resilient urban smart city infrastructure, sustainable water management networks, and green building projects.',
    skills: ['Smart City Infrastructure', 'GIS Mapping', 'Primavera P6 / MS Project', 'AutoCAD Civil 3D', 'Green Building Standards', 'Surveying'],
    eligibility: 'B.Tech / B.E. in Civil Engineering / Infrastructure Engineering with 60%+ in degree.',
    workMode: 'Delhi NCR / Mumbai Project Sites',
    rounds: [
      { step: '1', title: 'Technical Assessment', desc: 'Soil mechanics, surveying, highway engineering, and construction management.' },
      { step: '2', title: 'Site Planning & Design Round', desc: 'Infrastructure layout review and cost estimation test.' },
      { step: '3', title: 'Project Director Interview', desc: 'In-depth assessment of field knowledge and project management acumen.' },
      { step: '4', title: 'HR Discussion', desc: 'Compensation, site allowances, and joining date.' }
    ]
  }
};

export default function JobApplyModal({ drive, allDrives = [], courses = [], currentUser, onClose }) {
  if (!drive) return null;

  const targetCourseName = drive.courseName || '';
  const targetDept = drive.dept || 'IT';

  // Find all hiring companies & drives associated with this course
  const relatedDrives = allDrives.filter(d => {
    if (!d) return false;
    if (targetCourseName && d.courseName === targetCourseName) return true;
    if (d.dept === targetDept && (!targetCourseName || d.courseName?.toLowerCase().includes(targetCourseName.toLowerCase()))) return true;
    return false;
  });

  // Ensure current drive is always in the list
  const displayDrives = relatedDrives.length > 0 ? relatedDrives : [drive];
  const [activeDrive, setActiveDrive] = useState(drive);
  const [notification, setNotification] = useState('');

  const companyMeta = COMPANY_EXTENDED_INFO[activeDrive.company] || {
    color: '#4f46e5',
    logoText: activeDrive.company ? activeDrive.company.charAt(0) : 'C',
    portalUrl: `https://www.google.com/search?q=${encodeURIComponent((activeDrive.company || '') + ' ' + (activeDrive.role || '') + ' careers jobs India')}`,
    summary: `Official hiring drive for ${activeDrive.role || 'Specialist'} at ${activeDrive.company || 'Leading Company'} linked with ${activeDrive.courseName || 'Course'}.`,
    skills: ['Domain Knowledge', 'Problem Solving', 'Communication', 'Industry Best Practices', 'Team Collaboration'],
    eligibility: 'Graduate in relevant stream with good academic track record. Strong practical interest in the domain.',
    workMode: activeDrive.location || 'Bengaluru / Hybrid',
    rounds: [
      { step: '1', title: 'Initial Screening & Aptitude', desc: 'Evaluation of foundational domain knowledge and analytical reasoning.' },
      { step: '2', title: 'Technical Round', desc: 'Hands-on problem solving and project viva.' },
      { step: '3', title: 'Final Discussion', desc: 'Managerial and HR review for final selection.' }
    ]
  };

  const totalCourseVacancies = displayDrives.reduce((sum, d) => sum + (parseInt(d.vacancies, 10) || 10), 0);

  const handleApplyExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNotifyAdvisor = () => {
    setNotification(`Your interest in ${activeDrive.company} (${activeDrive.role}) has been submitted to your Career Advisor!`);
    setTimeout(() => setNotification(''), 4500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '1.25rem',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          border: '1px solid #cbd5e1',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            color: '#ffffff',
            padding: '1.4rem 1.75rem',
            position: 'relative',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            title="Close"
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: 'rgba(99, 102, 241, 0.35)',
                color: '#c7d2fe',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid rgba(129, 140, 248, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <GraduationCap size={13} />
              COURSE CAREER DIRECTORY
            </span>

            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: '700',
                background: 'rgba(16, 185, 129, 0.25)',
                color: '#6ee7b7',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid rgba(52, 211, 153, 0.4)'
              }}
            >
              {totalCourseVacancies} Total Vacancies Available
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', margin: '0.35rem 0 0.2rem 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            {targetCourseName || activeDrive.courseName || 'Selected Course'} — Job Vacancies & Company Openings
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Detailed corporate recruitment drives, company roles, vacancies, packages, and eligibility criteria.</span>
          </p>
        </div>

        {/* Notification Toast if user requests advisor connect */}
        {notification && (
          <div
            style={{
              background: '#ecfdf5',
              borderBottom: '1px solid #a7f3d0',
              padding: '0.75rem 1.5rem',
              color: '#065f46',
              fontSize: '0.85rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={18} color="#059669" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Body with Two Tabs/Columns */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          
          {/* Companies Hiring for this Course Strip */}
          <div
            style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '0.85rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                Hiring Companies for this Course ({displayDrives.length}):
              </span>
              <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: '700' }}>
                Click a company to view complete vacancy details
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {displayDrives.map((d) => {
                const isSelected = activeDrive.id === d.id || activeDrive.company === d.company;
                const meta = COMPANY_EXTENDED_INFO[d.company] || {};
                return (
                  <button
                    key={d.id || d.company}
                    type="button"
                    onClick={() => setActiveDrive(d)}
                    style={{
                      background: isSelected ? '#ffffff' : '#ffffff',
                      border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                      borderRadius: '0.65rem',
                      padding: '0.55rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none',
                      transition: 'all 0.15s ease',
                      flexShrink: 0
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '0.45rem',
                        background: meta.color || '#4f46e5',
                        color: '#ffffff',
                        fontWeight: '900',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {meta.logoText || d.company?.charAt(0) || 'C'}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: '800', color: isSelected ? '#4f46e5' : '#1e293b' }}>
                        {d.company}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: '600' }}>
                        {d.vacancies || 10} Openings • <strong style={{ color: '#059669' }}>{d.ctc}</strong>
                      </div>
                    </div>

                    {isSelected && (
                      <span
                        style={{
                          background: '#e0e7ff',
                          color: '#4338ca',
                          fontSize: '0.65rem',
                          fontWeight: '800',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          marginLeft: '0.25rem'
                        }}
                      >
                        VIEWING
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Spotlight of Selected Drive */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Company Profile Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '1rem',
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '0.85rem',
                    background: companyMeta.color || '#4f46e5',
                    color: '#ffffff',
                    fontWeight: '900',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  {companyMeta.logoText || activeDrive.company?.charAt(0) || 'C'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                      {activeDrive.company}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: '800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        background: activeDrive.status === 'Active' ? '#dcfce7' : activeDrive.status === 'Completed' ? '#f1f5f9' : '#dbeafe',
                        color: activeDrive.status === 'Active' ? '#166534' : activeDrive.status === 'Completed' ? '#475569' : '#1e40af'
                      }}
                    >
                      {activeDrive.status || 'Active'} Drive
                    </span>
                  </div>

                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', fontWeight: '700', color: '#475569' }}>
                    {activeDrive.role}
                  </p>
                </div>
              </div>

              {/* Action Buttons for this company */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => handleApplyExternal(companyMeta.portalUrl)}
                  style={{
                    background: companyMeta.color || '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '0.6rem',
                    fontWeight: '800',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'transform 0.15s'
                  }}
                >
                  <span>Apply on Official Portal</span>
                  <ArrowUpRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleNotifyAdvisor}
                  style={{
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.6rem',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <ShieldCheck size={16} color="#4f46e5" />
                  <span>Notify Advisor</span>
                </button>
              </div>
            </div>

            {/* 4 Core Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.85rem'
              }}
            >
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Offered Package (CTC)
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#059669', marginTop: '0.25rem' }}>
                  {activeDrive.ctc}
                </div>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Standard package + incentives</span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Open Vacancies
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#2563eb', marginTop: '0.25rem' }}>
                  {activeDrive.vacancies} Seats
                </div>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Direct campus quota</span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Job Location & Mode
                </span>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} color="#64748b" />
                  {activeDrive.location}
                </div>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>{companyMeta.workMode}</span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Drive / Application Date
                </span>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} color="#64748b" />
                  {activeDrive.date}
                </div>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Registered students eligible</span>
              </div>
            </div>

            {/* Detailed Description & Overview */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.15rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={16} color="#4f46e5" />
                Role Overview & Job Profile
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                {companyMeta.summary}
              </p>
            </div>

            {/* Required Skills & Tech Stack */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.15rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.65rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="#f59e0b" />
                Required Skills & Key Competencies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {companyMeta.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: '700'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.15rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GraduationCap size={16} color="#10b981" />
                Eligibility Criteria
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                {companyMeta.eligibility}
              </p>
            </div>

            {/* Selection & Hiring Process Rounds */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.15rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} color="#6366f1" />
                Recruitment & Interview Process
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {companyMeta.rounds?.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.65rem',
                      padding: '0.85rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#4f46e5',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {r.step}
                      </span>
                      <strong style={{ fontSize: '0.825rem', color: '#0f172a' }}>{r.title}</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                      {r.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Campus placements managed directly via Lasak Edu Career & Admissions Cell.</span>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => handleApplyExternal(companyMeta.portalUrl)}
              style={{
                padding: '0.55rem 1.35rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: companyMeta.color || '#4f46e5',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
              }}
            >
              <span>Apply on {activeDrive.company} Official Site</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
