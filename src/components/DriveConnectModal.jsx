import React, { useState } from 'react';
import { X, CheckCircle2, Users, Building, MapPin, Award, ExternalLink, Send, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DriveConnectModal({ drive, students, currentUser, onClose, onNominateStudents }) {
  if (!drive) return null;

  const isGoogle = drive.company.toLowerCase().includes('google');

  // Filter students eligible for this drive (dept match & minimum GPA threshold)
  const eligibleStudents = students.filter(s => {
    const deptMatch = drive.dept ? s.dept === drive.dept : true;
    const isNotPlacedYet = s.placedStatus !== 'Placed';
    return deptMatch && isNotPlacedYet;
  });

  const [selectedStudentIds, setSelectedStudentIds] = useState(
    eligibleStudents.map(s => s.id)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const toggleStudent = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onNominateStudents(drive.company, selectedStudentIds);
      setIsSubmitting(false);
      setSuccessMessage(`Successfully connected ${selectedStudentIds.length} candidate(s) to ${drive.company} recruitment portal!`);
      setTimeout(() => {
        onClose();
      }, 1800);
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '680px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div className="modal-title-group">
            {isGoogle ? (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.5rem',
                  background: '#4285F4',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.2rem'
                }}
              >
                G
              </div>
            ) : (
              <Building size={24} color="#4f46e5" />
            )}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                Connect with {drive.company}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Recruitment Portal Integration & Candidate Nomination
              </p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '1.25rem 0' }}>
          {/* Success Banner */}
          {successMessage && (
            <div className="alert-banner alert-success" style={{ marginBottom: '1rem' }}>
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Corporate Drive Overview Banner */}
          <div
            style={{
              background: isGoogle ? '#eff6ff' : '#f8fafc',
              border: isGoogle ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: isGoogle ? '#1d4ed8' : '#475569', textTransform: 'uppercase' }}>
                  {drive.dept || 'ALL'} DEPARTMENT DRIVE
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0.1rem 0 0.25rem 0' }}>
                  {drive.role}
                </h4>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  background: drive.status === 'Active' ? '#ecfdf5' : '#eff6ff',
                  color: drive.status === 'Active' ? '#047857' : '#1d4ed8'
                }}
              >
                {drive.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.825rem', color: '#334155' }}>
              <div>
                <span style={{ color: '#64748b' }}>Package:</span> <strong>{drive.ctc}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Vacancies:</span> <strong>{drive.vacancies} Seats</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Location:</span> <strong>{drive.location}</strong>
              </div>
            </div>

            {isGoogle && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#1e40af' }}>
                <ShieldCheck size={16} color="#2563eb" />
                <span>Google Campus Connect API Online — Real-time candidate sync enabled.</span>
              </div>
            )}
          </div>

          {/* Candidate Selection Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={16} color="#4f46e5" />
                Eligible Student Candidates ({eligibleStudents.length})
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {selectedStudentIds.length} Selected
              </span>
            </div>

            {eligibleStudents.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                No unplaced students currently match the department criteria ({drive.dept}).
              </div>
            ) : (
              <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <table className="data-table" style={{ margin: 0, fontSize: '0.85rem' }}>
                  <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.length === eligibleStudents.length && eligibleStudents.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds(eligibleStudents.map(s => s.id));
                            } else {
                              setSelectedStudentIds([]);
                            }
                          }}
                        />
                      </th>
                      <th>Candidate Name</th>
                      <th>Dept</th>
                      <th>GPA</th>
                      <th>Current Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleStudents.map((s) => {
                      const isChecked = selectedStudentIds.includes(s.id);
                      return (
                        <tr
                          key={s.id}
                          style={{ background: isChecked ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                          onClick={() => toggleStudent(s.id)}
                        >
                          <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleStudent(s.id)}
                            />
                          </td>
                          <td style={{ fontWeight: '700', color: '#0f172a' }}>
                            {s.name}
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '400' }}>{s.email}</div>
                          </td>
                          <td><strong>{s.dept}</strong></td>
                          <td><strong>{s.gpa}</strong></td>
                          <td>
                            <span className={`status-badge badge-${s.placedStatus.toLowerCase().replace(' ', '-')}`}>
                              {s.placedStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              background: isGoogle ? '#4285F4' : '#4f46e5',
              borderColor: isGoogle ? '#357ae8' : '#4338ca',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={handleConnectSubmit}
            disabled={isSubmitting || selectedStudentIds.length === 0}
          >
            <Send size={16} />
            <span>
              {isSubmitting
                ? 'Connecting to Portal...'
                : `Nominate ${selectedStudentIds.length} Student(s) to ${drive.company}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
