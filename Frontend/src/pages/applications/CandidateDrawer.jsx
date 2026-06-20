import React, { useState } from 'react';
import InterviewScheduler from '../interviews/InterviewScheduler';
import AICandidateScore from '../../components/ai/AICandidateScore';

export default function CandidateDrawer({ isOpen, onClose, application, onStatusChange }) {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  if (!isOpen || !application) return null;

  const { candidateSnapshot, coverLetter, resumeUrl, atsMatchScore, status } = application;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <section className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition ease-in-out duration-300 sm:duration-700 bg-white shadow-xl flex flex-col h-full">
          
          {/* Header */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Candidate Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Info */}
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                {candidateSnapshot?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="text-xl font-bold">{candidateSnapshot?.name}</h3>
                <p className="text-gray-600">{candidateSnapshot?.headline}</p>
                <a href={`mailto:${candidateSnapshot?.email}`} className="text-blue-600 text-sm hover:underline">{candidateSnapshot?.email}</a>
              </div>
            </div>

            {/* ATS Keyword Score */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${getScoreColor(atsMatchScore)}`}>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">ATS Keyword Score</p>
                <p className="text-xs opacity-80">Raw parsing match</p>
              </div>
              <div className="text-3xl font-black">{Math.round(atsMatchScore)}%</div>
            </div>

            {/* AI Match Score */}
            <AICandidateScore jobId={application.jobId} candidateUid={application.candidateUid} />

            {/* Actions */}
            <div className="flex space-x-2">
              <select 
                className="flex-1 border p-2 rounded bg-white text-sm font-bold"
                value={status}
                onChange={(e) => onStatusChange(application.applicationId, e.target.value)}
              >
                <option value="APPLIED">Applied</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="INTERVIEW_COMPLETED">Interview Completed</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-bold border-b pb-2 mb-3">Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidateSnapshot?.skills?.map((s, i) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-700">{s}</span>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <h4 className="font-bold border-b pb-2 mb-3">Cover Letter</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                {coverLetter || 'No cover letter provided.'}
              </p>
            </div>

          </div>

          {/* Schedule Interview Button */}
          <div className="px-6 pb-6">
            <button 
              onClick={() => setIsSchedulerOpen(true)}
              className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-lg border border-blue-200 hover:bg-blue-100 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Schedule Interview</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 flex justify-between space-x-3">
             {resumeUrl ? (
                <>
                  <button onClick={() => window.open(resumeUrl, '_blank')} className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-100">
                    View Resume
                  </button>
                  <a href={resumeUrl} download className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
                    Download PDF
                  </a>
                </>
             ) : (
                <div className="flex-1 text-center text-gray-500 py-2">No Resume Attached</div>
             )}
          </div>
        </div>
      </section>

      {isSchedulerOpen && (
        <InterviewScheduler 
          applicationId={application.applicationId}
          onClose={() => setIsSchedulerOpen(false)}
          onSuccess={() => {
            setIsSchedulerOpen(false);
            onStatusChange(application.applicationId, 'INTERVIEW_SCHEDULED');
          }}
        />
      )}
    </div>
  );
}
