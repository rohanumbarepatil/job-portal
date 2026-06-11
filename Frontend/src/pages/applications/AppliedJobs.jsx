import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get('/applications/me');
      setApplications(res.data.data);
    } catch (e) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPLIED': return 'bg-gray-100 text-gray-800';
      case 'REVIEWING': return 'bg-blue-100 text-blue-800';
      case 'SHORTLISTED': return 'bg-yellow-100 text-yellow-800';
      case 'INTERVIEW_SCHEDULED': 
      case 'INTERVIEWED': return 'bg-purple-100 text-purple-800';
      case 'OFFERED': 
      case 'HIRED': return 'bg-green-100 text-green-800';
      case 'REJECTED': 
      case 'WITHDRAWN': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-10 font-bold">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">My Applications</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 border-b">Job Title</th>
              <th className="p-4 border-b">Company</th>
              <th className="p-4 border-b">Applied On</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No applications yet.</td></tr>
            ) : (
              applications.map(app => (
                <tr key={app.applicationId} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-bold text-blue-600">
                    {app.jobSnapshot?.title}
                  </td>
                  <td className="p-4 text-gray-600">{app.jobSnapshot?.companyName}</td>
                  <td className="p-4 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => window.location.href=`/dashboard/applications/${app.applicationId}`} 
                      className="text-blue-600 font-bold hover:underline"
                    >
                      View Timeline
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
