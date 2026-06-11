import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await axiosInstance.get('/interviews/me');
      // Filter for SCHEDULED or RESCHEDULED
      const upcoming = res.data.data.filter(i => i.status === 'SCHEDULED' || i.status === 'RESCHEDULED');
      setInterviews(upcoming);
    } catch (e) {
      toast.error("Failed to load upcoming interviews");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-bold">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-black text-gray-900 mb-6">Upcoming Interviews</h2>

      {interviews.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          You have no upcoming interviews at the moment.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {interviews.map(inv => (
            <div key={inv.interviewId} className="bg-white rounded-xl shadow-md border-l-4 border-blue-600 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{inv.roundName}</h3>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded mt-1">
                    {inv.roundType}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-500">Date & Time</div>
                  <div className="text-lg font-black text-blue-600">
                    {new Date(inv.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{inv.durationMinutes} Minutes</div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4 flex-1">
                <p><strong>Location/Link:</strong> <a href={inv.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{inv.meetingLink || inv.location}</a></p>
                {inv.notes && <p className="mt-2 text-gray-500 italic">" {inv.notes} "</p>}
              </div>

              <a 
                href={inv.meetingLink} 
                target="_blank" 
                rel="noreferrer"
                className="block text-center w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join Meeting
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
