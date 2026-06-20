import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ResumeUploader from '../../components/profile/ResumeUploader';
import toast from 'react-hot-toast';

export default function ProfileEditor() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/seekers/me');
      setProfile(res.data.data);
    } catch (e) {
      if (e.response && (e.response.status === 404 || e.response.status === 400)) {
         window.location.href = '/onboarding';
      } else {
         toast.error("Failed to load profile");
      }
    }
  };

  const handleSave = async (updates) => {
    try {
      const payload = { ...profile, ...updates };
      const res = await axiosInstance.put('/seekers/me', payload);
      setProfile(res.data.data);
      toast.success("Profile updated");
    } catch (e) {
      console.error("Profile update error:", e);
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  if (!profile) return <div>Loading...</div>;

  const { metrics = { profileCompletionPercentage: 0, atsScore: 0, strength: 'Beginner' } } = profile;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Headline & Availability</h3>
          <input type="text" value={profile.headline || ''} onChange={e => setProfile({...profile, headline: e.target.value})} className="w-full border p-2 rounded mb-4" placeholder="e.g. Senior Frontend Engineer" />
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={profile.openToWork || false} onChange={e => setProfile({...profile, openToWork: e.target.checked})} className="form-checkbox h-5 w-5 text-blue-600"/>
            <span className="font-medium text-gray-700">Open to Work</span>
          </label>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Resume & AI Parsing</h3>
          <ResumeUploader onParseSuccess={(data) => {
            setProfile({
              ...profile,
              skills: [...new Set([...(profile.skills||[]), ...data.skills])],
              experience: data.experience || profile.experience
            });
          }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.skills || []).map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
            ))}
          </div>
          <button onClick={() => {
            const skill = prompt("Enter a skill:");
            if (skill) setProfile({...profile, skills: [...(profile.skills||[]), skill]});
          }} className="text-blue-600 font-medium hover:underline">+ Add Skill</button>
        </div>

        <button onClick={() => handleSave(profile)} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
          Save All Changes
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Profile Strength</h3>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.858" strokeDashoffset={351.858 - (351.858 * metrics.atsScore) / 100} className="text-blue-600 transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-800">{metrics.atsScore}</span>
              <span className="text-xs text-gray-500 font-bold uppercase">ATS Score</span>
            </div>
          </div>
          <p className="mt-4 font-bold text-gray-700">{metrics.strength}</p>
          <div className="mt-6 text-left">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Completion</span>
              <span className="font-bold text-gray-800">{metrics.profileCompletionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${metrics.profileCompletionPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Analytics</h3>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Profile Views</span>
            <span className="font-bold text-blue-600">{profile.profileViews || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Search Appearances</span>
            <span className="font-bold text-blue-600">--</span>
          </div>
        </div>
      </div>
    </div>
  );
}
