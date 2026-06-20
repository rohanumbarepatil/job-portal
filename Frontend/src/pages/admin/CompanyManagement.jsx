import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const Badge = ({ text }) => {
  const colors = {
    VERIFIED:  { bg: '#ECFDF5', color: '#059669' },
    PENDING:   { bg: '#FFF7ED', color: '#C2410C' },
    REJECTED:  { bg: '#FEF2F2', color: '#DC2626' },
  };
  const s = colors[text] || { bg: '#F8FAFC', color: '#475569' };
  return (
    <span style={{ 
      background: s.bg, color: s.color, borderRadius: 12, 
      padding: '2px 10px', fontSize: 12, fontWeight: 500,
      border: `1px solid ${s.color}33`
    }}>{text}</span>
  );
};

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await axiosInstance.get(`/admin/companies?${params}`);
      setCompanies(res.data.data || []);
    } catch (e) { toast.error('Failed to load companies'); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#0F172A', margin: 0 }}>Companies</h1>
        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: 14 }}>Manage all registered companies on the platform.</p>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: 300, padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, background: 'white' }}>
          <option value="">All Statuses</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      
      <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Company</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Industry</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Status</th>
              <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 500, color: '#64748B' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
            ) : companies.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No companies found</td></tr>
            ) : companies.map(c => (
              <tr key={c.companyId} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 500, color: '#0F172A' }}>{c.companyInfo?.name || 'Unnamed'}</div>
                  <div style={{ color: '#64748B', marginTop: 2 }}>{c.companyInfo?.location || '—'}</div>
                </td>
                <td style={{ padding: '16px 24px', color: '#64748B' }}>{c.companyInfo?.industry || '—'}</td>
                <td style={{ padding: '16px 24px' }}><Badge text={c.verificationStatus} /></td>
                <td style={{ padding: '16px 24px', textAlign: 'right', color: '#64748B' }}>{c.rating ? c.rating.toFixed(1) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
