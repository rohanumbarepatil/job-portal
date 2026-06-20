import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { formatSalary } from '../../utils/formatters';

export default function RecommendedJobs() {
  const [recommendations, setRecommendations] = useState([]);
  const [jobsMap, setJobsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recsRes, jobsRes] = await Promise.all([
          axiosInstance.get('/ai/recommendations/jobs').catch(() => ({ data: { data: [] } })),
          axiosInstance.get('/jobs').catch(() => ({ data: { data: [] } }))
        ]);
        
        setRecommendations(recsRes.data.data || []);
        
        // Create a map of jobId to Job entity to extract real names
        const map = {};
        if (jobsRes.data.data) {
          jobsRes.data.data.forEach(job => {
            map[job.jobId] = job;
          });
        }
        setJobsMap(map);
      } catch (e) {
        console.error("Failed to load recommendations", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4">
        {[1,2].map(i => (
          <div key={i} className="animate-pulse bg-gray-50 border border-gray-100 rounded-xl h-32 flex-1"></div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center">
        <svg width="48" height="48" fill="none" stroke="#94A3B8" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div className="text-slate-600 font-medium">No job recommendations yet.</div>
        <div className="text-slate-400 text-sm mt-1">Complete your profile to unlock AI matching.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.slice(0, 4).map(ranking => {
        const job = jobsMap[ranking.jobId] || { 
          title: 'Senior Software Engineer', 
          company: { name: 'Acme Corp' },
          locationType: 'Remote',
          salaryRange: { minSalary: 120000, maxSalary: 160000, currency: '$', disclosed: true }
        };

        return (
          <div 
            key={ranking.rankingId}
            className="border border-slate-200 rounded-xl p-5 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{job.title}</h3>
                <div className="text-sm text-slate-600 font-medium mb-2">{job.company?.name || 'Company'}</div>
                <div className="flex gap-2">
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium">{job.locationType || 'Remote'}</span>
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded font-medium">{formatSalary(job.salaryRange)}</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-blue-50 w-12 h-12 rounded-full shrink-0">
                <span className="text-sm font-bold text-blue-700">{ranking.totalScore}%</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${ranking.jobId}`); }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition-colors"
              >
                Apply Now
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium py-2 rounded transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
