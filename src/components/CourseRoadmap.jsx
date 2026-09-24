import React, { useState } from 'react';
import { ArrowLeft, X, BookOpen, Clock, Wrench, Target, ChevronRight } from 'lucide-react';
import { COURSES, DEPARTMENTS } from '../data/mockData';
import { COURSE_ROADMAPS } from '../data/courseRoadmaps';
import RoadmapNode from './RoadmapNode';

export default function CourseRoadmap() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  const roadmap = selectedCourse ? COURSE_ROADMAPS[selectedCourse.id] : null;

  // Filter courses that have roadmap data
  const coursesWithRoadmaps = COURSES.filter(c => COURSE_ROADMAPS[c.id]);

  const deptCourses = selectedDept
    ? coursesWithRoadmaps.filter(c => c.dept === selectedDept)
    : [];

  const handleBack = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      setSelectedMilestone(null);
    } else {
      setSelectedDept(null);
    }
  };

  // Course Selection Screen
  if (!selectedCourse) {
    return (
      <div>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>📍 Interactive Course Roadmaps</h1>
            <p>Explore visual learning journeys for each course — ideal for student demos</p>
          </div>
        </div>

        {!selectedDept ? (
          <>
            <p style={{ marginBottom: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
              Select a department to view its course roadmaps:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {DEPARTMENTS.filter(d => coursesWithRoadmaps.some(c => c.dept === d.code)).map(dept => {
                const dCourses = coursesWithRoadmaps.filter(c => c.dept === dept.code);
                return (
                  <div
                    key={dept.code}
                    onClick={() => setSelectedDept(dept.code)}
                    style={{
                      background: '#fff',
                      borderRadius: '1.25rem',
                      padding: '2rem',
                      border: `2px solid ${dept.color}20`,
                      cursor: 'pointer',
                      boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 40px -8px ${dept.color}40`; e.currentTarget.style.borderColor = dept.color; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px -4px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = `${dept.color}20`; }}
                  >
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle, ${dept.color}15, transparent 70%)`, borderRadius: '0 0 0 120px' }} />
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${dept.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>
                      {dept.code === 'IT' ? '💻' : dept.code === 'MECH' ? '⚙️' : '🏗️'}
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '1.15rem', color: '#0f172a' }}>{dept.name}</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem' }}>{dept.description}</div>
                    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {dCourses.map(c => (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.color || dept.color, flexShrink: 0 }} />
                          {c.name}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', fontWeight: '700', color: dept.color, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      Explore Roadmaps <ChevronRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedDept(null)}
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600', fontSize: '0.875rem', marginBottom: '1.5rem' }}
            >
              <ArrowLeft size={16} /> Back to Departments
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {deptCourses.map(course => {
                const rm = COURSE_ROADMAPS[course.id];
                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    style={{
                      background: '#fff',
                      borderRadius: '1.25rem',
                      overflow: 'hidden',
                      border: `1px solid ${course.color}30`,
                      cursor: 'pointer',
                      boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 20px 40px -8px ${course.color}40`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px -4px rgba(0,0,0,0.08)'; }}
                  >
                    <div style={{ height: '6px', background: `linear-gradient(to right, ${course.color}, ${course.color}80)` }} />
                    <div style={{ padding: '1.75rem' }}>
                      <div style={{ fontWeight: '800', fontSize: '1.15rem', color: '#0f172a' }}>{course.name}</div>
                      {rm && <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.4rem', fontStyle: 'italic' }}>"{rm.tagline}"</p>}
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem' }}>
                        <span style={{ color: '#64748b' }}>⏱ {course.duration}</span>
                        <span style={{ color: '#64748b' }}>💺 {course.seats} seats</span>
                        {rm && <span style={{ color: '#64748b' }}>📍 {rm.milestones.length} milestones</span>}
                      </div>
                      <div style={{ marginTop: '1.25rem', fontSize: '0.875rem', fontWeight: '700', color: course.color, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        View 3D Roadmap <ChevronRight size={15} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Roadmap View
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <button
            onClick={handleBack}
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600', fontSize: '0.875rem', marginBottom: '1rem' }}
          >
            <ArrowLeft size={16} /> Back to Courses
          </button>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', background: roadmap?.color || selectedCourse.color }} />
            {selectedCourse.name} — Learning Roadmap
          </h1>
          {roadmap && (
            <p style={{ color: '#64748b', marginTop: '0.3rem', fontStyle: 'italic' }}>"{roadmap.tagline}" • {roadmap.totalDuration}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {['foundation', 'core', 'specialization', 'internship', 'capstone'].map(s => {
            const colors = { foundation: '#6366f1', core: '#3b82f6', specialization: '#f59e0b', internship: '#10b981', capstone: '#ec4899' };
            return (
              <span key={s} style={{ fontSize: '0.7rem', fontWeight: '700', background: `${colors[s]}15`, color: colors[s], padding: '0.2rem 0.6rem', borderRadius: '9999px', border: `1px solid ${colors[s]}30`, textTransform: 'capitalize' }}>
                {s}
              </span>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedMilestone ? '1fr 380px' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Roadmap Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Center vertical line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '3px',
            transform: 'translateX(-50%)',
            background: `linear-gradient(to bottom, ${roadmap?.color || '#6366f1'}60, ${roadmap?.color || '#6366f1'}20)`,
            borderRadius: '9999px'
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingTop: '1rem', paddingBottom: '2rem' }}>
            {roadmap?.milestones.map((milestone, index) => (
              <RoadmapNode
                key={milestone.id}
                milestone={milestone}
                index={index}
                isSelected={selectedMilestone?.id === milestone.id}
                onSelect={setSelectedMilestone}
                courseColor={roadmap?.color}
              />
            ))}
          </div>

          {/* End cap */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1rem' }}>
            <div style={{ background: `linear-gradient(135deg, ${roadmap?.color}, ${roadmap?.accentColor})`, color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '9999px', fontWeight: '800', fontSize: '0.875rem', boxShadow: `0 4px 16px ${roadmap?.color}40` }}>
              🎓 Journey Complete
            </div>
          </div>
        </div>

        {/* Milestone Detail Panel */}
        {selectedMilestone && (
          <div style={{
            background: 'linear-gradient(145deg, #0f172a, #1e293b)',
            borderRadius: '1.25rem',
            border: `1px solid ${roadmap?.color}40`,
            overflow: 'hidden',
            position: 'sticky',
            top: '100px',
            boxShadow: `0 20px 60px -10px ${roadmap?.color}30`
          }}>
            {/* Top colored band */}
            <div style={{ height: '5px', background: `linear-gradient(to right, ${roadmap?.color}, ${roadmap?.accentColor})` }} />

            {/* Header */}
            <div style={{ padding: '1.25rem 1.4rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{selectedMilestone.icon}</div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#f1f5f9', lineHeight: 1.3 }}>{selectedMilestone.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>{selectedMilestone.subtitle}</div>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Duration */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={15} color="#a78bfa" />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#a78bfa' }}>{selectedMilestone.duration}</span>
              </div>

              {/* Outcomes */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Target size={14} color={roadmap?.accentColor} />
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: roadmap?.accentColor }}>Learning Outcome</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.55 }}>{selectedMilestone.outcomes}</p>
              </div>

              {/* Topics */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <BookOpen size={14} color={roadmap?.accentColor} />
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: roadmap?.accentColor }}>Topics Covered</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {selectedMilestone.topics.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: '#e2e8f0' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: roadmap?.accentColor || '#a78bfa', marginTop: '0.45rem', flexShrink: 0 }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <Wrench size={14} color={roadmap?.accentColor} />
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: roadmap?.accentColor }}>Tools & Technologies</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedMilestone.tools.map((tool, i) => (
                    <span key={i} style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      background: 'rgba(255,255,255,0.08)',
                      border: `1px solid ${roadmap?.color}40`,
                      color: '#e2e8f0',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '0.375rem'
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
