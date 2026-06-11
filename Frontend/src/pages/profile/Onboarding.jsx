import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Onboarding() {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const checkUsername = async (val) => {
    setUsername(val);
    if (val.length < 3) return setIsAvailable(null);
    setChecking(true);
    try {
      const res = await axiosInstance.get(`/seekers/username/check?username=${val}`);
      setIsAvailable(res.data.data);
    } catch (e) {
      setIsAvailable(false);
    }
    setChecking(false);
  };

  const handleSave = async () => {
    if (!isAvailable) return toast.error("Please pick an available username");
    try {
      await axiosInstance.put('/seekers/me', {
        username,
        profileVisibility: 'PUBLIC',
        openToWork: true
      });
      toast.success("Profile initialized!");
      navigate('/dashboard/profile/edit');
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save username");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim your Public URL</h2>
        <p className="text-gray-600 mb-6">Choose a unique handle for your public profile (e.g. jobportal.com/u/rohan-umbare)</p>
        
        <div className="mb-6">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="text-gray-500 font-medium mr-1">jobportal.com/u/</span>
            <input 
              type="text" 
              value={username}
              onChange={(e) => checkUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="w-full outline-none text-gray-900 font-medium"
              placeholder="username"
            />
          </div>
          {username.length >= 3 && (
            <p className={`text-sm mt-2 font-medium ${checking ? 'text-gray-500' : isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {checking ? 'Checking availability...' : isAvailable ? '✓ Username is available' : '✗ Username is taken'}
            </p>
          )}
        </div>

        <button 
          onClick={handleSave}
          disabled={!isAvailable || checking}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
