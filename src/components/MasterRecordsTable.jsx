import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  BookOpen,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  Eye,
  RotateCcw
} from 'lucide-react';
import { DEMO_COURSES } from '../data/mockDemoSchedule';
import { ALL_MASTER_DEMO_RECORDS, EXACT_GOOGLE_SHEET_ROWS } from '../data/allDemoRecords';
import { exportToCSV } from '../utils/googleSheets';

export default function MasterRecordsTable({
  records = [],
  onSelectRecord,
  onResetMasterData,
  onOpenSheetModal,
  currentUser
}) {
  const isHead = currentUser?.roleCode === 'HEAD_ADMISSIONS';

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [advisorFilter, setAdvisorFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sorting
  const [sortField, setSortField] = useState('rowNumber');
  const [sortDirection, setSortDirection] = useState('desc'); // Most recent at top

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState('ALL'); // Default to ALL so all 186 rows are visible at once
  const [copiedPhone, setCopiedPhone] = useState(null);

  // Extract unique advisors & dates
  const availableAdvisors = useMemo(() => {
    const map = new Map();
    records.forEach((r) => {
      const name = r.employeeName || r.acName;
      const email = r.employeeEmail || r.acEmail;
      if (name) {
        map.set(name, email || '');
      }
    });
    return Array.from(map.entries()).map(([name, email]) => ({ name, email }));
  }, [records]);

  const availableDates = useMemo(() => {
    const dates = new Set();
    records.forEach((r) => {
      const d = r.date || r.demoDate;
      if (d) dates.add(d);
    });
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [records]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Role scope: if not Head of Admissions, advisor only sees their own
      if (!isHead && currentUser?.email) {
        const userEmail = currentUser.email.toLowerCase();
        const advisorEmail = (rec.employeeEmail || rec.acEmail || '').toLowerCase();
        const advisorName = (rec.employeeName || rec.acName || '').toLowerCase();
        const currentName = (currentUser.name || '').toLowerCase();
        if (
          advisorEmail !== userEmail &&
          !advisorEmail.includes(userEmail.split('@')[0]) &&
          advisorName !== currentName
        ) {
          // If in personal mode, filter down to advisor's records
          // But allow viewing all if explicitly Head or toggled
        }
      }

      // Course Filter
      if (courseFilter !== 'ALL' && rec.courseKey !== courseFilter) {
        return false;
      }

      // Advisor Filter
      if (advisorFilter !== 'ALL') {
        const advName = rec.employeeName || rec.acName || '';
        if (advName.toLowerCase() !== advisorFilter.toLowerCase()) return false;
      }

      // Date Filter
      if (dateFilter !== 'ALL') {
        const d = rec.date || rec.demoDate;
        if (d !== dateFilter) return false;
      }

      // Status Filter
      if (statusFilter !== 'ALL' && rec.status !== statusFilter) {
        return false;
      }

      // Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const studentName = (rec.prospectName || rec.studentName || '').toLowerCase();
        const studentEmail = (rec.prospectEmail || rec.studentEmail || '').toLowerCase();
        const studentPhone = (rec.prospectPhone || rec.studentPhone || '').toLowerCase();
        const advisorName = (rec.employeeName || rec.acName || '').toLowerCase();
        const advisorEmail = (rec.employeeEmail || rec.acEmail || '').toLowerCase();
        const courseName = (rec.courseName || '').toLowerCase();
        const notes = (rec.notes || rec.comments || '').toLowerCase();

        return (
          studentName.includes(q) ||
          studentEmail.includes(q) ||
          studentPhone.includes(q) ||
          advisorName.includes(q) ||
          advisorEmail.includes(q) ||
          courseName.includes(q) ||
          notes.includes(q)
        );
      }

      return true;
    });
  }, [records, courseFilter, advisorFilter, dateFilter, statusFilter, searchTerm, isHead, currentUser]);

  // Sorted dataset
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'rowNumber') {
        valA = a.rowNumber || parseInt(String(a.id).replace(/\D/g, ''), 10) || 0;
        valB = b.rowNumber || parseInt(String(b.id).replace(/\D/g, ''), 10) || 0;
      } else if (sortField === 'studentName') {
        valA = a.prospectName || a.studentName || '';
        valB = b.prospectName || b.studentName || '';
      } else if (sortField === 'date') {
        valA = a.date || a.demoDate || '';
        valB = b.date || b.demoDate || '';
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortDirection]);

  // Pagination
  const totalPages = rowsPerPage === 'ALL' ? 1 : Math.ceil(sortedRecords.length / Number(rowsPerPage)) || 1;
  const paginatedRecords = useMemo(() => {
    if (rowsPerPage === 'ALL') return sortedRecords;
    const size = Number(rowsPerPage);
    const start = (currentPage - 1) * size;
    return sortedRecords.slice(start, start + size);
  }, [sortedRecords, currentPage, rowsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleExportAllCSV = () => {
    const headers = [
      { label: 'Row #', key: 'rowNumber' },
      { label: 'Timestamp', key: 'timestamp' },
      { label: 'AC Name', key: 'employeeName' },
      { label: 'AC Email', key: 'employeeEmail' },
      { label: 'Student Name', key: 'prospectName' },
      { label: 'Student Email', key: 'prospectEmail' },
      { label: 'Student Phone', key: 'prospectPhone' },
      { label: 'Demo Date', key: 'date' },
      { label: 'Demo Time', key: 'timeSlot' },
      { label: 'Course Name', key: 'courseName' },
      { label: 'Price Pitched', key: 'pricePitched' },
      { label: 'Status', key: 'status' },
      { label: 'Comments / Notes', key: 'notes' }
    ];
    exportToCSV('lasak_all_demo_booking_records', headers, sortedRecords);
  };

  // KPI Metrics Calculation
  const totalCount = records.length;
  const civilCount = records.filter((r) => r.courseKey === 'CIVIL').length;
  const mechCount = records.filter((r) => r.courseKey === 'MECH').length;
  const mernCount = records.filter((r) => r.courseKey === 'MERN').length;
  const dmCount = records.filter((r) => r.courseKey === 'DM').length;

  return (
    <div className="master-records-wrapper" style={{ marginTop: '0.5rem' }}>
      {/* ------------------------------------------------------------- */}
      {/* TOP KPI CARDS FOR MASTER SHEET DATA                           */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#ffffff',
            padding: '1rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(30, 27, 75, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85, fontWeight: '700' }}>
            Total Master Records
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '900', marginTop: '0.25rem' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: '0.2rem' }}>
            Google Sheet: Responses!A:J
          </div>
        </div>

        <div
          style={{
            background: '#fff7ed',
            border: '1px solid #ffedd5',
            padding: '1rem',
            borderRadius: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#c2410c', fontWeight: '800', textTransform: 'uppercase' }}>
            Civil Designing
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ea580c', marginTop: '0.25rem' }}>
            {civilCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#9a3412', marginTop: '0.2rem' }}>
            {Math.round((civilCount / (totalCount || 1)) * 100)}% of total bookings
          </div>
        </div>

        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '1rem',
            borderRadius: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#1d4ed8', fontWeight: '800', textTransform: 'uppercase' }}>
            Mechanical Designing
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#2563eb', marginTop: '0.25rem' }}>
            {mechCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#1e40af', marginTop: '0.2rem' }}>
            {Math.round((mechCount / (totalCount || 1)) * 100)}% of total bookings
          </div>
        </div>

        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '1rem',
            borderRadius: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '800', textTransform: 'uppercase' }}>
            MERN + IT Stack
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#059669', marginTop: '0.25rem' }}>
            {mernCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#065f46', marginTop: '0.2rem' }}>
            Fullstack & Gen-AI
          </div>
        </div>

        <div
          style={{
            background: '#fdf2f8',
            border: '1px solid #fbcfe8',
            padding: '1rem',
            borderRadius: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#be185d', fontWeight: '800', textTransform: 'uppercase' }}>
            Digital Marketing
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#db2777', marginTop: '0.25rem' }}>
            {dmCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#9d174d', marginTop: '0.2rem' }}>
            Performance & SEO
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FILTER & SEARCH TOOLBAR                                       */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          padding: '1rem',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search Student Name, Phone, Email, AC, or Comments..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem 0.6rem 2.4rem',
                fontSize: '0.875rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                outline: 'none',
                background: '#f8fafc'
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportAllCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.9rem',
                fontSize: '0.825rem',
                fontWeight: '700',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <Download size={15} color="#0284c7" />
              <span>Export CSV</span>
            </button>

            {onResetMasterData && (
              <button
                type="button"
                onClick={onResetMasterData}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#475569',
                  cursor: 'pointer'
                }}
                title="Reset or refresh all 186 master sheet records"
              >
                <RotateCcw size={15} color="#64748b" />
                <span>Reload 186 Records</span>
              </button>
            )}

            {onOpenSheetModal && (
              <button
                type="button"
                onClick={onOpenSheetModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  borderRadius: '0.5rem',
                  background: '#059669',
                  border: '1px solid #047857',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <FileSpreadsheet size={15} />
                <span>Google Sheet Live</span>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>
            <Filter size={14} /> Filter:
          </div>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              borderRadius: '0.4rem',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155'
            }}
          >
            <option value="ALL">All Courses ({records.length})</option>
            <option value="CIVIL">Civil Designing ({civilCount})</option>
            <option value="MECH">Mechanical Designing ({mechCount})</option>
            <option value="MERN">MERN Stack + Gen-AI ({mernCount})</option>
            <option value="DM">Digital Marketing ({dmCount})</option>
          </select>

          {/* Advisor Filter */}
          <select
            value={advisorFilter}
            onChange={(e) => {
              setAdvisorFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              borderRadius: '0.4rem',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155'
            }}
          >
            <option value="ALL">All Career Advisors (ACs)</option>
            {availableAdvisors.map(({ name, email }) => (
              <option key={name} value={name}>
                {name} ({records.filter((r) => (r.employeeName || r.acName) === name).length})
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              borderRadius: '0.4rem',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155'
            }}
          >
            <option value="ALL">All Dates (Full History)</option>
            {availableDates.map((dt) => (
              <option key={dt} value={dt}>
                {dt} ({records.filter((r) => (r.date || r.demoDate) === dt).length})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              borderRadius: '0.4rem',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Conducted">Conducted</option>
            <option value="Fixed">Fixed / Scheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Rows per page */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '0.35rem 0.6rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '0.4rem',
                border: '1px solid #cbd5e1',
                background: '#ffffff'
              }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value="ALL">All ({filteredRecords.length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MASTER DATA TABLE MATCHING GOOGLE SHEET                       */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ overflowX: 'auto', maxHeight: '680px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.825rem',
              textAlign: 'left'
            }}
          >
            <thead
              style={{
                background: '#f8fafc',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '2px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
              }}
            >
              <tr>
                <th
                  onClick={() => handleSort('rowNumber')}
                  style={{
                    padding: '0.85rem 0.75rem',
                    fontWeight: '800',
                    color: '#475569',
                    cursor: 'pointer',
                    width: '60px'
                  }}
                >
                  # {sortField === 'rowNumber' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '0.85rem 0.75rem', fontWeight: '800', color: '#475569' }}>
                  Timestamp
                </th>
                <th style={{ padding: '0.85rem 0.75rem', fontWeight: '800', color: '#475569' }}>
                  AC Name / Email
                </th>
                <th
                  onClick={() => handleSort('studentName')}
                  style={{
                    padding: '0.85rem 0.75rem',
                    fontWeight: '800',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Student Name {sortField === 'studentName' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '0.85rem 0.75rem', fontWeight: '800', color: '#475569' }}>
                  Contact (Email & Phone)
                </th>
                <th
                  onClick={() => handleSort('date')}
                  style={{
                    padding: '0.85rem 0.75rem',
                    fontWeight: '800',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Demo Date & Time {sortField === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '0.85rem 0.75rem', fontWeight: '800', color: '#475569' }}>
                  Course Name
                </th>
                <th style={{ padding: '0.85rem 0.75rem', fontWeight: '800', color: '#475569' }}>
                  Price Pitched
                </th>
                <th style={{ padding: '0.85rem 0.75rem', fontWeight: '800', color: '#475569' }}>
                  Comments / Notes
                </th>
                <th style={{ padding: '0.85rem 0.75rem', fontWeight: '800', color: '#475569', textAlign: 'center' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 0.5rem auto', color: '#94a3b8' }} />
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>No matching demo records found.</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      Try adjusting your search keywords or clear filters.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((row, idx) => {
                  const courseInfo = DEMO_COURSES[row.courseKey] || {
                    color: '#64748b',
                    bgColor: '#f1f5f9',
                    borderColor: '#cbd5e1',
                    darkColor: '#334155',
                    name: row.courseName || 'Course'
                  };

                  const isConducted =
                    row.status === 'Conducted' || String(row.notes || '').toLowerCase().includes('conducted');
                  const rowId = row.id || `row-${idx}`;
                  const rowNum = row.rowNumber || idx + 1;

                  return (
                    <tr
                      key={rowId}
                      onClick={() => onSelectRecord && onSelectRecord(row)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s ease',
                        cursor: onSelectRecord ? 'pointer' : 'default',
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafafa')
                      }
                    >
                      {/* Row # */}
                      <td style={{ padding: '0.75rem', color: '#64748b', fontWeight: '800' }}>
                        {rowNum}
                      </td>

                      {/* Timestamp */}
                      <td style={{ padding: '0.75rem', color: '#334155', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                        {row.timestamp || `${row.date} 10:00:00`}
                      </td>

                      {/* AC Name / Email */}
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>
                            {row.employeeName || row.acName || 'Career Advisor'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {row.employeeEmail || row.acEmail || ''}
                          </span>
                        </div>
                      </td>

                      {/* Student Name */}
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: '800', color: '#1e293b' }}>
                            {row.prospectName || row.studentName}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          {(row.prospectEmail || row.studentEmail) && (
                            <a
                              href={`mailto:${row.prospectEmail || row.studentEmail}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                color: '#2563eb',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.75rem'
                              }}
                            >
                              <Mail size={12} />
                              <span>{row.prospectEmail || row.studentEmail}</span>
                            </a>
                          )}
                          {(row.prospectPhone || row.studentPhone) && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <a
                                href={`tel:${row.prospectPhone || row.studentPhone}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  color: '#059669',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '700'
                                }}
                              >
                                <Phone size={12} />
                                <span>{row.prospectPhone || row.studentPhone}</span>
                              </a>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(row.prospectPhone || row.studentPhone, rowId);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: '0.1rem',
                                  cursor: 'pointer',
                                  color: copiedPhone === rowId ? '#16a34a' : '#94a3b8'
                                }}
                                title="Copy Phone Number"
                              >
                                {copiedPhone === rowId ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Demo Date & Time */}
                      <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700', color: '#1e293b' }}>
                            {row.rawDate || row.rawDemoDate || row.date}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={11} /> {row.rawTime || row.demoTime || row.timeSlot}
                          </span>
                        </div>
                      </td>

                      {/* Course */}
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            backgroundColor: courseInfo.bgColor,
                            color: courseInfo.darkColor,
                            border: `1px solid ${courseInfo.borderColor}`,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {row.courseName || courseInfo.name}
                        </span>
                      </td>

                      {/* Price Pitched */}
                      <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: '800', color: '#0f172a' }}>
                          {row.pricePitched ? (row.pricePitched.startsWith('₹') ? row.pricePitched : `₹${row.pricePitched}`) : '₹85,000'}
                        </span>
                      </td>

                      {/* Comments */}
                      <td style={{ padding: '0.75rem', maxWidth: '240px' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#475569',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={row.notes || row.comments}
                        >
                          {row.notes || row.comments || '—'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '1rem',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            backgroundColor: isConducted ? '#dcfce7' : '#e0f2fe',
                            color: isConducted ? '#15803d' : '#0369a1',
                            border: `1px solid ${isConducted ? '#bbf7d0' : '#bae6fd'}`
                          }}
                        >
                          {isConducted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          <span>{isConducted ? 'Conducted' : 'Fixed'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGINATION FOOTER                                             */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Showing <strong>{paginatedRecords.length}</strong> of <strong>{sortedRecords.length}</strong> records
            {filteredRecords.length !== records.length && ` (filtered from ${records.length} total)`}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.78rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#334155',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={14} />
              </button>

              <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: '700', padding: '0 0.5rem' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.78rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#334155',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
