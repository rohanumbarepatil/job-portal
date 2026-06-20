import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const KpiCard = ({ label, value, sub, color = '#2563EB' }) => (
  <div style={{
    background: '#FFFFFF', borderRadius: 8, padding: '20px',
    border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column'
  }}>
    <div style={{ color: '#64748B', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{value ?? '—'}</div>
    {sub && <div style={{ fontSize: 12, color: color, marginTop: 8, fontWeight: 500 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: '0 0 16px 0' }}>{children}</h2>
);

const TableCard = ({ title, children }) => (
  <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
    <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{title}</div>
    {children}
  </div>
);

const Badge = ({ text, type }) => {
  const styles = {
    ACTIVE: { bg: '#ECFDF5', color: '#059669' },
    CLOSED: { bg: '#F1F5F9', color: '#475569' },
    SCHEDULED: { bg: '#EFF6FF', color: '#1D4ED8' },
    COMPLETED: { bg: '#ECFDF5', color: '#059669' },
    APPLIED: { bg: '#F8FAFC', color: '#475569' },
    SHORTLISTED: { bg: '#FFF7ED', color: '#C2410C' },
  };
  const s = styles[text?.toUpperCase()] || { bg: '#F8FAFC', color: '#475569' };
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 12, padding: '2px 8px', fontSize: 11, fontWeight: 600, border: `1px solid ${s.color}33`
    }}>{text}</span>
  );
};

