import React, { useState, useMemo } from 'react';
import { Users, BookOpen, CheckCircle, Clock, PlusCircle, Search, Eye, MessageSquare, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';
import { filterStudentsForUser, logAccessAttempt } from '../utils/security';

export default function AdvisorDashboard({
  user,
  students,
  activeDepartment,
  onSelectStudent,
  onOpenCounsellingModal
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const deptInfo = DEPARTMENTS.find(d => d.id === activeDepartment) || DEPARTMENTS[0];

  // Core Access Rule: Career Advisor sees ONLY students assigned to them
  const myAssignedStudents = useMemo(() => {
    return filterStudentsForUser(students, user, activeDepartment);
  }, [students, user, activeDepartment]);

  // Check if search matches candidates NOT assigned to this advisor
  const unassignedSearchMatches = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    const otherStudents = students.filter(s =>
      s.dept === activeDepartment &&
      !(s.assignedAdvisorId === user.id || s.assignedAdvisorName === user.name)
    );
    const matches = otherStudents.filter(s => s.id.toLowerCase().includes(term) || s.name.toLowerCase().includes(term));
    if (matches.length > 0) {
      matches.forEach(m => {
        logAccessAttempt({
          user,
          studentId: m.id,
          action: 'SEARCH_UNAUTHORIZED_RECORD',
          granted: false,
          reason: `SEARCH_DENIED: Advisor ${user.name} searched for unassigned candidate ${m.id}`
        });
      });
    }
    return matches;
  }, [searchTerm, students, user, activeDepartment]);

  const activeCases = myAssignedStudents.filter(s => s.counsellingStatus === 'Active').length;
  const scheduledCases = myAssignedStudents.filter(s => s.counsellingStatus === 'Scheduled').length;
  const resolvedCases = myAssignedStudents.filter(s => s.counsellingStatus === 'Resolved').length;

  const filteredStudents = myAssignedStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Advisor Counselling Hub — {user.name}</h1>
          <p>My Assigned Student Roster for <strong>{deptInfo.name} ({activeDepartment})</strong></p>
        </div>
        <div style={{ background: '#ecfdf5', color: '#047857', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '800' }}>
          DEPT OF {activeDepartment}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">My Assigned Students</div>
            <div className="kpi-value">{myAssignedStudents.length}</div>
            <div className="kpi-subtext">In {activeDepartment} Department</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Active Guidance Cases</div>
            <div className="kpi-value" style={{ color: '#b45309' }}>{activeCases}</div>
            <div className="kpi-subtext">Ongoing prep & reviews</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Scheduled Meetings</div>
            <div className="kpi-value" style={{ color: '#4f46e5' }}>{scheduledCases}</div>
            <div className="kpi-subtext">Upcoming sessions</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
            <BookOpen size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-info-label">Resolved / Placed</div>
            <div className="kpi-value" style={{ color: '#047857' }}>{resolvedCases}</div>
            <div className="kpi-subtext">Offer secured</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* RBAC Security Isolation Banner */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={22} color="#16a34a" />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#15803d' }}>
              Core Access Control Enforced: Strictly Isolated Portfolio Scope
            </div>
            <div style={{ fontSize: '0.8rem', color: '#166534' }}>
              Viewing records exclusively assigned to <strong>{user.name}</strong> ({user.id}). Cross-advisor data & leaderboards are restricted.
            </div>
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>
          SECURE PORTFOLIO MODE
        </span>
      </div>

      {/* Unassigned Candidate Search Access Denied Warning Banner */}
      {unassignedSearchMatches.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Lock size={20} color="#dc2626" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#991b1b' }}>
              Access Restricted: Candidate Record Belongs to Another Advisor
            </div>
            <div style={{ fontSize: '0.8rem', color: '#7f1d1d' }}>
              {unassignedSearchMatches.length} candidate record(s) matching "{searchTerm}" belong to another advisor's assigned caseload. Under security policy, candidate details are withheld and this attempt has been recorded to the audit log.
            </div>
          </div>
        </div>
      )}

      {/* My Assigned Students Table & Log Entry */}
      <div className="content-card">
        <div className="card-header-bar">
          <div className="card-header-title">
            <h3>Assigned Students ({filteredStudents.length})</h3>
            <p>Select a student to add counselling notes, schedule sessions, or view recommendations</p>
          </div>
          <div className="table-controls">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search my student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Student Name</th>
                <th>GPA</th>
                <th>Placement Target</th>
                <th>Counselling Status</th>
                <th>Latest Note</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => {
                  const latestNote = s.counsellingNotes && s.counsellingNotes.length > 0
                    ? s.counsellingNotes[s.counsellingNotes.length - 1]
                    : null;

                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: '700', color: '#4f46e5' }}>{s.id}</td>
                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.phone}</div>
                      </td>
                      <td style={{ fontWeight: '700' }}>{s.gpa}</td>
                      <td>
                        <div>
                          <span className={`status-badge badge-${s.placedStatus.toLowerCase().replace(' ', '-')}`}>
                            {s.placedStatus}
                          </span>
                        </div>
                        {s.company !== '—' && (
                          <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '700', marginTop: '0.2rem' }}>
                            {s.company}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge badge-${s.counsellingStatus.toLowerCase()}`}>
                          {s.counsellingStatus}
                        </span>
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        {latestNote ? (
                          <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                            <span style={{ fontWeight: '700', color: '#4f46e5' }}>[{latestNote.date}]</span> {latestNote.text}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', italic: 'true' }}>No notes recorded yet</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#4f46e5', color: '#ffffff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                            onClick={() => onOpenCounsellingModal(s)}
                          >
                            <PlusCircle size={14} /> Add Note
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={28} color="#94a3b8" />
                      <div>No students currently assigned to you in the <strong>{activeDepartment}</strong> department.</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Tip: Switch department using the header dropdown or ask Senior Career Advisor to allocate students.
                      </div>
                    </div>
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
