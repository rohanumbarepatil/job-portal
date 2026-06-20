import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const Badge = ({ text }) => {
  const colors = {
    SCHEDULED: { bg: '#EFF6FF', color: '#1D4ED8' },
    COMPLETED: { bg: '#ECFDF5', color: '#059669' },
    CANCELLED: { bg: '#FEF2F2', color: '#DC2626' },
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

export default function InterviewManagement() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInterviews(); }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/interviews');
      setInterviews(res.data.data || []);
    } catch (e) { toast.error('Failed to load interviews'); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this interview?')) return;
    try {
      await axiosInstance.patch(`/admin/interviews/${id}/cancel`);
      toast.success('Interview cancelled');
      fetchInterviews();
    } catch (e) { toast.error('Failed to cancel interview'); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#0F172A', margin: 0 }}>Interviews</h1>
        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: 14 }}>System-wide scheduled interviews overview.</p>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Interview ID</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Round</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Status</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Scheduled</th>
              <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 500, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
            ) : interviews.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No scheduled interviews</td></tr>
            ) : interviews.map(i => (
              <tr key={i.interviewId} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: '#64748B', fontSize: 12 }}>{i.interviewId?.slice(0, 16)}…</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 500, color: '#0F172A' }}>{i.roundName || '—'}</div>
                  <div style={{ color: '#64748B', marginTop: 2 }}>{i.roundType || '—'}</div>
                </td>
                <td style={{ padding: '16px 24px' }}><Badge text={i.status} /></td>
                <td style={{ padding: '16px 24px', color: '#64748B' }}>{i.scheduledAt ? new Date(i.scheduledAt).toLocaleString() : '—'}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {i.status === 'SCHEDULED' && (
                    <button onClick={() => handleCancel(i.interviewId)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: 13, color: '#DC2626', fontWeight: 500 }}>
                      Cancel
                    </button>
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
