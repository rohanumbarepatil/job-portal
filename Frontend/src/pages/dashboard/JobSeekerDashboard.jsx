import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import RecommendedJobs from '../../components/ai/RecommendedJobs';
import Logo from '../../components/common/Logo';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const KpiCard = ({ label, value }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col">
    <div className="text-slate-500 text-sm font-medium mb-1">{label}</div>
    <div className="text-3xl font-bold text-slate-900">{value}</div>
  </div>
);

const SectionCard = ({ title, children, action }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-base font-semibold text-slate-900 m-0">{title}</h2>
      {action && <div className="text-sm font-medium text-blue-600 cursor-pointer">{action}</div>}
    </div>
    {children}
  </div>
);

const EmptyState = ({ icon, message, sub }) => (
  <div className="py-8 flex flex-col items-center justify-center text-center">
    <div className="text-4xl mb-3 opacity-50">{icon}</div>
    <div className="text-slate-600 font-medium text-sm">{message}</div>
    {sub && <div className="text-slate-400 text-xs mt-1">{sub}</div>}
  </div>
);

export default function JobSeekerDashboard() {
  const { dbUser, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, intRes] = await Promise.all([
          axiosInstance.get('/applications/me').catch(() => ({ data: { data: [] } })),
          axiosInstance.get('/interviews/me').catch(() => ({ data: { data: [] } }))
        ]);
        setApps(appRes.data.data || []);
        setInterviews(intRes.data.data || []);
      } catch (e) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-slate-500 font-medium animate-pulse">Loading Career Portal...</div>;

  const profileComplete = dbUser?.profileCompleted;
  const atsScore = profileComplete ? '85%' : '--';
  
  // Pipeline
  const pipelineStages = [
    { label: 'Applied', count: apps.length },
    { label: 'Under Review', count: apps.filter(a => ['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'SELECTED'].includes(a.status?.toUpperCase())).length },
    { label: 'Shortlisted', count: apps.filter(a => ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'SELECTED'].includes(a.status?.toUpperCase())).length },
    { label: 'Interview', count: interviews.length },
    { label: 'Selected', count: apps.filter(a => a.status?.toUpperCase() === 'SELECTED').length },
    { label: 'Rejected', count: apps.filter(a => a.status?.toUpperCase() === 'REJECTED').length }
  ];

  // Mocks
  const careerInsights = [
    { label: 'Applications Sent This Week', value: '3' },
    { label: 'Profile Views', value: '14' },
    { label: 'Search Appearances', value: '42' },
    { label: 'Response Rate', value: '28%' }
  ];

  const recentActivity = apps.length > 0 ? apps.slice(0,3).map(a => ({
    title: `Applied to ${a.job?.title || 'Role'}`,
    date: 'Recently'
  })) : [
    { title: 'Saved Full Stack Engineer at Acme', date: '2 days ago' },
    { title: 'Profile completed to 82%', date: '1 week ago' }
  ];

  const notifications = [
    { text: 'Your application for Java Developer was viewed.', time: '2 hours ago' },
    { text: '3 new recommended jobs match your profile.', time: '1 day ago' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="sm" />
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-600">
            <Link to="/jobs" className="hover:text-blue-600 transition-colors">Search Jobs</Link>
            <Link to="/dashboard/applications" className="hover:text-blue-600 transition-colors">My Applications</Link>
            <Link to="/dashboard/interviews" className="hover:text-blue-600 transition-colors">Interviews</Link>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-900">{dbUser?.fullName?.split(' ')[0]}</span>
              <button onClick={logout} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Professional Career Overview (Hero) */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Professional Career Overview</h1>
          <p className="text-slate-500 text-sm">Track your progress, improve your profile, and discover your next role.</p>
        </div>

        {/* Top KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <KpiCard label="Profile Completion" value={profileComplete ? '82%' : '40%'} />
          <KpiCard label="ATS Resume Score" value={atsScore} />
          <KpiCard label="Applications" value={apps.length} />
          <KpiCard label="Interviews" value={interviews.length} />
          <KpiCard label="Saved Jobs" value="12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Application Pipeline */}
            <SectionCard title="Hiring Pipeline">
              <div className="flex justify-between items-center px-4 py-6 overflow-x-auto">
                {pipelineStages.map((stage, idx) => (
                  <React.Fragment key={stage.label}>
                    <div className="flex flex-col items-center min-w-[80px]">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3 transition-colors ${
                        stage.count > 0 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {stage.count}
                      </div>
                      <div className="text-xs font-medium text-slate-600 whitespace-nowrap">{stage.label}</div>
                    </div>
                    {idx < pipelineStages.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 sm:mx-4 rounded ${stage.count > 0 ? 'bg-blue-200' : 'bg-slate-100'} mb-7`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </SectionCard>

            {/* Recommended Jobs */}
            <SectionCard title="Recommended Jobs For You" action="View All">
              <RecommendedJobs />
            </SectionCard>

            {/* ATS Score Detailed Section */}
            <SectionCard title="ATS Resume Analysis">
              {profileComplete ? (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-black text-green-600">85%</span>
                      <span className="text-sm font-medium text-slate-500">Industry Benchmark: 72%</span>
                    </div>
                    <div className="text-sm font-semibold text-green-700 bg-green-50 inline-block px-3 py-1 rounded-full mb-6">
                      Top 15% Candidate
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Strengths Detected</div>
                        <ul className="space-y-2">
                          {['Java / Spring Boot', 'React.js', 'System Design'].map(skill => (
                            <li key={skill} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                              <span className="text-green-500">✓</span> {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Missing Keywords</div>
                        <ul className="space-y-2">
                          {['Docker / Kubernetes', 'AWS / Cloud'].map(skill => (
                            <li key={skill} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                              <span className="text-orange-400">!</span> {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState icon="📄" message="No resume detected" sub="Upload your resume to unlock ATS scoring and keyword analysis." />
              )}
            </SectionCard>

          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-6">
            
            {/* Profile Strength */}
            <SectionCard title="Profile Strength">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center shrink-0">
                  <div className={`absolute inset-0 border-4 rounded-full ${profileComplete ? 'border-green-500' : 'border-blue-500 border-r-transparent border-b-transparent'}`}></div>
                  <span className="text-lg font-bold text-slate-800">{profileComplete ? '82%' : '40%'}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 mb-1">{profileComplete ? 'Intermediate' : 'Beginner'}</div>
                  <div className="text-xs text-slate-500">Complete your profile to stand out to recruiters.</div>
                </div>
              </div>
              
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Missing Items</div>
              <ul className="space-y-3 mb-6">
                {!profileComplete && (
                  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span> Add Work Experience
                  </li>
                )}
                <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span> Upload Latest Resume
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span> Add Certifications
                </li>
              </ul>
              
              <Link to="/dashboard/profile/edit" className="block text-center w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2 rounded transition-colors">
                Complete Profile
              </Link>
            </SectionCard>

            {/* Upcoming Interviews Calendar Widget */}
            <SectionCard title="Upcoming Interviews">
              {interviews.length > 0 ? (
                <div className="space-y-4">
                  {interviews.map((intv, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="bg-white rounded p-2 flex flex-col items-center justify-center shrink-0 border border-blue-100 w-12 h-12">
                        <span className="text-xs font-bold text-blue-600 uppercase">{new Date(intv.scheduledAt).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-black text-slate-900 leading-none">{new Date(intv.scheduledAt).getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">{intv.job?.title || 'Interview'}</div>
                        <div className="text-xs text-slate-500 font-medium mb-2">{intv.job?.company?.name || 'Company'} • {new Date(intv.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <a href={intv.meetingLink || '#'} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 bg-white px-3 py-1 rounded border border-blue-200 inline-block">Join Link</a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon="📅" message="No upcoming interviews" sub="Browse opportunities and keep applying." />
              )}
            </SectionCard>

            {/* Career Insights */}
            <SectionCard title="Career Insights">
              <div className="space-y-4">
                {careerInsights.map((ci, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">{ci.label}</span>
                    <span className="text-sm font-bold text-slate-900">{ci.value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Notifications & Recent Activity */}
            <SectionCard title="Recent Activity">
              <div className="space-y-5">
                {recentActivity.map((act, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{act.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{act.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Notifications">
              {notifications.map((notif, idx) => (
                <div key={idx} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-0 border-slate-100">
                  <div className="text-sm text-slate-700 font-medium leading-snug">{notif.text}</div>
                  <div className="text-xs text-slate-400 mt-1">{notif.time}</div>
                </div>
              ))}
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  );
}
