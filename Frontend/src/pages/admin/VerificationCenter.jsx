import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function VerificationCenter() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/admin/verifications');
      setRequests(res.data.data);
    } catch (e) {
      toast.error("Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    const reason = status === 'REJECTED' ? prompt("Enter rejection reason:") : "Verified by Admin";
    if (status === 'REJECTED' && !reason) return;

    try {
      await axiosInstance.patch(`/admin/verifications/${requestId}`, { status, reason });
      toast.success(`Request ${status}`);
      fetchRequests(); // reload
    } catch (e) {
      toast.error(`Failed to ${status} request`);
    }
  };

  if (loading) return <div className="text-center p-10 font-bold">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Verification Center</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <th className="p-4 border-b">Type</th>
              <th className="p-4 border-b">Entity ID</th>
              <th className="p-4 border-b">Submitted At</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.requestId} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{req.entityType}</td>
                <td className="p-4 font-mono text-xs text-gray-500">{req.entityId}</td>
                <td className="p-4 text-sm">{new Date(req.submittedAt).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    req.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {req.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => handleAction(req.requestId, 'APPROVED')}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-bold text-sm"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAction(req.requestId, 'REJECTED')}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-bold text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
