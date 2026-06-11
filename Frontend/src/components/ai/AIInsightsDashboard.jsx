import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AIInsightsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get('/ai/analytics');
        if (res.data.data) {
          setAnalytics(res.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch analytics", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="animate-pulse p-8 bg-gray-50 rounded-xl h-48"></div>;
  if (!analytics) return null;

  const chartData = [
    { name: 'Avg Score', value: analytics.averageMatchScore, fill: '#3b82f6' },
    { name: 'Strong Matches', value: analytics.highlyRecommendedCandidates, fill: '#10b981' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <span className="text-2xl">✨</span> AI Insights
          </h2>
          <p className="text-sm text-gray-500 mt-1">Overview of Gemini's candidate evaluations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <div className="text-sm font-bold text-blue-600 mb-2">Total Evaluations</div>
            <div className="text-4xl font-black text-blue-900">{analytics.totalAIAnalyses}</div>
        </div>
        <div className="p-6 bg-green-50 rounded-xl border border-green-100 text-center">
            <div className="text-sm font-bold text-green-600 mb-2">Avg Match Score</div>
            <div className="text-4xl font-black text-green-900">{analytics.averageMatchScore}%</div>
        </div>
        <div className="p-6 bg-purple-50 rounded-xl border border-purple-100 text-center">
            <div className="text-sm font-bold text-purple-600 mb-2">Strong Matches (&gt;80%)</div>
            <div className="text-4xl font-black text-purple-900">{analytics.highlyRecommendedCandidates}</div>
        </div>
      </div>

      <div className="h-64 mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: '#f3f4f6'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
