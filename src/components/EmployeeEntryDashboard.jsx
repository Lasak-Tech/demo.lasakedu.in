import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  UserPlus,
  Calendar,
  User,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  ListFilter,
  FileSpreadsheet,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Download,
  Link2
} from 'lucide-react';
import GoogleSheetModal from './GoogleSheetModal';
import { exportToCSV, syncToGoogleSheet, fetchFromGoogleSheet, parseCSVText, normalizeExcelEmployeeRow } from '../utils/googleSheets';

const getTodayDateStr = () => new Date().toISOString().split('T')[0];
const getOffsetDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const INITIAL_EMPLOYEE_ENTRIES = [
  { id: 'emp-rec-1', employeeName: 'Gukan', date: getOffsetDateStr(0), createdAt: Date.now() },
  { id: 'emp-rec-2', employeeName: 'Siva', date: getOffsetDateStr(0), createdAt: Date.now() - 3600000 },
  { id: 'emp-rec-3', employeeName: 'Sreya', date: getOffsetDateStr(-1), createdAt: Date.now() - 86400000 },
  { id: 'emp-rec-6', employeeName: 'Hari Haran', date: getOffsetDateStr(-2), createdAt: Date.now() - 176400000 }
];

const DEFAULT_WEB_URL = 'https://script.google.com/macros/s/AKfycbyysKeO1b_pIiETYUZLOrNEJ1NINkZ2RVvr36ooa4ABzZxwjNHJoGS1a4k7_x6Ke_P1/exec';

