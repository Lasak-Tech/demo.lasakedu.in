import React, { useState } from 'react';
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
  Sparkles,
  ShieldCheck,
  DownloadCloud,
  Table
} from 'lucide-react';
import { APPS_SCRIPT_TEMPLATE, fetchFromGoogleSheet } from '../utils/googleSheets';

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
  const [urlInput, setUrlInput] = useState(sheetUrl || '');
  const [isCopied, setIsCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { type: 'success'|'error', text: '' }
  const [showCodeGuide, setShowCodeGuide] = useState(false);
  const [fetchedTabs, setFetchedTabs] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveUrl(urlInput.trim());
    setSyncStatus({ type: 'success', text: 'Google Sheet Web App URL updated successfully!' });
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
    if (!urlInput.trim()) {
      setSyncStatus({
        type: 'error',
        text: 'Please enter a valid Google Apps Script Web App URL first.'
      });
      return;
    }

    setIsFetching(true);
    setSyncStatus(null);
    try {
      const data = await fetchFromGoogleSheet(urlInput.trim());
      if (data && data.subSheets) {
        setFetchedTabs(data.subSheets);
        if (onFetchData) {
          onFetchData(data);
        }
        const tabNames = Object.keys(data.subSheets);
        setSyncStatus({
          type: 'success',
          text: `Fetched ${tabNames.length} sub-sheets from "${data.spreadsheetName || 'Sales Revenue Tracker'}": ${tabNames.join(', ')}`
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '780px', width: '92%', borderRadius: '1rem', padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '0.6rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileSpreadsheet size={24} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                Google Sheet & Sub-Sheets Integration
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#a7f3d0', margin: '0.15rem 0 0 0' }}>
                {dashboardType} Dashboard • Multi-Tab Live Fetch & Cloud Push Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '0.5rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '1.5rem', maxHeight: '78vh', overflowY: 'auto' }}>
          {/* Sync Feedback Alert */}
          {syncStatus && (
            <div
              className={`alert-banner ${syncStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}
              style={{ marginBottom: '1.25rem' }}
            >
              {syncStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{syncStatus.text}</span>
            </div>
          )}

          {/* Connection Status Box */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Zap size={20} color="#059669" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#065f46' }}>
                    {sheetUrl ? '● Google Sheet Live WebApp Connected' : '○ Local Mode Active (Sheet Not Linked)'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#047857', margin: '0.25rem 0 0 0' }}>
                  Linked Sheet: <strong>"Lasak - Sales Revenue Tracker View"</strong> • Handles all Sub-Sheet tabs automatically.
                </p>
              </div>
            </div>

            <a
              href="https://docs.google.com/spreadsheets/d/1_XXDnftilVvpwOysCzigKPHIwGPo1N07CFZsiQ1lh84/edit"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#047857',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
                background: '#ffffff',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #a7f3d0'
              }}
            >
              <span>Open Sales Revenue Sheet</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Web App URL Configuration Form */}
          <form onSubmit={handleSave} style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="webAppUrlInput"
              style={{
                fontSize: '0.875rem',
                fontWeight: '800',
                color: '#0f172a',
                display: 'block',
                marginBottom: '0.4rem'
              }}
            >
              Google Apps Script Web App URL
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Link
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }}
                />
                <input
                  id="webAppUrlInput"
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '38px',
                    paddingRight: '12px',
                    paddingTop: '0.6rem',
                    paddingBottom: '0.6rem',
                    fontSize: '0.85rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  background: '#059669',
                  borderColor: '#047857',
                  whiteSpace: 'nowrap',
                  padding: '0.6rem 1.1rem'
                }}
              >
                Save URL
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
              Paste your deployed Apps Script Web App URL below to enable live fetch and push across all sub-sheets.
            </p>
          </form>

          {/* Fetched Sub-Sheets Preview Bar */}
          {fetchedTabs && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.85rem 1.1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Table size={16} color="#4f46e5" />
                <span>Live Sub-Sheets Detected in Spreadsheet ({Object.keys(fetchedTabs).length}):</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Object.entries(fetchedTabs).map(([tabName, tabInfo]) => (
                  <div key={tabName} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.4rem', padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: '700', color: '#334155', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                    <span>{tabName}</span>
                    <span style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', color: '#64748b', fontSize: '0.7rem' }}>
                      {tabInfo.totalRows} rows
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Grid: Fetch Subsheets, Push to Cloud & Export CSV */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            {/* Action 1: Fetch Subsheets Data */}
            <div
              style={{
                border: '1px solid #93c5fd',
                borderRadius: '0.75rem',
                padding: '1rem',
                background: '#eff6ff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <DownloadCloud size={18} color="#2563eb" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#1e3a8a' }}>
                  1. Fetch Live Subsheets Data
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#1e40af', marginBottom: '0.85rem' }}>
                Pull live entries from "Demo Booking Responses", "Student Data", and all subsheet tabs.
              </p>
              <button
                type="button"
                onClick={handleTriggerFetch}
                disabled={isFetching}
                style={{
                  width: '100%',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.65rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: isFetching ? 'not-allowed' : 'pointer'
                }}
              >
                <DownloadCloud size={16} className={isFetching ? 'spin-animation' : ''} />
                <span>{isFetching ? 'Fetching Subsheets...' : 'Fetch All Subsheets'}</span>
              </button>
            </div>

            {/* Action 2: Sync / Push to Cloud */}
            <div
              style={{
                border: '1px solid #a7f3d0',
                borderRadius: '0.75rem',
                padding: '1rem',
                background: '#f0fdf4'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <RefreshCw size={18} color="#059669" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#064e3b' }}>
                  2. Push Local Data to Sheet
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#047857', marginBottom: '0.85rem' }}>
                Transmit all {recordsCount} active local records to Google Sheet subsheet tab.
              </p>
              <button
                type="button"
                onClick={handleTriggerSync}
                disabled={isSyncing}
                style={{
                  width: '100%',
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.65rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: isSyncing ? 'not-allowed' : 'pointer'
                }}
              >
                <RefreshCw size={16} className={isSyncing ? 'spin-animation' : ''} />
                <span>{isSyncing ? 'Pushing Data...' : 'Push Data to Sheet'}</span>
              </button>
            </div>

            {/* Action 3: Export CSV */}
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                padding: '1rem',
                background: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Download size={18} color="#475569" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  3. Export CSV Backup
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.85rem' }}>
                Download formatted CSV containing all active dashboard entries.
              </p>
              <button
                type="button"
                onClick={onExportCSV}
                style={{
                  width: '100%',
                  background: '#475569',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.65rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} />
                <span>Download CSV File</span>
              </button>
            </div>
          </div>


          {/* Setup Guide Collapsible Accordion */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '0.75rem',
              overflow: 'hidden'
            }}
          >
            <button
              type="button"
              onClick={() => setShowCodeGuide(!showCodeGuide)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: '#f8fafc',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.875rem',
                color: '#334155'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={18} color="#4f46e5" />
                <span>How to connect your Google Sheet (Google Apps Script Setup Guide)</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#4f46e5' }}>
                {showCodeGuide ? 'Hide Setup Steps ▲' : 'Show Setup Steps ▼'}
              </span>
            </button>

            {showCodeGuide && (
              <div style={{ padding: '1rem 1.25rem', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                <ol style={{ paddingLeft: '1.2rem', fontSize: '0.825rem', color: '#334155', lineHeight: '1.6' }}>
                  <li>
                    Open a Google Sheet at <a href="https://sheets.new" target="_blank" rel="noreferrer">sheets.new</a>.
                  </li>
                  <li>
                    Click on <strong>Extensions</strong> in the top menu and select <strong>Apps Script</strong>.
                  </li>
                  <li>
                    Delete any default code, click the <strong>Copy Script Code</strong> button below, and paste it into the editor.
                  </li>
                  <li>
                    Click <strong>Deploy</strong> &gt; <strong>New deployment</strong>.
                  </li>
                  <li>
                    Select type: <strong>Web app</strong>. Set <i>Execute as</i>: <strong>Me</strong> and <i>Who has access</i>: <strong>Anyone</strong>.
                  </li>
                  <li>
                    Click <strong>Deploy</strong>, copy the generated <strong>Web app URL</strong>, and paste it in the field above!
                  </li>
                </ol>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    style={{
                      background: isCopied ? '#ecfdf5' : '#4f46e5',
                      color: isCopied ? '#047857' : '#ffffff',
                      border: isCopied ? '1px solid #a7f3d0' : 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    <span>{isCopied ? 'Script Copied to Clipboard!' : 'Copy Apps Script Code'}</span>
                  </button>

                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    100% Free & No API key needed!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: '0.5rem 1.25rem' }}
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
