export const MOCK_USERS = [
  {
    id: 'usr-1',
    email: 'vikram@lasakedu.in',
    password: 'head123',
    name: 'Dr. Vikram',
    role: 'Head of Admissions',
    roleCode: 'HEAD_ADMISSIONS',
    avatar: 'VK',
    title: 'Dean & Head of Admissions',
    badgeColor: '#4f46e5',
    status: 'Active',
    dept: 'ALL',
    joinedDate: '2024-01-15'
  },
  {
    id: 'usr-2',
    email: 'sanjana@lasak.in',
    password: 'advisor123',
    name: 'Sanjana',
    role: 'Senior Career Advisor',
    roleCode: 'SR_CAREER_ADVISOR',
    avatar: 'SJ',
    title: 'Senior Placement & Career Guidance Manager',
    badgeColor: '#d97706',
    status: 'Active',
    dept: 'ALL',
    joinedDate: '2024-03-10'
  },
  {
    id: 'usr-3',
    email: 'laskhmanan@lasak.in',
    password: 'advisor123',
    name: 'Lakshmanan',
    role: 'Senior Career Advisor',
    roleCode: 'SR_CAREER_ADVISOR',
    avatar: 'LK',
    title: 'Head of Placement & Career Guidance',
    badgeColor: '#d97706',
    status: 'Active',
    dept: 'IT',
    joinedDate: '2024-04-22'
  },
  {
    id: 'usr-4',
    email: 'gukankalimuthu@gmail.com',
    password: 'advisor123',
    name: 'Gukan',
    role: 'Career Advisor',
    roleCode: 'CAREER_ADVISOR',
    avatar: 'GK',
    title: 'IT & Core Career Advisor',
    badgeColor: '#059669',
    status: 'Active',
    dept: 'IT',
    joinedDate: '2024-06-01'
  },
  {
    id: 'usr-5',
    email: 'sivaselvan121206@gmail.com',
    password: 'advisor123',
    name: 'Siva',
    role: 'Career Advisor',
    roleCode: 'CAREER_ADVISOR',
    avatar: 'SV',
    title: 'Mechanical Career Advisor',
    badgeColor: '#059669',
    status: 'Active',
    dept: 'MECH',
    joinedDate: '2024-06-15'
  },
  {
    id: 'usr-6',
    email: 'sreyarajendran96@gmail.com',
    password: 'advisor123',
    name: 'Sreya',
    role: 'Career Advisor',
    roleCode: 'CAREER_ADVISOR',
    avatar: 'SR',
    title: 'IT Career Advisor',
    badgeColor: '#059669',
    status: 'Active',
    dept: 'IT',
    joinedDate: '2024-07-01'
  },
  {
    id: 'usr-7',
    email: 'aswathysivan222@gmail.com',
    password: 'advisor123',
    name: 'Aswathy',
    role: 'Career Advisor',
    roleCode: 'CAREER_ADVISOR',
    avatar: 'AW',
    title: 'Civil Career Advisor',
    badgeColor: '#059669',
    status: 'Active',
    dept: 'CIVIL',
    joinedDate: '2024-07-15'
  },
  {
    id: 'usr-8',
    email: 'parkavi23.annadurai@gmail.com',
    password: 'advisor123',
    name: 'Parkavi',
    role: 'Career Advisor',
    roleCode: 'CAREER_ADVISOR',
    avatar: 'PK',
    title: 'Career Guidance Counsellor',
    badgeColor: '#059669',
    status: 'Active',
    dept: 'IT',
    joinedDate: '2024-08-01'
  },
  {
    id: 'usr-9',
    email: 'Hariharan26112006@gmail.com',
    password: 'advisor123',
    name: 'Hari Haran',
    role: 'Career Advisor',
    roleCode: 'CAREER_ADVISOR',
    avatar: 'HH',
    title: 'Placement & Career Counsellor',
    badgeColor: '#059669',
    status: 'Active',
    dept: 'MECH',
    joinedDate: '2024-08-15'
  },
  {
    id: 'usr-10',
    email: 'dinshiya21@gmail.com',
    password: 'advisor123',
    name: 'Dinshiya',
    role: 'Career Advisor',
    roleCode: 'CAREER_ADVISOR',
    avatar: 'DS',
    title: 'Placement & Career Counsellor',
    badgeColor: '#059669',
    status: 'Active',
    dept: 'CIVIL',
    joinedDate: '2024-09-01'
  }
];

