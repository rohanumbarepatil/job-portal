import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpiRes, chartRes] = await Promise.all([
        axiosInstance.get('/admin/analytics/kpis'),
        axiosInstance.get('/admin/analytics/charts')
      ]);
      setKpis(kpiRes.data.data);
      setCharts(chartRes.data.data);
    } catch (e) {
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-bold">Loading secure data...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500">Real-time metrics for the Job Portal.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: kpis?.totalUsers, color: 'bg-blue-50 text-blue-600' },
          { label: 'Job Seekers', value: kpis?.totalJobSeekers, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Recruiters', value: kpis?.totalRecruiters, color: 'bg-purple-50 text-purple-600' },
          { label: 'Companies', value: kpis?.totalCompanies, color: 'bg-pink-50 text-pink-600' },
          { label: 'Total Jobs', value: kpis?.totalJobs, color: 'bg-green-50 text-green-600' },
          { label: 'Active Jobs', value: kpis?.activeJobs, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Applications', value: kpis?.totalApplications, color: 'bg-orange-50 text-orange-600' },
          { label: 'Conversion Rate', value: `${kpis?.hiringConversionRate}%`, color: 'bg-yellow-50 text-yellow-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{kpi.label}</span>
            <span className={`text-4xl font-black mt-2 p-2 rounded-lg w-full ${kpi.color}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Growth */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-gray-800 mb-4">User Growth (MoM)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="seekers" stroke="#3b82f6" strokeWidth={2} name="Seekers" />
                <Line type="monotone" dataKey="recruiters" stroke="#8b5cf6" strokeWidth={2} name="Recruiters" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hiring Funnel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-gray-800 mb-4">Hiring Funnel</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.hiringFunnel || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
