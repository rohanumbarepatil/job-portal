import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';

const KpiCard = ({ label, value, sub, icon }) => (
  <div style={{
    background: '#FFFFFF', borderRadius: 8, padding: '20px',
    border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <div style={{ color: '#64748B', fontSize: 13, fontWeight: 500 }}>{label}</div>
      {icon && <div style={{ color: '#9CA3AF' }}>{icon}</div>}
    </div>
    <div style={{ fontSize: 28, fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{value ?? '—'}</div>
    {sub && <div style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: '0 0 16px 0' }}>{children}</h2>
);

const ChartCard = ({ title, children, height = 300 }) => (
  <div style={{
    background: '#FFFFFF', borderRadius: 8, padding: '24px',
    border: '1px solid #E2E8F0',
  }}>
    <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 24 }}>{title}</div>
    <div style={{ height }}>{children}</div>
  </div>
);

const TableCard = ({ title, children }) => (
  <div style={{
    background: '#FFFFFF', borderRadius: 8,
    border: '1px solid #E2E8F0', overflow: 'hidden',
  }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{title}</div>
    {children}
  </div>
);

const Badge = ({ text, type }) => {
  const colors = {
    ACTIVE: { bg: '#ECFDF5', color: '#059669' },
    CLOSED: { bg: '#FEF2F2', color: '#DC2626' },
    ROLE_ADMIN: { bg: '#F3F4F6', color: '#374151' },
    ROLE_RECRUITER: { bg: '#EFF6FF', color: '#1D4ED8' },
    ROLE_JOB_SEEKER: { bg: '#F8FAFC', color: '#475569' },
    ROLE_PENDING_RECRUITER: { bg: '#FFF7ED', color: '#C2410C' },
  };
  const style = colors[text] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      background: style.bg, color: style.color, borderRadius: 12,
      padding: '2px 10px', fontSize: 12, fontWeight: 500, border: `1px solid ${style.bg === '#F1F5F9' ? '#E2E8F0' : style.color}33`
    }}>{text?.replace('ROLE_', '')}</span>
  );
};

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [kpiRes, chartRes] = await Promise.all([
        axiosInstance.get('/admin/analytics/kpis'),
        axiosInstance.get('/admin/analytics/charts'),
      ]);
      setKpis(kpiRes.data.data);
      setCharts(chartRes.data.data);
    } catch (e) {
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Skeletons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ height: 110, background: '#E2E8F0', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {[1,2].map(i => <div key={i} style={{ height: 350, background: '#E2E8F0', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />)}
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', margin: 0 }}>Overview</h1>
        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: 14 }}>
          Platform metrics and recent activity
        </p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <KpiCard label="Total Users"          value={kpis?.totalUsers}            sub={`${kpis?.totalJobSeekers} Seekers · ${kpis?.totalRecruiters} Recruiters`} />
        <KpiCard label="Active Jobs"          value={kpis?.activeJobs}            sub={`Out of ${kpis?.totalJobs} total jobs posted`} />
        <KpiCard label="Total Applications"   value={kpis?.totalApplications}      sub="Across all active and closed jobs" />
        <KpiCard label="Pending Verifications" value={kpis?.pendingVerifications}  sub="Awaiting admin review" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <ChartCard title="User Growth">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts?.userGrowth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="seekers" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} name="Seekers" />
              <Area type="monotone" dataKey="recruiters" stroke="#4B5563" fill="transparent" strokeWidth={2} name="Recruiters" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Applications Trend">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.applicationTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="applications" fill="#2563EB" name="Applications" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <TableCard title="Recent Registrations">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>User</th>
                <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 500, color: '#64748B' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {(kpis?.recentRegistrations || []).map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 500, color: '#0F172A' }}>{u.fullName}</div>
                    <div style={{ color: '#64748B', marginTop: 2 }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', color: '#64748B' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))}
              {(!kpis?.recentRegistrations?.length) && (
                <tr><td colSpan={2} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>No recent registrations</td></tr>
              )}
            </tbody>
          </table>
        </TableCard>

        <TableCard title="Recent Jobs">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Job</th>
                <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 500, color: '#64748B' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(kpis?.recentJobs || []).map((j, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 500, color: '#0F172A' }}>{j.title}</div>
                    <div style={{ color: '#64748B', marginTop: 2 }}>{j.companyName}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <Badge text={j.status} />
                  </td>
                </tr>
              ))}
              {(!kpis?.recentJobs?.length) && (
                <tr><td colSpan={2} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>No recent jobs</td></tr>
              )}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
}
