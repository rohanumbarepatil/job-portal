import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

export default function JobEditor() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(jobId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    locationType: 'REMOTE',
    location: '',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    openPositions: 1,
    salaryMin: '',
    salaryMax: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (isEditing) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const res = await axiosInstance.get(`/jobs/details/${jobId}`);
      const job = res.data.data;
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requiredSkills: (job.requiredSkills || []).join(', '),
        locationType: job.locationType || 'REMOTE',
        location: job.location || '',
        employmentType: job.employmentType || 'FULL_TIME',
        experienceLevel: job.experienceLevel || 'MID',
        openPositions: job.openPositions || 1,
        salaryMin: job.salaryRange?.minSalary || '',
        salaryMax: job.salaryRange?.maxSalary || '',
        status: job.status || 'ACTIVE'
      });
    } catch (e) {
      toast.error("Failed to load job details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse skills into array
    const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
    // Parse search tags dynamically from title, skills, location
    const searchTags = [...skillsArray, formData.title, formData.locationType, formData.employmentType].map(t => t.toLowerCase());

    const payload = {
      title: formData.title,
      description: formData.description,
      requiredSkills: skillsArray,
      searchTags: searchTags,
      locationType: formData.locationType,
      location: formData.location,
      employmentType: formData.employmentType,
      experienceLevel: formData.experienceLevel,
      openPositions: parseInt(formData.openPositions, 10),
      salaryRange: {
        minSalary: parseInt(formData.salaryMin, 10) || 0,
        maxSalary: parseInt(formData.salaryMax, 10) || 0,
        currency: 'INR',
        disclosed: true
      },
      status: formData.status
    };

    try {
      if (isEditing) {
        await axiosInstance.put(`/jobs/${jobId}`, payload);
        toast.success("Job updated successfully!");
      } else {
        await axiosInstance.post('/jobs', payload);
        toast.success("Job posted successfully!");
      }
      navigate('/dashboard/jobs');
    } catch (e) {
      console.error("Job post error:", e);
      toast.error(e.response?.data?.message || "Failed to save job");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6 mb-10">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">{isEditing ? 'Edit Job' : 'Post a New Job'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block font-bold mb-1">Job Title *</label>
            <input required type="text" className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Java Developer" />
          </div>

          <div className="col-span-2">
            <label className="block font-bold mb-1">Job Description *</label>
            <textarea required rows="6" className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the role..."></textarea>
          </div>

          <div className="col-span-2">
            <label className="block font-bold mb-1">Required Skills (comma separated) *</label>
            <input required type="text" className="w-full border p-2 rounded" value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})} placeholder="e.g. Java, Spring Boot, React" />
          </div>

          <div>
            <label className="block font-bold mb-1">Location Type</label>
            <select className="w-full border p-2 rounded" value={formData.locationType} onChange={e => setFormData({...formData, locationType: e.target.value})}>
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">On-Site</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">Location (City, Country)</label>
            <input type="text" className="w-full border p-2 rounded" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Pune, India" />
          </div>

          <div>
            <label className="block font-bold mb-1">Employment Type</label>
            <select className="w-full border p-2 rounded" value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">Experience Level</label>
            <select className="w-full border p-2 rounded" value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})}>
              <option value="ENTRY">Entry Level</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior Level</option>
              <option value="EXECUTIVE">Executive</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">Minimum Salary (Annual)</label>
            <input type="number" className="w-full border p-2 rounded" value={formData.salaryMin} onChange={e => setFormData({...formData, salaryMin: e.target.value})} placeholder="e.g. 500000" />
          </div>

          <div>
            <label className="block font-bold mb-1">Maximum Salary (Annual)</label>
            <input type="number" className="w-full border p-2 rounded" value={formData.salaryMax} onChange={e => setFormData({...formData, salaryMax: e.target.value})} placeholder="e.g. 1500000" />
          </div>
          
          <div>
            <label className="block font-bold mb-1">Open Positions</label>
            <input type="number" className="w-full border p-2 rounded" value={formData.openPositions} onChange={e => setFormData({...formData, openPositions: e.target.value})} />
          </div>
          
          <div>
            <label className="block font-bold mb-1">Status</label>
            <select className="w-full border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="ACTIVE">Active (Published)</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
          <button type="button" onClick={() => navigate('/dashboard/jobs')} className="px-6 py-2 border rounded font-bold hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Save Job</button>
        </div>
      </form>
    </div>
  );
}
