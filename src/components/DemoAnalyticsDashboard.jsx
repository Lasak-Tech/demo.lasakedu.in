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
import { exportToCSV, syncToGoogleSheet } from '../utils/googleSheets';
import {
  DEMO_COURSES,
  TIME_SLOTS,
  DEMO_EMPLOYEES,
  INITIAL_SCHEDULED_DEMOS
} from '../data/mockDemoSchedule';

export default function DemoAnalyticsDashboard({ currentUser }) {
  // Check if active user has Head of Admissions privileges
  const isHead = currentUser?.roleCode === 'HEAD_ADMISSIONS';

  // Date State - Default to Today (2026-09-09)
  const [selectedDate, setSelectedDate] = useState('2026-09-09');
  const [scheduledDemos, setScheduledDemos] = useState(INITIAL_SCHEDULED_DEMOS);

  // Google Sheet Sync State
  const [adminSheetUrl, setAdminSheetUrl] = useLocalStorage('lasak_admin_sheet_url', '');
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);

  // Modal / Detail Popover State
  const [selectedDemoDetail, setSelectedDemoDetail] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSlotContext, setAddSlotContext] = useState(null); // { employeeId, employeeName, timeSlot }

  // Form State for Adding New Demo
  const [newProspectName, setNewProspectName] = useState('');
  const [newProspectPhone, setNewProspectPhone] = useState('');
  const [newCourseKey, setNewCourseKey] = useState('MECH');
  const [newNotes, setNewNotes] = useState('');

  // Determine list of employees visible to the active user
  const displayEmployees = useMemo(() => {
    if (isHead) {
      return DEMO_EMPLOYEES;
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
  }, [isHead, currentUser]);

  // Filtering Demos for Selected Date & User Scope
  const dateDemos = useMemo(() => {
    const rawDateDemos = scheduledDemos.filter((d) => d.date === selectedDate);
    if (isHead) {
      return rawDateDemos;
    }
    const myEmpIds = displayEmployees.map((e) => e.id);
    const myEmpNames = displayEmployees.map((e) => e.name.toLowerCase());
    return rawDateDemos.filter(
      (d) =>
        myEmpIds.includes(d.employeeId) ||
        myEmpNames.includes(d.employeeName?.toLowerCase())
    );
  }, [scheduledDemos, selectedDate, isHead, displayEmployees]);

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

  // Employee Daily Stats for Selected Date (Filtered by Access Level)
  const employeeDailyStats = useMemo(() => {
    return displayEmployees.map((emp) => {
      const empDemos = scheduledDemos.filter(
        (d) =>
          d.date === selectedDate &&
          (d.employeeId === emp.id ||
            d.employeeName?.toLowerCase() === emp.name.toLowerCase())
      );
      const fixedForDay = empDemos.length;
      const conducted = empDemos.filter((d) => d.status === 'Conducted').length;
      const cancelled = empDemos.filter((d) => d.status === 'Cancelled').length;

      return {
        ...emp,
        fixedForDay,
        conducted,
        cancelled
      };
    });
  }, [displayEmployees, scheduledDemos, selectedDate]);

  const totalEmpStats = useMemo(() => {
    return employeeDailyStats.reduce(
      (acc, curr) => ({
        fixedForDay: acc.fixedForDay + curr.fixedForDay,
        conducted: acc.conducted + curr.conducted,
        cancelled: acc.cancelled + curr.cancelled
      }),
      { fixedForDay: 0, conducted: 0, cancelled: 0 }
    );
  }, [employeeDailyStats]);

  // Timetable Matrix Lookup: employeeId + timeSlot -> Demo or null
  const timetableMatrix = useMemo(() => {
    const map = {};
    dateDemos.forEach((demo) => {
      const key = `${demo.employeeId}_${demo.timeSlot}`;
      map[key] = demo;
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
    try {
      const parts = dateStr.split('-');
      const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
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

  return (
    <div className="demo-analytics-container">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER & DATE FILTER CONTROLS                             */}
      {/* ------------------------------------------------------------- */}
      <div className="dashboard-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="dashboard-title-group">
            <h1 className="dashboard-title">Demo Analytics & Funnel Management</h1>
            <span className="dashboard-badge-live">
              <span className="pulse-dot"></span> LIVE DEMO TRACKER
            </span>
          </div>
          <p className="dashboard-subtitle">
            Real-time track of fixed demos per course and daily employee timetable roster.
          </p>
        </div>

        {/* Action Controls & Date Selector Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Export & Sheet Sync Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
            </div>

            <div className="quick-date-pills">
              <button
                className={`date-pill ${selectedDate === '2026-09-09' ? 'active' : ''}`}
                onClick={() => setSelectedDate('2026-09-09')}
              >
                Today (Sep 9)
              </button>
              <button
                className={`date-pill ${selectedDate === '2026-09-08' ? 'active' : ''}`}
                onClick={() => setSelectedDate('2026-09-08')}
              >
                Yesterday (Sep 8)
              </button>
              <button
                className={`date-pill ${selectedDate === '2026-09-10' ? 'active' : ''}`}
                onClick={() => setSelectedDate('2026-09-10')}
              >
                Tomorrow (Sep 10)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Date Summary Banner */}
      {!isHead && (
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

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: FUNNEL OVERVIEW CARDS / SEMI-CIRCULAR METER GAUGES */}
      {/* ------------------------------------------------------------- */}
      <div className="section-block">
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

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: DAILY REPORT SUMMARY & FUNNEL DIAGRAM              */}
      {/* ------------------------------------------------------------- */}
      <div className="section-block">
        <div className="section-header-inline">
          <div>
            <h2 className="section-title">2. Today's Funnel Report Summary</h2>
            <p className="section-desc">
              {isHead
                ? `Detailed breakdown of all employee demo performance for ${getFormattedDateLabel(selectedDate)}.`
                : `Personal demo performance summary report for ${currentUser?.name} on ${getFormattedDateLabel(selectedDate)}.`}
            </p>
          </div>
        </div>

        <div className="report-summary-layout">
          {/* Visual Funnel Stage Graphic */}
          <div className="funnel-visual-card">
            <div className="card-title-mini">
              <Sparkles size={16} color="#6366f1" />
              <span>Conversion Funnel Progression</span>
            </div>

            <div className="visual-funnel-stack">
              <div className="funnel-stage stage-1">
                <div className="stage-info">
                  <span className="stage-name">1. Total Inquiries Received</span>
                  <span className="stage-val">{totalDemosFixedToday ? Math.round(totalDemosFixedToday * 2.8) : 0} Leads</span>
                </div>
                <div className="stage-bar-fill" style={{ width: '100%' }}></div>
              </div>

              <div className="funnel-stage stage-2">
                <div className="stage-info">
                  <span className="stage-name">2. Demos Scheduled</span>
                  <span className="stage-val">{totalDemosFixedToday ? Math.round(totalDemosFixedToday * 1.5) : 0} Prospects</span>
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

            <div className="funnel-stage-footer">
              <TrendingUp size={14} color="#059669" />
              <span>Conversion rate: <strong>{totalDemosFixedToday ? '45%' : '0%'} estimated enrollment</strong></span>
            </div>
          </div>

          {/* Employee Daily Performance Report Table */}
          <div className="summary-table-card">
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

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: DAILY TIMETABLE / TIMESLOT TABLE MATRIX            */}
      {/* ------------------------------------------------------------- */}
      <div className="section-block">
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
                    const demo = timetableMatrix[matrixKey];

                    if (demo) {
                      const courseObj = DEMO_COURSES[demo.courseKey] || DEMO_COURSES.MECH;

                      return (
                        <td
                          key={slot}
                          className="timetable-cell occupied-cell"
                          onClick={() => setSelectedDemoDetail(demo)}
                        >
                          <div
                            className="scheduled-demo-badge"
                            style={{
                              backgroundColor: courseObj.bgColor,
                              borderColor: courseObj.color,
                              color: courseObj.darkColor
                            }}
                          >
                            <div className="badge-header-row">
                              <span
                                className="course-code-dot"
                                style={{ backgroundColor: courseObj.color }}
                              />
                              <span className="course-code-name">{courseObj.name}</span>
                            </div>
                            <div className="prospect-name-text">{demo.prospectName}</div>
                            <div className="status-tag">{demo.status}</div>
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
              <div className="detail-row">
                <span className="d-label">Candidate Name:</span>
                <span className="d-value bold">{selectedDemoDetail.prospectName}</span>
              </div>
              <div className="detail-row">
                <span className="d-label">Phone Number:</span>
                <span className="d-value">
                  <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {selectedDemoDetail.prospectPhone}
                </span>
              </div>
              <div className="detail-row">
                <span className="d-label">Assigned Advisor:</span>
                <span className="d-value">{selectedDemoDetail.employeeName}</span>
              </div>
              <div className="detail-row">
                <span className="d-label">Demo Course:</span>
                <span
                  className="code-pill"
                  style={{
                    backgroundColor: DEMO_COURSES[selectedDemoDetail.courseKey]?.bgColor,
                    color: DEMO_COURSES[selectedDemoDetail.courseKey]?.darkColor,
                    borderColor: DEMO_COURSES[selectedDemoDetail.courseKey]?.borderColor
                  }}
                >
                  {DEMO_COURSES[selectedDemoDetail.courseKey]?.fullName}
                </span>
              </div>
              <div className="detail-row">
                <span className="d-label">Date & Time Slot:</span>
                <span className="d-value">
                  {selectedDemoDetail.date} ({selectedDemoDetail.timeSlot})
                </span>
              </div>
              <div className="detail-row">
                <span className="d-label">Demo Status:</span>
                <span className="status-chip high">{selectedDemoDetail.status}</span>
              </div>

              {selectedDemoDetail.notes && (
                <div className="notes-box">
                  <div className="notes-heading">
                    <FileText size={14} /> Counselor Notes:
                  </div>
                  <p>{selectedDemoDetail.notes}</p>
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
        onExportCSV={handleExportCSV}
        dashboardType="Admin Demo Analytics"
        recordsCount={dateDemos.length}
      />
    </div>
  );
}
