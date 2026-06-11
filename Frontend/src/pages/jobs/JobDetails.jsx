import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dbUser } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const res = await axiosInstance.get(`/jobs/details/${jobId}`);
      setJob(res.data.data);
      // Optional: check if job is already saved by user
    } catch (e) {
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!dbUser) return toast.error("Please login to save jobs");
    try {
      if (saved) {
        await axiosInstance.delete(`/jobs/${jobId}/unsave`);
        setSaved(false);
        toast.success("Job removed from saved list");
      } else {
        await axiosInstance.post(`/jobs/${jobId}/save`);
        setSaved(true);
        toast.success("Job saved successfully!");
      }
    } catch (e) {
      toast.error("Failed to save job");
    }
  };

  const handleApply = () => {
    if (!dbUser) return toast.error("Please login to apply");
    toast.success("Application flow will be implemented in the ATS module!");
  };

  if (loading) return <div className="text-center mt-20 font-bold">Loading...</div>;
  if (!job) return <div className="text-center mt-20 text-xl font-bold">Job Not Found</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border mb-6">
          <div className="flex justify-between items-start">
            <div className="flex space-x-6">
               <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                 {job.companyMetadata?.logoUrl ? (
                    <img src={job.companyMetadata.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                 ) : (
                    <span className="font-bold text-gray-400">{job.title.charAt(0)}</span>
                 )}
               </div>
               <div>
                 <h1 className="text-3xl font-extrabold text-gray-900">{job.title}</h1>
                 <p className="text-lg text-blue-600 font-medium cursor-pointer" onClick={() => window.location.href=`/company/${job.companyMetadata?.slug}`}>{job.companyMetadata?.name}</p>
                 <div className="flex space-x-4 mt-2 text-gray-600 text-sm">
                   <span>📍 {job.location} ({job.locationType})</span>
                   <span>💼 {job.employmentType}</span>
                   <span>💰 {job.salaryRange?.isDisclosed ? `₹${job.salaryRange.min.toLocaleString()} - ₹${job.salaryRange.max.toLocaleString()}` : 'Not Disclosed'}</span>
                 </div>
               </div>
            </div>
            
            <div className="flex space-x-3">
              <button onClick={handleSave} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50">
                {saved ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleApply} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills?.map(skill => (
                <span key={skill} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <h3 className="font-bold text-gray-800">Experience Level</h3>
               <p className="text-gray-600">{job.experienceLevel}</p>
             </div>
             <div>
               <h3 className="font-bold text-gray-800">Open Positions</h3>
               <p className="text-gray-600">{job.openPositions}</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
