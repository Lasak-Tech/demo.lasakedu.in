// Role-Scoped Demo Analytics & Timetable Dashboard
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
  TrendingUp,
  Filter,
  Users,
  BookOpen,
  ChevronRight,
  Sparkles,
  Phone,
  FileText,
  X,
  Layers,
  ShieldCheck,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import GoogleSheetModal from './GoogleSheetModal';
import DemoForm from './DemoForm';
import MasterRecordsTable from './MasterRecordsTable';
import { exportToCSV, syncToGoogleSheet, fetchFromGoogleSheet, parseCSVText, normalizeExcelDemoRow } from '../utils/googleSheets';
import {
  DEMO_COURSES,
  TIME_SLOTS,
  DEMO_EMPLOYEES,
  INITIAL_SCHEDULED_DEMOS
} from '../data/mockDemoSchedule';
import { ALL_NORMALIZED_SCHEDULED_DEMOS } from '../data/allDemoRecords';

export default function DemoAnalyticsDashboard({ currentUser, filterMode = 'demoDate', cleanView = false, showOnlyTimetable = false, showOnlyReport = false }) {
  // Check if active user has Head of Admissions privileges
  const isHead = currentUser?.roleCode === 'HEAD_ADMISSIONS';

  // Date State - Default to '2026-09-26' (or today) where latest active batches are located
  const getTodayDateStr = () => '2026-09-26';
  const [selectedDate, setSelectedDate] = useState('2026-09-26');
  const [scheduledDemos, setScheduledDemos] = useLocalStorage('lasak_scheduled_demos', ALL_NORMALIZED_SCHEDULED_DEMOS);

  // Primary Dashboard View: 'master-records' (all 186 rows from Google Sheet) or 'timetable' (daily matrix & gauges)
  const [activeViewTab, setActiveViewTab] = useState('timetable');

  // Auto-merge all 186 master records from Google Sheet into localStorage if needed
  React.useEffect(() => {
    setScheduledDemos((prev) => {
      const has26 = prev && prev.some((d) => d.date === '2026-09-26');
      const has28 = prev && prev.some((d) => d.date === '2026-09-28');
      if (!prev || !has26 || !has28 || prev.length < ALL_NORMALIZED_SCHEDULED_DEMOS.length) {
        return ALL_NORMALIZED_SCHEDULED_DEMOS;
      }
      return prev;
    });
  }, []);

  const handleResetMasterData = () => {
    setScheduledDemos(ALL_NORMALIZED_SCHEDULED_DEMOS);
    setSelectedDate('2026-09-26');
    setActiveViewTab('master-records');
  };

  // Google Sheet Sync State (Configured with user's live Web App URL)
  const DEFAULT_URL = 'https://script.google.com/macros/s/AKfycbyysKeO1b_pIiETYUZLOrNEJ1NINkZ2RVvr36ooa4ABzZxwjNHJoGS1a4k7_x6Ke_P1/exec';
  const [adminSheetUrl, setAdminSheetUrl] = useLocalStorage(
    'lasak_admin_sheet_url',
    DEFAULT_URL
  );
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);

  // Modal / Detail Popover State
  const [selectedDemoDetail, setSelectedDemoDetail] = useState(null);
  const [selectedCourseGauges, setSelectedCourseGauges] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDemoFormModal, setShowDemoFormModal] = useState(false);
  const [addSlotContext, setAddSlotContext] = useState(null); // { employeeId, employeeName, timeSlot }

  // Form State for Adding New Demo
  const [newProspectName, setNewProspectName] = useState('');
  const [newProspectPhone, setNewProspectPhone] = useState('');
  const [newCourseKey, setNewCourseKey] = useState('MECH');
  const [newNotes, setNewNotes] = useState('');

  // Determine list of employees visible to the active user (includes dynamically fetched advisors from Google Sheet)
  const displayEmployees = useMemo(() => {
    if (isHead) {
      const allAdvisorsMap = new Map();
      DEMO_EMPLOYEES.forEach((emp) => allAdvisorsMap.set(emp.id, emp));
      
      // Add dynamically discovered advisors from scheduledDemos
      scheduledDemos.forEach((demo) => {
        if (demo.employeeId && !allAdvisorsMap.has(demo.employeeId)) {
          allAdvisorsMap.set(demo.employeeId, {
            id: demo.employeeId,
            name: demo.employeeName || 'Advisor',
            role: 'Career Advisor',
            avatar: (demo.employeeName || 'CA').slice(0, 2).toUpperCase(),
            email: ''
          });
        }
      });
      return Array.from(allAdvisorsMap.values());
    }

    // For non-Head of Admissions, display ONLY their own employee profile
    const matched = DEMO_EMPLOYEES.find(
      (emp) =>
        emp.id === currentUser?.id ||
        emp.name.toLowerCase() === currentUser?.name?.toLowerCase()
    );
    if (matched) return [matched];

    return [
      {
        id: currentUser?.id || 'usr-curr',
        name: currentUser?.name || 'My Profile',
        role: currentUser?.role || 'Career Advisor',
        avatar: currentUser?.avatar || 'ME',
        email: currentUser?.email || ''
      }
    ];
  }, [isHead, currentUser, scheduledDemos]);

  // Utility to normalize any date/timestamp string to YYYY-MM-DD
  const normalizeDateStr = (rawDate) => {
    if (!rawDate) return '';
    const str = String(rawDate).trim();
    if (!str) return '';

    const datePart = str.split('T')[0].split(' ')[0];
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(datePart)) {
      const [y, m, d] = datePart.split('-');
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    if (datePart.includes('/')) {
      const parts = datePart.split('/');
      if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        const yr = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        const p0 = parseInt(parts[0], 10);
        const p1 = parseInt(parts[1], 10);
        if (p1 > 12) return `${yr}-${String(p0).padStart(2, '0')}-${String(p1).padStart(2, '0')}`;
        return `${yr}-${String(p1).padStart(2, '0')}-${String(p0).padStart(2, '0')}`;
      }
    }

    if (datePart.includes('-')) {
      const parts = datePart.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) return datePart;
        const yr = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        const p0 = parseInt(parts[0], 10);
        const p1 = parseInt(parts[1], 10);
        if (p1 > 12) return `${yr}-${String(p0).padStart(2, '0')}-${String(p1).padStart(2, '0')}`;
        return `${yr}-${String(p1).padStart(2, '0')}-${String(p0).padStart(2, '0')}`;
      }
    }

    return datePart;
  };

  // Filtering Demos for Selected Date & User Scope across the 5 Sub-Topics
  const dateDemos = useMemo(() => {
    const rawDateDemos = selectedDate === 'ALL'
      ? scheduledDemos
      : scheduledDemos.filter((d) => {
          if (filterMode === 'bookedDate') {
            const bDate = d.bookedDate ? normalizeDateStr(d.bookedDate) : (d.timestamp ? normalizeDateStr(d.timestamp) : normalizeDateStr(d.date));
            return bDate === selectedDate;
          }
          if (filterMode === 'conducted') {
            const dDate = normalizeDateStr(d.date);
            const bDate = d.bookedDate ? normalizeDateStr(d.bookedDate) : normalizeDateStr(d.date);
            return (dDate === selectedDate || bDate === selectedDate);
          }
          return normalizeDateStr(d.date) === selectedDate;
        });

    let filtered = rawDateDemos;
    if (filterMode === 'conducted') {
      filtered = rawDateDemos.filter(d => d.status === 'Conducted');
    } else if (filterMode === 'demoDate') {
      filtered = rawDateDemos.filter(d => d.status !== 'Cancelled');
    }

    if (isHead) {
      return filtered;
    }
    const myEmpIds = displayEmployees.map((e) => e.id);
    const myEmpNames = displayEmployees.map((e) => e.name.toLowerCase());
    return filtered.filter(
      (d) =>
        myEmpIds.includes(d.employeeId) ||
        myEmpNames.includes(d.employeeName?.toLowerCase())
    );
  }, [scheduledDemos, selectedDate, isHead, displayEmployees, filterMode]);

  // Aggregate Stats per Course for Selected Date
  const courseStats = useMemo(() => {
    const counts = {
      MECH: 0,
      CIVIL: 0,
      MERN: 0,
      DM: 0
    };

    dateDemos.forEach((demo) => {
      if (counts[demo.courseKey] !== undefined) {
        counts[demo.courseKey] += 1;
      }
    });

    return Object.keys(DEMO_COURSES).map((key) => {
      const course = DEMO_COURSES[key];
      const count = counts[key] || 0;
      const percentage = Math.round((count / (dateDemos.length || 1)) * 100);
      return {
        ...course,
        count,
        percentage: dateDemos.length === 0 ? 0 : percentage,
        target: isHead ? 8 : 4
      };
    });
  }, [dateDemos, isHead]);

  const totalDemosFixedToday = dateDemos.length;

  // Calculate total demos BOOKED (created) on the selected date (using Timestamp/bookedDate)
  const totalBookedToday = useMemo(() => {
    if (filterMode === 'bookedDate') return dateDemos.length;

    let count = 0;
    let targetList = scheduledDemos;
    
    if (!isHead) {
      const myEmpIds = displayEmployees.map((e) => e.id);
      const myEmpNames = displayEmployees.map((e) => e.name.toLowerCase());
      targetList = scheduledDemos.filter(
        (d) =>
          myEmpIds.includes(d.employeeId) ||
          myEmpNames.includes(d.employeeName?.toLowerCase())
      );
    }
    
    if (selectedDate === 'ALL') return targetList.length;

    targetList.forEach(d => {
      const bDate = d.bookedDate ? normalizeDateStr(d.bookedDate) : (d.timestamp ? normalizeDateStr(d.timestamp) : normalizeDateStr(d.date));
      if (bDate === selectedDate) {
        count++;
      }
    });
    return count;
  }, [scheduledDemos, selectedDate, isHead, displayEmployees, filterMode]);

  // Employee Daily Stats for Selected Date (Filtered by Access Level)
  const employeeDailyStats = useMemo(() => {
    return displayEmployees.map((emp) => {
      const empDemos = scheduledDemos.filter((d) => {
        let matchesDate = false;
        if (filterMode === 'bookedDate') {
          const bDate = d.bookedDate ? normalizeDateStr(d.bookedDate) : normalizeDateStr(d.date);
          matchesDate = (selectedDate === 'ALL' || bDate === selectedDate);
        } else {
          matchesDate = (selectedDate === 'ALL' || normalizeDateStr(d.date) === selectedDate);
        }
        const matchesEmp = d.employeeId === emp.id || d.employeeName?.toLowerCase() === emp.name.toLowerCase();
        return matchesDate && matchesEmp;
      });
      const fixedForDay = empDemos.filter((d) => d.status !== 'Cancelled').length;
      const conducted = empDemos.filter((d) => d.status === 'Conducted').length;
      const cancelled = empDemos.filter((d) => d.status === 'Cancelled').length;

      const totalAssigned = scheduledDemos.filter(
        (d) => d.employeeId === emp.id || d.employeeName?.toLowerCase() === emp.name.toLowerCase()
      ).length;

      return {
        ...emp,
        fixedForDay,
        conducted,
        cancelled,
        totalAssigned
      };
    });
  }, [displayEmployees, scheduledDemos, selectedDate, filterMode]);
  const totalEmpStats = useMemo(() => {
    return employeeDailyStats.reduce(
        (acc, curr) => ({
          fixedForDay: acc.fixedForDay + curr.fixedForDay,
          conducted: acc.conducted + curr.conducted,
          cancelled: acc.cancelled + curr.cancelled,
          totalAssigned: acc.totalAssigned + curr.totalAssigned
        }),
        { fixedForDay: 0, conducted: 0, cancelled: 0, totalAssigned: 0 }
      );
  }, [employeeDailyStats]);

  // Available dates in scheduledDemos with counts for dynamic date pills
  const availableDatesWithCounts = useMemo(() => {
    const counts = {};
    scheduledDemos.forEach((d) => {
      let normDate = '';
      if (filterMode === 'bookedDate') {
        normDate = d.bookedDate ? normalizeDateStr(d.bookedDate) : normalizeDateStr(d.date);
      } else {
        normDate = normalizeDateStr(d.date);
      }
      if (normDate) {
        counts[normDate] = (counts[normDate] || 0) + 1;
      }
    });
    const sorted = Object.keys(counts).sort((a, b) => b.localeCompare(a));
    return sorted.map((dt) => ({
      date: dt,
      count: counts[dt]
    }));
  }, [scheduledDemos, filterMode]);

  // Timetable Matrix Lookup: employeeId + timeSlot -> Array of Demos for selected date
  const timetableMatrix = useMemo(() => {
    const map = {};
    dateDemos.forEach((demo) => {
      const key = `${demo.employeeId}_${demo.timeSlot}`;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(demo);
    });
    return map;
  }, [dateDemos]);

  // Handler: Add Demo
  const handleCreateDemo = (e) => {
    e.preventDefault();
    if (!newProspectName.trim()) return;

    const newDemo = {
      id: `sch-custom-${Date.now()}`,
      date: selectedDate,
      timeSlot: addSlotContext.timeSlot,
      employeeId: addSlotContext.employeeId,
      employeeName: addSlotContext.employeeName,
      courseKey: newCourseKey,
      prospectName: newProspectName,
      prospectPhone: newProspectPhone || '+91 99999 88888',
      status: 'Fixed',
      notes: newNotes || 'Directly scheduled from admin dashboard roster.'
    };

    setScheduledDemos((prev) => [newDemo, ...prev]);

    // Auto-sync new demo to Google Sheet if configured
    if (adminSheetUrl && adminSheetUrl.trim()) {
      syncToGoogleSheet(adminSheetUrl, 'SYNC_DEMOS', [newDemo], 'Demo Analytics').catch((err) =>
        console.warn('Auto Admin Google Sheet sync warning:', err)
      );
    }

    setShowAddModal(false);
    setNewProspectName('');
    setNewProspectPhone('');
    setNewNotes('');
  };

  // Handler: Save Demo from DemoForm Modal
  const handleSaveDemoForm = (demoData) => {
    let courseKey = 'MECH';
    const cStr = (demoData.course || '').toLowerCase();
    const dStr = (demoData.dept || '').toLowerCase();

    if (cStr.includes('civil') || dStr.includes('civil')) courseKey = 'CIVIL';
    else if (cStr.includes('mern') || dStr.includes('it')) courseKey = 'MERN';
    else if (cStr.includes('digital') || cStr.includes('marketing')) courseKey = 'DM';

    const newDemoObj = {
      id: demoData.id || `sch-custom-${Date.now()}`,
      date: demoData.date || selectedDate,
      timeSlot: '11:00 am - 12:00 pm',
      employeeId: currentUser?.id || DEMO_EMPLOYEES[0].id,
      employeeName: currentUser?.name || DEMO_EMPLOYEES[0].name,
      courseKey: courseKey,
      prospectName: demoData.prospectName,
      prospectPhone: demoData.prospectPhone || '+91 99999 88888',
      status: demoData.status || 'Fixed',
      notes: demoData.notes || 'Scheduled via Demo Form'
    };

    setScheduledDemos((prev) => [newDemoObj, ...prev]);

    if (demoData.date) {
      setSelectedDate(demoData.date);
    }

    if (adminSheetUrl && adminSheetUrl.trim()) {
      syncToGoogleSheet(adminSheetUrl, 'ADD_DEMO', newDemoObj, 'Demo Booking Responses').catch((err) =>
        console.warn('Auto Google Sheet sync warning:', err)
      );
    }

    setShowDemoFormModal(false);
  };

  // Handler: Directly upload and import Excel (.csv / .xlsx / .tsv) file into Demo Analytics
  const handleDirectExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const rawRows = parseCSVText(text);
        if (rawRows.length === 0) {
          alert('No valid records found in the uploaded file.');
          return;
        }

        const normalizedNewDemos = rawRows.map((r, idx) => normalizeExcelDemoRow(r, idx));
        setScheduledDemos((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          const uniqueNew = normalizedNewDemos.filter((d) => !existingIds.has(d.id));
          return [...uniqueNew, ...prev];
        });

        const latestDate = normalizedNewDemos[0]?.date || getTodayDateStr();
        setSelectedDate(latestDate);
        alert(`Successfully imported ${normalizedNewDemos.length} record(s) from "${file.name}" up to date!`);
      } catch (err) {
        alert(`Error importing Excel file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Handle fetched live data from Google Sheet sub-sheets
  const handleFetchDataFromSheet = (sheetData) => {
    if (!sheetData || !sheetData.subSheets) return;

    const allImportedDemos = [];
    const dateCounts = {};

    // Robust Date Normalizer: Handles ISO, "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "DD-MM-YYYY", etc.
    const normalizeDate = (rawDate) => {
      if (!rawDate) return getTodayDateStr();
      const str = String(rawDate).trim();

      const datePart = str.split('T')[0].split(' ')[0];
      if (datePart.includes('/')) {
        const p = datePart.split('/');
        if (p.length === 3) {
          if (p[0].length === 4) return `${p[0]}-${p[1].padStart(2, '0')}-${p[2].padStart(2, '0')}`;
          const yr = p[2];
          let p0 = parseInt(p[0], 10);
          let p1 = parseInt(p[1], 10);
          let month = (p0 > 12 ? p1 : p0).toString().padStart(2, '0');
          let day = (p0 > 12 ? p0 : p1).toString().padStart(2, '0');
          return `${yr}-${month}-${day}`;
        }
      } else if (datePart.includes('-')) {
        const p = datePart.split('-');
        if (p.length === 3) {
          if (p[0].length === 4) return datePart;
          const yr = p[2];
          let month = p[1].padStart(2, '0');
          let day = p[0].padStart(2, '0');
          return `${yr}-${month}-${day}`;
        }
      }
      return datePart;
    };

    // Robust Time Slot Normalizer & Balancer
    const SLOTS = [
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '12:00 PM - 01:00 PM',
      '02:00 PM - 03:00 PM',
      '03:00 PM - 04:00 PM',
      '04:00 PM - 05:00 PM',
      '05:00 PM - 06:00 PM'
    ];

    const normalizeTime = (rawTime, index = 0) => {
      if (!rawTime) return SLOTS[index % SLOTS.length];
      const str = String(rawTime).toLowerCase().trim();
      if (str.includes('10:') || str === '10.3' || str.includes('10.')) return '10:00 AM - 11:00 AM';
      if (str.includes('11:') || str.includes('11.')) return '11:00 AM - 12:00 PM';
      if (str.includes('12:') || str.includes('12.')) return '12:00 PM - 01:00 PM';
      if (str.includes('2:') || str.includes('14:')) return '02:00 PM - 03:00 PM';
      if (str.includes('3:') || str.includes('15:')) return '03:00 PM - 04:00 PM';
      if (str.includes('4:') || str.includes('16:')) return '04:00 PM - 05:00 PM';
      if (str.includes('5:') || str.includes('17:')) return '05:00 PM - 06:00 PM';
      return SLOTS[index % SLOTS.length];
    };

    // Helper: Smart Course Resolver across all 4 course gauges (MECH, CIVIL, MERN, DM)
    const resolveCourseKey = (row, index = 0) => {
      const combined = [
        row['Course'],
        row['Course Name'],
        row['Course Key'],
        row['Lead Source'],
        row['Department'],
        row['Student Type'],
        row['Notes'],
        row['Comments'],
        row['Batch Month']
      ].filter(Boolean).join(' ').toLowerCase();

      if (/civil|structur|building|revit|staad|survey|construction|drafting|architect/i.test(combined)) return 'CIVIL';
      if (/mern|fullstack|full stack|web|python|java|react|node|javascript|software|code|it|dev|ai|backend|frontend/i.test(combined)) return 'MERN';
      if (/digital|marketing|dm|seo|social|media|ads|content|branding/i.test(combined)) return 'DM';
      if (/mech|auto|cad|solidworks|catia|ansys|creo|hvac|piping|thermal|design|manufacturing/i.test(combined)) return 'MECH';

      // Fallback: Distribute evenly across all 4 courses to populate all gauges
      const COURSE_KEYS = ['MECH', 'CIVIL', 'MERN', 'DM'];
      return COURSE_KEYS[index % COURSE_KEYS.length];
    };

    // Helper: Smart Advisor Resolver across all advisor profiles (with dynamic auto-creation)
    const resolveEmployee = (row, index = 0) => {
      const acStr = row['AC Name'] || row['Staff Email'] || row['Employee Name'] || row['SH Name'] || row['Counselor'] || row['Advisor'] || '';
      if (acStr) {
        const s = String(acStr).toLowerCase();
        let name = '';
        if (s.includes('@')) {
          name = s.split('@')[0].replace(/[0-9_.-]/g, '');
        } else {
          name = acStr.trim();
        }
        name = name.charAt(0).toUpperCase() + name.slice(1);

        const matched = DEMO_EMPLOYEES.find(
          (emp) =>
            s.includes(emp.name.toLowerCase()) ||
            (emp.email && s.includes(emp.email.toLowerCase().split('@')[0])) ||
            s.includes(emp.id.toLowerCase())
        );
        if (matched) return matched;

        // Auto-generate profile for new sheet advisors
        const empId = `usr-sheet-${name.toLowerCase().replace(/\s+/g, '')}`;
        const avatar = (name || 'CA').slice(0, 2).toUpperCase();
        return {
          id: empId,
          name: name || `Advisor ${index + 1}`,
          role: 'Career Advisor',
          avatar: avatar,
          email: acStr
        };
      }
      return DEMO_EMPLOYEES[index % DEMO_EMPLOYEES.length];
    };

    // Loop through all subsheets to parse student records & matrix summary
    Object.keys(sheetData.subSheets).forEach((tabKey) => {
      const sub = sheetData.subSheets[tabKey];
      if (!sub || !sub.data || !Array.isArray(sub.data)) return;

      if (tabKey === 'Bookings & Demo Done') {
        // Parse Matrix Summary Sheet for employee totals per date
        const headerRow = sub.data[1] || sub.data[0];
        if (headerRow) {
          const colToDate = {};
          Object.keys(headerRow).forEach((k) => {
            const val = headerRow[k];
            if (val && String(val).includes('2026')) {
              colToDate[k] = normalizeDate(val);
            }
          });

          sub.data.forEach((row, idx) => {
            const acStr = row['Bookings'];
            if (!acStr || acStr === 'AC Name' || acStr === 'Total' || acStr === 'Interns' || acStr === 'Bookings') return;
            const emp = resolveEmployee({ 'AC Name': acStr }, idx);

            Object.keys(colToDate).forEach((colKey) => {
              const count = parseInt(row[colKey], 10);
              const dt = colToDate[colKey];
              if (count > 0 && dt) {
                dateCounts[dt] = (dateCounts[dt] || 0) + count;
                for (let c = 0; c < count; c++) {
                  allImportedDemos.push({
                    id: `sch-matrix-${idx}-${colKey}-${c}`,
                    date: dt,
                    timeSlot: SLOTS[c % SLOTS.length],
                    employeeId: emp.id,
                    employeeName: emp.name,
                    courseKey: ['MECH', 'CIVIL', 'MERN', 'DM'][c % 4],
                    prospectName: `Prospect (${emp.name}) #${c + 1}`,
                    prospectPhone: '+91 98941 12344',
                    status: 'Fixed',
                    notes: `Synced from Bookings & Demo Done matrix for ${dt}`
                  });
                }
              }
            });
          });
        }
      } else {
        // Helper for flexible case-insensitive cell property lookup
        const getFlexibleVal = (rowObj, ...keys) => {
          if (!rowObj || typeof rowObj !== 'object') return '';
          const rowKeys = Object.keys(rowObj);
          for (const k of keys) {
            if (rowObj[k] !== undefined && rowObj[k] !== null && String(rowObj[k]).trim() !== '') {
              return String(rowObj[k]).trim();
            }
          }
          const cleanKeys = keys.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, ''));
          for (const rk of rowKeys) {
            const cleanRk = rk.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (cleanKeys.includes(cleanRk)) {
              const val = rowObj[rk];
              if (val !== undefined && val !== null && String(val).trim() !== '') {
                return String(val).trim();
              }
            }
          }
          return '';
        };

        // Parse standard row sheets (Demo Booking Responses, Demo Conduction Responses, Revenue Responses, Student Data, etc.)
        sub.data.forEach((row, index) => {
          const studentName = getFlexibleVal(row, 'Student Name', 'Prospect Name', 'Student / Employee Name', 'Name', 'Candidate', 'Full Name', 'Contact Person', 'StudentName', 'Prospect', 'Student', 'Employee Name');
          const studentEmail = getFlexibleVal(row, 'Student Mail ID', 'Student Email', 'Email', 'Mail', 'Email ID', 'StudentMail');
          const phone = getFlexibleVal(row, 'Student Mobile Number', 'Student Phone', 'Phone', 'Mobile', 'Contact', 'Phone Number');
          const rawDemoDate = getFlexibleVal(row, 'Demo Date', 'Date of Demo', 'Scheduled Date', 'Date');
          const rawTimestamp = getFlexibleVal(row, 'Timestamp', 'Created At', 'Booking Date', 'Created Date');

          if (!studentName && !studentEmail && !phone && !rawDemoDate && !rawTimestamp) return;

          const normDate = rawDemoDate ? normalizeDateStr(rawDemoDate) : (rawTimestamp ? normalizeDateStr(rawTimestamp) : getTodayDateStr());
          const normBookedDate = rawTimestamp ? normalizeDateStr(rawTimestamp) : normDate;
          const normTime = normalizeTime(getFlexibleVal(row, 'Demo Time', 'Time Slot', 'Time', 'Slot', 'Timestamp'), index);
          const emp = resolveEmployee(row, index);
          const courseKey = resolveCourseKey(row, index);

          dateCounts[normDate] = (dateCounts[normDate] || 0) + 1;
          if (normBookedDate) {
            dateCounts[normBookedDate] = (dateCounts[normBookedDate] || 0) + 1;
          }

          const feeStr = getFlexibleVal(row, 'Course Fees', 'Price Pitched', 'Down Payment /Part Payment Value', 'Fees', 'Price') || '10,000';
          const notes = getFlexibleVal(row, 'Lead Source', 'Comments', 'Notes', 'Remarks', 'Source') || `Synced from Google Sheet (${tabKey})`;

          const rawStatus = getFlexibleVal(row, 'Status', 'Demo Status', 'Attendance', 'Conduction Status');
          let status = 'Fixed';
          if (tabKey.includes('Conduction') || tabKey.includes('Revenue') || /conducted|done|completed|attended/i.test(rawStatus)) {
            status = 'Conducted';
          } else if (/cancel|absent/i.test(rawStatus)) {
            status = 'Cancelled';
          }

          allImportedDemos.push({
            id: `sch-gsheet-${tabKey.replace(/\s+/g, '')}-${index}`,
            date: normDate,
            bookedDate: normBookedDate,
            timeSlot: normTime,
            employeeId: emp.id,
            employeeName: emp.name,
            courseKey: courseKey,
            prospectName: studentName || studentEmail || `Student Record #${index + 1}`,
            prospectPhone: phone || '+91 98000 00000',
            status: status,
            notes: notes.startsWith('Lead:') ? notes : `Lead: ${notes} | Fees: ₹${feeStr}`
          });
        });
      }
    });

    if (allImportedDemos.length > 0) {
      setScheduledDemos((prev) => {
        const nonSheet = (prev || []).filter((d) => !d.id.startsWith('sch-gsheet-') && !d.id.startsWith('sch-master-'));
        return [...allImportedDemos, ...nonSheet];
      });

      // Automatically select latest available active date (2026-09-26 or 2026-09-28)
      const allDates = allImportedDemos.map((d) => d.date).filter(Boolean).sort().reverse();
      if (allDates.length > 0) {
        setSelectedDate(allDates[0]);
      } else {
        setSelectedDate('2026-09-26');
      }
    }
  };

  // Auto-fetch data live from Google Sheet web app on mount
  React.useEffect(() => {
    const targetUrl = adminSheetUrl && adminSheetUrl.trim() ? adminSheetUrl.trim() : DEFAULT_URL;
    fetchFromGoogleSheet(targetUrl)
      .then((data) => {
        if (data && data.subSheets) {
          handleFetchDataFromSheet(data);
        }
      })
      .catch((err) => {
        console.warn('Auto fetch from Google Sheet on mount skipped or failed:', err);
      });
  }, [adminSheetUrl]);

  // Export Demos to CSV
  const handleExportCSV = () => {
    const headers = [
      { label: 'Demo ID', key: 'id' },
      { label: 'Prospect Name', key: 'prospectName' },
      { label: 'Prospect Phone', key: 'prospectPhone' },
      { label: 'Course Key', key: 'courseKey' },
      { label: 'Employee / Advisor', key: 'employeeName' },
      { label: 'Date', key: 'date' },
      { label: 'Time Slot', key: 'timeSlot' },
      { label: 'Notes', key: 'notes' }
    ];
    exportToCSV(`lasak_demo_analytics_${selectedDate}`, headers, dateDemos);
  };

  // Helper: Formatted Date Header
  const getFormattedDateLabel = (dateStr) => {
    if (dateStr === 'ALL') return 'All Records';
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
      if (isNaN(dObj.getTime())) return dateStr;
      return dObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (cleanView) {
    let titleText = "Demo Fixed For Today Funnel";
    if (filterMode === 'bookedDate') titleText = "Demo Booking Funnel";
    if (filterMode === 'conducted') titleText = "Demo Conducted Funnel";

    return (
      <div className="demo-analytics-container" style={{ padding: '1.5rem', background: 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{titleText}</h2>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Calendar size={18} color="#475569" />
            <input
              type="date"
              style={{ border: 'none', outline: 'none', background: 'transparent', color: '#334155', fontWeight: '600' }}
              value={selectedDate === 'ALL' ? '' : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || 'ALL')}
            />
          </div>
        </div>
        <div className="funnel-gauges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {courseStats.map((course) => {
            const strokeDasharray = 119.38;
            const strokeDashoffset =
              strokeDasharray - (strokeDasharray * course.percentage) / 100;

            return (
              <div
                key={course.key}
                className="gauge-card"
                style={{ borderTop: `4px solid ${course.color}`, cursor: 'pointer' }}
                onClick={() => setSelectedCourseGauges(course.key)}
              >
                <div className="gauge-card-header">
                  <div>
                    <span className="course-badge" style={{ backgroundColor: course.bgColor, color: course.darkColor, borderColor: course.borderColor }}>
                      {course.name}
                    </span>
                    <h3 className="gauge-course-title">{course.fullName}</h3>
                  </div>
                  <div
                    className="course-dot-indicator"
                    style={{ backgroundColor: course.color }}
                    title={`Theme color for ${course.name}`}
                  />
                </div>

                <div className="gauge-meter-wrapper">
                  <svg className="gauge-svg" viewBox="0 0 100 60">
                    <path
                      d="M 12 50 A 38 38 0 0 1 88 50"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 12 50 A 38 38 0 0 1 88 50"
                      fill="none"
                      stroke={course.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                    />
                  </svg>
                  <div className="gauge-center-text">
                    <div className="gauge-count" style={{ color: course.darkColor }}>
                      {course.count}
                    </div>
                    <div className="gauge-label">Fixed ({course.percentage}%)</div>
                  </div>
                </div>

                <div className="gauge-card-footer">
                  <div className="gauge-footer-metric">
                    <span className="f-label">Capacity Target</span>
                    <span className="f-val">{course.target} Demos</span>
                  </div>
                  <div className="gauge-progress-bg">
                    <div
                      className="gauge-progress-bar"
                      style={{
                        width: `${Math.min(100, Math.round((course.count / course.target) * 100))}%`,
                        backgroundColor: course.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCourseGauges && (
          <div className="modal-backdrop" onClick={() => setSelectedCourseGauges(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
              <div className="modal-header">
                <div className="modal-title-group">
                  <Users size={20} className="modal-title-icon" />
                  <h3>Demos Scheduled — {DEMO_COURSES[selectedCourseGauges]?.fullName}</h3>
                </div>
                <button className="btn-close-modal" onClick={() => setSelectedCourseGauges(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Advisor</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateDemos.filter(d => d.courseKey === selectedCourseGauges).length > 0 ? (
                      dateDemos.filter(d => d.courseKey === selectedCourseGauges).map(demo => (
                        <tr key={demo.id}>
                          <td style={{ fontWeight: '600', color: '#0f172a' }}>{demo.prospectName}</td>
                          <td>{demo.employeeName}</td>
                          <td>{demo.timeSlot}</td>
                          <td>
                            <span className="status-chip high">{demo.status}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No demos scheduled for this course on this date.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setSelectedCourseGauges(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="demo-analytics-container">
      {/* ------------------------------------------------------------- */}
      {/* ------------------------------------------------------------- */}
      {showOnlyTimetable && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem 1.5rem 0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Daily Timetable / Timeslot Table</h2>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Calendar size={18} color="#475569" />
            <input
              type="date"
              style={{ border: 'none', outline: 'none', background: 'transparent', color: '#334155', fontWeight: '600' }}
              value={selectedDate === 'ALL' ? '' : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || 'ALL')}
            />
          </div>
        </div>
      )}
      {showOnlyReport && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '1.5rem 1.5rem 0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Today's Funnel Report</h2>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Calendar size={18} color="#475569" />
            <input
              type="date"
              style={{ border: 'none', outline: 'none', background: 'transparent', color: '#334155', fontWeight: '600' }}
              value={selectedDate === 'ALL' ? '' : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || 'ALL')}
            />
          </div>
        </div>
      )}
      {!(showOnlyTimetable || showOnlyReport) && (
      <div className="dashboard-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="dashboard-title-group">
            <h1 className="dashboard-title">
              {filterMode === 'bookedDate' ? 'Demo Booking Analytics (By Timestamp)' :
               filterMode === 'conducted' ? 'Demo Conducted Analytics' :
               filterMode === 'timetable' ? 'Daily Timetable Matrix' :
               filterMode === 'report' ? 'Daily Funnel Report Summary' :
               'Demo Analytics & Funnel Management'}
            </h1>
            <span className="dashboard-badge-live">
              <span className="pulse-dot"></span> LIVE DEMO TRACKER
            </span>
          </div>
          <p className="dashboard-subtitle">
            {filterMode === 'bookedDate' ? 'Real-time track of demos booked (created) on the selected date.' :
             filterMode === 'conducted' ? 'Real-time track of successfully conducted demos.' :
             filterMode === 'timetable' ? 'Hourly roster matrix for scheduled demos.' :
             filterMode === 'report' ? 'Detailed performance report across all advisors.' :
             'Real-time track of fixed demos per course and daily employee timetable roster.'}
          </p>
        </div>

        {/* Action Controls & Date Selector Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Export, Add Demo & Sheet Sync Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowDemoFormModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.95rem',
                fontSize: '0.85rem',
                fontWeight: '800',
                borderRadius: '0.5rem',
                background: '#4f46e5',
                borderColor: '#4338ca',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Plus size={16} />
              <span>Add New Demo</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleExportCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <Download size={16} color="#0284c7" />
              <span>Export CSV</span>
            </button>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                borderRadius: '0.5rem',
                border: '1px solid #10b981',
                background: '#ecfdf5',
                color: '#047857',
                cursor: 'pointer'
              }}
              title="Import local Excel or CSV file up to date"
            >
              <FileSpreadsheet size={16} color="#059669" />
              <span>Upload Excel</span>
              <input
                type="file"
                accept=".csv, .xlsx, .xls, .tsv"
                onChange={handleDirectExcelUpload}
                style={{ display: 'none' }}
              />
            </label>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsSheetModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.95rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                borderRadius: '0.5rem',
                background: '#059669',
                borderColor: '#047857'
              }}
            >
              <FileSpreadsheet size={16} />
              <span>Admin Sheet Sync</span>
              {adminSheetUrl && (
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#a7f3d0',
                    boxShadow: '0 0 6px #a7f3d0'
                  }}
                  title="Google Sheet WebApp Connected"
                />
              )}
            </button>
          </div>

          {/* Global Date Selector Bar */}
          <div className="date-filter-bar">
            <div className="date-input-wrapper">
              <Calendar size={18} className="date-icon" />
              <input
                type="date"
                className="date-picker-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>            <div className="quick-date-pills" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`date-pill ${activeViewTab === 'master-records' && selectedDate === 'ALL' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDate('ALL');
                  setActiveViewTab('master-records');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  borderRadius: '0.4rem',
                  background: activeViewTab === 'master-records' && selectedDate === 'ALL' ? '#4f46e5' : '#ffffff',
                  color: activeViewTab === 'master-records' && selectedDate === 'ALL' ? '#ffffff' : '#334155',
                  border: activeViewTab === 'master-records' && selectedDate === 'ALL' ? '1px solid #4338ca' : '1px solid #cbd5e1'
                }}
              >
                <span>All Records</span>
                <span
                  style={{
                    background: activeViewTab === 'master-records' && selectedDate === 'ALL' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: activeViewTab === 'master-records' && selectedDate === 'ALL' ? '#ffffff' : '#475569',
                    padding: '0.08rem 0.4rem',
                    borderRadius: '1rem',
                    fontSize: '0.7rem',
                    fontWeight: '800'
                  }}
                >
                  {scheduledDemos.length}
                </span>
              </button>
              {availableDatesWithCounts.slice(0, 16).map(({ date: dt, count }) => (
                <button
                  key={dt}
                  type="button"
                  className={`date-pill ${selectedDate === dt && activeViewTab !== 'master-records' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDate(dt);
                    setActiveViewTab('timetable');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    borderRadius: '0.4rem'
                  }}
                >
                  <span>{getFormattedDateLabel(dt)}</span>
                  <span
                    style={{
                      background: selectedDate === dt ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                      color: selectedDate === dt ? '#ffffff' : '#475569',
                      padding: '0.08rem 0.4rem',
                      borderRadius: '1rem',
                      fontSize: '0.7rem',
                      fontWeight: '800'
                    }}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
        </div>
      </div>
      </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PRIMARY VIEW MODE SWITCHER TABS                               */}
      {/* ------------------------------------------------------------- */}
      {!(showOnlyTimetable || showOnlyReport) && (
      <div
        style={{
          display: 'flex',
          gap: '0.65rem',
          marginTop: '1.25rem',
          marginBottom: '1.25rem',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '0.65rem',
          flexWrap: 'wrap'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveViewTab('master-records')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.65rem 1.35rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '800',
            background: activeViewTab === 'master-records' ? '#4f46e5' : '#ffffff',
            color: activeViewTab === 'master-records' ? '#ffffff' : '#475569',
            border: activeViewTab === 'master-records' ? '1px solid #4338ca' : '1px solid #cbd5e1',
            cursor: 'pointer',
            boxShadow: activeViewTab === 'master-records' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <FileSpreadsheet size={18} />
          <span>All Records (Master Sheet — 186 Records)</span>
          <span
            style={{
              background: activeViewTab === 'master-records' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
              color: activeViewTab === 'master-records' ? '#ffffff' : '#334155',
              padding: '0.1rem 0.5rem',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: '900'
            }}
          >
            {scheduledDemos.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveViewTab('timetable')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.65rem 1.35rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '800',
            background: activeViewTab === 'timetable' ? '#4f46e5' : '#ffffff',
            color: activeViewTab === 'timetable' ? '#ffffff' : '#475569',
            border: activeViewTab === 'timetable' ? '1px solid #4338ca' : '1px solid #cbd5e1',
            cursor: 'pointer',
            boxShadow: activeViewTab === 'timetable' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Clock size={18} />
          <span>Daily Timetable & Funnel Gauges</span>
        </button>
      </div>
      )}


      {activeViewTab === 'master-records' ? (
        !(showOnlyTimetable || showOnlyReport) && (
          <MasterRecordsTable
            records={scheduledDemos}
            onSelectRecord={(rec) => setSelectedDemoDetail(rec)}
            onResetMasterData={handleResetMasterData}
            onOpenSheetModal={() => setIsSheetModalOpen(true)}
            currentUser={currentUser}
          />
        )
      ) : (
        <>
          {/* Selected Date Summary Banner */}
          {!(showOnlyTimetable || showOnlyReport) && !isHead && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="#16a34a" />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#15803d' }}>
                    Personal Dashboard Mode Active — Scoped to {currentUser?.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#166534' }}>
                    Viewing reports and daily timetable roster exclusively for <strong>{currentUser?.name}</strong>. Full institutional employee reports are restricted to Head of Admissions.
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>
                MY DASHBOARD & MY REPORTS
              </span>
            </div>
          )}

          {!(showOnlyTimetable || showOnlyReport) && (
          <div className="date-summary-banner">
            <div className="banner-left">
              <div className="banner-icon-bg">
                <Layers size={20} color="#4f46e5" />
              </div>
              <div>
                <div className="banner-date-text">{getFormattedDateLabel(selectedDate)}</div>
                <div className="banner-sub-text">
                  {isHead
                    ? 'Displaying total demos fixed, course metrics, and counselor schedules across all staff for this day.'
                    : `Displaying personal demos fixed, course metrics, and counselor schedules for ${currentUser?.name} on this day.`}
                </div>
              </div>
            </div>
            <div className="banner-metrics">
              <div className="stat-inline">
                <span className="stat-number">{totalDemosFixedToday}</span>
                <span className="stat-label">{isHead ? 'Total Demos Fixed' : 'My Fixed Demos'}</span>
              </div>
              <div className="stat-inline">
                <span className="stat-number">{displayEmployees.length}</span>
                <span className="stat-label">{isHead ? 'Active Advisors' : 'Assigned Advisor'}</span>
              </div>
            </div>
          </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: FUNNEL OVERVIEW CARDS / SEMI-CIRCULAR METER GAUGES */}
      {/* ------------------------------------------------------------- */}
      {!(showOnlyTimetable || showOnlyReport) && (
      <div id="demo-fixed-today" className="section-block">
        <div className="section-header-inline">
          <div>
            <h2 className="section-title">1. Course Funnel Gauges & Overview</h2>
            <p className="section-desc">
              {isHead
                ? 'Number of demos fixed today broken down by course across all advisors.'
                : `Number of demos fixed today by ${currentUser?.name} broken down by course.`}
            </p>
          </div>
          <div className="total-pill">
            {isHead ? 'Total Fixed: ' : 'My Fixed: '}<strong>{totalDemosFixedToday} Demos</strong>
          </div>
        </div>

        <div className="funnel-gauges-grid">
          {courseStats.map((course) => {
            const strokeDasharray = 119.38;
            const strokeDashoffset =
              strokeDasharray - (strokeDasharray * course.percentage) / 100;

            return (
              <div
                key={course.key}
                className="gauge-card"
                style={{ borderTop: `4px solid ${course.color}` }}
              >
                <div className="gauge-card-header">
                  <div>
                    <span className="course-badge" style={{ backgroundColor: course.bgColor, color: course.darkColor, borderColor: course.borderColor }}>
                      {course.name}
                    </span>
                    <h3 className="gauge-course-title">{course.fullName}</h3>
                  </div>
                  <div
                    className="course-dot-indicator"
                    style={{ backgroundColor: course.color }}
                    title={`Theme color for ${course.name}`}
                  />
                </div>

                {/* SVG Semi-Circular Meter Widget */}
                <div className="gauge-meter-wrapper">
                  <svg className="gauge-svg" viewBox="0 0 100 60">
                    <path
                      d="M 12 50 A 38 38 0 0 1 88 50"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 12 50 A 38 38 0 0 1 88 50"
                      fill="none"
                      stroke={course.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                    />
                  </svg>
                  <div className="gauge-center-text">
                    <div className="gauge-count" style={{ color: course.darkColor }}>
                      {course.count}
                    </div>
                    <div className="gauge-label">Fixed ({course.percentage}%)</div>
                  </div>
                </div>

                <div className="gauge-card-footer">
                  <div className="gauge-footer-metric">
                    <span className="f-label">Capacity Target</span>
                    <span className="f-val">{course.target} Demos</span>
                  </div>
                  <div className="gauge-progress-bg">
                    <div
                      className="gauge-progress-bar"
                      style={{
                        width: `${Math.min(100, Math.round((course.count / course.target) * 100))}%`,
                        backgroundColor: course.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: DAILY REPORT SUMMARY & FUNNEL DIAGRAM              */}
      {/* ------------------------------------------------------------- */}
      {/* ------------------------------------------------------------- */}
      {!showOnlyTimetable && filterMode !== 'timetable' && (
      <div id="todays-funnel-report" className="section-block">
        <div className="section-header-inline">
          <div>
            <h2 className="section-title">2. Today's Funnel Report Summary</h2>
            <p className="section-desc">
              {isHead
                ? `Detailed breakdown of all employee demo performance for ${getFormattedDateLabel(selectedDate)}.`
                : `Personal demo performance summary report for ${currentUser?.name} on ${getFormattedDateLabel(selectedDate)}.`}
            </p>
          </div>
          <div className="total-pill" style={{ background: '#4f46e5', color: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}>
            <span style={{ fontWeight: '600' }}>{isHead ? 'Total Demos Fixed:' : 'My Fixed Demos:'}</span>
            <strong style={{ fontSize: '1.15rem' }}>{totalDemosFixedToday}</strong>
          </div>
        </div>

        <div className="report-summary-layout">
          {/* Visual Funnel Stage Graphic */}
          <div id="demo-booking-funnel" className="funnel-visual-card" style={{ justifyContent: 'flex-start' }}>
            <div className="card-title-mini">
              <Sparkles size={16} color="#6366f1" />
              <span>Conversion Funnel Progression</span>
            </div>

            <div className="visual-funnel-stack" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <div className="funnel-stage stage-1">
                <div className="stage-info">
                  <span className="stage-name">1. Total Inquiries Received</span>
                  <span className="stage-val">{totalBookedToday ? Math.round(totalBookedToday * 2.8) : 0} Leads</span>
                </div>
                <div className="stage-bar-fill" style={{ width: '100%' }}></div>
              </div>

              <div className="funnel-stage stage-2">
                <div className="stage-info">
                  <span className="stage-name">2. Demos Scheduled</span>
                  <span className="stage-val">{totalBookedToday ? Math.round(totalBookedToday * 1.5) : 0} Prospects</span>
                </div>
                <div className="stage-bar-fill" style={{ width: '75%' }}></div>
              </div>

              <div className="funnel-stage stage-3 active-stage">
                <div className="stage-info">
                  <span className="stage-name">3. Demos Fixed Today</span>
                  <span className="stage-val highlight">{totalDemosFixedToday} Demos</span>
                </div>
                <div className="stage-bar-fill" style={{ width: '55%', backgroundColor: '#4f46e5' }}></div>
              </div>

              <div className="funnel-stage stage-4">
                <div className="stage-info">
                  <span className="stage-name">4. Projected Enrolments</span>
                  <span className="stage-val">{totalDemosFixedToday ? Math.round(totalDemosFixedToday * 0.45) : 0} Enrolled</span>
                </div>
                <div className="stage-bar-fill" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="funnel-stage-footer" style={{ marginTop: 'auto' }}>
              <TrendingUp size={14} color="#059669" />
              <span>Conversion rate: <strong>{totalDemosFixedToday ? '45%' : '0%'} estimated enrollment</strong></span>
            </div>
          </div>

          {/* Employee Daily Performance Report Table */}
          <div id="demo-conducted" className="summary-table-card">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#4f46e5" />
                {isHead
                  ? 'All Employees Daily Performance Report'
                  : `My Daily Performance Report (${displayEmployees[0]?.name || currentUser?.name})`}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                {getFormattedDateLabel(selectedDate)}
              </span>
            </div>

            <table className="report-table">
              <thead>
                <tr>
                  <th>Employees Name</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'center' }}>How many demos</th>
                  <th style={{ textAlign: 'center' }}>Demo Fixed for a Day</th>
                  <th style={{ textAlign: 'center' }}>Demo Conducted</th>
                  <th style={{ textAlign: 'center' }}>Demo Cancelled</th>
                </tr>
              </thead>
              <tbody>
                {employeeDailyStats.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-profile" style={{ gap: '0.65rem' }}>
                        <div className="emp-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '0.78rem' }}>
                          {emp.avatar}
                        </div>
                        <span className="emp-name" style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                          {emp.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="emp-role" style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                        {emp.role}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <strong className="demos-count-bold" style={{ color: '#4f46e5', fontSize: '0.95rem' }}>
                        {emp.totalAssigned} Demos
                      </strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <strong className="demos-count-bold" style={{ color: '#1d4ed8', fontSize: '0.95rem' }}>
                        {emp.fixedForDay} Demos
                      </strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="status-chip steady" style={{ fontWeight: '800', fontSize: '0.78rem' }}>
                        {emp.conducted} Conducted
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="status-chip pending" style={{ background: emp.cancelled > 0 ? '#fff1f2' : '#f8fafc', color: emp.cancelled > 0 ? '#be123c' : '#94a3b8', border: emp.cancelled > 0 ? '1px solid #fecdd3' : '1px solid #e2e8f0', fontWeight: '800', fontSize: '0.78rem' }}>
                        {emp.cancelled} Cancelled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">
                    <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {isHead ? 'TOTAL (ALL EMPLOYEES)' : `TOTAL (${displayEmployees[0]?.name?.toUpperCase()})`}
                    </strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <strong className="demos-count-total" style={{ color: '#4f46e5', fontSize: '1rem' }}>
                      {totalEmpStats.totalAssigned} Demos
                    </strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <strong className="demos-count-total" style={{ color: '#1d4ed8', fontSize: '1rem' }}>
                      {totalEmpStats.fixedForDay} Demos
                    </strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <strong style={{ color: '#047857', fontSize: '0.95rem' }}>
                      {totalEmpStats.conducted} Conducted
                    </strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <strong style={{ color: '#be123c', fontSize: '0.95rem' }}>
                      {totalEmpStats.cancelled} Cancelled
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: DAILY TIMETABLE / TIMESLOT TABLE MATRIX            */}
      {/* ------------------------------------------------------------- */}
      {/* ------------------------------------------------------------- */}
      {!['bookedDate', 'report', 'conducted'].includes(filterMode) && (
      <div id="time-slots" className="section-block">
        <div className="section-header-inline">
          <div>
            <h2 className="section-title">3. Daily Timetable / Timeslot Table</h2>
            <p className="section-desc">
              {isHead
                ? `Hourly roster matrix from 10:00 AM to 6:00 PM for all advisors on ${getFormattedDateLabel(selectedDate)}.`
                : `Hourly roster matrix from 10:00 AM to 6:00 PM for ${displayEmployees[0]?.name} on ${getFormattedDateLabel(selectedDate)}.`}
            </p>
          </div>

          {/* Color Legend */}
          <div className="legend-row">
            <div className="legend-item">
              <span className="legend-box" style={{ backgroundColor: DEMO_COURSES.MECH.color }}></span>
              <span>Mech</span>
            </div>
            <div className="legend-item">
              <span className="legend-box" style={{ backgroundColor: DEMO_COURSES.CIVIL.color }}></span>
              <span>Civil</span>
            </div>
            <div className="legend-item">
              <span className="legend-box" style={{ backgroundColor: DEMO_COURSES.MERN.color }}></span>
              <span>MERN</span>
            </div>
            <div className="legend-item">
              <span className="legend-box" style={{ backgroundColor: DEMO_COURSES.DM.color }}></span>
              <span>Digital Mktg</span>
            </div>
            <div className="legend-item">
              <span className="legend-box free-box"></span>
              <span>Free Slot</span>
            </div>
          </div>
        </div>

        <div className="timetable-table-wrapper">
          <table className="timetable-matrix">
            <thead>
              <tr>
                <th className="sticky-col emp-header-cell">
                  <div className="emp-hdr">
                    <Users size={16} />
                    <span>Employee Name</span>
                  </div>
                </th>
                {TIME_SLOTS.map((slot) => (
                  <th key={slot} className="timeslot-header-cell">
                    <div className="slot-title">{slot.split(' - ')[0]}</div>
                    <div className="slot-subtitle">to {slot.split(' - ')[1]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayEmployees.map((emp) => (
                <tr key={emp.id}>
                  {/* Row Label: Employee */}
                  <td className="sticky-col emp-info-cell">
                    <div className="emp-profile">
                      <div className="emp-avatar-circle">{emp.avatar}</div>
                      <div className="emp-text-details">
                        <div className="emp-name">{emp.name}</div>
                        <div className="emp-role">{emp.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Hourly Slot Cells */}
                  {TIME_SLOTS.map((slot) => {
                    const matrixKey = `${emp.id}_${slot}`;
                    const slotDemos = timetableMatrix[matrixKey];

                    if (slotDemos && slotDemos.length > 0) {
                      const firstDemo = slotDemos[0];
                      const courseObj = DEMO_COURSES[firstDemo.courseKey] || DEMO_COURSES.MECH;

                      return (
                        <td
                          key={slot}
                          className="timetable-cell occupied-cell"
                          onClick={() => setSelectedDemoDetail(firstDemo)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className="scheduled-demo-badge"
                            style={{
                              backgroundColor: courseObj.bgColor,
                              borderColor: courseObj.color,
                              color: courseObj.darkColor,
                              position: 'relative'
                            }}
                          >
                            <div className="badge-header-row">
                              <span
                                className="course-code-dot"
                                style={{ backgroundColor: courseObj.color }}
                              />
                              <span className="course-code-name">{courseObj.name}</span>
                              {slotDemos.length > 1 && (
                                <span
                                  style={{
                                    marginLeft: 'auto',
                                    background: courseObj.darkColor,
                                    color: '#ffffff',
                                    borderRadius: '1rem',
                                    fontSize: '0.65rem',
                                    padding: '0.05rem 0.35rem',
                                    fontWeight: '800'
                                  }}
                                  title={`${slotDemos.length} demos scheduled in this slot`}
                                >
                                  +{slotDemos.length - 1}
                                </span>
                              )}
                            </div>
                            <div className="prospect-name-text">{firstDemo.prospectName}</div>
                            <div className="status-tag">{firstDemo.status}</div>
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td key={slot} className="timetable-cell free-cell">
                          <button
                            className="btn-add-slot"
                            onClick={() => {
                              setAddSlotContext({
                                employeeId: emp.id,
                                employeeName: emp.name,
                                timeSlot: slot
                              });
                              setShowAddModal(true);
                            }}
                            title={`Click to book demo for ${emp.name} at ${slot}`}
                          >
                            <Plus size={12} />
                            <span>Free</span>
                          </button>
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: VIEW DEMO DETAILS                                    */}
      {/* ------------------------------------------------------------- */}
      {selectedDemoDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedDemoDetail(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <BookOpen size={20} className="modal-title-icon" />
                <h3>Demo Details — {selectedDemoDetail.prospectName}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedDemoDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {selectedDemoDetail.rowNumber && (
                <div className="detail-row">
                  <span className="d-label">Sheet Row #:</span>
                  <span className="d-value bold" style={{ color: '#4f46e5' }}>
                    Row #{selectedDemoDetail.rowNumber}
                  </span>
                </div>
              )}
              {selectedDemoDetail.timestamp && (
                <div className="detail-row">
                  <span className="d-label">Timestamp:</span>
                  <span className="d-value">{selectedDemoDetail.timestamp}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="d-label">Candidate Name:</span>
                <span className="d-value bold">{selectedDemoDetail.prospectName || selectedDemoDetail.studentName}</span>
              </div>
              {(selectedDemoDetail.prospectEmail || selectedDemoDetail.studentEmail) && (
                <div className="detail-row">
                  <span className="d-label">Email Address:</span>
                  <span className="d-value">
                    <a
                      href={`mailto:${selectedDemoDetail.prospectEmail || selectedDemoDetail.studentEmail}`}
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}
                    >
                      {selectedDemoDetail.prospectEmail || selectedDemoDetail.studentEmail}
                    </a>
                  </span>
                </div>
              )}
              <div className="detail-row">
                <span className="d-label">Phone Number:</span>
                <span className="d-value">
                  <a
                    href={`tel:${selectedDemoDetail.prospectPhone || selectedDemoDetail.studentPhone}`}
                    style={{
                      color: '#059669',
                      textDecoration: 'none',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Phone size={14} />
                    <span>{selectedDemoDetail.prospectPhone || selectedDemoDetail.studentPhone}</span>
                  </a>
                </span>
              </div>
              <div className="detail-row">
                <span className="d-label">Assigned Advisor:</span>
                <span className="d-value">
                  <strong>{selectedDemoDetail.employeeName || selectedDemoDetail.acName}</strong>
                  {(selectedDemoDetail.employeeEmail || selectedDemoDetail.acEmail) && (
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '6px' }}>
                      ({selectedDemoDetail.employeeEmail || selectedDemoDetail.acEmail})
                    </span>
                  )}
                </span>
              </div>
              <div className="detail-row">
                <span className="d-label">Demo Course:</span>
                <span
                  className="code-pill"
                  style={{
                    backgroundColor: DEMO_COURSES[selectedDemoDetail.courseKey]?.bgColor || '#f1f5f9',
                    color: DEMO_COURSES[selectedDemoDetail.courseKey]?.darkColor || '#334155',
                    borderColor: DEMO_COURSES[selectedDemoDetail.courseKey]?.borderColor || '#cbd5e1'
                  }}
                >
                  {selectedDemoDetail.courseName || DEMO_COURSES[selectedDemoDetail.courseKey]?.fullName || selectedDemoDetail.courseKey}
                </span>
              </div>
              {selectedDemoDetail.pricePitched && (
                <div className="detail-row">
                  <span className="d-label">Price Pitched:</span>
                  <span className="d-value bold" style={{ color: '#047857' }}>
                    {selectedDemoDetail.pricePitched.startsWith('₹') ? selectedDemoDetail.pricePitched : `₹${selectedDemoDetail.pricePitched}`}
                  </span>
                </div>
              )}
              <div className="detail-row">
                <span className="d-label">Date & Time:</span>
                <span className="d-value">
                  {selectedDemoDetail.rawDate || selectedDemoDetail.date} ({selectedDemoDetail.rawTime || selectedDemoDetail.timeSlot})
                </span>
              </div>
              <div className="detail-row">
                <span className="d-label">Demo Status:</span>
                <span className="status-chip high">{selectedDemoDetail.status}</span>
              </div>

              {(selectedDemoDetail.notes || selectedDemoDetail.comments) && (
                <div className="notes-box">
                  <div className="notes-heading">
                    <FileText size={14} /> Comments / Qualifications:
                  </div>
                  <p>{selectedDemoDetail.notes || selectedDemoDetail.comments}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedDemoDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ADD NEW DEMO SLOT                                     */}
      {/* ------------------------------------------------------------- */}
      {showAddModal && addSlotContext && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Plus size={20} className="modal-title-icon" />
                <h3>Book Demo Slot — {addSlotContext.employeeName}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDemo}>
              <div className="modal-body">
                <div className="slot-info-pill">
                  <Clock size={14} />
                  <span>
                    Date: <strong>{selectedDate}</strong> | Time Slot:{' '}
                    <strong>{addSlotContext.timeSlot}</strong>
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Prospect Student Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Vikas Sharma"
                    value={newProspectName}
                    onChange={(e) => setNewProspectName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prospect Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. +91 98765 43210"
                    value={newProspectPhone}
                    onChange={(e) => setNewProspectPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Demo Course *</label>
                  <select
                    className="form-control"
                    value={newCourseKey}
                    onChange={(e) => setNewCourseKey(e.target.value)}
                  >
                    <option value="MECH">Mechanical (Blue)</option>
                    <option value="CIVIL">Civil (Orange)</option>
                    <option value="MERN">MERN Stack (Green)</option>
                    <option value="DM">Digital Marketing (Pink/Purple)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Counselor Notes / Remarks</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Candidate interests, background or specific requirements..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm & Schedule Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Sheet Integration Modal */}
      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        sheetUrl={adminSheetUrl}
        onSaveUrl={(url) => setAdminSheetUrl(url)}
        onSyncData={(url) => syncToGoogleSheet(url, 'SYNC_DEMOS', dateDemos, 'Demo Analytics')}
        onFetchData={handleFetchDataFromSheet}
        onExportCSV={handleExportCSV}
        dashboardType="Admin Demo Analytics"
        recordsCount={dateDemos.length}
      />

      {/* Demo Form Log Modal */}
      {showDemoFormModal && (
        <DemoForm
          currentUser={currentUser || { id: 'usr-1', name: 'Dr. Vikram' }}
          onSave={handleSaveDemoForm}
          onClose={() => setShowDemoFormModal(false)}
        />
      )}
    </div>
  );
}
