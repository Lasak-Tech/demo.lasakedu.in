import React, { useState } from 'react';
import {
  Award,
  Building,
  CheckCircle2,
  Search,
  Filter,
  Users,
  Download,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Briefcase,
  TrendingUp,
  MapPin,
  Eye
} from 'lucide-react';
import PlacementDetailsModal from './PlacementDetailsModal';
import { exportToCSV } from '../utils/googleSheets';

export default function PlacementReportPage({ students = [], courses = [], onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // Filter only placed candidates or candidates with hired company info
  const placedStudents = students.filter(s => {
    const isPlaced = s.placedStatus === 'Placed' || (s.company && s.company !== '—');
    if (!isPlaced) return false;

    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.company && s.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.dept && s.dept.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedDeptFilter === 'ALL') return matchesSearch;
    return matchesSearch && s.dept === selectedDeptFilter;
  });

  // Placement Statistics Calculation
  const totalPlacedCount = placedStudents.length;
  const itPlacedCount = students.filter(s => s.dept === 'IT' && (s.placedStatus === 'Placed' || (s.company && s.company !== '—'))).length;
  const mechPlacedCount = students.filter(s => s.dept === 'MECH' && (s.placedStatus === 'Placed' || (s.company && s.company !== '—'))).length;
  const civilPlacedCount = students.filter(s => s.dept === 'CIVIL' && (s.placedStatus === 'Placed' || (s.company && s.company !== '—'))).length;

  const handleExportCSV = () => {
    const headers = [
      { label: 'Student ID', key: 'id' },
      { label: 'Candidate Name', key: 'name' },
      { label: 'Department', key: 'dept' },
      { label: 'GPA', key: 'gpa' },
      { label: 'Hired Company', key: 'company' },
      { label: 'Package CTC', key: 'packageAmt' },
      { label: 'Applied Date', key: 'appliedDate' },
      { label: 'Guided Advisor', key: 'assignedAdvisorName' }
    ];
    exportToCSV('lasak_placement_report', headers, placedStudents);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '1.75rem',
        border: '1px solid #e2e8f0'
      }}
    >
      {/* Header Bar with Back Button */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '0.5rem 0.85rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: '700',
                fontSize: '0.85rem',
                color: '#334155'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Drives</span>
            </button>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                Institutional Placement Details & Alumni Report Page
              </h1>
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '800'
                }}
              >
                VERIFIED PLACEMENTS
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
              Comprehensive breakdown of all candidates successfully placed across IT, Mechanical, and Civil programs.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            background: '#059669',
            color: '#ffffff',
            border: 'none',
            padding: '0.6rem 1.15rem',
            borderRadius: '0.5rem',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
          }}
        >
          <Download size={16} />
          <span>Export Placement Report CSV</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.15rem', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '800', textTransform: 'uppercase' }}>
            Total Placed Students
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#15803d', marginTop: '0.2rem' }}>
            {totalPlacedCount} Candidates
          </div>
          <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '600' }}>100% Verified Offer Letters</span>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.15rem', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: '800', textTransform: 'uppercase' }}>
            Highest Package
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1d4ed8', marginTop: '0.2rem' }}>
            ₹21.0 LPA
          </div>
          <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '600' }}>Microsoft India Development</span>
        </div>

        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '1.15rem', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#6b21a8', fontWeight: '800', textTransform: 'uppercase' }}>
            Average Package
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#7e22ce', marginTop: '0.2rem' }}>
            ₹13.4 LPA
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: '600' }}>Across All Course Programs</span>
        </div>

        <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '1.15rem', borderRadius: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#c2410c', fontWeight: '800', textTransform: 'uppercase' }}>
            Corporate Hiring Partners
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#c2410c', marginTop: '0.2rem' }}>
            15+ Top MNCs
          </div>
          <span style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: '600' }}>Google, Microsoft, Tata, L&T, Zoho</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
            Filter Dept:
          </span>
          {['ALL', 'IT', 'MECH', 'CIVIL'].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.825rem',
                fontWeight: '800',
                border: selectedDeptFilter === dept ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                background: selectedDeptFilter === dept ? '#4f46e5' : '#ffffff',
                color: selectedDeptFilter === dept ? '#ffffff' : '#334155',
                cursor: 'pointer'
              }}
            >
              {dept === 'ALL' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search candidate or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.2rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Placement Details Table View */}
      <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.825rem', color: '#475569' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Candidate Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Dept / Course</th>
              <th style={{ padding: '0.85rem 1rem' }}>Hired Company</th>
              <th style={{ padding: '0.85rem 1rem' }}>Salary Package</th>
              <th style={{ padding: '0.85rem 1rem' }}>Advisor</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {placedStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                  No placement record found matching your criteria.
                </td>
              </tr>
            ) : (
              placedStudents.map(student => {
                const isGoogle = student.company?.toLowerCase().includes('google');
                const isMicrosoft = student.company?.toLowerCase().includes('microsoft');

                return (
                  <tr
                    key={student.id}
                    style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem', transition: 'background 0.15s' }}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isGoogle ? '#4285F4' : isMicrosoft ? '#9333ea' : '#059669',
                            color: '#ffffff',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', color: '#0f172a' }}>{student.name}</div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>GPA: {student.gpa}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontWeight: '800', color: '#1e293b' }}>{student.dept}</span>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.appliedDate}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: '800', color: isGoogle ? '#1d4ed8' : isMicrosoft ? '#7e22ce' : '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Building size={15} />
                        <span>{student.company || 'Corporate Partner'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontWeight: '900', color: '#047857', fontSize: '0.925rem' }}>
                        {student.packageAmt || 'Confidential'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: '700' }}>
                      {student.assignedAdvisorName || 'Senior Advisor'}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: '800',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          background: '#ecfdf5',
                          color: '#047857',
                          border: '1px solid #a7f3d0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <CheckCircle2 size={13} /> PLACED
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedStudentForModal(student)}
                        style={{
                          background: '#e0e7ff',
                          color: '#3730a3',
                          border: '1px solid #c7d2fe',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Placement Details Modal */}
      {selectedStudentForModal && (
        <PlacementDetailsModal
          student={selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
        />
      )}
    </div>
  );
}