export default function RecruiterDashboard() {
  const { dbUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mocked pipeline & chart data since there's no backend aggregate endpoint
  const pipelineData = [
    { stage: 'Applied', count: 287 },
    { stage: 'Screening', count: 142 },
    { stage: 'Shortlisted', count: 48 },
    { stage: 'Interview', count: 24 },
    { stage: 'Offer', count: 6 },
    { stage: 'Hired', count: 4 }
  ];

  const appTrend = [
    { date: 'Mon', apps: 12 }, { date: 'Tue', apps: 24 }, { date: 'Wed', apps: 18 },
    { date: 'Thu', apps: 32 }, { date: 'Fri', apps: 28 }, { date: 'Sat', apps: 8 }, { date: 'Sun', apps: 42 }
  ];

  const recentApplicationsMock = [
    { name: 'Sarah Jenkins', role: 'Senior Frontend Engineer', exp: '5 years', date: '2 hours ago', status: 'Applied' },
    { name: 'Michael Chen', role: 'Product Manager', exp: '8 years', date: '5 hours ago', status: 'Shortlisted' },
    { name: 'Emily Davis', role: 'UX Designer', exp: '3 years', date: '1 day ago', status: 'Interview' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, intRes] = await Promise.all([
          axiosInstance.get('/jobs/recruiter').catch(() => ({ data: { data: [] } })),
          axiosInstance.get('/interviews/company').catch(() => ({ data: { data: [] } }))
        ]);
        setJobs(jobsRes.data.data || []);
        setInterviews(intRes.data.data || []);
      } catch (e) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 40, color: '#64748B' }}>Loading ATS Dashboard...</div>;

  const activeJobs = jobs.filter(j => j.status === 'ACTIVE').length;
  const totalApps = jobs.reduce((acc, j) => acc + (j.metrics?.applications || 0), 0);
  const scheduledInt = interviews.filter(i => i.status === 'SCHEDULED').length;

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Enterprise Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '24px 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 }}>Welcome back, {dbUser?.fullName?.split(' ')[0] || 'Recruiter'}</h1>
            <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: 14 }}>{dbUser?.company?.name || 'Company Workspace'}</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => window.location.href='/dashboard/jobs/new'} style={{ background: '#2563EB', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>
              Post Job
            </button>
            <button onClick={() => window.location.href='/dashboard/interviews'} style={{ background: '#FFFFFF', color: '#0F172A', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: 6, fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>
              Schedule Interview
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px' }}>
        
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <KpiCard label="Open Jobs" value={activeJobs} sub={`Out of ${jobs.length} total`} />
          <KpiCard label="Applications" value={totalApps} sub="+31 this week" color="#16A34A" />
          <KpiCard label="Shortlisted" value={48} sub="Pending review" color="#F59E0B" />
          <KpiCard label="Interviews" value={scheduledInt} sub="Scheduled" />
          <KpiCard label="Hiring Rate" value="14%" sub="From applied to hired" color="#16A34A" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Visualizations */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            
            {/* Hiring Pipeline */}
            <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', padding: 24 }}>
              <SectionTitle>Hiring Pipeline</SectionTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
                {pipelineData.map((stage, idx) => (
                  <React.Fragment key={stage.stage}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{stage.count}</div>
                      <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{stage.stage}</div>
                    </div>
                    {idx < pipelineData.length - 1 && <div style={{ color: '#CBD5E1', fontSize: 20 }}>→</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Applications Trend Chart */}
            <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', padding: 24 }}>
              <SectionTitle>Applications Trend (Last 7 Days)</SectionTitle>
              <div style={{ height: 250, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={appTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="apps" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} name="Applications" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Applications Table */}
            <TableCard title="Recent Applications">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Candidate</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Role</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Applied</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 500, color: '#64748B' }}>Status</th>
                    <th style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 500, color: '#64748B' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplicationsMock.map((app, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 500, color: '#0F172A' }}>{app.name}</td>
                      <td style={{ padding: '16px 20px', color: '#64748B' }}>{app.role}</td>
                      <td style={{ padding: '16px 20px', color: '#64748B' }}>{app.date}</td>
                      <td style={{ padding: '16px 20px' }}><Badge text={app.status} /></td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button style={{ border: 'none', background: 'transparent', color: '#2563EB', fontWeight: 500, cursor: 'pointer' }}>Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>

          </div>

          {/* Right Sidebar Widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Upcoming Interviews */}
            <TableCard title="Upcoming Interviews">
              <div style={{ padding: '16px 20px' }}>
                {interviews.filter(i => i.status === 'SCHEDULED').slice(0, 3).map((intv, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid #E2E8F0' : 'none' }}>
                    <div style={{ fontWeight: 500, color: '#0F172A', fontSize: 13 }}>{intv.roundName}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                      {new Date(intv.scheduledAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <button style={{ fontSize: 12, background: '#EFF6FF', color: '#1D4ED8', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontWeight: 500 }}>Join Meeting</button>
                    </div>
                  </div>
                ))}
                {interviews.filter(i => i.status === 'SCHEDULED').length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF', fontSize: 13 }}>No upcoming interviews</div>
                )}
              </div>
            </TableCard>

            {/* Jobs Performance */}
            <TableCard title="Active Jobs Performance">
              <div style={{ padding: '8px 20px' }}>
                {jobs.filter(j => j.status === 'ACTIVE').slice(0, 4).map((j, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: i < 3 ? '1px solid #E2E8F0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, color: '#0F172A', fontSize: 13 }}>{j.title}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{j.metrics?.applications || 0} applications</div>
                    </div>
                    <button style={{ border: '1px solid #E2E8F0', background: '#FFF', padding: '4px 8px', borderRadius: 4, fontSize: 12, cursor: 'pointer', color: '#475569' }}>View ATS</button>
                  </div>
                ))}
                {jobs.filter(j => j.status === 'ACTIVE').length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF', fontSize: 13 }}>No active jobs</div>
                )}
              </div>
            </TableCard>

            {/* AI Insights Section */}
            <div style={{ background: '#F8FAFC', borderRadius: 8, border: '1px dashed #CBD5E1', padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <span>✨</span> AI Insights
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                <div style={{ marginBottom: 8 }}><strong>Top Matches:</strong> 3 new strong candidates for Senior Engineer role.</div>
                <div><strong>Attention:</strong> Product Manager posting has low application velocity. Consider updating the description.</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