export const DEPARTMENTS = [
  {
    id: 'MECH',
    code: 'MECH',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical',
    icon: 'Settings',
    description: 'Design, Thermal Systems, Automation & Advanced Robotics',
    color: '#3b82f6',
    headName: 'Dr. Suresh R.'
  },
  {
    id: 'CIVIL',
    code: 'CIVIL',
    name: 'Civil Engineering',
    shortName: 'Civil',
    icon: 'Building2',
    description: 'Structural Infrastructure, Smart Cities & Green Building Design',
    color: '#10b981',
    headName: 'Prof. Ananya Das'
  },
  {
    id: 'IT',
    code: 'IT',
    name: 'Information Technology',
    shortName: 'Info Tech',
    icon: 'Laptop',
    description: 'Software Engineering, AI/ML Systems, Cloud & Cyber Security',
    color: '#8b5cf6',
    headName: 'Dr. Alok Verma'
  }
];

export const COURSES = [
  {
    id: 'crs-mech-1',
    dept: 'MECH',
    name: 'Mechanical Engineering',
    shortName: 'Mech Engg',
    duration: '4 Years',
    seats: 60,
    description: 'Core engineering principles: thermodynamics, manufacturing, CAD/CAM, robotics and automation.',
    color: '#3b82f6',
    isSubCourse: false
  },
  {
    id: 'crs-civil-1',
    dept: 'CIVIL',
    name: 'Civil Engineering',
    shortName: 'Civil Engg',
    duration: '4 Years',
    seats: 60,
    description: 'Structural design, construction management, environmental engineering and smart infrastructure.',
    color: '#10b981',
    isSubCourse: false
  },
  {
    id: 'crs-it-1',
    dept: 'IT',
    name: 'MERN Stack with Gen-AI',
    shortName: 'MERN + Gen-AI',
    duration: '18 Months',
    seats: 60,
    description: 'Full-stack development using MongoDB, Express, React and Node.js integrated with Generative AI tools.',
    color: '#8b5cf6',
    isSubCourse: true
  },
  {
    id: 'crs-it-2',
    dept: 'IT',
    name: 'Digital Marketing with AI Automation',
    shortName: 'Digital Mktg + AI',
    duration: '12 Months',
    seats: 60,
    description: 'Modern digital marketing strategies powered by AI: SEO, social media, content automation and analytics.',
    color: '#ec4899',
    isSubCourse: true
  }
];

export const CAREER_ADVISORS_LIST = [
  { id: 'usr-2', name: 'Sanjana', email: 'sanjana@lasak.in', activeCases: 10 },
  { id: 'usr-3', name: 'Lakshmanan', email: 'laskhmanan@lasak.in', activeCases: 12 },
  { id: 'usr-4', name: 'Gukan', email: 'gukankalimuthu@gmail.com', activeCases: 8 },
  { id: 'usr-5', name: 'Siva', email: 'sivaselvan121206@gmail.com', activeCases: 6 },
  { id: 'usr-6', name: 'Sreya', email: 'sreyarajendran96@gmail.com', activeCases: 9 },
  { id: 'usr-7', name: 'Aswathy', email: 'aswathysivan222@gmail.com', activeCases: 5 },
  { id: 'usr-8', name: 'Parkavi', email: 'parkavi23.annadurai@gmail.com', activeCases: 7 },
  { id: 'usr-9', name: 'Hari Haran', email: 'Hariharan26112006@gmail.com', activeCases: 6 },
  { id: 'usr-10', name: 'Dinshiya', email: 'dinshiya21@gmail.com', activeCases: 4 }
];

const today = new Date();
const d = (offsetDays) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString().split('T')[0];
};

