// Demo Schedule Mock Data Engine for demo.lasakedu.in

export const DEMO_COURSES = {
  MECH: {
    key: 'MECH',
    name: 'Mechanical',
    fullName: 'Mechanical Engineering',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    darkColor: '#1d4ed8'
  },
  CIVIL: {
    key: 'CIVIL',
    name: 'Civil',
    fullName: 'Civil Engineering',
    color: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#ffedd5',
    darkColor: '#c2410c'
  },
  MERN: {
    key: 'MERN',
    name: 'MERN',
    fullName: 'MERN Stack + Gen-AI',
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    darkColor: '#047857'
  },
  DM: {
    key: 'DM',
    name: 'Digital Marketing',
    fullName: 'Digital Marketing + AI',
    color: '#ec4899',
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    darkColor: '#be185d'
  }
};

export const TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM'
];

export const DEMO_EMPLOYEES = [
  { id: 'usr-4', name: 'Gukan', role: 'Career Advisor', avatar: 'GK', email: 'gukankalimuthu@gmail.com' },
  { id: 'usr-5', name: 'Siva', role: 'Career Advisor', avatar: 'SV', email: 'sivaselvan121206@gmail.com' },
  { id: 'usr-6', name: 'Sreya', role: 'Career Advisor', avatar: 'SR', email: 'sreyarajendran96@gmail.com' },
  { id: 'usr-7', name: 'Aswathy', role: 'Career Advisor', avatar: 'AW', email: 'aswathysivan222@gmail.com' },
  { id: 'usr-8', name: 'Parkavi', role: 'Career Advisor', avatar: 'PK', email: 'parkavi23.annadurai@gmail.com' },
  { id: 'usr-3', name: 'Lakshmanan', role: 'Senior Career Advisor', avatar: 'LK', email: 'laskhmanan@lasak.in' },
  { id: 'usr-2', name: 'Sanjana', role: 'Senior Career Advisor', avatar: 'SJ', email: 'sanjana@lasak.in' },
  { id: 'usr-1', name: 'Dr. Vikram', role: 'Head of Admissions', avatar: 'VK', email: 'vikram@lasakedu.in' }
];

