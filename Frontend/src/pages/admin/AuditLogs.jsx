import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const Badge = ({ text }) => {
  return (
    <span style={{ 
      background: '#F1F5F9', color: '#475569', borderRadius: 4, 
      padding: '2px 8px', fontSize: 11, fontWeight: 600, fontFamily: 'monospace'
    }}>{text}</span>
  );
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/logs');
      setLogs(res.data.data || []);
    } catch (e) { toast.error('Failed to load audit logs'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#0F172A', margin: 0 }}>Audit Logs</h1>
        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: 14 }}>System-wide administrative action history.</p>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Action</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Target</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Details</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No audit logs found</td></tr>
            ) : logs.map(l => (
              <tr key={l.logId} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '16px 24px' }}><Badge text={l.action} /></td>
                <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: '#64748B', fontSize: 12 }}>{l.targetId}</td>
                <td style={{ padding: '16px 24px', color: '#0F172A' }}>{l.details || '—'}</td>
                <td style={{ padding: '16px 24px', color: '#64748B' }}>{l.timestamp ? new Date(l.timestamp).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