export const INITIAL_DEMOS = [
  // Gukan demos
  { id: 'dem-001', staffId: 'usr-4', staffName: 'Gukan', prospectName: 'Rahul Kumar', prospectPhone: '+91 98001 11001', dept: 'MECH', course: 'Mechanical Engineering', date: d(-20), status: 'Completed', notes: 'Student very interested in CAD modules. Follow-up call scheduled.' },
  { id: 'dem-002', staffId: 'usr-4', staffName: 'Gukan', prospectName: 'Sunita Verma', prospectPhone: '+91 98001 11002', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(-18), status: 'Completed', notes: 'Explained full MERN roadmap. Student excited about AI integration.' },
  { id: 'dem-003', staffId: 'usr-4', staffName: 'Gukan', prospectName: 'Arun Pillai', prospectPhone: '+91 98001 11003', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(-15), status: 'Follow-up', notes: 'Student requested brochure and fee structure. Needs parental consent.' },
  { id: 'dem-004', staffId: 'usr-4', staffName: 'Gukan', prospectName: 'Ritu Agarwal', prospectPhone: '+91 98001 11004', dept: 'CIVIL', course: 'Civil Engineering', date: d(-12), status: 'Completed', notes: 'Visited campus. Very impressed with lab infrastructure.' },
  { id: 'dem-005', staffId: 'usr-4', staffName: 'Gukan', prospectName: 'Manish Soni', prospectPhone: '+91 98001 11005', dept: 'IT', course: 'Digital Marketing with AI Automation', date: d(-10), status: 'Scheduled', notes: 'Confirmed for next week. Will bring sibling too.' },
  { id: 'dem-006', staffId: 'usr-4', staffName: 'Gukan', prospectName: 'Divya Menon', prospectPhone: '+91 98001 11006', dept: 'MECH', course: 'Mechanical Engineering', date: d(-8), status: 'Completed', notes: 'Enrolled same day. Fee paid.' },
  { id: 'dem-007', staffId: 'usr-4', staffName: 'Gukan', prospectName: 'Kartik Shah', prospectPhone: '+91 98001 11007', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(-5), status: 'Cancelled', notes: 'Student did not show up. Phone unreachable.' },
  { id: 'dem-008', staffId: 'usr-4', staffName: 'Gukan', prospectName: 'Preethi Nair', prospectPhone: '+91 98001 11008', dept: 'CIVIL', course: 'Civil Engineering', date: d(-3), status: 'Completed', notes: 'Great engagement. Student comparing with two other colleges.' },

  // Siva demos
  { id: 'dem-009', staffId: 'usr-5', staffName: 'Siva', prospectName: 'Vivek Yadav', prospectPhone: '+91 98002 22001', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(-19), status: 'Completed', notes: 'Showed 3D course roadmap. Student loved the Gen-AI module overview.' },
  { id: 'dem-010', staffId: 'usr-5', staffName: 'Siva', prospectName: 'Neelu Jain', prospectPhone: '+91 98002 22002', dept: 'IT', course: 'Digital Marketing with AI Automation', date: d(-16), status: 'Completed', notes: 'Covered AI content tools and automation. Student wants weekend batch.' },
  { id: 'dem-011', staffId: 'usr-5', staffName: 'Siva', prospectName: 'Sanjay Patil', prospectPhone: '+91 98002 22003', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(-13), status: 'Follow-up', notes: 'Budget concern. Offered scholarship application form.' },
  { id: 'dem-012', staffId: 'usr-5', staffName: 'Siva', prospectName: 'Archana Tiwari', prospectPhone: '+91 98002 22004', dept: 'IT', course: 'Digital Marketing with AI Automation', date: d(-9), status: 'Completed', notes: 'Student enrolled. Fee pending.' },
  { id: 'dem-013', staffId: 'usr-5', staffName: 'Siva', prospectName: 'Nitin Ghosh', prospectPhone: '+91 98002 22005', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(-6), status: 'Scheduled', notes: 'Referred by existing student Aarav Patel.' },

  // Sreya demos
  { id: 'dem-014', staffId: 'usr-6', staffName: 'Sreya', prospectName: 'Gaurav Mishra', prospectPhone: '+91 98003 33001', dept: 'MECH', course: 'Mechanical Engineering', date: d(-22), status: 'Completed', notes: 'Detailed walkthrough of Tata Motors placement record.' },
  { id: 'dem-015', staffId: 'usr-6', staffName: 'Sreya', prospectName: 'Priya Shastri', prospectPhone: '+91 98003 33002', dept: 'MECH', course: 'Mechanical Engineering', date: d(-17), status: 'Completed', notes: 'Showed robotics lab. Student very interested in automation track.' },
  { id: 'dem-016', staffId: 'usr-6', staffName: 'Sreya', prospectName: 'Rohan Kapila', prospectPhone: '+91 98003 33003', dept: 'MECH', course: 'Mechanical Engineering', date: d(-11), status: 'Follow-up', notes: 'Parent attended. Wants more info about hostel facilities.' },
  { id: 'dem-017', staffId: 'usr-6', staffName: 'Sreya', prospectName: 'Anjali Bajaj', prospectPhone: '+91 98003 33004', dept: 'MECH', course: 'Mechanical Engineering', date: d(-7), status: 'Completed', notes: 'Enrolled. Will start next Monday.' },
  { id: 'dem-018', staffId: 'usr-6', staffName: 'Sreya', prospectName: 'Hemant Rathore', prospectPhone: '+91 98003 33005', dept: 'MECH', course: 'Mechanical Engineering', date: d(-2), status: 'Scheduled', notes: '' },

  // Aswathy demos
  { id: 'dem-019', staffId: 'usr-7', staffName: 'Aswathy', prospectName: 'Tanmay Joshi', prospectPhone: '+91 98004 44001', dept: 'CIVIL', course: 'Civil Engineering', date: d(-21), status: 'Completed', notes: 'Covered L&T and infrastructure sector placements.' },
  { id: 'dem-020', staffId: 'usr-7', staffName: 'Aswathy', prospectName: 'Kavitha Reddy', prospectPhone: '+91 98004 44002', dept: 'CIVIL', course: 'Civil Engineering', date: d(-14), status: 'Completed', notes: 'Walked through BIM and smart city project modules.' },
  { id: 'dem-021', staffId: 'usr-7', staffName: 'Aswathy', prospectName: 'Arjun Krishnan', prospectPhone: '+91 98004 44003', dept: 'CIVIL', course: 'Civil Engineering', date: d(-8), status: 'Follow-up', notes: 'Student comparing Civil vs MERN. Needs more time.' },
  { id: 'dem-022', staffId: 'usr-7', staffName: 'Aswathy', prospectName: 'Pooja Singh', prospectPhone: '+91 98004 44004', dept: 'CIVIL', course: 'Civil Engineering', date: d(-4), status: 'Completed', notes: 'Enrolled with full payment.' },

  // Vikram Malhotra (Sr Advisor) demos
  { id: 'dem-023', staffId: 'usr-3', staffName: 'Vikram Malhotra', prospectName: 'Suresh Nambiar', prospectPhone: '+91 98005 55001', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(-25), status: 'Completed', notes: 'Corporate referral demo. Company wants 5 sponsored seats.' },
  { id: 'dem-024', staffId: 'usr-3', staffName: 'Vikram Malhotra', prospectName: 'Lakshmi Iyer', prospectPhone: '+91 98005 55002', dept: 'IT', course: 'Digital Marketing with AI Automation', date: d(-18), status: 'Completed', notes: 'Freelancer wanting upskilling. Enrolled immediately.' },
  { id: 'dem-025', staffId: 'usr-3', staffName: 'Vikram Malhotra', prospectName: 'Rakesh Mehta', prospectPhone: '+91 98005 55003', dept: 'MECH', course: 'Mechanical Engineering', date: d(-10), status: 'Scheduled', notes: 'Cross-dept demo. Referred by Priya Mukherjee.' },

  // Priya Mukherjee (Sr Manager) demos
  { id: 'dem-026', staffId: 'usr-2', staffName: 'Priya Mukherjee', prospectName: 'Anil Bose', prospectPhone: '+91 98006 66001', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(-30), status: 'Completed', notes: 'Group demo for college students. 8 attendees.' },
  { id: 'dem-027', staffId: 'usr-2', staffName: 'Priya Mukherjee', prospectName: 'Smita Kulkarni', prospectPhone: '+91 98006 66002', dept: 'CIVIL', course: 'Civil Engineering', date: d(-20), status: 'Completed', notes: 'Alumni referral. Student from IIT background.' },
  { id: 'dem-028', staffId: 'usr-2', staffName: 'Priya Mukherjee', prospectName: 'Aryan Gupta', prospectPhone: '+91 98006 66003', dept: 'IT', course: 'Digital Marketing with AI Automation', date: d(-12), status: 'Follow-up', notes: 'Parent meeting required.' },
  { id: 'dem-029', staffId: 'usr-2', staffName: 'Priya Mukherjee', prospectName: 'Rishi Pandey', prospectPhone: '+91 98006 66004', dept: 'MECH', course: 'Mechanical Engineering', date: d(-5), status: 'Completed', notes: 'Walk-in demo. Enrolled on spot.' },
  { id: 'dem-030', staffId: 'usr-2', staffName: 'Priya Mukherjee', prospectName: 'Farah Ahmed', prospectPhone: '+91 98006 66005', dept: 'IT', course: 'MERN Stack with Gen-AI', date: d(1), status: 'Scheduled', notes: 'Online demo via Zoom. Link sent.' }
];

