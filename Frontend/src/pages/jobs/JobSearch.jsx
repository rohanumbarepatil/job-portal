import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ keyword: '', location: '', type: '' });
  const { dbUser } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchParams.keyword) query.append('keyword', searchParams.keyword);
      if (searchParams.location) query.append('location', searchParams.location);
      if (searchParams.type) query.append('type', searchParams.type);
      
      const res = await axiosInstance.get(`/jobs?${query.toString()}`);
      setJobs(res.data.data || []);
    } catch (e) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-white text-center mb-8">Find Your Dream Job</h1>
          
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-lg flex space-x-4">
            <input 
              type="text" 
              placeholder="Job title, keywords, or company" 
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchParams.keyword}
              onChange={e => setSearchParams({...searchParams, keyword: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="City, state, or 'Remote'" 
              className="w-1/4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchParams.location}
              onChange={e => setSearchParams({...searchParams, location: e.target.value})}
            />
            <select 
              className="w-1/4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchParams.type}
              onChange={e => setSearchParams({...searchParams, type: e.target.value})}
            >
              <option value="">All Job Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Latest Recommended Jobs</h2>
        {loading ? (
          <div className="text-center text-gray-500 font-bold">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 font-bold py-10">No jobs found matching your criteria.</div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.jobId} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition duration-200 cursor-pointer" onClick={() => window.location.href = `/jobs/${job.jobId}`}>
                <div className="flex justify-between items-start">
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {job.companyMetadata?.logoUrl ? (
                        <img src={job.companyMetadata.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-bold text-gray-400">{job.title.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-700">{job.title}</h3>
                      <p className="text-gray-600">{job.companyMetadata?.name} • {job.location}</p>
                      <div className="flex space-x-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded text-gray-700">{job.employmentType}</span>
                        <span className="px-2 py-1 bg-green-50 text-xs font-bold rounded text-green-700">{job.locationType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{job.salaryRange?.isDisclosed ? `₹${job.salaryRange.min.toLocaleString()} - ₹${job.salaryRange.max.toLocaleString()}` : 'Not Disclosed'}</p>
                    <p className="text-sm text-gray-400 mt-1">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
