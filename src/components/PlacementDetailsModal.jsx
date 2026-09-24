import React from 'react';
import {
  X,
  Award,
  Building,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  ShieldCheck,
  FileCheck,
  ExternalLink,
  Users,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

export default function PlacementDetailsModal({ student, onClose }) {
  if (!student) return null;

  const isGoogle = student.company?.toLowerCase().includes('google');
  const isMicrosoft = student.company?.toLowerCase().includes('microsoft');

  const themeColor = isGoogle ? '#4285F4' : isMicrosoft ? '#9333ea' : '#059669';
  const themeBg = isGoogle ? '#eff6ff' : isMicrosoft ? '#faf5ff' : '#ecfdf5';
  const themeBorder = isGoogle ? '#bfdbfe' : isMicrosoft ? '#e9d5ff' : '#a7f3d0';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '1.25rem',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          border: `2px solid ${themeBorder}`,
          position: 'relative',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div
          style={{
            background: isGoogle
              ? 'linear-gradient(135deg, #4285F4 0%, #1d4ed8 100%)'
              : isMicrosoft
              ? 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)'
              : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#ffffff',
            padding: '1.75rem 1.5rem 1.5rem 1.5rem',
            borderTopLeftRadius: '1.1rem',
            borderTopRightRadius: '1.1rem',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.2rem',
              right: '1.2rem',
              background: 'rgba(255, 255, 255, 0.25)',
              border: 'none',
              color: '#ffffff',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#ffffff',
                color: themeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: '900',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {student.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    background: 'rgba(255,255,255,0.25)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    letterSpacing: '0.05em'
                  }}
                >
                  VERIFIED PLACEMENT RECORD
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>ID: {student.id}</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>
                {student.name}
              </h2>
              <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0 0', opacity: 0.95 }}>
                Department of {student.dept} Engineering • Academic GPA: {student.gpa}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main Placement Highlight Card */}
          <div
            style={{
              background: themeBg,
              border: `1px solid ${themeBorder}`,
              borderRadius: '0.85rem',
              padding: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: themeColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Hired Corporate Partner
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0.15rem 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={22} color={themeColor} />
                  <span>{student.company || 'Corporate Placement Partner'}</span>
                </h3>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: `2px solid ${themeColor}`,
                  padding: '0.5rem 1rem',
                  borderRadius: '0.65rem',
                  textAlign: 'right'
                }}
              >
                <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                  Salary Package (CTC)
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: '900', color: themeColor }}>
                  {student.packageAmt || 'Confidential'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px dashed ${themeBorder}` }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Applied Date:</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <Calendar size={15} color="#4f46e5" />
                  <span>{student.appliedDate || '2026-08-15'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Verification Status:</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <FileCheck size={16} color="#059669" />
                  <span>Offer Letter Verified</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Guided By Advisor:</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <Users size={15} color="#6366f1" />
                  <span>{student.assignedAdvisorName || 'Senior Career Advisor'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Profile Details Section */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={18} color="#4f46e5" />
              Candidate Profile & Academic Overview
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', display: 'block' }}>Email Address</span>
                <span style={{ fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <Mail size={14} color="#64748b" />
                  {student.email || 'student@lasakedu.in'}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', display: 'block' }}>Phone Contact</span>
                <span style={{ fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <Phone size={14} color="#64748b" />
                  {student.phone || '+91 98765 43210'}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', display: 'block' }}>Location / Residence</span>
                <span style={{ fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <MapPin size={14} color="#64748b" />
                  {student.address || 'Bengaluru, Karnataka'}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', display: 'block' }}>Academic Performance</span>
                <span style={{ fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <GraduationCap size={14} color="#64748b" />
                  GPA: {student.gpa} • Score: {student.entranceScore || 95.0}%
                </span>
              </div>
            </div>
          </div>

          {/* Counselling & Selection Timeline */}
          {student.counsellingNotes && student.counsellingNotes.length > 0 && (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} color="#f59e0b" />
                Placement Guidance & Selection Milestones
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {student.counsellingNotes.map((note, idx) => (
                  <div
                    key={note.id || idx}
                    style={{
                      background: '#f8fafc',
                      borderLeft: '4px solid #4f46e5',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.825rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: '700', color: '#4f46e5' }}>{note.author} ({note.type || 'Milestone'})</span>
                      <span>{note.date}</span>
                    </div>
                    <div style={{ color: '#334155', fontWeight: '600' }}>{note.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
            borderBottomLeftRadius: '1.1rem',
            borderBottomRightRadius: '1.1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>
            <ShieldCheck size={16} />
            <span>Official Institutional Placement Certificate #LSK-{student.id}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '0.5rem',
              background: '#1e293b',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
