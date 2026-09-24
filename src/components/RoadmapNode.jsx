import React, { useRef, useState, useCallback } from 'react';

const STATUS_STYLES = {
  foundation: { gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', glow: 'rgba(99,102,241,0.4)', label: 'Foundation' },
  core: { gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', glow: 'rgba(59,130,246,0.4)', label: 'Core' },
  specialization: { gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', glow: 'rgba(245,158,11,0.4)', label: 'Specialization' },
  internship: { gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.4)', label: 'Internship' },
  capstone: { gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.5)', label: 'Capstone' }
};

export default function RoadmapNode({ milestone, index, isSelected, onSelect, courseColor }) {
  const nodeRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isLeft = index % 2 === 0;

  const style = STATUS_STYLES[milestone.status] || STATUS_STYLES.core;

  const handleMouseMove = useCallback((e) => {
    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotX = ((e.clientY - cy) / (rect.height / 2)) * -8;
    const rotY = ((e.clientX - cx) / (rect.width / 2)) * 8;
    setTilt({ x: rotX, y: rotY });
  }, []);

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        paddingLeft: isLeft ? '0' : '50%',
        paddingRight: isLeft ? '50%' : '0',
        position: 'relative',
        zIndex: isSelected || isHovered ? 10 : 1
      }}
    >
      {/* Phase number connector dot */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: style.gradient,
        border: '3px solid #fff',
        boxShadow: `0 0 0 3px ${style.glow}, 0 4px 12px ${style.glow}`,
        zIndex: 5,
        transition: 'all 0.3s ease'
      }} />

      {/* Main Node Card */}
      <div
        ref={nodeRef}
        onClick={() => onSelect(isSelected ? null : milestone)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '340px',
          background: isSelected
            ? 'linear-gradient(145deg, #0f172a, #1e293b)'
            : '#ffffff',
          borderRadius: '1rem',
          border: isSelected
            ? `2px solid ${courseColor || '#6366f1'}`
            : `1px solid ${isHovered ? courseColor || '#6366f1' : '#e2e8f0'}`,
          boxShadow: isHovered || isSelected
            ? `0 20px 40px -10px ${style.glow}, 0 0 0 1px rgba(255,255,255,0.1)`
            : '0 4px 16px -4px rgba(0,0,0,0.12)',
          cursor: 'pointer',
          transform: `
            perspective(800px)
            rotateX(${tilt.x}deg)
            rotateY(${tilt.y}deg)
            translateY(${isHovered ? '-4px' : '0'})
            scale(${isSelected ? 1.02 : 1})
          `,
          transition: 'transform 0.15s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          transformStyle: 'preserve-3d',
          margin: isLeft ? '0 1.5rem 0 0' : '0 0 0 1.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Colored top bar */}
        <div style={{
          height: '5px',
          background: style.gradient
        }} />

        <div style={{ padding: '1.25rem 1.35rem' }}>
          {/* Phase badge + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <span style={{
              fontSize: '1.35rem',
              lineHeight: 1,
              transform: `translateZ(20px)`,
              display: 'inline-block',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
            }}>
              {milestone.icon}
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '800',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: style.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Phase {milestone.phase} · {style.label}
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: '1rem',
            fontWeight: '800',
            color: isSelected ? '#f1f5f9' : '#0f172a',
            lineHeight: 1.3,
            transform: 'translateZ(10px)'
          }}>
            {milestone.title}
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: '0.8rem',
            color: isSelected ? '#94a3b8' : '#64748b',
            marginTop: '0.2rem'
          }}>
            {milestone.subtitle}
          </div>

          {/* Duration badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            marginTop: '0.75rem',
            background: isSelected ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
            border: `1px solid ${isSelected ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
            borderRadius: '9999px',
            padding: '0.2rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: isSelected ? '#a5b4fc' : '#4f46e5'
          }}>
            ⏱ {milestone.duration}
          </div>

          {/* Quick preview of topics */}
          {!isSelected && (
            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {milestone.topics.slice(0, 3).map((t, i) => (
                <span key={i} style={{ fontSize: '0.7rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.25rem', padding: '0.15rem 0.45rem', color: '#475569' }}>
                  {t}
                </span>
              ))}
              {milestone.topics.length > 3 && (
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>+{milestone.topics.length - 3} more</span>
              )}
            </div>
          )}

          {/* Click hint */}
          {!isSelected && (
            <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>→</span> Click to explore this milestone
            </div>
          )}
        </div>

        {/* 3D depth effect – bottom pseudo-shadow strip */}
        <div style={{
          height: '3px',
          background: `linear-gradient(to right, transparent, ${style.glow}, transparent)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} />
      </div>
    </div>
  );
}
