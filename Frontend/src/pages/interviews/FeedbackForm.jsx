import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function FeedbackForm({ interview, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    interviewerName: '',
    technicalScore: 5,
    communicationScore: 5,
    problemSolvingScore: 5,
    overallRating: 5,
    recommendation: 'PROCEED',
    feedback: '',
    nextStepStatus: 'INTERVIEWED' // ATS integration
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post(`/interviews/${interview.interviewId}/feedback`, formData);
      toast.success("Feedback submitted!");
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold">Interview Feedback</h2>
            <p className="text-sm text-gray-600">For {interview.roundName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Interviewer Name</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.interviewerName} onChange={e => setFormData({...formData, interviewerName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Overall Recommendation</label>
              <select className="w-full border p-2 rounded bg-blue-50 font-bold" value={formData.recommendation} onChange={e => setFormData({...formData, recommendation: e.target.value})}>
                <option value="PROCEED">Proceed</option>
                <option value="HOLD">Hold</option>
                <option value="REJECT">Reject</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="font-bold border-b pb-2">Scores (1-10)</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Technical Score', key: 'technicalScore' },
                { label: 'Communication', key: 'communicationScore' },
                { label: 'Problem Solving', key: 'problemSolvingScore' },
                { label: 'Overall Rating', key: 'overallRating' }
              ].map(field => (
                <div key={field.key} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{field.label}</span>
                  <input type="number" min="1" max="10" required className="w-20 border p-1 rounded text-center font-bold" 
                         value={formData[field.key]} onChange={e => setFormData({...formData, [field.key]: parseInt(e.target.value)})} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Detailed Feedback (Internal Only)</label>
            <textarea required className="w-full border p-3 rounded h-32 text-sm" placeholder="Provide detailed technical and behavioral feedback here..."
                      value={formData.feedback} onChange={e => setFormData({...formData, feedback: e.target.value})}></textarea>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <label className="block text-sm font-bold mb-2 text-yellow-800">Next ATS Status</label>
            <p className="text-xs text-yellow-700 mb-2">Automatically move candidate in the ATS board after submitting this feedback.</p>
            <select className="w-full border-yellow-300 p-2 rounded font-bold" value={formData.nextStepStatus} onChange={e => setFormData({...formData, nextStepStatus: e.target.value})}>
              <option value="INTERVIEWED">Leave in Interviewed Stage</option>
              <option value="NEXT_ROUND">Move to Next Round / Shortlisted</option>
              <option value="OFFERED">Move to Offered</option>
              <option value="REJECTED">Move to Rejected</option>
            </select>
          </div>

        </form>

        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="px-6 py-2 font-bold bg-blue-600 text-white rounded hover:bg-blue-700">
            {loading ? 'Submitting...' : 'Submit Feedback & Update ATS'}
          </button>
        </div>
      </div>
    </div>
  );
}
