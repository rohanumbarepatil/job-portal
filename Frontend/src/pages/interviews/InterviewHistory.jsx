import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await axiosInstance.get('/interviews/me');
      // Filter for COMPLETED, CANCELLED
      const history = res.data.data.filter(i => i.status === 'COMPLETED' || i.status === 'CANCELLED');
      setInterviews(history);
    } catch (e) {
      toast.error("Failed to load interview history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
      if (status === 'COMPLETED') return 'bg-green-100 text-green-800';
      if (status === 'CANCELLED') return 'bg-red-100 text-red-800';
      return 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center p-10 font-bold">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-black text-gray-900 mb-6">Interview History</h2>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold text-gray-600">Round</th>
              <th className="p-4 font-bold text-gray-600">Type</th>
              <th className="p-4 font-bold text-gray-600">Date</th>
              <th className="p-4 font-bold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No past interviews found.</td></tr>
            ) : (
              interviews.map(inv => (
                <tr key={inv.interviewId} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-900">{inv.roundName}</td>
                  <td className="p-4 text-gray-600">{inv.roundType}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(inv.scheduledAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
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