export const INITIAL_STUDENTS = [
  // --- INFORMATION TECHNOLOGY (IT) ---
  {
    id: 'APP-IT-101',
    name: 'Aarav Patel',
    email: 'aarav.p@gmail.com',
    phone: '+91 98765 43210',
    dept: 'IT',
    gpa: 3.88,
    entranceScore: 96.5,
    status: 'Admitted',
    appliedDate: '2026-08-12',
    placedStatus: 'Placed',
    company: 'Google Cloud India',
    packageAmt: '₹18.5 LPA',
    assignedAdvisorId: 'usr-4',
    assignedAdvisorName: 'Gukan',
    counsellingStatus: 'Resolved',
    address: 'Mumbai, Maharashtra',
    counsellingNotes: [
      { id: 'n1', date: '2026-08-18', author: 'Gukan', text: 'Reviewed Aarav\'s algorithms prep. Recommended mock interviews for system design.', type: 'Guidance' },
      { id: 'n2', date: '2026-08-28', author: 'Gukan', text: 'Cleared Google final tech round. Offer letter received.', type: 'Milestone' }
    ]
  },
  {
    id: 'APP-IT-102',
    name: 'Neha Sharma',
    email: 'neha.s@gmail.com',
    phone: '+91 98123 45678',
    dept: 'IT',
    gpa: 3.65,
    entranceScore: 91.2,
    status: 'Admitted',
    appliedDate: '2026-08-14',
    placedStatus: 'Interviewing',
    company: 'Infosys Tech',
    packageAmt: '₹8.5 LPA (Offered)',
    assignedAdvisorId: 'usr-4',
    assignedAdvisorName: 'Gukan',
    counsellingStatus: 'Active',
    address: 'Bengaluru, Karnataka',
    counsellingNotes: [
      { id: 'n3', date: '2026-08-20', author: 'Gukan', text: 'Conducted resume enhancement session. Focus on React and Full Stack projects.', type: 'Guidance' }
    ]
  },
  {
    id: 'APP-IT-103',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@outlook.com',
    phone: '+91 97654 32109',
    dept: 'IT',
    gpa: 3.42,
    entranceScore: 84.0,
    status: 'Under Review',
    appliedDate: '2026-08-25',
    placedStatus: 'Eligible',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: 'usr-4',
    assignedAdvisorName: 'Gukan',
    counsellingStatus: 'Scheduled',
    address: 'Pune, Maharashtra',
    counsellingNotes: [
      { id: 'n4', date: '2026-08-26', author: 'Gukan', text: 'Initial onboarding scheduled for Sept 10. Student requested extra help with DSA.', type: 'Followup' }
    ]
  },
  {
    id: 'APP-IT-104',
    name: 'Ananya Roy',
    email: 'ananya.roy@yahoo.com',
    phone: '+91 99887 76655',
    dept: 'IT',
    gpa: 3.92,
    entranceScore: 98.0,
    status: 'Admitted',
    appliedDate: '2026-08-10',
    placedStatus: 'Placed',
    company: 'Microsoft India',
    packageAmt: '₹21.0 LPA',
    assignedAdvisorId: 'usr-5',
    assignedAdvisorName: 'Siva',
    counsellingStatus: 'Resolved',
    address: 'Kolkata, West Bengal',
    counsellingNotes: [
      { id: 'n5', date: '2026-08-15', author: 'Siva', text: 'Accepted offer at Microsoft. Final verification complete.', type: 'Milestone' }
    ]
  },
  {
    id: 'APP-IT-105',
    name: 'Devendra Kulkarni',
    email: 'dev.kulkarni@gmail.com',
    phone: '+91 91234 56789',
    dept: 'IT',
    gpa: 2.95,
    entranceScore: 71.5,
    status: 'Rejected',
    appliedDate: '2026-08-05',
    placedStatus: 'Not Eligible',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: null,
    assignedAdvisorName: 'Unassigned',
    counsellingStatus: 'None',
    address: 'Nagpur, Maharashtra',
    counsellingNotes: []
  },
  {
    id: 'APP-IT-106',
    name: 'Meera Iyer',
    email: 'meera.iyer@gmail.com',
    phone: '+91 94433 22110',
    dept: 'IT',
    gpa: 3.78,
    entranceScore: 94.0,
    status: 'Admitted',
    appliedDate: '2026-08-19',
    placedStatus: 'Interviewing',
    company: 'TCS Innovation Labs',
    packageAmt: 'Pending',
    assignedAdvisorId: 'usr-4',
    assignedAdvisorName: 'Gukan',
    counsellingStatus: 'Active',
    address: 'Chennai, Tamil Nadu',
    counsellingNotes: [
      { id: 'n6', date: '2026-09-01', author: 'Gukan', text: 'Prepped Meera for cloud architecture interview.', type: 'Guidance' }
    ]
  },
  {
    id: 'APP-IT-107',
    name: 'Vikrant Saxena',
    email: 'vikrant.s@gmail.com',
    phone: '+91 93322 11009',
    dept: 'IT',
    gpa: 3.10,
    entranceScore: 78.4,
    status: 'Submitted',
    appliedDate: '2026-09-01',
    placedStatus: 'Eligible',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: null,
    assignedAdvisorName: 'Unassigned',
    counsellingStatus: 'None',
    address: 'Delhi NCR',
    counsellingNotes: []
  },

  // --- MECHANICAL ENGINEERING (MECH) ---
  {
    id: 'APP-MECH-201',
    name: 'Karan Malhotra',
    email: 'karan.m@gmail.com',
    phone: '+91 98221 34567',
    dept: 'MECH',
    gpa: 3.75,
    entranceScore: 92.4,
    status: 'Admitted',
    appliedDate: '2026-08-11',
    placedStatus: 'Placed',
    company: 'Tata Motors R&D',
    packageAmt: '₹12.0 LPA',
    assignedAdvisorId: 'usr-6',
    assignedAdvisorName: 'Sreya',
    counsellingStatus: 'Resolved',
    address: 'Pune, Maharashtra',
    counsellingNotes: [
      { id: 'n7', date: '2026-08-22', author: 'Sreya', text: 'Mock EV engineering test completed. Placed in Tata EV powertrain div.', type: 'Milestone' }
    ]
  },
  {
    id: 'APP-MECH-202',
    name: 'Tanvi Joshi',
    email: 'tanvi.j@gmail.com',
    phone: '+91 97112 23344',
    dept: 'MECH',
    gpa: 3.60,
    entranceScore: 89.1,
    status: 'Admitted',
    appliedDate: '2026-08-16',
    placedStatus: 'Interviewing',
    company: 'Bosch Automotive',
    packageAmt: '₹10.5 LPA',
    assignedAdvisorId: 'usr-4',
    assignedAdvisorName: 'Gukan',
    counsellingStatus: 'Active',
    address: 'Nashik, Maharashtra',
    counsellingNotes: [
      { id: 'n8', date: '2026-08-30', author: 'Gukan', text: 'Assigned CAD/CAM portfolio review for Bosch round 2.', type: 'Guidance' }
    ]
  },
  {
    id: 'APP-MECH-203',
    name: 'Siddharth Rao',
    email: 'sid.rao@gmail.com',
    phone: '+91 96543 21876',
    dept: 'MECH',
    gpa: 3.25,
    entranceScore: 81.0,
    status: 'Under Review',
    appliedDate: '2026-08-22',
    placedStatus: 'Needs Guidance',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: 'usr-4',
    assignedAdvisorName: 'Gukan',
    counsellingStatus: 'Active',
    address: 'Hyderabad, Telangana',
    counsellingNotes: [
      { id: 'n9', date: '2026-09-02', author: 'Gukan', text: 'Discussed thermal analysis electives to boost profile score.', type: 'Guidance' }
    ]
  },
  {
    id: 'APP-MECH-204',
    name: 'Aditya Mehta',
    email: 'aditya.m@gmail.com',
    phone: '+91 95432 10987',
    dept: 'MECH',
    gpa: 3.89,
    entranceScore: 95.8,
    status: 'Admitted',
    appliedDate: '2026-08-08',
    placedStatus: 'Placed',
    company: 'L&T Heavy Engineering',
    packageAmt: '₹14.2 LPA',
    assignedAdvisorId: 'usr-6',
    assignedAdvisorName: 'Sreya',
    counsellingStatus: 'Resolved',
    address: 'Vadodara, Gujarat',
    counsellingNotes: []
  },
  {
    id: 'APP-MECH-205',
    name: 'Nikhil Shinde',
    email: 'nikhil.shinde@gmail.com',
    phone: '+91 91122 33445',
    dept: 'MECH',
    gpa: 2.80,
    entranceScore: 69.0,
    status: 'Rejected',
    appliedDate: '2026-08-03',
    placedStatus: 'Not Eligible',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: null,
    assignedAdvisorName: 'Unassigned',
    counsellingStatus: 'None',
    address: 'Satara, Maharashtra',
    counsellingNotes: []
  },
  {
    id: 'APP-MECH-206',
    name: 'Ishita Kapoor',
    email: 'ishita.k@gmail.com',
    phone: '+91 98989 89898',
    dept: 'MECH',
    gpa: 3.45,
    entranceScore: 86.2,
    status: 'Submitted',
    appliedDate: '2026-09-03',
    placedStatus: 'Eligible',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: null,
    assignedAdvisorName: 'Unassigned',
    counsellingStatus: 'None',
    address: 'Chandigarh',
    counsellingNotes: []
  },

  // --- CIVIL ENGINEERING (CIVIL) ---
  {
    id: 'APP-CIVIL-301',
    name: 'Preeti Verma',
    email: 'preeti.v@gmail.com',
    phone: '+91 97890 12345',
    dept: 'CIVIL',
    gpa: 3.82,
    entranceScore: 93.6,
    status: 'Admitted',
    appliedDate: '2026-08-09',
    placedStatus: 'Placed',
    company: 'Larsen & Toubro Construction',
    packageAmt: '₹11.8 LPA',
    assignedAdvisorId: 'usr-7',
    assignedAdvisorName: 'Aswathy',
    counsellingStatus: 'Resolved',
    address: 'Lucknow, Uttar Pradesh',
    counsellingNotes: [
      { id: 'n10', date: '2026-08-21', author: 'Aswathy', text: 'Cleared structural interview at L&T.', type: 'Milestone' }
    ]
  },
  {
    id: 'APP-CIVIL-302',
    name: 'Harsh Vardhan',
    email: 'harsh.v@gmail.com',
    phone: '+91 96789 01234',
    dept: 'CIVIL',
    gpa: 3.51,
    entranceScore: 87.5,
    status: 'Admitted',
    appliedDate: '2026-08-15',
    placedStatus: 'Interviewing',
    company: 'Shapoorji Pallonji Group',
    packageAmt: '₹9.8 LPA (Offered)',
    assignedAdvisorId: 'usr-4',
    assignedAdvisorName: 'Gukan',
    counsellingStatus: 'Active',
    address: 'Jaipur, Rajasthan',
    counsellingNotes: [
      { id: 'n11', date: '2026-08-29', author: 'Gukan', text: 'Reviewed STAAD Pro certifications and BIM projects.', type: 'Guidance' }
    ]
  },
  {
    id: 'APP-CIVIL-303',
    name: 'Gaurav Banerjee',
    email: 'gaurav.b@gmail.com',
    phone: '+91 95678 90123',
    dept: 'CIVIL',
    gpa: 3.15,
    entranceScore: 79.0,
    status: 'Under Review',
    appliedDate: '2026-08-28',
    placedStatus: 'Needs Guidance',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: 'usr-4',
    assignedAdvisorName: 'Gukan',
    counsellingStatus: 'Active',
    address: 'Kolkata, West Bengal',
    counsellingNotes: [
      { id: 'n12', date: '2026-09-04', author: 'Gukan', text: 'Advised student on AutoCAD & GIS certification track.', type: 'Guidance' }
    ]
  },
  {
    id: 'APP-CIVIL-304',
    name: 'Shweta Tiwari',
    email: 'shweta.t@gmail.com',
    phone: '+91 94567 89012',
    dept: 'CIVIL',
    gpa: 3.68,
    entranceScore: 90.1,
    status: 'Admitted',
    appliedDate: '2026-08-17',
    placedStatus: 'Placed',
    company: 'Afcons Infrastructure',
    packageAmt: '₹10.2 LPA',
    assignedAdvisorId: 'usr-7',
    assignedAdvisorName: 'Aswathy',
    counsellingStatus: 'Resolved',
    address: 'Bhopal, Madhya Pradesh',
    counsellingNotes: []
  },
  {
    id: 'APP-CIVIL-305',
    name: 'Deepak Nambiar',
    email: 'deepak.n@gmail.com',
    phone: '+91 93456 78901',
    dept: 'CIVIL',
    gpa: 2.75,
    entranceScore: 66.0,
    status: 'Rejected',
    appliedDate: '2026-08-04',
    placedStatus: 'Not Eligible',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: null,
    assignedAdvisorName: 'Unassigned',
    counsellingStatus: 'None',
    address: 'Kochi, Kerala',
    counsellingNotes: []
  },
  {
    id: 'APP-CIVIL-306',
    name: 'Pooja Choudhury',
    email: 'pooja.c@gmail.com',
    phone: '+91 92345 67890',
    dept: 'CIVIL',
    gpa: 3.30,
    entranceScore: 82.5,
    status: 'Submitted',
    appliedDate: '2026-09-02',
    placedStatus: 'Eligible',
    company: '—',
    packageAmt: '—',
    assignedAdvisorId: null,
    assignedAdvisorName: 'Unassigned',
    counsellingStatus: 'None',
    address: 'Guwahati, Assam',
    counsellingNotes: []
  }
];

