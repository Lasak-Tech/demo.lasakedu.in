import React, { useState } from 'react';
import {
  Briefcase,
  Building,
  MapPin,
  Users,
  Award,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Filter,
  GraduationCap,
  Send,
  Plus
} from 'lucide-react';
import DriveConnectModal from './DriveConnectModal';
import JobApplyModal from './JobApplyModal';
import PlacementDetailsModal from './PlacementDetailsModal';
import PlacementReportPage from './PlacementReportPage';

export default function CareerHub({
  recruitmentDrives = [],
  courses = [],
  students = [],
  currentUser,
  onUpdateStudentStatus,
  onAddStudent
}) {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedDriveForConnect, setSelectedDriveForConnect] = useState(null);
  const [selectedDriveForApply, setSelectedDriveForApply] = useState(null);
  const [selectedPlacedStudentModal, setSelectedPlacedStudentModal] = useState(null);
  const [showPlacementReportView, setShowPlacementReportView] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (showPlacementReportView) {
    return (
      <PlacementReportPage
        students={students}
        courses={courses}
        onBack={() => setShowPlacementReportView(false)}
      />
    );
  }

  const handleNominateStudents = (companyName, studentIds) => {
    studentIds.forEach(studentId => {
      onUpdateStudentStatus(
        studentId,
        'Admitted',
        `Nominated & Connected to ${companyName} placement drive by ${currentUser?.name || 'Career Advisor'}.`
      );
    });

    setToastMessage(`Successfully connected ${studentIds.length} candidate(s) to ${companyName}!`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleApplySuccess = (newStudentData, companyName) => {
    if (onAddStudent) {
      onAddStudent(newStudentData);
    }
    setToastMessage(`Application submitted successfully for ${newStudentData.name} to ${companyName}!`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  // Ensure ALL courses from Course Management have corresponding Job Drives
  const allJobDrives = [...recruitmentDrives];

  courses.forEach(crs => {
    const hasDrive = allJobDrives.some(
      d => d.courseName === crs.name || (d.dept === crs.dept && d.courseName === crs.shortName)
    );
    if (!hasDrive) {
      allJobDrives.push({
        id: `drv-auto-${crs.id}`,
        company: `${crs.name} Career & Hiring Hub`,
        dept: crs.dept,
        courseName: crs.name,
        role: `Graduate & Full Stack Specialist (${crs.shortName || crs.name})`,
        ctc: '₹9.5 - ₹16.0 LPA',
        date: '2026-10-15',
        status: 'Active',
        vacancies: crs.seats || 20,
        location: 'Bengaluru / Remote / Hybrid'
      });
    }
  });

  // Filter drives based on selected course filter
  const filteredDrives = allJobDrives.filter(drive => {
    if (selectedCourseFilter === 'ALL') return true;
    return (
      drive.courseName === selectedCourseFilter ||
      drive.dept === selectedCourseFilter ||
      (drive.courseName && drive.courseName.includes(selectedCourseFilter))
    );
  });

  return (
    <div
      className="section-block"
      style={{
        background: '#ffffff',
        padding: '1.75rem',
        borderRadius: '1rem',
        border: '1px solid #e2e8f0'
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="alert-banner alert-success" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '0.75rem',
              background: '#fff7ed',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ffedd5'
            }}
          >
            <Briefcase size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
              Career & Placement Drives Hub
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.1rem 0 0 0' }}>
              All programs from <strong>Course Management</strong> listed as active corporate job & recruitment drives. Click <strong>Apply</strong> to submit an application.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '800',
            color: '#047857'
          }}
        >
          <ShieldCheck size={16} />
          <span>INSTITUTIONAL CORPORATE PARTNERSHIPS</span>
        </div>
      </div>

      {/* Course Management Filter Tabs Bar */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.65rem',
            fontSize: '0.825rem',
            fontWeight: '800',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          <Filter size={15} color="#4f46e5" />
          <span>Filter Career Jobs by Course (Course Management):</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* ALL COURSES TAB */}
          <button
            type="button"
            onClick={() => setSelectedCourseFilter('ALL')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '0.5rem',
              fontSize: '0.825rem',
              fontWeight: '800',
              border: selectedCourseFilter === 'ALL' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
              background: selectedCourseFilter === 'ALL' ? '#4f46e5' : '#ffffff',
              color: selectedCourseFilter === 'ALL' ? '#ffffff' : '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
          >
            <GraduationCap size={15} />
            <span>All Courses</span>
            <span
              style={{
                fontSize: '0.725rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                background: selectedCourseFilter === 'ALL' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: selectedCourseFilter === 'ALL' ? '#ffffff' : '#64748b'
              }}
            >
              {allJobDrives.length}
            </span>
          </button>

          {/* DYNAMIC COURSE TABS */}
          {courses.map(crs => {
            const isSelected = selectedCourseFilter === crs.name;
            const count = allJobDrives.filter(
              d => d.courseName === crs.name || d.dept === crs.dept
            ).length;

            return (
              <button
                key={crs.id}
                type="button"
                onClick={() => setSelectedCourseFilter(crs.name)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  border: isSelected ? `2px solid ${crs.color || '#4f46e5'}` : '1px solid #cbd5e1',
                  background: isSelected ? (crs.color || '#4f46e5') : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <BookOpen size={14} />
                <span>{crs.name}</span>
                <span
                  style={{
                    fontSize: '0.725rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '9999px',
                    background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                    fontWeight: '800'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Drives */}
      {filteredDrives.length === 0 ? (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            background: '#f8fafc',
            borderRadius: '0.75rem',
            border: '1px dashed #cbd5e1',
            color: '#64748b'
          }}
        >
          <GraduationCap size={36} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ margin: '0 0 0.25rem 0', color: '#334155', fontWeight: '700' }}>
            No Job Drives Listed for Selected Course
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            Select "All Courses" or another course tab to view available corporate placement drives.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredDrives.map(drive => {
            const isGoogle = drive.company.toLowerCase().includes('google');

            return (
              <div
                key={drive.id}
                style={{
                  border: isGoogle ? '2px solid #93c5fd' : '1px solid #e2e8f0',
                  borderRadius: '0.85rem',
                  padding: '1.25rem',
                  background: isGoogle ? '#f0f7ff' : '#f8fafc',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isGoogle ? '0 4px 14px rgba(66, 133, 244, 0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  {/* Company & Status */}
                  <div
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.65rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isGoogle ? (
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '0.5rem',
                            background: '#4285F4',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '900',
                            fontSize: '1.05rem',
                            boxShadow: '0 2px 4px rgba(66,133,244,0.3)'
                          }}
                        >
                          G
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '0.5rem',
                            background: '#e0e7ff',
                            color: '#4f46e5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Building size={20} />
                        </div>
                      )}
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          margin: 0
                        }}
                      >
                        {drive.company}
                      </h3>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        background: drive.status === 'Active' ? '#ecfdf5' : '#eff6ff',
                        color: drive.status === 'Active' ? '#047857' : '#1d4ed8'
                      }}
                    >
                      {drive.status}
                    </span>
                  </div>

                  {/* Course Tag */}
                  {drive.courseName && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#e0e7ff',
                        color: '#3730a3',
                        border: '1px solid #c7d2fe',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        marginBottom: '0.6rem'
                      }}
                    >
                      <GraduationCap size={13} />
                      <span>Course: {drive.courseName}</span>
                    </div>
                  )}

                  {/* Role Details */}
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#334155',
                      fontWeight: '700',
                      marginBottom: '0.35rem'
                    }}
                  >
                    Role: <span style={{ color: '#0f172a' }}>{drive.role}</span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.4rem',
                      fontSize: '0.825rem',
                      color: '#475569',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <div>
                      CTC: <strong>{drive.ctc}</strong>
                    </div>
                    <div>
                      Vacancies: <strong>{drive.vacancies} Seats</strong>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <MapPin size={14} />
                    <span>{drive.location}</span>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div
                  style={{
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem'
                  }}
                >
                  {/* BUTTON 1: APPLY NOW -> Opens JobApplyModal */}
                  <button
                    type="button"
                    style={{
                      background: isGoogle ? '#4285F4' : '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '800',
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      boxShadow: isGoogle ? '0 2px 6px rgba(66, 133, 244, 0.35)' : '0 2px 6px rgba(79, 70, 229, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedDriveForApply(drive)}
                  >
                    <Send size={14} />
                    <span>Apply Now</span>
                  </button>

                  {/* BUTTON 2: CONNECT CANDIDATES -> Opens DriveConnectModal */}
                  <button
                    type="button"
                    style={{
                      background: '#ffffff',
                      color: '#1e293b',
                      border: '1px solid #cbd5e1',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                    onClick={() => setSelectedDriveForConnect(drive)}
                  >
                    <span>Connect Candidates</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PLACED STUDENTS & ALUMNI SUCCESS GALLERY                      */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          marginTop: '2.5rem',
          paddingTop: '2rem',
          borderTop: '2px dashed #e2e8f0'
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '0.75rem',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #a7f3d0'
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Placed Students & Alumni Success Gallery
                </h3>
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: '800',
                    background: '#059669',
                    color: '#ffffff',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px'
                  }}
                >
                  VERIFIED PLACEMENTS
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                Candidates successfully placed in corporate recruitment drives across programs.
              </p>
            </div>
          </div>

          {/* Quick Placed Stats Pills & Placement Details Page Toggle */}
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '0.4rem 0.85rem',
                borderRadius: '0.6rem',
                fontSize: '0.8rem',
                color: '#166534',
                fontWeight: '700'
              }}
            >
              Total Placed: <strong>{students.filter(s => s.placedStatus === 'Placed' || (s.company && s.company !== '—')).length} Candidates</strong>
            </div>
            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '0.4rem 0.85rem',
                borderRadius: '0.6rem',
                fontSize: '0.8rem',
                color: '#1e40af',
                fontWeight: '700'
              }}
            >
              Highest Package: <strong>₹21.0 LPA (Microsoft)</strong>
            </div>

            <button
              type="button"
              onClick={() => setShowPlacementReportView(true)}
              style={{
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '0.5rem',
                fontWeight: '800',
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(5,150,105,0.25)'
              }}
            >
              <span>View Full Placement Details Page</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Placed Students Cards Grid */}
        {(() => {
          const placedList = students.filter(s => {
            const isPlaced = s.placedStatus === 'Placed' || (s.company && s.company !== '—');
            if (!isPlaced) return false;
            if (selectedCourseFilter === 'ALL') return true;
            return s.dept === selectedCourseFilter || (selectedCourseFilter.includes('MERN') && s.dept === 'IT') || (selectedCourseFilter.includes('Digital') && s.dept === 'IT');
          });

          if (placedList.length === 0) {
            return (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  borderRadius: '0.75rem',
                  color: '#64748b',
                  fontSize: '0.875rem'
                }}
              >
                No placed students record found for the selected course filter. Select "All Courses" to view all placed candidates.
              </div>
            );
          }

          return (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.1rem'
              }}
            >
              {placedList.map((student) => {
                const isGoogle = student.company?.toLowerCase().includes('google');
                const isMicrosoft = student.company?.toLowerCase().includes('microsoft');

                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedPlacedStudentModal(student)}
                    style={{
                      background: '#ffffff',
                      border: isGoogle
                        ? '2px solid #60a5fa'
                        : isMicrosoft
                        ? '2px solid #a855f7'
                        : '1px solid #cbd5e1',
                      borderRadius: '0.85rem',
                      padding: '1.15rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    <div>
                      {/* Card Header: Avatar & Status */}
                      <div
                        style={{
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: isGoogle ? '#4285F4' : isMicrosoft ? '#9333ea' : '#059669',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              fontSize: '0.95rem'
                            }}
                          >
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4
                              style={{
                                fontSize: '0.975rem',
                                fontWeight: '800',
                                color: '#0f172a',
                                margin: 0
                              }}
                            >
                              {student.name}
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Dept: <strong>{student.dept}</strong> • GPA: <strong>{student.gpa}</strong>
                            </span>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            background: '#ecfdf5',
                            color: '#047857',
                            border: '1px solid #a7f3d0'
                          }}
                        >
                          PLACED
                        </span>
                      </div>

                      {/* Company & Package Banner */}
                      <div
                        style={{
                          background: isGoogle ? '#eff6ff' : isMicrosoft ? '#faf5ff' : '#f8fafc',
                          border: isGoogle ? '1px solid #bfdbfe' : isMicrosoft ? '1px solid #e9d5ff' : '1px solid #e2e8f0',
                          borderRadius: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          marginBottom: '0.75rem'
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                          Hired By Company:
                        </div>
                        <div
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: '800',
                            color: isGoogle ? '#1d4ed8' : isMicrosoft ? '#7e22ce' : '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            marginTop: '0.1rem'
                          }}
                        >
                          <Building size={16} />
                          <span>{student.company || 'Corporate Partner'}</span>
                        </div>

                        <div style={{ marginTop: '0.35rem', fontSize: '0.825rem', color: '#334155' }}>
                          Package: <strong style={{ color: '#047857', fontSize: '0.9rem' }}>{student.packageAmt || 'Confidential'}</strong>
                        </div>
                      </div>

                      {/* Advisor info */}
                      {student.assignedAdvisorName && (
                        <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Users size={13} color="#6366f1" />
                          <span>Guided by Advisor: <strong>{student.assignedAdvisorName}</strong></span>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        fontSize: '0.75rem',
                        color: '#059669',
                        fontWeight: '700'
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={13} />
                        Offer Letter Verified
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlacedStudentModal(student);
                        }}
                        style={{
                          background: '#f0fdf4',
                          color: '#047857',
                          border: '1px solid #a7f3d0',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <span>Details</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Connect Candidates Modal */}
      {selectedDriveForConnect && (
        <DriveConnectModal
          drive={selectedDriveForConnect}
          students={students}
          currentUser={currentUser}
          onClose={() => setSelectedDriveForConnect(null)}
          onNominateStudents={handleNominateStudents}
        />
      )}

      {/* Apply to Job & Course Modal */}
      {selectedDriveForApply && (
        <JobApplyModal
          drive={selectedDriveForApply}
          courses={courses}
          currentUser={currentUser}
          onClose={() => setSelectedDriveForApply(null)}
          onApplySuccess={handleApplySuccess}
        />
      )}

      {/* Placement Details Modal */}
      {selectedPlacedStudentModal && (
        <PlacementDetailsModal
          student={selectedPlacedStudentModal}
          onClose={() => setSelectedPlacedStudentModal(null)}
        />
      )}
    </div>
  );
}
