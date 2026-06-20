import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const Badge = ({ text }) => {
  const colors = {
    ACTIVE: { bg: '#ECFDF5', color: '#059669' },
    CLOSED: { bg: '#FEF2F2', color: '#DC2626' },
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

export default function JobModeration() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await axiosInstance.get(`/admin/jobs?${params}`);
      setJobs(res.data.data || []);
    } catch (e) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    const reason = prompt('Reason for removal:') || 'Admin moderation';
    try {
      await axiosInstance.delete(`/admin/jobs/${job.jobId}`, { data: { reason } });
      toast.success('Job removed');
      fetchJobs();
    } catch (e) { toast.error('Failed to remove job'); }
  };

  const handleBlock = async (job) => {
    if (!window.confirm(`Block/close "${job.title}"?`)) return;
    try {
      await axiosInstance.patch(`/admin/jobs/${job.jobId}/block`);
      toast.success('Job blocked');
      fetchJobs();
    } catch (e) { toast.error('Failed to block job'); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#0F172A', margin: 0 }}>Jobs</h1>
        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: 14 }}>Review and moderate job postings.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          placeholder="Search jobs..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: 300, padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, background: 'white' }}>
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Job Details</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Status</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Posted</th>
              <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 500, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No jobs found</td></tr>
            ) : jobs.map(j => (
              <tr key={j.jobId} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 500, color: '#0F172A' }}>{j.title}</div>
                  <div style={{ color: '#64748B', marginTop: 2 }}>{j.companyMetadata?.companyName || 'Unknown Company'}</div>
                </td>
                <td style={{ padding: '16px 24px' }}><Badge text={j.status} /></td>
                <td style={{ padding: '16px 24px', color: '#64748B' }}>
                  {j.createdAt ? new Date(j.createdAt).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    {j.status === 'ACTIVE' && (
                      <button onClick={() => handleBlock(j)} style={{ 
                        padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', 
                        background: 'white', cursor: 'pointer', fontSize: 13, color: '#F59E0B', fontWeight: 500
                      }}>Block</button>
                    )}
                    <button onClick={() => handleDelete(j)} style={{ 
                      padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', 
                      background: 'white', cursor: 'pointer', fontSize: 13, color: '#DC2626', fontWeight: 500
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