export const RECRUITMENT_DRIVES = [
  {
    id: 'drv-1',
    company: 'Google Cloud India',
    dept: 'IT',
    courseName: 'MERN Stack with Gen-AI',
    role: 'Cloud & Full Stack SDE',
    ctc: '₹18.5 LPA',
    date: '2026-09-18',
    status: 'Upcoming',
    vacancies: 12,
    location: 'Bengaluru / Hybrid'
  },
  {
    id: 'drv-2',
    company: 'Microsoft India',
    dept: 'IT',
    courseName: 'MERN Stack with Gen-AI',
    role: 'Full Stack MERN & AI Developer',
    ctc: '₹21.0 LPA',
    date: '2026-08-25',
    status: 'Completed',
    vacancies: 8,
    location: 'Hyderabad'
  },
  {
    id: 'drv-3',
    company: 'Zoho Corporation',
    dept: 'IT',
    courseName: 'MERN Stack with Gen-AI',
    role: 'React & Node.js Application Engineer',
    ctc: '₹12.5 LPA',
    date: '2026-09-29',
    status: 'Active',
    vacancies: 18,
    location: 'Chennai'
  },
  {
    id: 'drv-4',
    company: 'HubSpot Digital',
    dept: 'IT',
    courseName: 'Digital Marketing with AI Automation',
    role: 'AI Growth & Marketing Automation Lead',
    ctc: '₹14.0 LPA',
    date: '2026-09-30',
    status: 'Active',
    vacancies: 10,
    location: 'Remote / Bengaluru'
  },
  {
    id: 'drv-5',
    company: 'Accenture Interactive',
    dept: 'IT',
    courseName: 'Digital Marketing with AI Automation',
    role: 'AI Marketing Strategist & Campaign Lead',
    ctc: '₹11.5 LPA',
    date: '2026-10-05',
    status: 'Upcoming',
    vacancies: 15,
    location: 'Bengaluru'
  },
  {
    id: 'drv-6',
    company: 'Tata Motors R&D',
    dept: 'MECH',
    courseName: 'Mechanical Engineering',
    role: 'EV Powertrain Design Engineer',
    ctc: '₹12.0 LPA',
    date: '2026-09-15',
    status: 'Active',
    vacancies: 15,
    location: 'Pune Tech Park'
  },
  {
    id: 'drv-7',
    company: 'Bosch Automotive',
    dept: 'MECH',
    courseName: 'Mechanical Engineering',
    role: 'Robotics & Control Systems Specialist',
    ctc: '₹10.5 LPA',
    date: '2026-09-22',
    status: 'Upcoming',
    vacancies: 10,
    location: 'Bengaluru'
  },
  {
    id: 'drv-8',
    company: 'L&T Construction',
    dept: 'CIVIL',
    courseName: 'Civil Engineering',
    role: 'Junior Structural Engineer',
    ctc: '₹11.8 LPA',
    date: '2026-08-20',
    status: 'Completed',
    vacancies: 20,
    location: 'Mumbai & Chennai'
  },
  {
    id: 'drv-9',
    company: 'Shapoorji Pallonji',
    dept: 'CIVIL',
    courseName: 'Civil Engineering',
    role: 'Smart Infrastructure Engineer',
    ctc: '₹9.8 LPA',
    date: '2026-09-28',
    status: 'Upcoming',
    vacancies: 14,
    location: 'Delhi NCR'
  }
];
