import React, { useState } from 'react';
import { Users, CheckCircle, Clock, XCircle, Search, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

export default function SeniorManagerDashboard({
  students,
  activeDepartment,
  onSelectStudent,
  onUpdateStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const deptInfo = DEPARTMENTS.find(d => d.id === activeDepartment) || DEPARTMENTS[0];

  // Filter students for selected department
  const deptStudents = students.filter(s => s.dept === activeDepartment);

  const totalDeptApps = deptStudents.length;
  const admittedDept = deptStudents.filter(s => s.status === 'Admitted').length;
  const pendingDept = deptStudents.filter(s => s.status === 'Submitted' || s.status === 'Under Review').length;
  const rejectedDept = deptStudents.filter(s => s.status === 'Rejected').length;

  const filteredStudents = deptStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' ? true : s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Senior Admissions Manager Hub</h1>
          <p>Admissions review & approvals for <strong>{deptInfo.name} ({activeDepartment})</strong></p>
        </div>
        <div style={{ background: `${deptInfo.color}15`, color: deptInfo.color, padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '800' }}>
          DEPT OF {activeDepartment}
        </div>
      </div>

      {/* KPI Cards for Department */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">{activeDepartment} Applications</div>
            <div className="kpi-value">{totalDeptApps}</div>
            <div className="kpi-subtext">Department total</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Admitted Students</div>
            <div className="kpi-value" style={{ color: '#047857' }}>{admittedDept}</div>
            <div className="kpi-subtext">Accepted applications</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Pending Action</div>
            <div className="kpi-value" style={{ color: '#b45309' }}>{pendingDept}</div>
            <div className="kpi-subtext">Awaiting manager decision</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Rejected</div>
            <div className="kpi-value" style={{ color: '#be123c' }}>{rejectedDept}</div>
            <div className="kpi-subtext">Declined applications</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#ffe4e6', color: '#e11d48' }}>
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* Applications Review Table */}
      <div className="content-card">
        <div className="card-header-bar">
          <div className="card-header-title">
            <h3>{deptInfo.name} Student Applications</h3>
            <p>Review credentials, entrance percentile, and approve/reject applications</p>
          </div>
          <div className="table-controls">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search student or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted (New)</option>
              <option value="Under Review">Under Review</option>
              <option value="Admitted">Admitted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Student Name</th>
                <th>GPA</th>
                <th>Entrance Score</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '700', color: '#4f46e5' }}>{s.id}</td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.email}</div>
                    </td>
                    <td style={{ fontWeight: '700' }}>{s.gpa}</td>
                    <td><span style={{ fontWeight: '700', color: '#4f46e5' }}>{s.entranceScore}%ile</span></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.appliedDate}</td>
                    <td>
                      <span className={`status-badge badge-${s.status.toLowerCase().replace(' ', '-')}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.65rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                          onClick={() => onSelectStudent(s)}
                          title="View Full Profile & Decision Modal"
                        >
                          <Eye size={14} /> Review
                        </button>

                        {s.status !== 'Admitted' && (
                          <button
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.35rem 0.65rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                            onClick={() => onUpdateStatus(s.id, 'Admitted', 'Approved by Senior Admissions Manager')}
                            title="Approve Admission"
                          >
                            <ThumbsUp size={14} /> Approve
                          </button>
                        )}

                        {s.status !== 'Rejected' && (
                          <button
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', padding: '0.35rem 0.65rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                            onClick={() => onUpdateStatus(s.id, 'Rejected', 'Rejected by Senior Admissions Manager')}
                            title="Reject Application"
                          >
                            <ThumbsDown size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No student applications in {activeDepartment} match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
