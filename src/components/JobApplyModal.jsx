import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Building,
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Send,
  Sparkles,
  MapPin,
  Briefcase,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

export default function JobApplyModal({ drive, courses = [], currentUser, onClose, onApplySuccess }) {
  if (!drive) return null;

  const isGoogle = drive.company?.toLowerCase().includes('google');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dept: drive.dept || 'IT',
    courseName: drive.courseName || '',
    gpa: '3.80',
    address: 'Bengaluru, Karnataka',
    qualification: 'B.Tech / B.E. / Degree Student',
    resumeUrl: '',
    coverNote: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email address is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.courseName) errs.courseName = 'Select a course';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newStudentApplication = {
        id: `APP-JOB-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dept: form.dept,
        gpa: parseFloat(form.gpa) || 3.75,
        entranceScore: 92.5,
        status: 'Submitted',
        appliedDate: new Date().toISOString().split('T')[0],
        placedStatus: 'Interviewing',
        company: drive.company,
        packageAmt: drive.ctc || '₹12.5 LPA',
        assignedAdvisorId: currentUser?.id || 'usr-4',
        assignedAdvisorName: currentUser?.name || 'Gukan',
        counsellingStatus: 'Active',
        address: form.address,
        counsellingNotes: [
          {
            id: `note-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            author: form.name,
            text: `Applied directly via Career Hub for ${drive.company} (${drive.role}). Note: ${form.coverNote || 'Application submitted successfully.'}`,
            type: 'Application'
          }
        ]
      };

      onApplySuccess(newStudentApplication, drive.company);
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
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
          borderRadius: '1rem',
          maxWidth: '620px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: isGoogle ? '2px solid #60a5fa' : '1px solid #cbd5e1',
          position: 'relative',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div
          style={{
            background: isGoogle ? 'linear-gradient(135deg, #4285F4 0%, #174ea6 100%)' : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: '#ffffff',
            padding: '1.5rem',
            borderTopLeftRadius: '0.9rem',
            borderTopRightRadius: '0.9rem',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {isGoogle ? (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.6rem',
                  background: '#ffffff',
                  color: '#4285F4',
                  fontWeight: '900',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                G
              </div>
            ) : (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.6rem',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Building size={22} />
              </div>
            )}
            <div>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: '800',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px'
                }}
              >
                JOB & COURSE APPLICATION PAGE
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0.2rem 0 0 0' }}>
                Apply for {drive.company}
              </h2>
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', opacity: 0.95, display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
            <span><strong>Role:</strong> {drive.role}</span>
            <span><strong>CTC:</strong> {drive.ctc}</span>
            <span><strong>Location:</strong> {drive.location}</span>
          </div>
        </div>

        {/* Modal Form Content */}
        <div style={{ padding: '1.5rem' }}>
          {isSuccess ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Application Submitted Successfully!
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '400px' }}>
                Thank you for applying to <strong>{drive.company}</strong> for the course <strong>{drive.courseName}</strong>. Our admissions & placement team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.65rem',
                  padding: '0.85rem',
                  fontSize: '0.825rem',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <ShieldCheck size={18} color="#4f46e5" />
                <span>
                  Official Application for <strong>{drive.courseName || 'Selected Course'}</strong> linked directly with Course Management.
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Enter your complete full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem 0.6rem 2.3rem',
                      borderRadius: '0.5rem',
                      border: errors.name ? '1px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.name}</span>}
              </div>

              {/* Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="email"
                      placeholder="student@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem 0.6rem 2.3rem',
                        borderRadius: '0.5rem',
                        border: errors.email ? '1px solid #ef4444' : '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.email}</span>}
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                    Phone Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem 0.6rem 2.3rem',
                        borderRadius: '0.5rem',
                        border: errors.phone ? '1px solid #ef4444' : '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.phone}</span>}
                </div>
              </div>

              {/* Department & Course Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                    Department
                  </label>
                  <select
                    value={form.dept}
                    onChange={(e) => setForm({ ...form, dept: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      background: '#ffffff'
                    }}
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                    Course Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={form.courseName}
                    onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: errors.courseName ? '1px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      background: '#ffffff'
                    }}
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {errors.courseName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.courseName}</span>}
                </div>
              </div>

              {/* Address / Location & Qualification */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru / Chennai"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                    Qualification / Degree
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech IT / Mechanical / Diploma"
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              {/* Cover Note / Message */}
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                  Why do you want to join this job & course drive? (Optional)
                </label>
                <textarea
                  placeholder="Mention your skills, interest in this course or company..."
                  rows={3}
                  value={form.coverNote}
                  onChange={(e) => setForm({ ...form, coverNote: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: isGoogle ? '#4285F4' : '#4f46e5',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
