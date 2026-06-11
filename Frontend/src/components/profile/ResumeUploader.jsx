import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function ResumeUploader({ onParseSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const loadingToast = toast.loading("Gemini AI is parsing your resume...");

    try {
      const res = await axiosInstance.post('/seekers/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const rawJsonString = res.data.data;
      const cleanJson = rawJsonString.replace(/```json\n?|```/g, '');
      const parsedData = JSON.parse(cleanJson);
      
      onParseSuccess(parsedData);
      toast.success("Resume parsed successfully!", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to parse resume", { id: loadingToast });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <label className="cursor-pointer">
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">Select PDF Resume</span>
        <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={loading} />
      </label>
      <p className="mt-3 text-xs text-gray-500">Gemini AI will extract your skills and experience automatically.</p>
    </div>
  );
}
