import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function RecruiterJobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get('/jobs/recruiter');
      setJobs(res.data.data);
    } catch (e) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await axiosInstance.put(`/jobs/${jobId}`, { status: newStatus });
      toast.success(`Job marked as ${newStatus}`);
      fetchJobs();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      toast.success("Job deleted");
      fetchJobs();
    } catch (e) {
      toast.error("Failed to delete job");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <button onClick={() => window.location.href='/dashboard/jobs/new'} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
          + Post New Job
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 border-b">Job Title</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Views</th>
              <th className="p-4 border-b">Applications</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No jobs posted yet.</td></tr>
            ) : (
              jobs.map(job => (
                <tr key={job.jobId} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-600 cursor-pointer" onClick={() => window.open(`/jobs/${job.jobId}`, '_blank')}>
                    {job.title}
                    <div className="text-xs text-gray-500 font-normal">{job.locationType} • {job.employmentType}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4">{job.metrics?.views || 0}</td>
                  <td className="p-4">{job.metrics?.applications || 0}</td>
                  <td className="p-4 space-x-2">
                    <button onClick={() => toggleStatus(job.jobId, job.status)} className="text-sm bg-gray-200 px-3 py-1 rounded font-bold">
                      Toggle
                    </button>
                    <button onClick={() => window.location.href=`/dashboard/jobs/edit/${job.jobId}`} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(job.jobId)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded font-bold">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
