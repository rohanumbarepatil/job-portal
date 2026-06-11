import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function InterviewScheduler({ applicationId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    roundName: 'Technical Interview',
    roundType: 'TECHNICAL',
    scheduledAt: '',
    durationMinutes: 60,
    meetingLink: '',
    location: 'Virtual',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure ISO string for backend
      const payload = {
          ...formData,
          applicationId,
          scheduledAt: new Date(formData.scheduledAt).toISOString()
      };
      await axiosInstance.post('/interviews', payload);
      toast.success("Interview scheduled successfully!");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold">Schedule Interview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Round Name</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.roundName} onChange={e => setFormData({...formData, roundName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Type</label>
              <select className="w-full border p-2 rounded" value={formData.roundType} onChange={e => setFormData({...formData, roundType: e.target.value})}>
                <option value="HR">HR</option>
                <option value="TECHNICAL">Technical</option>
                <option value="CODING">Coding</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="MANAGERIAL">Managerial</option>
                <option value="FINAL">Final</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Date & Time</label>
              <input required type="datetime-local" className="w-full border p-2 rounded" value={formData.scheduledAt} onChange={e => setFormData({...formData, scheduledAt: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Duration (Mins)</label>
              <input required type="number" className="w-full border p-2 rounded" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Meeting Link</label>
            <input required type="url" placeholder="https://meet.google.com/..." className="w-full border p-2 rounded" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Notes for Candidate</label>
            <textarea className="w-full border p-2 rounded h-20" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>

          <div className="pt-4 border-t flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 font-bold bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