export default function EmployeeEntryDashboard({ currentUser }) {
  const isHead = currentUser?.roleCode === 'HEAD_ADMISSIONS';

  // Local Storage Persistence
  const [entries, setEntries] = useLocalStorage(
    'lasak_employee_records',
    INITIAL_EMPLOYEE_ENTRIES
  );
  const [sheetUrl, setSheetUrl] = useLocalStorage(
    'lasak_employee_sheet_url',
    DEFAULT_WEB_URL
  );

  // Google Sheet Modal State
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);

  // Form Field States
  const [employeeName, setEmployeeName] = useState(
    !isHead && currentUser?.name ? currentUser.name : ''
  );
  const [entryDate, setEntryDate] = useState(getTodayDateStr());
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter / Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const targetEmpName = !isHead && currentUser?.name ? currentUser.name : employeeName;

    // Form Validation
    if (!targetEmpName.trim()) {
      setErrorMsg('Please enter a valid Employee Name.');
      return;
    }
    if (!entryDate) {
      setErrorMsg('Please select a Date.');
      return;
    }

    setErrorMsg('');

    // Create New Entry (added at top / most recent)
    const newEntry = {
      id: `emp-rec-${Date.now()}`,
      employeeName: targetEmpName.trim(),
      date: entryDate,
      createdAt: Date.now()
    };

    // Prepend new entry so most recent displays at the top
    setEntries((prev) => [newEntry, ...prev]);

    // Auto-sync to Google Sheet if Web App URL is configured
    if (sheetUrl && sheetUrl.trim()) {
      syncToGoogleSheet(sheetUrl, 'ADD_ENTRY', newEntry, 'Employee Entries').catch((err) =>
        console.warn('Auto Google Sheet sync warning:', err)
      );
    }

    // Show Success Alert Feedback
    setSuccessMsg(`Successfully added entry for "${newEntry.employeeName}" on ${newEntry.date}!`);
    setTimeout(() => setSuccessMsg(''), 4000);

    // Reset Form Fields (keep advisor name if non-head)
    if (isHead) {
      setEmployeeName('');
    }
  };

  // Export entries to CSV file
  const handleExportCSV = () => {
    const headers = [
      { label: 'Entry ID', key: 'id' },
      { label: 'Employee Name', key: 'employeeName' },
      { label: 'Date', key: 'date' }
    ];
    exportToCSV('lasak_employee_entries', headers, entries);
  };

  // Handle fetched live data from Google Sheet sub-sheets
  const handleFetchDataFromSheet = (sheetData) => {
    if (!sheetData || !sheetData.subSheets) return;

    const availableTabs = Object.values(sheetData.subSheets).filter((sub) => sub && sub.data && sub.data.length > 0);
    if (availableTabs.length > 0) {
      const allRows = availableTabs.flatMap((sub) => sub.data);
      const importedEntries = allRows.map((row, index) => {
        const rawEmp = row['Student / Employee Name'] || row['Employee Name'] || row['AC Name'] || row['Staff Email'] || 'Advisor';
        let empName = rawEmp.includes('@') ? rawEmp.split('@')[0] : rawEmp;
        empName = empName.trim();
        const dateStr = row['Date'] || row['Demo Date'] || row['Timestamp'] || '2026-09-09';
        const normDate = dateStr.split('T')[0].split(' ')[0];

        return {
          id: `emp-rec-gsheet-${index}-${Date.now()}`,
          employeeName: empName.charAt(0).toUpperCase() + empName.slice(1),
          date: normDate,
          createdAt: Date.now() - index * 1000
        };
      });

      setEntries((prev) => {
        const existingKeys = new Set(prev.map((e) => `${e.employeeName.toLowerCase()}_${e.date}`));
        const uniqueNew = importedEntries.filter((e) => !existingKeys.has(`${e.employeeName.toLowerCase()}_${e.date}`));
        return [...uniqueNew, ...prev];
      });
    }
  };

  // Auto-fetch data live from Google Sheet web app on mount
  React.useEffect(() => {
    const targetUrl = sheetUrl && sheetUrl.trim() ? sheetUrl.trim() : DEFAULT_WEB_URL;
    fetchFromGoogleSheet(targetUrl)
      .then((data) => {
        if (data && data.subSheets) {
          handleFetchDataFromSheet(data);
        }
      })
      .catch((err) => {
        console.warn('Auto fetch from Google Sheet in Employee Entry Dashboard skipped or failed:', err);
      });
  }, [sheetUrl]);

  // Delete Individual Entry
  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear All Entries
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your employee records?')) {
      if (isHead) {
        setEntries([]);
      } else {
        setEntries((prev) =>
          prev.filter((item) => item.employeeName.toLowerCase() !== currentUser?.name?.toLowerCase())
        );
      }
    }
  };

  // Filtered Entries based on search term & user role scope
  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm);
    if (isHead) return matchesSearch;
    return matchesSearch && item.employeeName.toLowerCase() === currentUser?.name?.toLowerCase();
  });

  // Formatted Date Helper
  const formatDateDisplay = (dateStr) => {
    try {
      const parts = dateStr.split('-');
      const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
      return dObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

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

        const normalizedNewEntries = rawRows.map((r, idx) => normalizeExcelEmployeeRow(r, idx));
        setEntries((prev) => {
          const existingKeys = new Set(prev.map((item) => `${item.employeeName.toLowerCase()}_${item.date}`));
          const uniqueNew = normalizedNewEntries.filter(
            (item) => !existingKeys.has(`${item.employeeName.toLowerCase()}_${item.date}`)
          );
          return [...uniqueNew, ...prev];
        });

        alert(`Successfully imported ${normalizedNewEntries.length} employee entry record(s) from "${file.name}" up to date!`);
      } catch (err) {
        alert(`Error importing Excel file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="employee-dashboard-wrapper">
      {/* Dashboard Page Header */}
      <div className="dashboard-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="dashboard-title-group">
            <h1 className="dashboard-title">
              {isHead ? 'Employee Entry Dashboard (All Staff)' : `My Employee Entry Hub (${currentUser?.name})`}
            </h1>
            <span className="dashboard-badge-live">
              {isHead ? 'HEAD OF ADMISSIONS VIEW' : 'MY RECORDS ONLY'}
            </span>
          </div>
          <p className="dashboard-subtitle">
            {isHead
              ? 'Submit and manage employee records across all staff members.'
              : `Submit new daily work entries and view your personal record history (${currentUser?.name}).`}
          </p>
        </div>

        {/* Google Sheet & Export Action Bar */}
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
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
            <span>Google Sheet Sync</span>
            {sheetUrl && (
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#a7f3d0',
                  boxShadow: '0 0 6px #a7f3d0'
                }}
                title="Google Sheet Live WebApp Connected"
              />
            )}
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      {errorMsg && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FORM SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="form-card-container">
        <div className="form-card-header">
          <div className="form-card-icon">
            <UserPlus size={20} color="#4f46e5" />
          </div>
          <div>
            <h2 className="form-card-title">Add New Employee Entry</h2>
            <p className="form-card-desc">Fill in the employee name and date to register a new entry.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="employee-entry-form">
          <div className="form-grid-layout">
            {/* Field 1: Employee Name */}
            <div className="form-input-group">
              <label className="input-label" htmlFor="employeeNameInput">
                Employee Name <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="employeeNameInput"
                  type="text"
                  className="text-input"
                  list="careerAdvisorsDatalist"
                  placeholder="e.g. Gukan, Siva, Sreya, Hari Haran..."
                  value={employeeName}
                  onChange={(e) => {
                    setEmployeeName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                />
                <datalist id="careerAdvisorsDatalist">
                  <option value="Gukan" />
                  <option value="Siva" />
                  <option value="Sreya" />
                  <option value="Hari Haran" />
                  <option value="Lakshmanan" />
                </datalist>
              </div>
            </div>

            {/* Field 2: Date Picker */}
            <div className="form-input-group">
              <label className="input-label" htmlFor="entryDateInput">
                Date <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <input
                  id="entryDateInput"
                  type="date"
                  className="text-input"
                  value={entryDate}
                  onChange={(e) => {
                    setEntryDate(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="form-action-row">
            <button type="submit" className="btn-submit-entry">
              <UserPlus size={18} />
              <span>Submit Employee Entry</span>
            </button>
          </div>
        </form>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TABLE VIEW SECTION (BELOW FORM)                              */}
      {/* ------------------------------------------------------------- */}
      <div className="table-card-container">
        {/* Table Card Header & Filter Bar */}
        <div className="table-card-header">
          <div className="table-header-title-group">
            <div className="table-icon-bg">
              <FileSpreadsheet size={20} color="#0284c7" />
            </div>
            <div>
              <h2 className="table-card-title">Submitted Employee Entries</h2>
              <p className="table-card-desc">
                Showing {filteredEntries.length} saved {filteredEntries.length === 1 ? 'entry' : 'entries'} (most recent at top).
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="table-header-actions">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>

            {entries.length > 0 && (
              <button
                type="button"
                className="btn-clear-all"
                onClick={handleClearAll}
                title="Clear all saved entries"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="entries-table-wrapper">
          {filteredEntries.length === 0 ? (
            <div className="empty-table-state">
              <div className="empty-icon-circle">
                <ListFilter size={32} color="#94a3b8" />
              </div>
              <h3 className="empty-state-title">No Entries Found</h3>
              <p className="empty-state-text">
                {searchTerm
                  ? `No entries match your search "${searchTerm}".`
                  : 'No employee entries recorded yet. Use the form above to submit an entry.'}
              </p>
            </div>
          ) : (
            <table className="employee-entries-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((item, index) => (
                  <tr key={item.id} className="table-row-item">
                    <td className="row-number-cell">
                      <span className="row-badge">{index + 1}</span>
                    </td>
                    <td className="emp-name-cell">
                      <div className="emp-name-content">
                        <div className="emp-avatar-small">
                          {item.employeeName.charAt(0).toUpperCase()}
                        </div>
                        <span className="emp-name-bold">{item.employeeName}</span>
                        {index === 0 && !searchTerm && (
                          <span className="badge-new-entry">LATEST</span>
                        )}
                      </div>
                    </td>
                    <td className="date-cell">
                      <div className="date-badge-inline">
                        <Calendar size={14} color="#6366f1" />
                        <span className="date-text-formatted">
                          {formatDateDisplay(item.date)}
                        </span>
                        <span className="date-code">({item.date})</span>
                      </div>
                    </td>
                    <td className="action-cell" style={{ textAlign: 'center' }}>
                      <button
                        className="btn-delete-row"
                        onClick={() => handleDelete(item.id)}
                        title={`Delete entry for ${item.employeeName}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer Stats */}
        <div className="table-card-footer">
          <span>
            Data is saved locally in browser <code>localStorage</code> (Key: <code>lasak_employee_records</code>)
          </span>
          <span className="footer-count">Total Records: {entries.length}</span>
        </div>
      </div>

      {/* Google Sheet Integration Modal */}
      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        sheetUrl={sheetUrl}
        onSaveUrl={(url) => setSheetUrl(url)}
        onSyncData={(url) => syncToGoogleSheet(url, 'SYNC_ALL_ENTRIES', entries, 'Employee Entries')}
        onFetchData={handleFetchDataFromSheet}
        onExportCSV={handleExportCSV}
        dashboardType="Employee Entry"
        recordsCount={entries.length}
      />
    </div>
  );
}
