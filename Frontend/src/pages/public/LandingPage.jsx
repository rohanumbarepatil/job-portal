import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Logo from '../../components/common/Logo';
import { KpiCard, SectionCard } from '../../components/common/DashboardWidgets';

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ candidates: 0, companies: 0, activeJobs: 0, placements: 0 });
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [previewTab, setPreviewTab] = useState('recruiter');

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [statsRes, companiesRes, jobsRes] = await Promise.all([
          axiosInstance.get('/public/stats'),
          axiosInstance.get('/companies/featured'),
          axiosInstance.get('/jobs?size=6&sort=createdAt,desc')
        ]);
        if (statsRes.data.data) setStats(statsRes.data.data);
        if (companiesRes.data.data) setFeaturedCompanies(companiesRes.data.data);
        if (jobsRes.data.data) setRecentJobs(jobsRes.data.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load landing data", err);
      }
    };
    fetchLandingData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery || searchLocation) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}`);
    } else {
      navigate('/jobs');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k+';
    return num;
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#0F172A', background: '#F8FAFC' }}>
      
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-10 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#preview" className="hover:text-blue-600 transition-colors">Platform</a>
            <a href="#companies" className="hover:text-blue-600 transition-colors">Companies</a>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Log in</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-bold text-sm transition-all shadow-sm">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="bg-white border-b border-slate-200 pt-20 pb-24 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-100">
              Enterprise Recruitment Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              Discover Opportunities That Match Your Skills.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              Join the platform where elite talent meets leading enterprises. Advanced AI matching and streamlined workflows accelerate your career or hiring process.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row bg-white p-2 rounded-lg shadow-lg border border-slate-200 mb-8 max-w-2xl">
              <input 
                type="text" 
                aria-label="Search by job title, keywords, or company"
                placeholder="Job title, keywords, or company" 
                className="flex-1 border-none px-4 py-3 text-base outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="w-px bg-slate-200 my-2 hidden sm:block" />
              <input 
                type="text" 
                aria-label="Search by city, state, or remote"
                placeholder="City, state, or remote" 
                className="flex-1 border-none px-4 py-3 text-base outline-none bg-transparent"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
              <button type="submit" aria-label="Submit Job Search" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold text-base transition-colors mt-2 sm:mt-0">
                Search Jobs
              </button>
            </form>

            <div className="flex gap-4">
              <Link to="/register?role=job_seeker" className="text-blue-600 font-bold hover:underline">Find Jobs &rarr;</Link>
              <span className="text-slate-300">|</span>
              <Link to="/register?role=recruiter" className="text-slate-600 font-bold hover:underline">Hire Talent &rarr;</Link>
            </div>
          </div>

          {/* Hero Right: Candidate Pipeline Preview (Pure CSS/React elements) */}
          <div className="relative z-10 hidden lg:block">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-slate-50 rounded-2xl -rotate-2 scale-105 border border-slate-200"></div>
             <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-8 relative transform rotate-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                   <h3 className="font-bold text-slate-900">Candidate Pipeline: Senior Engineer</h3>
                   <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Active Role</div>
                </div>
                <div className="space-y-4 relative">
                   {/* Vertical Line */}
                   <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-100"></div>
                   
                   {[
                     { step: 'Applied', time: 'Oct 12, 09:41 AM', active: true },
                     { step: 'Review', time: 'Oct 13, 11:20 AM', active: true },
                     { step: 'Shortlisted', time: 'Oct 14, 02:15 PM', active: true },
                     { step: 'Interview', time: 'Pending Scheduling', active: false },
                     { step: 'Selected', time: 'Awaiting Decision', active: false }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-4 items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${item.active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                          {i + 1}
                        </div>
                        <div className={`flex-1 p-4 rounded-lg border ${item.active ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 border-dashed'}`}>
                          <div className={`font-bold text-sm ${item.active ? 'text-slate-900' : 'text-slate-400'}`}>{item.step}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.time}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST BAR */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-[1200px] mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2">{formatNumber(stats.activeJobs)}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Jobs</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2">{formatNumber(stats.companies)}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Companies</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2">{formatNumber(stats.candidates)}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Candidates</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-blue-600 mb-2">{formatNumber(stats.placements)}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Placements</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Streamlined workflows for everyone</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Whether you're building a career or building a team, our platform removes the friction from recruitment.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">💼</span> For Candidates
              </h3>
              <div className="space-y-8">
                {[
                  { title: 'Create Profile', desc: 'Build your professional identity' },
                  { title: 'Upload Resume', desc: 'Automated ATS parsing' },
                  { title: 'Get Matched', desc: 'AI recommends the best fits' },
                  { title: 'Apply', desc: 'One-click application process' },
                  { title: 'Get Hired', desc: 'Track interviews and offers' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 shrink-0 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div>
                    <div>
                      <div className="font-bold text-slate-900">{step.title}</div>
                      <div className="text-sm text-slate-500 mt-1">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <span className="bg-slate-800 text-white p-2 rounded-lg">🏢</span> For Recruiters
              </h3>
              <div className="space-y-8">
                {[
                  { title: 'Create Company', desc: 'Setup employer branding' },
                  { title: 'Post Job', desc: 'Define requirements and tags' },
                  { title: 'Review Candidates', desc: 'View AI-scored applicants' },
                  { title: 'Schedule Interviews', desc: 'Built-in calendar tracking' },
                  { title: 'Hire Talent', desc: 'Manage offers and onboarding' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 shrink-0 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div>
                    <div>
                      <div className="font-bold text-slate-900">{step.title}</div>
                      <div className="text-sm text-slate-500 mt-1">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY COMPANIES CHOOSE US */}
      <section id="features" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Why companies choose us</h2>
            <p className="text-lg text-slate-600 max-w-2xl">Enterprise-grade tools designed to reduce time-to-hire and improve candidate quality.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Faster Hiring', desc: 'Reduce time-to-hire by 40% with automated screening and scheduling workflows.' },
              { title: 'AI Resume Matching', desc: 'Our proprietary ML models score candidates against job requirements instantly.' },
              { title: 'ATS Tracking', desc: 'End-to-end applicant tracking system with customizable pipeline stages.' },
              { title: 'Recruiter Workflow', desc: 'Collaborative hiring tools for teams to review, comment, and vote on candidates.' },
              { title: 'Interview Scheduling', desc: 'Seamlessly coordinate interviews between candidates and hiring managers.' },
              { title: 'Analytics Dashboard', desc: 'Real-time insights into your hiring funnel, sourcing metrics, and team performance.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors bg-slate-50">
                <h3 className="font-bold text-slate-900 text-lg mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE PLATFORM PREVIEW */}
      <section id="preview" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4">Experience the platform</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Actual live components powering thousands of hiring decisions daily.</p>
          </div>
          
          <div className="flex justify-center gap-4 mb-12">
            {['job_seeker', 'recruiter', 'admin'].map(tab => (
              <button 
                key={tab}
                onClick={() => setPreviewTab(tab)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${previewTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                {tab === 'job_seeker' ? 'Candidate Portal' : tab === 'recruiter' ? 'Recruiter Dashboard' : 'Admin Console'}
              </button>
            ))}
          </div>

          <div className="bg-slate-100 rounded-t-2xl p-4 md:p-8 border border-slate-700 mx-auto max-w-5xl shadow-2xl relative text-slate-900" style={{ height: '500px', overflowY: 'auto' }}>
            {/* Real React Components Embedded as Preview */}
            {previewTab === 'recruiter' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <KpiCard label="Active Jobs" value="12" trend="+2 this week" />
                  <KpiCard label="Total Applications" value="1,248" trend="+15% vs last month" />
                  <KpiCard label="Interviews Scheduled" value="24" trend="8 upcoming" />
                </div>
                <SectionCard title="Recent Applications">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-3">Candidate</th>
                          <th className="px-6 py-3">Role</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">AI Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        <tr>
                          <td className="px-6 py-4 font-medium">Sarah Jenkins</td>
                          <td className="px-6 py-4">Senior UX Designer</td>
                          <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Under Review</span></td>
                          <td className="px-6 py-4 text-green-600 font-bold">92%</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium">David Chen</td>
                          <td className="px-6 py-4">Backend Engineer</td>
                          <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">Interview</span></td>
                          <td className="px-6 py-4 text-green-600 font-bold">88%</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium">Emily Rodriguez</td>
                          <td className="px-6 py-4">Product Manager</td>
                          <td className="px-6 py-4"><span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs font-bold">Applied</span></td>
                          <td className="px-6 py-4 text-yellow-600 font-bold">75%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>
            )}
            
            {previewTab === 'job_seeker' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Welcome back, Alex</h2>
                    <p className="text-slate-500 text-sm mt-1">Your profile is 85% complete. Add your latest experience to reach 100%.</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-sm">Update Profile</button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <KpiCard label="Saved Jobs" value="14" />
                  <KpiCard label="Applications Sent" value="8" />
                  <KpiCard label="ATS Resume Score" value="94/100" trend="Strong Match" />
                </div>
                <SectionCard title="Application Timeline">
                   <div className="p-4 bg-slate-50 rounded border border-slate-200">
                     <div className="flex justify-between items-center mb-2">
                       <span className="font-bold">Frontend Engineer @ TechCorp</span>
                       <span className="text-sm text-blue-600 font-bold">Interview Scheduled</span>
                     </div>
                     <div className="text-sm text-slate-500">Tomorrow at 10:00 AM PST</div>
                   </div>
                </SectionCard>
              </div>
            )}
            
            {previewTab === 'admin' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <KpiCard label="System Load" value="24%" trend="Normal" />
                  <KpiCard label="New Users (24h)" value="1,402" />
                  <KpiCard label="Pending Companies" value="45" trend="Needs Review" />
                  <KpiCard label="Error Rate" value="0.01%" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <SectionCard title="Recent Verification Requests">
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-slate-50 border border-slate-200 rounded">
                        <span className="font-medium text-sm">Stripe Inc.</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">Verify</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50 border border-slate-200 rounded">
                        <span className="font-medium text-sm">Vercel</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">Verify</span>
                      </div>
                    </div>
                  </SectionCard>
                  <SectionCard title="System Alerts">
                    <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded text-sm font-medium">
                      All systems operational. Database replication latency: 12ms.
                    </div>
                  </SectionCard>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 6: RECRUITMENT WORKFLOW */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-10 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-16">The visual hiring pipeline</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-slate-200 -z-10"></div>
            
            {['Applications', 'Shortlisting', 'Interviews', 'Selection', 'Onboarding'].map((stage, i) => (
              <div key={i} className="bg-white px-6 py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-700 shadow-sm relative z-10 w-full md:w-auto">
                {stage}
                {i < 4 && <div className="hidden md:block absolute -right-6 top-1/2 -mt-3 text-slate-300">➔</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: TOP COMPANIES */}
      <section id="companies" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-12">Top companies hiring now</h2>
          
          {featuredCompanies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredCompanies.map(company => (
                <Link to={`/company/${company.companySlug}`} key={company.companyId} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-center h-48">
                  {company.branding?.logoUrl ? (
                    <img src={company.branding.logoUrl} alt={company.companyInfo.name} className="w-16 h-16 object-contain mb-4" />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 text-blue-700 font-bold text-xl rounded-lg flex items-center justify-center mb-4">
                      {company.companyInfo.name.charAt(0)}
                    </div>
                  )}
                  <h4 className="font-bold text-slate-900">{company.companyInfo.name}</h4>
                  <div className="text-xs text-slate-500 mt-1">{company.companyInfo.industry || 'Technology'}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10">Loading companies...</div>
          )}
        </div>
      </section>

      {/* SECTION 8: RECENT JOBS */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Recently posted roles</h2>
            <Link to="/jobs" className="text-blue-600 font-bold hover:underline">View all jobs &rarr;</Link>
          </div>
          
          {recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map(job => (
                <Link to={`/jobs/${job.jobId}`} key={job.jobId} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                      <div className="text-sm text-slate-600 mt-1">{job.companyName}</div>
                    </div>
                    {job.employmentType && (
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                        {job.employmentType.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs font-medium text-slate-500 mt-auto pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1">📍 {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-1">💰 {job.salaryRange?.disclosed ? `${job.salaryRange.minSalary} - ${job.salaryRange.maxSalary}` : 'Competitive'}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10">Loading recent jobs...</div>
          )}
        </div>
      </section>

      {/* SECTION 9: TESTIMONIALS (Seeded data representation) */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">Trusted by professionals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-700 italic mb-6">"JobPortal's AI matching connected me with candidates who perfectly fit our niche technical requirements. We cut our sourcing time in half."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Michael T.</div>
                  <div className="text-xs text-slate-500">VP of Engineering, Acme Inc</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-700 italic mb-6">"The application tracking pipeline is the best I've used. It's incredibly intuitive and the automated email notifications save hours of manual work."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Sarah L.</div>
                  <div className="text-xs text-slate-500">Senior Recruiter, Globex</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-700 italic mb-6">"I uploaded my resume and within 2 days had 3 interviews scheduled with top tier companies. The ATS score feedback was game-changing."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="font-bold text-sm text-slate-900">David R.</div>
                  <div className="text-xs text-slate-500">Senior React Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA */}
      <section className="bg-blue-700 py-24 text-center">
        <div className="max-w-[800px] mx-auto px-10">
          <h2 className="text-4xl font-extrabold text-white mb-6">Ready to transform your recruitment?</h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed font-medium">
            Join the enterprise platform built for the modern workforce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=job_seeker" className="bg-white text-blue-700 px-8 py-4 rounded-md font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg">
              Find Your Next Opportunity
            </Link>
            <Link to="/register?role=recruiter" className="bg-blue-800 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-blue-900 transition-colors shadow-lg border border-blue-600">
              Hire Faster With Better Matches
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-10 flex flex-col md:flex-row justify-between border-b border-slate-800 pb-16 mb-8 gap-12">
          <div className="max-w-xs">
            <Logo size="sm" dark={true} />
            <p className="mt-6 text-sm text-slate-400 leading-relaxed">
              Enterprise-grade recruitment platform connecting world-class talent with industry-leading companies.
            </p>
          </div>
          <div className="flex gap-16 md:gap-24">
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Candidates</h4>
              <div className="flex flex-col gap-4 text-sm text-slate-400">
                <Link to="/jobs" className="hover:text-white transition-colors">Search Jobs</Link>
                <Link to="/companies" className="hover:text-white transition-colors">View Companies</Link>
                <Link to="/register" className="hover:text-white transition-colors">Create Profile</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Employers</h4>
              <div className="flex flex-col gap-4 text-sm text-slate-400">
                <Link to="/register?role=recruiter" className="hover:text-white transition-colors">Post a Job</Link>
                <Link to="/register?role=recruiter" className="hover:text-white transition-colors">Search Resumes</Link>
                <span className="cursor-not-allowed">Pricing</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
              <div className="flex flex-col gap-4 text-sm text-slate-400">
                <span className="cursor-not-allowed">About Us</span>
                <span className="cursor-not-allowed">Contact</span>
                <span className="cursor-not-allowed">Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-10 text-xs text-slate-500 text-center font-medium">
          &copy; {new Date().getFullYear()} JobPortal. All rights reserved. Built for enterprise.
        </div>
      </footer>
    </div>
  );
}
