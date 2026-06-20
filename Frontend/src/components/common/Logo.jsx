import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', dark = false }) {
  const sizes = {
    sm: { icon: 24, text: 16, gap: 8 },
    md: { icon: 32, text: 20, gap: 10 },
    lg: { icon: 48, text: 28, gap: 14 }
  };
  
  const { icon, text, gap } = sizes[size] || sizes.md;
  const textColor = dark ? '#FFFFFF' : '#0F172A';
  
  return (
    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: gap, textDecoration: 'none' }}>
      <div style={{ 
        width: icon, height: icon, borderRadius: icon * 0.2, 
        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
      }}>
        <svg width={icon * 0.55} height={icon * 0.55} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <span style={{ 
        fontSize: text, fontWeight: 800, color: textColor, 
        letterSpacing: '-0.02em', fontFamily: "'Inter', sans-serif"
      }}>
        JobPortal<span style={{ color: '#2563EB' }}>.</span>
      </span>
    </Link>
  );
}
