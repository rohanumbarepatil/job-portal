import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await axiosInstance.get('/jobs/saved');
      setSavedJobs(res.data.data);
    } catch (e) {
      toast.error("Failed to fetch saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await axiosInstance.delete(`/jobs/${jobId}/unsave`);
      toast.success("Job removed");
      fetchSavedJobs();
    } catch (e) {
      toast.error("Failed to unsave job");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <div className="text-center text-gray-500 py-10">You haven't saved any jobs yet.</div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map(item => (
            <div key={item.id} className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-50">
              <div className="cursor-pointer" onClick={() => window.location.href=`/jobs/${item.jobId}`}>
                <h3 className="text-lg font-bold text-blue-700">{item.jobSnapshot?.title}</h3>
                <p className="text-gray-600 text-sm">{item.jobSnapshot?.companyName} • {item.jobSnapshot?.location}</p>
              </div>
              <div>
                <button onClick={() => handleUnsave(item.jobId)} className="text-red-600 font-bold hover:underline text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
