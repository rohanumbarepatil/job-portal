import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axiosInstance.get('/admin/logs');
      setLogs(res.data.data);
    } catch (e) {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-bold">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Immutable Audit Logs</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-900 text-white uppercase text-xs tracking-wider">
              <th className="p-4 border-b">Timestamp</th>
              <th className="p-4 border-b">Admin UID</th>
              <th className="p-4 border-b">Action</th>
              <th className="p-4 border-b">Target ID</th>
              <th className="p-4 border-b">Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.logId} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-600 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4 font-mono text-xs text-blue-600">{log.adminUid}</td>
                <td className="p-4 font-bold text-gray-800">{log.actionType}</td>
                <td className="p-4 font-mono text-xs text-gray-500">{log.targetId}</td>
                <td className="p-4 text-gray-600">{log.reason}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
