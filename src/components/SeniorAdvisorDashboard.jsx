import React, { useState } from 'react';
import { Briefcase, Building, UserCheck, DollarSign, Search, UserPlus, Eye, Award } from 'lucide-react';
import { DEPARTMENTS, CAREER_ADVISORS_LIST } from '../data/mockData';

export default function SeniorAdvisorDashboard({
  students,
  recruitmentDrives,
  activeDepartment,
  onSelectStudent,
  onOpenAssignModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [placementFilter, setPlacementFilter] = useState('ALL');

  const deptInfo = DEPARTMENTS.find(d => d.id === activeDepartment) || DEPARTMENTS[0];

  // Filter students by active department
  const deptStudents = students.filter(s => s.dept === activeDepartment && s.status === 'Admitted');
  const deptDrives = recruitmentDrives.filter(d => d.dept === activeDepartment);

  const placedCount = deptStudents.filter(s => s.placedStatus === 'Placed').length;
  const interviewingCount = deptStudents.filter(s => s.placedStatus === 'Interviewing').length;
  const eligibleCount = deptStudents.filter(s => s.placedStatus === 'Eligible' || s.placedStatus === 'Needs Guidance').length;
  const unassignedCount = deptStudents.filter(s => !s.assignedAdvisorId || s.assignedAdvisorName === 'Unassigned').length;

  const filteredStudents = deptStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = placementFilter === 'ALL' ? true : s.placedStatus === placementFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Senior Career Guidance & Placement Hub</h1>
          <p>Placement analytics & advisor allocation for <strong>{deptInfo.name} ({activeDepartment})</strong></p>
        </div>
        <div style={{ background: '#fffbeb', color: '#b45309', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '800' }}>
          DEPT OF {activeDepartment}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Placed Students</div>
            <div className="kpi-value" style={{ color: '#047857' }}>{placedCount}</div>
            <div className="kpi-subtext">Offers accepted</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>
            <Award size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">In Interview Process</div>
            <div className="kpi-value" style={{ color: '#b45309' }}>{interviewingCount}</div>
            <div className="kpi-subtext">Active hiring rounds</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Briefcase size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Recruitment Drives</div>
            <div className="kpi-value" style={{ color: '#4f46e5' }}>{deptDrives.length}</div>
            <div className="kpi-subtext">Companies visiting</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Building size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Unassigned Students</div>
            <div className="kpi-value" style={{ color: unassignedCount > 0 ? '#dc2626' : '#059669' }}>
              {unassignedCount}
            </div>
            <div className="kpi-subtext">Needs Advisor Allocation</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <UserPlus size={22} />
          </div>
        </div>
      </div>

      {/* Recruitment Drives Section */}
      <div className="content-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header-bar">
          <div className="card-header-title">
            <h3>{deptInfo.name} Recruiting Companies & Drives</h3>
            <p>Hiring partners, roles, CTC package, drive dates</p>
          </div>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role Offered</th>
                <th>CTC Package</th>
                <th>Drive Date</th>
                <th>Open Slots</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deptDrives.length > 0 ? (
                deptDrives.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{d.company}</td>
                    <td>{d.role}</td>
                    <td style={{ fontWeight: '800', color: '#047857' }}>{d.ctc}</td>
                    <td>{d.date}</td>
                    <td>{d.vacancies} Positions</td>
                    <td>
                      <span className={`status-badge badge-${d.status.toLowerCase()}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                    No campus placement drives currently scheduled for {activeDepartment}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Career Profiles & Advisor Allocation */}
      <div className="content-card">
        <div className="card-header-bar">
          <div className="card-header-title">
            <h3>Student Career Profiles & Advisor Allocation</h3>
            <p>Assign admitted students to Career Advisors for 1-on-1 guidance</p>
          </div>
          <div className="table-controls">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
            >
              <option value="ALL">All Placements</option>
              <option value="Placed">Placed</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Eligible">Eligible</option>
              <option value="Needs Guidance">Needs Guidance</option>
            </select>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>GPA</th>
                <th>Placement Status</th>
                <th>Company / CTC</th>
                <th>Assigned Career Advisor</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.id}</div>
                    </td>
                    <td style={{ fontWeight: '700' }}>{s.gpa}</td>
                    <td>
                      <span className={`status-badge badge-${s.placedStatus.toLowerCase().replace(' ', '-')}`}>
                        {s.placedStatus}
                      </span>
                    </td>
                    <td>
                      {s.company !== '—' ? (
                        <div>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{s.company}</div>
                          <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '700' }}>{s.packageAmt}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Unplaced</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: '700', color: s.assignedAdvisorName === 'Unassigned' ? '#dc2626' : '#0f172a' }}>
                          {s.assignedAdvisorName}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe', padding: '0.35rem 0.65rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                          onClick={() => onOpenAssignModal(s)}
                        >
                          <UserPlus size={14} /> Reassign Advisor
                        </button>
                        <button
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.65rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                          onClick={() => onSelectStudent(s)}
                        >
                          <Eye size={14} /> Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No admitted students in {activeDepartment} match criteria.
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
