import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/seekers/public/${username}`);
        setProfile(res.data.data);
      } catch (e) {
        setError(true);
      }
    };
    fetchProfile();
  }, [username]);

  if (error) return <div className="text-center mt-20 text-xl font-bold text-gray-700">Profile not found or is private.</div>;
  if (!profile) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        
        <div className="px-8 pb-8 relative">
          <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white absolute -top-16 flex items-center justify-center text-4xl font-bold text-gray-400">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="pt-20 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{profile.username}</h1>
              <p className="text-xl text-gray-600 mt-1">{profile.headline || "Professional"}</p>
              {profile.openToWork && (
                <span className="inline-block mt-3 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Open to Work</span>
              )}
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all">
              Message
            </button>
          </div>
          
          {profile.bio && <p className="mt-6 text-gray-700 leading-relaxed">{profile.bio}</p>}
        </div>

        <div className="border-t border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map((skill, idx) => (
                <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium">{skill}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
            <div className="space-y-6">
              {(profile.experience || []).map((exp, idx) => (
                <div key={idx} className="border-l-2 border-blue-500 pl-4 py-1">
                  <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-600 font-medium">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                  <p className="text-gray-600 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
