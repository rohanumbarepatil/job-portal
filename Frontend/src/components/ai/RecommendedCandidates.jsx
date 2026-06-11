import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import MatchScoreCard from './MatchScoreCard';

export default function RecommendedCandidates({ jobId }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await axiosInstance.get(`/ai/recommendations/candidates/${jobId}`);
        if (res.data.data) {
          setCandidates(res.data.data);
        }
      } catch (e) {
        console.error("Failed to load recommended candidates", e);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchRecs();
  }, [jobId]);

  if (loading) {
    return <div className="p-4 text-center text-blue-500 font-bold animate-pulse bg-blue-50 rounded-xl border border-blue-100">✨ AI is evaluating candidates...</div>;
  }

  if (candidates.length === 0) {
    return <div className="p-4 text-center text-gray-500 border rounded-xl bg-gray-50">No candidates have applied or been scored yet.</div>;
  }

  return (
    <div className="grid gap-4">
      <h3 className="font-black text-gray-900 text-lg mb-2">Top AI Ranked Candidates</h3>
      {candidates.map(ranking => (
        <div 
          key={ranking.rankingId}
          className="border rounded-xl p-4 bg-white hover:shadow-lg transition-all flex justify-between items-center"
        >
          <div>
            <h4 className="font-bold text-gray-900 text-md">Candidate #{ranking.candidateUid.substring(0,6)}</h4>
            <p className="text-sm text-gray-500 mt-1 italic">"{ranking.aiExplanation}"</p>
          </div>
          <div className="flex space-x-4 items-center">
            <MatchScoreCard scoreData={ranking} loading={false} />
            <button 
                onClick={() => navigate(`/dashboard/applications/${ranking.candidateUid}`)} // Simplified navigation
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800"
            >
                View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
