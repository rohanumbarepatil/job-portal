import React from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { currentUser } = useAuth();

  // Basic check for MVP, in real app check for role claim
  if (!currentUser) return <Navigate to="/unauthorized" />;

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Verification', path: '/admin/verification' },
    { name: 'Moderation', path: '/admin/moderation' },
    { name: 'Analytics', path: '/admin/analytics' },
    { name: 'Audit Logs', path: '/admin/logs' },
    { name: 'Announcements', path: '/admin/announcements' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-black text-center border-b border-gray-800">
          Admin Portal
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  end={item.path === '/admin'}
                  className={({isActive}) => `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          Secure Zone
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
