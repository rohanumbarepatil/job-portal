import React, { useState } from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { group: 'Overview' },
  { name: 'Dashboard',       path: '/admin',                end: true,  icon: <DashboardIcon /> },
  { name: 'Analytics',       path: '/admin/analytics',      end: false, icon: <ChartIcon /> },
  
  { group: 'Management' },
  { name: 'Users',           path: '/admin/users',          end: false, icon: <UsersIcon /> },
  { name: 'Companies',       path: '/admin/companies',      end: false, icon: <BuildingIcon /> },
  { name: 'Jobs',            path: '/admin/moderation',     end: false, icon: <BriefcaseIcon /> },
  { name: 'Interviews',      path: '/admin/interviews',     end: false, icon: <CalendarIcon /> },
  
  { group: 'Security & Ops' },
  { name: 'Verification',    path: '/admin/verification',   end: false, icon: <ShieldCheckIcon /> },
  { name: 'Audit Logs',      path: '/admin/logs',           end: false, icon: <ListIcon /> },
];

export default function AdminLayout() {
  const { currentUser, dbUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser || dbUser?.role !== 'ROLE_ADMIN') return <Navigate to="/unauthorized" />;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar - Hidden on mobile, flex on desktop */}
      <aside className="w-64 bg-gray-900 text-gray-400 hidden md:flex flex-col shrink-0">
        {/* Logo */}
        <div style={{
          padding: '24px 24px',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'white',
          }}>
            JP
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 14, letterSpacing: '-0.3px' }}>Job Portal Admin</div>
            <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 500 }}>Enterprise Edition</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto', marginTop: 8 }}>
          {NAV_ITEMS.map((item, idx) => {
            if (item.group) {
              return (
                <div key={`group-${idx}`} style={{ 
                  padding: '16px 12px 8px', 
                  fontSize: 11, fontWeight: 600, 
                  color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' 
                }}>
                  {item.group}
                </div>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 12px', borderRadius: 6, marginBottom: 2,
                  textDecoration: 'none', transition: 'all 0.1s ease',
                  background: isActive ? '#1F2937' : 'transparent',
                  color: isActive ? '#F9FAFB' : '#9CA3AF',
                  fontWeight: isActive ? 500 : 400,
                  fontSize: 13.5,
                })}
              >
                <span style={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>{item.icon}</span>
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #1F2937',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px', borderRadius: 6, background: '#1F2937' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>
              {dbUser?.fullName?.[0] || 'A'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ color: '#F9FAFB', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dbUser?.fullName}</div>
              <div style={{ color: '#6B7280', fontSize: 11 }}>admin@jobportal.com</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px 0', marginTop: 12,
            borderRadius: 6, border: '1px solid #374151', cursor: 'pointer',
            background: 'transparent', color: '#9CA3AF',
            fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.color = '#F9FAFB'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
          >
            <LogOutIcon /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Minimal Icons
function DashboardIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>; }
function UsersIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>; }
function BuildingIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>; }
function BriefcaseIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>; }
function CalendarIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>; }
function ShieldCheckIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>; }
function ChartIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>; }
function ListIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>; }
function LogOutIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>; }
