import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Link,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Download,
  AlertCircle,
  Code2,
  Zap,
  DownloadCloud,
  Table,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  Grid,
  Maximize2
} from 'lucide-react';
import { APPS_SCRIPT_TEMPLATE, fetchFromGoogleSheet } from '../utils/googleSheets';

const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyysKeO1b_pIiETYUZLOrNEJ1NINkZ2RVvr36ooa4ABzZxwjNHJoGS1a4k7_x6Ke_P1/exec';
const EMBED_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1_XXDnftilVvpwOysCzigKPHIwGPo1N07CFZsiQ1lh84/preview';

export default function GoogleSheetModal({
  isOpen,
  onClose,
  sheetUrl,
  onSaveUrl,
  onSyncData,
  onFetchData,
  onExportCSV,
  dashboardType = 'Employee',
  recordsCount = 0
}) {
  const [urlInput, setUrlInput] = useState(sheetUrl || DEFAULT_WEB_APP_URL);
  const [isCopied, setIsCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { type: 'success'|'error', text: '' }
  const [showCodeGuide, setShowCodeGuide] = useState(false);
  const [fetchedTabs, setFetchedTabs] = useState(null);
  const [selectedTabKey, setSelectedTabKey] = useState(null);
  
  // View Modes: 'grid' (Interactive Spreadsheet Grid), 'iframe' (Embedded Google Sheet), 'settings' (Cloud Setup)
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Helper for column letters A, B, C ... Z, AA, AB
  const getColLetter = (index) => {
    let letter = '';
    let i = index;
    while (i >= 0) {
      letter = String.fromCharCode((i % 26) + 65) + letter;
      i = Math.floor(i / 26) - 1;
    }
    return letter;
  };

  useEffect(() => {
    if (isOpen) {
      setUrlInput(sheetUrl && sheetUrl.trim() ? sheetUrl : DEFAULT_WEB_APP_URL);
      // Auto trigger fetch on mount if no tabs loaded yet
      if (!fetchedTabs) {
        handleTriggerFetch();
      }
    }
  }, [isOpen]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    onSaveUrl(urlInput.trim());
    setSyncStatus({ type: 'success', text: 'Google Sheet Web App URL saved successfully!' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleTriggerSync = async () => {
    if (!urlInput.trim()) {
      setSyncStatus({
        type: 'error',
        text: 'Please enter a valid Google Apps Script Web App URL first.'
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await onSyncData(urlInput.trim());
      setSyncStatus({
        type: 'success',
        text: res?.message || `Successfully synced ${recordsCount} ${dashboardType} record(s) to Google Sheet!`
      });
    } catch (err) {
      setSyncStatus({
        type: 'error',
        text: err.message || 'Failed to sync with Google Sheet. Please check your Web App URL.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTriggerFetch = async () => {
    const target = urlInput && urlInput.trim() ? urlInput.trim() : DEFAULT_WEB_APP_URL;

    setIsFetching(true);
    setSyncStatus(null);
    try {
      const data = await fetchFromGoogleSheet(target);
      if (data && data.subSheets) {
        setFetchedTabs(data.subSheets);
        const keys = Object.keys(data.subSheets);
        if (keys.length > 0 && !selectedTabKey) {
          setSelectedTabKey(keys[0]);
        }
        if (onSaveUrl) {
          onSaveUrl(target);
        }
        if (onFetchData) {
          onFetchData(data);
        }
        const totalRowsSum = Object.values(data.subSheets).reduce((acc, curr) => acc + (curr.totalRows || 0), 0);
        setSyncStatus({
          type: 'success',
          text: `Fetched ${totalRowsSum} live entries across ${keys.length} sub-sheets from "${data.spreadsheetName || 'Lasak - Sales Revenue Tracker View'}". Spreadsheet ready!`
        });
      }
    } catch (err) {
      setSyncStatus({
        type: 'error',
        text: err.message || 'Failed to fetch sub-sheet data. Make sure Google Apps Script is deployed with "Who has access: Anyone".'
      });
    } finally {
      setIsFetching(false);
    }
  };

  const [filterDate, setFilterDate] = useState('ALL');

  // Extract columns and non-empty rows for active tab
  const currentTab = fetchedTabs && selectedTabKey ? fetchedTabs[selectedTabKey] : null;

  // Filter out blank/empty trailing rows from Google Sheet
  const validRows = useMemo(() => {
    const data = currentTab?.data || [];
    return data.filter((row) => {
      if (!row || typeof row !== 'object') return false;
      return Object.values(row).some((val) => val !== null && val !== undefined && String(val).trim() !== '');
    });
  }, [currentTab]);

  // Extract all unique dates in active tab for date dropdown filter
  const availableTabDates = useMemo(() => {
    const dates = new Set();
    validRows.forEach((row) => {
      const dt = row['Timestamp'] || row['Demo Date'] || row['Date'];
      if (dt) {
        const dStr = String(dt).slice(0, 10);
        if (dStr.startsWith('202')) dates.add(dStr);
      }
    });
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [validRows]);

  const columns = useMemo(() => {
    if (!validRows || validRows.length === 0) return ['Timestamp', 'AC Name', 'Student Name', 'Student Email', 'Student Phone', 'Course', 'Status'];
    if (currentTab?.headers && currentTab.headers.length > 0) {
      return currentTab.headers;
    }
    const keySet = new Set();
    validRows.forEach((row) => {
      Object.keys(row).forEach((k) => keySet.add(k));
    });
    return Array.from(keySet);
  }, [currentTab, validRows]);

  // Filtered rows by search term & Date Filter
  const filteredRows = useMemo(() => {
    return validRows.filter((row) => {
      // Date Filter
      if (filterDate !== 'ALL') {
        const dt = row['Timestamp'] || row['Demo Date'] || row['Date'];
        const dStr = dt ? String(dt).slice(0, 10) : '';
        if (!dStr.includes(filterDate)) return false;
      }
      // Search Filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return Object.values(row).some((val) => String(val).toLowerCase().includes(term));
      }
      return true;
    });
  }, [validRows, searchTerm, filterDate]);

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ backdropFilter: 'blur(6px)', background: 'rgba(15, 23, 42, 0.65)' }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '1280px',
          width: '95vw',
          height: '92vh',
          borderRadius: '1rem',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          background: '#ffffff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- GOOGLE SHEETS HEADER TOOLBAR --- */}
        <div
          style={{
            background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #047857'
          }}
        >
          {/* Left Title & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileSpreadsheet size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  Lasak - Sales Revenue Tracker View
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    background: '#10b981',
                    color: '#ffffff',
                    padding: '0.15rem 0.6rem',
                    borderRadius: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }}></span>
                  Live Sheet Connected
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#a7f3d0', margin: '0.15rem 0 0 0' }}>
                Multi-Tab Google Spreadsheet Viewer • {fetchedTabs ? `${Object.keys(fetchedTabs).length} Sub-Sheets Loaded` : 'Loading Sub-Sheets...'}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* View Mode Toggle: Grid vs Iframe */}
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.2rem', borderRadius: '0.5rem', display: 'flex', gap: '0.2rem' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  color: viewMode === 'grid' ? '#047857' : '#e2e8f0',
                  border: 'none',
                  borderRadius: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Grid size={15} />
                <span>Spreadsheet Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('iframe')}
                style={{
                  background: viewMode === 'iframe' ? '#ffffff' : 'transparent',
                  color: viewMode === 'iframe' ? '#047857' : '#e2e8f0',
                  border: 'none',
                  borderRadius: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Eye size={15} />
                <span>Google Web View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleTriggerFetch}
              disabled={isFetching}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                borderRadius: '0.5rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: isFetching ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={isFetching ? 'spin-animation' : ''} />
              <span>{isFetching ? 'Fetching Sheet...' : 'Refresh Sheet'}</span>
            </button>

            <a
              href="https://docs.google.com/spreadsheets/d/1_XXDnftilVvpwOysCzigKPHIwGPo1N07CFZsiQ1lh84/edit"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#ffffff',
                color: '#047857',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none'
              }}
            >
              <span>Open in Google Sheets</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '0.5rem',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- SECONDARY TOOLBAR: SEARCH & PAGINATION & SUB-SHEET ACTIONS --- */}
        <div
          style={{
            background: '#f8fafc',
            borderBottom: '1px solid #cbd5e1',
            padding: '0.6rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Search Box & Date Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                type="text"
                placeholder={`Search in ${selectedTabKey || 'sub-sheet'}...`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  paddingTop: '0.4rem',
                  paddingBottom: '0.4rem',
                  fontSize: '0.8rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.4rem',
                  background: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            {/* Date Filter Dropdown */}
            {availableTabDates.length > 0 && (
              <select
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '0.4rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  borderRadius: '0.4rem',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#1e293b',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">📅 All Dates ({validRows.length} rows)</option>
                {availableTabDates.map((dt) => (
                  <option key={dt} value={dt}>
                    📅 {dt}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Center Info Banner */}
          {syncStatus && (
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                color: syncStatus.type === 'success' ? '#047857' : '#b91c1c',
                background: syncStatus.type === 'success' ? '#ecfdf5' : '#fef2f2',
                padding: '0.3rem 0.75rem',
                borderRadius: '0.4rem',
                border: syncStatus.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {syncStatus.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              <span>{syncStatus.text}</span>
            </div>
          )}

          {/* Right Pagination & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Total Row Count */}
            <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>
              Showing {filteredRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} rows
            </div>

            {/* Rows Per Page Selector */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '0.3rem 0.5rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '0.35rem',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
              <option value={200}>200 / page</option>
              <option value={10000}>Show All ({filteredRows.length})</option>
            </select>

            {/* Pagination controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.35rem',
                  padding: '0.3rem 0.5rem',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', minWidth: '55px', textAlign: 'center' }}>
                Page {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.35rem',
                  padding: '0.3rem 0.5rem',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage >= totalPages ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Push Local & Export CSV */}
            <button
              type="button"
              onClick={handleTriggerSync}
              disabled={isSyncing}
              style={{
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.4rem',
                padding: '0.4rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: isSyncing ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={isSyncing ? 'spin-animation' : ''} />
              <span>{isSyncing ? 'Pushing...' : 'Push to Sheet'}</span>
            </button>

            <button
              type="button"
              onClick={onExportCSV}
              style={{
                background: '#475569',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.4rem',
                padding: '0.4rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* --- MAIN SPREADSHEET BODY --- */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
          {/* VIEW MODE 1: NATIVE SPREADSHEET GRID */}
          {viewMode === 'grid' && (
            <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif',
                  fontSize: '0.8rem',
                  tableLayout: 'auto'
                }}
              >
                {/* GRID TABLE HEADER (A, B, C... + Field Names) */}
                <thead>
                  {/* Row 1: Excel Column Letters A, B, C, D... */}
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    <th
                      style={{
                        width: '45px',
                        minWidth: '45px',
                        background: '#e2e8f0',
                        color: '#64748b',
                        fontWeight: '700',
                        textAlign: 'center',
                        padding: '0.35rem 0.5rem',
                        borderRight: '1px solid #cbd5e1',
                        position: 'sticky',
                        top: 0,
                        zIndex: 3
                      }}
                    >
                      FX
                    </th>
                    {columns.map((colName, idx) => (
                      <th
                        key={`letter-${idx}`}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontWeight: '700',
                          fontSize: '0.7rem',
                          textAlign: 'center',
                          padding: '0.2rem 0.5rem',
                          borderRight: '1px solid #cbd5e1',
                          borderBottom: '1px solid #e2e8f0',
                          position: 'sticky',
                          top: 0,
                          zIndex: 2,
                          textTransform: 'uppercase'
                        }}
                      >
                        {getColLetter(idx)}
                      </th>
                    ))}
                  </tr>

                  {/* Row 2: Field Names */}
                  <tr style={{ background: '#059669', color: '#ffffff' }}>
                    <th
                      style={{
                        background: '#047857',
                        color: '#ffffff',
                        fontWeight: '800',
                        textAlign: 'center',
                        padding: '0.5rem',
                        borderRight: '1px solid #065f46',
                        position: 'sticky',
                        top: '25px',
                        zIndex: 3
                      }}
                    >
                      #
                    </th>
                    {columns.map((colName, idx) => (
                      <th
                        key={`col-${idx}`}
                        style={{
                          padding: '0.55rem 0.85rem',
                          fontWeight: '700',
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                          borderRight: '1px solid #047857',
                          position: 'sticky',
                          top: '25px',
                          zIndex: 2
                        }}
                      >
                        {colName}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* GRID TABLE BODY */}
                <tbody>
                  {pageRows.length > 0 ? (
                    pageRows.map((row, rIdx) => {
                      const globalRowIndex = (currentPage - 1) * pageSize + rIdx + 1;
                      const isEven = rIdx % 2 === 0;

                      return (
                        <tr
                          key={`r-${rIdx}`}
                          style={{
                            background: isEven ? '#ffffff' : '#f8fafc',
                            transition: 'background 0.15s ease'
                          }}
                          className="spreadsheet-row"
                        >
                          {/* Row Number Column */}
                          <td
                            style={{
                              background: '#f1f5f9',
                              color: '#64748b',
                              fontWeight: '700',
                              textAlign: 'center',
                              fontSize: '0.72rem',
                              padding: '0.45rem 0.5rem',
                              borderRight: '1px solid #cbd5e1',
                              borderBottom: '1px solid #cbd5e1',
                              position: 'sticky',
                              left: 0,
                              zIndex: 1
                            }}
                          >
                            {globalRowIndex}
                          </td>

                          {/* Cell Columns */}
                          {columns.map((colName, cIdx) => {
                            const val = row[colName] !== undefined && row[colName] !== null ? String(row[colName]) : '';
                            const isEmail = val.includes('@');
                            const isUrl = val.startsWith('http://') || val.startsWith('https://');

                            return (
                              <td
                                key={`c-${cIdx}`}
                                style={{
                                  padding: '0.45rem 0.85rem',
                                  borderRight: '1px solid #e2e8f0',
                                  borderBottom: '1px solid #e2e8f0',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '300px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  color: isUrl ? '#2563eb' : isEmail ? '#0f766e' : '#1e293b'
                                }}
                                title={val}
                              >
                                {isUrl ? (
                                  <a href={val} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                                    View Link
                                  </a>
                                ) : (
                                  val || '-'
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        style={{
                          padding: '3rem 1.5rem',
                          textAlign: 'center',
                          color: '#64748b',
                          background: '#ffffff'
                        }}
                      >
                        <FileSpreadsheet size={42} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#334155' }}>
                          No Spreadsheet Entries Found
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                          {searchTerm ? `No rows matching "${searchTerm}". Try clearing search.` : 'Click "Refresh Sheet" above to fetch live rows.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW MODE 2: EMBEDDED GOOGLE SHEETS IFRAME */}
          {viewMode === 'iframe' && (
            <div style={{ flex: 1, width: '100%', height: '100%', background: '#f8fafc', position: 'relative' }}>
              <iframe
                title="Google Sheet Live View"
                src={EMBED_SHEET_URL}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* --- BOTTOM SHEET TABS BAR (GOOGLE SHEETS STYLE TABS) --- */}
        <div
          style={{
            background: '#e2e8f0',
            borderTop: '1px solid #cbd5e1',
            padding: '0.35rem 1rem 0 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            overflowX: 'auto'
          }}
        >
          {fetchedTabs &&
            Object.entries(fetchedTabs).map(([tabName, tabInfo]) => {
              const isActive = selectedTabKey === tabName;
              return (
                <button
                  key={tabName}
                  type="button"
                  onClick={() => {
                    setSelectedTabKey(tabName);
                    setCurrentPage(1);
                  }}
                  style={{
                    background: isActive ? '#ffffff' : '#cbd5e1',
                    color: isActive ? '#047857' : '#475569',
                    borderTopLeftRadius: '0.4rem',
                    borderTopRightRadius: '0.4rem',
                    padding: '0.45rem 1rem',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    border: '1px solid #cbd5e1',
                    borderBottom: isActive ? '2px solid #059669' : '1px solid #cbd5e1',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 -2px 5px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isActive ? '#10b981' : '#94a3b8' }}></span>
                  <span>{tabName}</span>
                  <span
                    style={{
                      background: isActive ? '#ecfdf5' : '#e2e8f0',
                      color: isActive ? '#047857' : '#64748b',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.7rem',
                      fontWeight: '700'
                    }}
                  >
                    {(tabInfo.data || []).filter(r => r && Object.values(r).some(v => v !== null && v !== undefined && String(v).trim() !== '')).length || tabInfo.totalRows}
                  </span>
                </button>
              );
            })}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>
              Lasak Edu Google Sheet Engine
            </span>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ padding: '0.25rem 0.85rem', fontSize: '0.75rem', borderRadius: '0.35rem' }}
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
