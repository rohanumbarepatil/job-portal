import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const Badge = ({ text }) => {
  const colors = {
    PENDING:  { bg: '#FFF7ED', color: '#C2410C' },
    APPROVED: { bg: '#ECFDF5', color: '#059669' },
    REJECTED: { bg: '#FEF2F2', color: '#DC2626' },
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

export default function VerificationCenter() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/verifications');
      setRequests(res.data.data || []);
    } catch (e) {
      toast.error('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    const reason = status === 'REJECTED' ? prompt('Enter rejection reason:') : 'Verified by Admin';
    if (status === 'REJECTED' && !reason) return;
    try {
      await axiosInstance.patch(`/admin/verifications/${requestId}`, { status, reason });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (e) { toast.error(`Failed to ${status} request`); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#0F172A', margin: 0 }}>Verification Queue</h1>
        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: 14 }}>Review pending entity verifications.</p>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Entity</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Submitted</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Status</th>
              <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 500, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No pending verifications</td></tr>
            ) : requests.map(req => (
              <tr key={req.requestId} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 500, color: '#0F172A' }}>{req.entityType}</div>
                  <div style={{ color: '#64748B', marginTop: 2, fontFamily: 'monospace', fontSize: 12 }}>{req.entityId}</div>
                </td>
                <td style={{ padding: '16px 24px', color: '#64748B' }}>
                  {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '16px 24px' }}><Badge text={req.status} /></td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {req.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => handleAction(req.requestId, 'APPROVED')}
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: 13, color: '#059669', fontWeight: 500 }}>
                        Approve
                      </button>
                      <button onClick={() => handleAction(req.requestId, 'REJECTED')}
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: 13, color: '#DC2626', fontWeight: 500 }}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#9CA3AF' }}>{req.reason || 'Resolved'}</span>
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
