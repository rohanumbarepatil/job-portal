import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function ApplicationDetails() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  const fetchData = async () => {
    try {
      const [appRes, logsRes] = await Promise.all([
        axiosInstance.get(`/applications/${applicationId}`),
        axiosInstance.get(`/applications/${applicationId}/logs`)
      ]);
      setApplication(appRes.data.data);
      setLogs(logsRes.data.data);
    } catch (e) {
      toast.error("Failed to fetch application details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 font-bold">Loading...</div>;
  if (!application) return <div className="text-center py-10 font-bold text-red-500">Application not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6 space-y-8">
      
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-900">{application.jobSnapshot?.title}</h1>
        <p className="text-lg text-gray-600">{application.jobSnapshot?.companyName}</p>
        <div className="mt-4 flex space-x-4 items-center">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">Status: {application.status}</span>
          <span className="text-sm text-gray-500">Applied on: {new Date(application.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Grid: Resume & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Application Payload */}
        <div className="space-y-6">
           <div>
             <h3 className="font-bold text-gray-800 border-b pb-2 mb-3">Cover Letter</h3>
             <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{application.coverLetter || "No cover letter provided."}</p>
           </div>
           
           <div>
             <h3 className="font-bold text-gray-800 border-b pb-2 mb-3">Resume</h3>
             {application.resumeUrl ? (
                <div className="flex space-x-3">
                  <button onClick={() => window.open(application.resumeUrl, '_blank')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
                    View Resume (PDF)
                  </button>
                  <a href={application.resumeUrl} download className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-200">
                    Download
                  </a>
                </div>
             ) : (
                <p className="text-gray-500">No resume attached.</p>
             )}
           </div>
        </div>

        {/* Right: Timeline */}
        <div className="bg-gray-50 p-6 rounded-xl border">
          <h3 className="font-bold text-gray-800 mb-6">Activity Timeline</h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            {logs.map((log, index) => (
              <div key={log.logId} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                {/* Timeline Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-gray-900">{log.action === 'STATUS_CHANGED' ? `Moved to ${log.newStatus}` : log.action}</div>
                    <time className="text-xs font-medium text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</time>
                  </div>
                  {log.notes && <div className="text-sm text-gray-600 mt-2">{log.notes}</div>}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

    </div>
  );
}
