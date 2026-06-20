import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const ROLES = ['ALL','ROLE_ADMIN','ROLE_RECRUITER','ROLE_PENDING_RECRUITER','ROLE_JOB_SEEKER'];

const Badge = ({ text }) => {
  const colors = {
    ROLE_ADMIN: { bg: '#F3F4F6', color: '#374151' },
    ROLE_RECRUITER: { bg: '#EFF6FF', color: '#1D4ED8' },
    ROLE_JOB_SEEKER: { bg: '#F8FAFC', color: '#475569' },
    ROLE_PENDING_RECRUITER: { bg: '#FFF7ED', color: '#C2410C' },
    true: { bg: '#ECFDF5', color: '#059669' },
    false: { bg: '#FEF2F2', color: '#DC2626' },
  };
  const s = colors[text] || { bg: '#F8FAFC', color: '#475569' };
  return (
    <span style={{ 
      background: s.bg, color: s.color, borderRadius: 12, 
      padding: '2px 10px', fontSize: 12, fontWeight: 500,
      border: `1px solid ${s.color}33`
    }}>
      {String(text).replace('ROLE_', '')}
    </span>
  );
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter !== 'ALL') params.set('role', roleFilter);
      const res = await axiosInstance.get(`/admin/users?${params}`);
      setUsers(res.data.data || []);
    } catch (e) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSuspend = async (user) => {
    const reason = prompt(`Reason for suspending ${user.fullName}?`);
    if (!reason) return;
    try {
      await axiosInstance.patch(`/admin/users/${user.uid}/suspend`, { reason });
      toast.success(`${user.fullName} suspended`);
      fetchUsers();
    } catch (e) { toast.error('Failed to suspend user'); }
  };

  const handleReactivate = async (user) => {
    try {
      await axiosInstance.patch(`/admin/users/${user.uid}/reactivate`, { reason: 'Admin reactivation' });
      toast.success(`${user.fullName} reactivated`);
      fetchUsers();
    } catch (e) { toast.error('Failed to reactivate user'); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#0F172A', margin: 0 }}>Users</h1>
          <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: 14 }}>Manage platform user access and roles.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300, padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }}
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, background: 'white' }}>
          {ROLES.map(r => <option key={r} value={r}>{r.replace('ROLE_', '') || 'ALL ROLES'}</option>)}
        </select>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>User Details</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Role</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Status</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Joined Date</th>
              <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 500, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No users found</td></tr>
            ) : users.map(u => (
              <tr key={u.uid} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 500, color: '#0F172A' }}>{u.fullName}</div>
                  <div style={{ color: '#64748B', marginTop: 2 }}>{u.email}</div>
                </td>
                <td style={{ padding: '16px 24px' }}><Badge text={u.role} /></td>
                <td style={{ padding: '16px 24px' }}><Badge text={u.isActive ? 'ACTIVE' : 'SUSPENDED'} /></td>
                <td style={{ padding: '16px 24px', color: '#64748B' }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {u.isActive ? (
                    <button onClick={() => handleSuspend(u)} style={{ 
                      padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', 
                      background: 'white', cursor: 'pointer', fontSize: 13, color: '#DC2626', fontWeight: 500
                    }}>Suspend</button>
                  ) : (
                    <button onClick={() => handleReactivate(u)} style={{ 
                      padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', 
                      background: 'white', cursor: 'pointer', fontSize: 13, color: '#059669', fontWeight: 500
                    }}>Reactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