export const INITIAL_SCHEDULED_DEMOS = [
  // --- TODAY: 2026-09-09 ---
  // Gukan (usr-4)
  {
    id: 'sch-001',
    date: '2026-09-09',
    timeSlot: '10:00 AM - 11:00 AM',
    employeeId: 'usr-4',
    employeeName: 'Gukan',
    courseKey: 'MECH',
    prospectName: 'Rohan Sharma',
    prospectPhone: '+91 98111 22334',
    status: 'Fixed',
    notes: 'Interested in Auto CAD & EV Powertrain modules.'
  },
  {
    id: 'sch-002',
    date: '2026-09-09',
    timeSlot: '11:00 AM - 12:00 PM',
    employeeId: 'usr-4',
    employeeName: 'Gukan',
    courseKey: 'MERN',
    prospectName: 'Deepika Rao',
    prospectPhone: '+91 98222 33445',
    status: 'Fixed',
    notes: 'Switching from BCA to fullstack React/Node.'
  },
  {
    id: 'sch-003',
    date: '2026-09-09',
    timeSlot: '02:00 PM - 03:00 PM',
    employeeId: 'usr-4',
    employeeName: 'Gukan',
    courseKey: 'MECH',
    prospectName: 'Arjun Gupta',
    prospectPhone: '+91 98333 44556',
    status: 'Conducted',
    notes: 'Demo completed successfully. Parents requested fee installment details.'
  },
  {
    id: 'sch-004',
    date: '2026-09-09',
    timeSlot: '04:00 PM - 05:00 PM',
    employeeId: 'usr-4',
    employeeName: 'Gukan',
    courseKey: 'CIVIL',
    prospectName: 'Tanya Singh',
    prospectPhone: '+91 98444 55667',
    status: 'Fixed',
    notes: 'Special inquiry regarding BIM and Revit certification.'
  },
  {
    id: 'sch-004b',
    date: '2026-09-09',
    timeSlot: '05:00 PM - 06:00 PM',
    employeeId: 'usr-4',
    employeeName: 'Gukan',
    courseKey: 'MECH',
    prospectName: 'Kartik Shah',
    prospectPhone: '+91 98111 99999',
    status: 'Cancelled',
    notes: 'Candidate postponed demo due to exam schedule.'
  },

  // Siva (usr-5)
  {
    id: 'sch-005',
    date: '2026-09-09',
    timeSlot: '10:00 AM - 11:00 AM',
    employeeId: 'usr-5',
    employeeName: 'Siva',
    courseKey: 'MERN',
    prospectName: 'Aarav Mehta',
    prospectPhone: '+91 98555 66778',
    status: 'Conducted',
    notes: 'Walkthrough of Next.js and Gen-AI portfolio project.'
  },
  {
    id: 'sch-006',
    date: '2026-09-09',
    timeSlot: '12:00 PM - 01:00 PM',
    employeeId: 'usr-5',
    employeeName: 'Siva',
    courseKey: 'MERN',
    prospectName: 'Kavya Nair',
    prospectPhone: '+91 98666 77889',
    status: 'Conducted',
    notes: 'Wants morning weekend batch slot.'
  },
  {
    id: 'sch-007',
    date: '2026-09-09',
    timeSlot: '03:00 PM - 04:00 PM',
    employeeId: 'usr-5',
    employeeName: 'Siva',
    courseKey: 'DM',
    prospectName: 'Vishal Verma',
    prospectPhone: '+91 98777 88990',
    status: 'Fixed',
    notes: 'Ecommerce business owner seeking Performance Marketing.'
  },
  {
    id: 'sch-008',
    date: '2026-09-09',
    timeSlot: '05:00 PM - 06:00 PM',
    employeeId: 'usr-5',
    employeeName: 'Siva',
    courseKey: 'MERN',
    prospectName: 'Priyamvada C.',
    prospectPhone: '+91 98888 99001',
    status: 'Fixed',
    notes: 'Final year CS student.'
  },

  // Sreya (usr-6)
  {
    id: 'sch-009',
    date: '2026-09-09',
    timeSlot: '11:00 AM - 12:00 PM',
    employeeId: 'usr-6',
    employeeName: 'Sreya',
    courseKey: 'MECH',
    prospectName: 'Suresh Patil',
    prospectPhone: '+91 98999 00112',
    status: 'Fixed',
    notes: 'Diploma holder looking for lateral entry B.Tech demo.'
  },
  {
    id: 'sch-010',
    date: '2026-09-09',
    timeSlot: '01:00 PM - 02:00 PM',
    employeeId: 'usr-6',
    employeeName: 'Sreya',
    courseKey: 'MECH',
    prospectName: 'Karan Malhotra',
    prospectPhone: '+91 97000 11223',
    status: 'Conducted',
    notes: 'Reviewed Tata Motors placement record.'
  },
  {
    id: 'sch-011',
    date: '2026-09-09',
    timeSlot: '04:00 PM - 05:00 PM',
    employeeId: 'usr-6',
    employeeName: 'Sreya',
    courseKey: 'CIVIL',
    prospectName: 'Nitin Sawant',
    prospectPhone: '+91 97111 22334',
    status: 'Fixed',
    notes: 'Infrastructure background.'
  },
  {
    id: 'sch-011b',
    date: '2026-09-09',
    timeSlot: '05:00 PM - 06:00 PM',
    employeeId: 'usr-6',
    employeeName: 'Sreya',
    courseKey: 'MECH',
    prospectName: 'Rahul Verma',
    prospectPhone: '+91 97111 88888',
    status: 'Cancelled',
    notes: 'Candidate unreachable on phone.'
  },

  // Aswathy (usr-7)
  {
    id: 'sch-012',
    date: '2026-09-09',
    timeSlot: '10:00 AM - 11:00 AM',
    employeeId: 'usr-7',
    employeeName: 'Aswathy',
    courseKey: 'CIVIL',
    prospectName: 'Ananya Bhatt',
    prospectPhone: '+91 97222 33445',
    status: 'Fixed',
    notes: 'Smart Cities & Structural engineering focus.'
  },
  {
    id: 'sch-013',
    date: '2026-09-09',
    timeSlot: '12:00 PM - 01:00 PM',
    employeeId: 'usr-7',
    employeeName: 'Aswathy',
    courseKey: 'CIVIL',
    prospectName: 'Rahul Deshmukh',
    prospectPhone: '+91 97333 44556',
    status: 'Conducted',
    notes: 'Referred by L&T campus ambassador.'
  },
  {
    id: 'sch-014',
    date: '2026-09-09',
    timeSlot: '02:00 PM - 03:00 PM',
    employeeId: 'usr-7',
    employeeName: 'Aswathy',
    courseKey: 'CIVIL',
    prospectName: 'Pooja Kulkarni',
    prospectPhone: '+91 97444 55667',
    status: 'Conducted',
    notes: 'Showed 3D structural model lab.'
  },
  {
    id: 'sch-015',
    date: '2026-09-09',
    timeSlot: '03:00 PM - 04:00 PM',
    employeeId: 'usr-7',
    employeeName: 'Aswathy',
    courseKey: 'DM',
    prospectName: 'Megha Sen',
    prospectPhone: '+91 97555 66778',
    status: 'Fixed',
    notes: 'Exploring Digital Marketing for family business.'
  },

  // Dr. Vikram (usr-1)
  {
    id: 'sch-016',
    date: '2026-09-09',
    timeSlot: '11:00 AM - 12:00 PM',
    employeeId: 'usr-1',
    employeeName: 'Dr. Vikram',
    courseKey: 'DM',
    prospectName: 'Sanjay Dutt',
    prospectPhone: '+91 97666 77889',
    status: 'Fixed',
    notes: 'AI tools demo for social media marketing.'
  },
  {
    id: 'sch-017',
    date: '2026-09-09',
    timeSlot: '01:00 PM - 02:00 PM',
    employeeId: 'usr-1',
    employeeName: 'Dr. Vikram',
    courseKey: 'DM',
    prospectName: 'Ritu Kapoor',
    prospectPhone: '+91 97777 88990',
    status: 'Conducted',
    notes: 'Enrolled in 12-month DM master program.'
  },
  {
    id: 'sch-018',
    date: '2026-09-09',
    timeSlot: '04:00 PM - 05:00 PM',
    employeeId: 'usr-1',
    employeeName: 'Dr. Vikram',
    courseKey: 'MERN',
    prospectName: 'Aakash Pillai',
    prospectPhone: '+91 97888 99001',
    status: 'Fixed',
    notes: 'Fullstack inquiry.'
  },

  // --- YESTERDAY: 2026-09-08 ---
  { id: 'sch-020', date: '2026-09-08', timeSlot: '10:00 AM - 11:00 AM', employeeId: 'usr-4', employeeName: 'Gukan', courseKey: 'MECH', prospectName: 'Vikas Roy', prospectPhone: '+91 98001', status: 'Conducted', notes: '' },
  { id: 'sch-021', date: '2026-09-08', timeSlot: '11:00 AM - 12:00 PM', employeeId: 'usr-4', employeeName: 'Gukan', courseKey: 'MECH', prospectName: 'Sunil Jha', prospectPhone: '+91 98002', status: 'Conducted', notes: '' },
  { id: 'sch-021b', date: '2026-09-08', timeSlot: '01:00 PM - 02:00 PM', employeeId: 'usr-4', employeeName: 'Gukan', courseKey: 'MECH', prospectName: 'Amit Shah', prospectPhone: '+91 98009', status: 'Cancelled', notes: '' },
  { id: 'sch-022', date: '2026-09-08', timeSlot: '02:00 PM - 03:00 PM', employeeId: 'usr-5', employeeName: 'Siva', courseKey: 'MERN', prospectName: 'Anita Seth', prospectPhone: '+91 98003', status: 'Conducted', notes: '' },
  { id: 'sch-023', date: '2026-09-08', timeSlot: '03:00 PM - 04:00 PM', employeeId: 'usr-5', employeeName: 'Siva', courseKey: 'MERN', prospectName: 'Mohit Rao', prospectPhone: '+91 98004', status: 'Conducted', notes: '' },
  { id: 'sch-024', date: '2026-09-08', timeSlot: '04:00 PM - 05:00 PM', employeeId: 'usr-6', employeeName: 'Sreya', courseKey: 'CIVIL', prospectName: 'Ravi Teja', prospectPhone: '+91 98005', status: 'Conducted', notes: '' },
  { id: 'sch-025', date: '2026-09-08', timeSlot: '12:00 PM - 01:00 PM', employeeId: 'usr-7', employeeName: 'Aswathy', courseKey: 'CIVIL', prospectName: 'Geeta Dey', prospectPhone: '+91 98006', status: 'Conducted', notes: '' },
  { id: 'sch-026', date: '2026-09-08', timeSlot: '01:00 PM - 02:00 PM', employeeId: 'usr-1', employeeName: 'Dr. Vikram', courseKey: 'DM', prospectName: 'Charu Jain', prospectPhone: '+91 98007', status: 'Conducted', notes: '' },
  { id: 'sch-027', date: '2026-09-08', timeSlot: '05:00 PM - 06:00 PM', employeeId: 'usr-1', employeeName: 'Dr. Vikram', courseKey: 'DM', prospectName: 'Harish Babu', prospectPhone: '+91 98008', status: 'Conducted', notes: '' },

  // --- TOMORROW: 2026-09-10 ---
  { id: 'sch-030', date: '2026-09-10', timeSlot: '10:00 AM - 11:00 AM', employeeId: 'usr-4', employeeName: 'Gukan', courseKey: 'MECH', prospectName: 'Devansh Pandey', prospectPhone: '+91 99001', status: 'Fixed', notes: 'Scheduled' },
  { id: 'sch-031', date: '2026-09-10', timeSlot: '12:00 PM - 01:00 PM', employeeId: 'usr-5', employeeName: 'Siva', courseKey: 'MERN', prospectName: 'Shruti Das', prospectPhone: '+91 99002', status: 'Fixed', notes: 'Scheduled' },
  { id: 'sch-032', date: '2026-09-10', timeSlot: '02:00 PM - 03:00 PM', employeeId: 'usr-6', employeeName: 'Sreya', courseKey: 'CIVIL', prospectName: 'Bhavya Shah', prospectPhone: '+91 99003', status: 'Fixed', notes: 'Scheduled' },
  { id: 'sch-033', date: '2026-09-10', timeSlot: '03:00 PM - 04:00 PM', employeeId: 'usr-7', employeeName: 'Aswathy', courseKey: 'CIVIL', prospectName: 'Manish Tyagi', prospectPhone: '+91 99004', status: 'Fixed', notes: 'Scheduled' },
  { id: 'sch-034', date: '2026-09-10', timeSlot: '04:00 PM - 05:00 PM', employeeId: 'usr-1', employeeName: 'Dr. Vikram', courseKey: 'DM', prospectName: 'Nisha Gupta', prospectPhone: '+91 99005', status: 'Fixed', notes: 'Scheduled' },
  { id: 'sch-035', date: '2026-09-10', timeSlot: '05:00 PM - 06:00 PM', employeeId: 'usr-1', employeeName: 'Dr. Vikram', courseKey: 'MERN', prospectName: 'Rohit Kadam', prospectPhone: '+91 99006', status: 'Fixed', notes: 'Scheduled' }
];
