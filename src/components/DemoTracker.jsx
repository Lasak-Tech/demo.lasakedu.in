import React, { useState, useMemo } from 'react';
import {
  BarChart2, Users, CheckCircle, Clock, XCircle, RefreshCw,
  Plus, Search, Filter, Download, Trophy, ChevronUp, ChevronDown, Eye
} from 'lucide-react';
import { DEPARTMENTS, COURSES, MOCK_USERS } from '../data/mockData';
import DemoForm from './DemoForm';

const STATUS_COLORS = {
  'Completed': { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
  'Scheduled': { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
  'Follow-up': { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  'Cancelled': { bg: '#fee2e2', text: '#be123c', border: '#fca5a5' }
};

const STAFF_ALL = MOCK_USERS.filter(u => u.roleCode !== 'HEAD_ADMISSIONS');

export default function DemoTracker({ demos, currentUser, onLogDemo, onUpdateDemoStatus }) {
  const isHead = currentUser.roleCode === 'HEAD_ADMISSIONS';
  const isSrManager = currentUser.roleCode === 'SR_MANAGER';
  const canSeeAll = isHead || isSrManager;

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterStaff, setFilterStaff] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  // Filter demos based on role
  const visibleDemos = useMemo(() => {
    if (canSeeAll) return demos;
    return demos.filter(d => d.staffId === currentUser.id);
  }, [demos, currentUser, canSeeAll]);

  // Filtered + sorted list
  const filteredDemos = useMemo(() => {
    return visibleDemos
      .filter(d => {
        const matchSearch = !search ||
          d.prospectName.toLowerCase().includes(search.toLowerCase()) ||
          d.course.toLowerCase().includes(search.toLowerCase());
        const matchDept = filterDept === 'ALL' || d.dept === filterDept;
        const matchStatus = filterStatus === 'ALL' || d.status === filterStatus;
        const matchStaff = filterStaff === 'ALL' || d.staffId === filterStaff;
        const matchFrom = !dateFrom || d.date >= dateFrom;
        const matchTo = !dateTo || d.date <= dateTo;
        return matchSearch && matchDept && matchStatus && matchStaff && matchFrom && matchTo;
      })
      .sort((a, b) => {
        let va = a[sortField] || '';
        let vb = b[sortField] || '';
        if (sortField === 'date') { va = a.date; vb = b.date; }
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [visibleDemos, search, filterDept, filterStatus, filterStaff, dateFrom, dateTo, sortField, sortDir]);

  // KPI counts
  const total = filteredDemos.length;
  const completed = filteredDemos.filter(d => d.status === 'Completed').length;
  const scheduled = filteredDemos.filter(d => d.status === 'Scheduled').length;
  const followUp = filteredDemos.filter(d => d.status === 'Follow-up').length;
  const cancelled = filteredDemos.filter(d => d.status === 'Cancelled').length;

  // Leaderboard
  const leaderboard = useMemo(() => {
    const staffScope = canSeeAll ? STAFF_ALL : [currentUser];
    return staffScope.map(staff => {
      const staffDemos = demos.filter(d => d.staffId === staff.id);
      const comp = staffDemos.filter(d => d.status === 'Completed').length;
      return {
        ...staff,
        total: staffDemos.length,
        completed: comp,
        scheduled: staffDemos.filter(d => d.status === 'Scheduled').length,
        followUp: staffDemos.filter(d => d.status === 'Follow-up').length,
        rate: staffDemos.length ? Math.round((comp / staffDemos.length) * 100) : 0
      };
    }).sort((a, b) => b.total - a.total);
  }, [demos, canSeeAll, currentUser]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => sortField === field
    ? (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)
    : null;

  const handleStatusEdit = (demoId, newStatus) => {
    onUpdateDemoStatus(demoId, newStatus);
    setEditingId(null);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>{canSeeAll ? 'Demo Analytics – All Staff' : 'My Demo Records'}</h1>
          <p>{canSeeAll ? 'Cross-staff demo tracking, filters and leaderboard' : 'Your personal demo log and activity'}</p>
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: 0, width: 'auto', padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} /> Log New Demo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {[
          { label: 'Total Demos', value: total, icon: BarChart2, bg: '#e0e7ff', color: '#4f46e5' },
          { label: 'Completed', value: completed, icon: CheckCircle, bg: '#d1fae5', color: '#047857' },
          { label: 'Scheduled', value: scheduled, icon: Clock, bg: '#dbeafe', color: '#1d4ed8' },
          { label: 'Follow-up', value: followUp, icon: RefreshCw, bg: '#fef3c7', color: '#b45309' },
          { label: 'Cancelled', value: cancelled, icon: XCircle, bg: '#fee2e2', color: '#be123c' }
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="kpi-card">
            <div>
              <div className="kpi-info-label">{label}</div>
              <div className="kpi-value">{value}</div>
            </div>
            <div className="kpi-icon-box" style={{ background: bg, color }}><Icon size={20} /></div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      {canSeeAll && (
        <div className="content-card" style={{ marginBottom: '1.75rem' }}>
          <div className="card-header-bar">
            <div className="card-header-title">
              <h3><Trophy size={16} style={{ display: 'inline', marginRight: '0.4rem', color: '#d97706' }} />Staff Demo Leaderboard</h3>
              <p>Total demos conducted per staff member (all-time)</p>
            </div>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leaderboard.map((staff, idx) => (
              <div key={staff.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: idx === 0 ? '#fffbeb' : '#f8fafc', borderRadius: '0.5rem', border: idx === 0 ? '1px solid #fde68a' : '1px solid #e2e8f0' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : idx === 1 ? '#e2e8f0' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', color: idx === 0 ? '#fff' : '#475569', flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: staff.badgeColor || '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0 }}>
                  {staff.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{staff.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{staff.role}</div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{staff.total}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Total</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#047857' }}>{staff.completed}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Done</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#b45309' }}>{staff.followUp}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Follow-up</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: staff.rate >= 70 ? '#047857' : staff.rate >= 50 ? '#b45309' : '#be123c' }}>{staff.rate}%</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Conv. Rate</div>
                  </div>
                  <div style={{ width: '100px' }}>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${staff.rate}%`, background: staff.rate >= 70 ? '#10b981' : staff.rate >= 50 ? '#f59e0b' : '#f43f5e', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demo Log Table */}
      <div className="content-card">
        <div className="card-header-bar">
          <div className="card-header-title">
            <h3>Demo Log</h3>
            <p>{filteredDemos.length} records matching filters</p>
          </div>
          <div className="table-controls" style={{ flexWrap: 'wrap' }}>
            <div className="search-input-wrapper">
              <Search size={16} />
              <input className="search-input" placeholder="Search prospect or course..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {canSeeAll && (
              <select className="filter-select" value={filterStaff} onChange={e => setFilterStaff(e.target.value)}>
                <option value="ALL">All Staff</option>
                {STAFF_ALL.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            )}
            <select className="filter-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="ALL">All Depts</option>
              {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.shortName}</option>)}
            </select>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option>Completed</option><option>Scheduled</option>
              <option>Follow-up</option><option>Cancelled</option>
            </select>
            <input type="date" className="filter-select" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From date" />
            <input type="date" className="filter-select" value={dateTo} onChange={e => setDateTo(e.target.value)} title="To date" />
          </div>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('date')}>
                  Date <SortIcon field="date" />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('prospectName')}>
                  Prospect <SortIcon field="prospectName" />
                </th>
                {canSeeAll && <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('staffName')}>
                  Staff <SortIcon field="staffName" />
                </th>}
                <th>Dept / Course</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemos.length > 0 ? filteredDemos.map(d => {
                const sc = STATUS_COLORS[d.status] || STATUS_COLORS['Scheduled'];
                return (
                  <tr key={d.id}>
                    <td style={{ whiteSpace: 'nowrap', fontWeight: '600', color: '#475569', fontSize: '0.82rem' }}>{d.date}</td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{d.prospectName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{d.prospectPhone}</div>
                    </td>
                    {canSeeAll && (
                      <td>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{d.staffName}</div>
                      </td>
                    )}
                    <td>
                      <span style={{ fontWeight: '700', fontSize: '0.75rem', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '0.25rem' }}>{d.dept}</span>
                      <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.2rem' }}>{d.course}</div>
                    </td>
                    <td>
                      {editingId === d.id ? (
                        <select
                          autoFocus
                          className="filter-select"
                          defaultValue={d.status}
                          onChange={e => handleStatusEdit(d.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                        >
                          <option>Completed</option><option>Scheduled</option>
                          <option>Follow-up</option><option>Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className="status-badge"
                          style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, cursor: 'pointer' }}
                          title="Click to update status"
                          onClick={() => { if (d.staffId === currentUser.id || canSeeAll) setEditingId(d.id); }}
                        >
                          {d.status}
                        </span>
                      )}
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.notes || <span style={{ color: '#94a3b8' }}>—</span>}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={canSeeAll ? 6 : 5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No demo records found for the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <DemoForm
          currentUser={currentUser}
          onSave={onLogDemo}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
