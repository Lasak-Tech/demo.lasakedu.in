import React, { useState } from 'react';
import { Users, CheckCircle, Clock, XCircle, Briefcase, Award, TrendingUp, Filter, Search, Eye } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

export default function HeadDashboard({
  students,
  recruitmentDrives,
  activeDepartment,
  activeTab,
  onSelectStudent
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Overall statistics across all departments
  const totalApps = students.length;
  const admittedCount = students.filter(s => s.status === 'Admitted').length;
  const pendingCount = students.filter(s => s.status === 'Submitted' || s.status === 'Under Review').length;
  const rejectedCount = students.filter(s => s.status === 'Rejected').length;
  const placedCount = students.filter(s => s.placedStatus === 'Placed').length;

  // Departmental distribution calculation
  const deptStats = DEPARTMENTS.map(dept => {
    const deptApps = students.filter(s => s.dept === dept.code);
    const admitted = deptApps.filter(s => s.status === 'Admitted').length;
    const placed = deptApps.filter(s => s.placedStatus === 'Placed').length;
    return {
      code: dept.code,
      name: dept.name,
      total: deptApps.length,
      admitted,
      placed,
      color: dept.color
    };
  });

  // Filtered applications list
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' ? true : student.dept === deptFilter;
    const matchesStatus = statusFilter === 'ALL' ? true : student.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Head of Admissions Overview</h1>
          <p>Institutional Summary & Cross-Departmental Admissions Control</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#4338ca', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', fontWeight: '700' }}>
            Active View: {activeDepartment === 'ALL' ? 'All Departments' : activeDepartment}
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Total Applications</div>
            <div className="kpi-value">{totalApps}</div>
            <div className="kpi-subtext">Across MECH, CIVIL, IT</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Total Admitted</div>
            <div className="kpi-value">{admittedCount}</div>
            <div className="kpi-subtext" style={{ color: '#047857' }}>
              <TrendingUp size={14} /> {Math.round((admittedCount / totalApps) * 100)}% Acceptance Rate
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Pending Review</div>
            <div className="kpi-value">{pendingCount}</div>
            <div className="kpi-subtext">Requires Officer Action</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Students Placed</div>
            <div className="kpi-value">{placedCount}</div>
            <div className="kpi-subtext" style={{ color: '#4f46e5' }}>
              <Award size={14} /> {Math.round((placedCount / (admittedCount || 1)) * 100)}% Placement Rate
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <Briefcase size={22} />
          </div>
        </div>
      </div>

      {/* Visual Charts & Department Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="content-card" style={{ marginBottom: 0 }}>
          <div className="card-header-bar">
            <div className="card-header-title">
              <h3>Applications & Enrollment by Department</h3>
              <p>Live departmental volume distribution</p>
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div className="chart-bar-container">
              {deptStats.map(dept => {
                const percentage = Math.round((dept.total / (totalApps || 1)) * 100);
                return (
                  <div key={dept.code} className="chart-bar-item">
                    <div className="chart-bar-label">
                      <span>{dept.name} ({dept.code})</span>
                      <span>{dept.total} Apps ({percentage}%)</span>
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill"
                        style={{ width: `${percentage}%`, backgroundColor: dept.color }}
                      ></div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                      Admitted: {dept.admitted} | Placed: {dept.placed}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="content-card" style={{ marginBottom: 0 }}>
          <div className="card-header-bar">
            <div className="card-header-title">
              <h3>Admissions Decision Ratio</h3>
              <p>Approved vs Under Review vs Rejected</p>
            </div>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700' }}>
                <span style={{ color: '#047857' }}>Admitted ({admittedCount})</span>
                <span>{Math.round((admittedCount / totalApps) * 100)}%</span>
              </div>
              <div className="chart-bar-track" style={{ marginTop: '0.25rem' }}>
                <div className="chart-bar-fill" style={{ width: `${(admittedCount / totalApps) * 100}%`, backgroundColor: '#10b981' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700' }}>
                <span style={{ color: '#b45309' }}>Under Review ({pendingCount})</span>
                <span>{Math.round((pendingCount / totalApps) * 100)}%</span>
              </div>
              <div className="chart-bar-track" style={{ marginTop: '0.25rem' }}>
                <div className="chart-bar-fill" style={{ width: `${(pendingCount / totalApps) * 100}%`, backgroundColor: '#f59e0b' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700' }}>
                <span style={{ color: '#be123c' }}>Rejected ({rejectedCount})</span>
                <span>{Math.round((rejectedCount / totalApps) * 100)}%</span>
              </div>
              <div className="chart-bar-track" style={{ marginTop: '0.25rem' }}>
                <div className="chart-bar-fill" style={{ width: `${(rejectedCount / totalApps) * 100}%`, backgroundColor: '#f43f5e' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="content-card">
        <div className="card-header-bar">
          <div className="card-header-title">
            <h3>Master Student Applications Directory</h3>
            <p>Full institutional records across departments</p>
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
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="ALL">All Depts</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
              <option value="IT">Information Tech</option>
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Submitted">Submitted</option>
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
                <th>Department</th>
                <th>GPA / Score</th>
                <th>Status</th>
                <th>Placement</th>
                <th>Action</th>
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
                    <td>
                      <span style={{ fontWeight: '700', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
                        {s.dept}
                      </span>
                    </td>
                    <td>
                      <div><strong>GPA:</strong> {s.gpa}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.entranceScore}%ile</div>
                    </td>
                    <td>
                      <span className={`status-badge badge-${s.status.toLowerCase().replace(' ', '-')}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge badge-${s.placedStatus.toLowerCase().replace(' ', '-')}`}>
                        {s.placedStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                        onClick={() => onSelectStudent(s)}
                      >
                        <Eye size={14} /> View Record
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No student application records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings / Institutional Info Footer Banner */}
      {activeTab === 'settings' && (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
            Institutional Admissions Settings
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            System configuration, seats allocation per department (MECH: 60, CIVIL: 60, IT: 120), and admissions round cutoffs.
          </p>
        </div>
      )}
    </div>
  );
}
