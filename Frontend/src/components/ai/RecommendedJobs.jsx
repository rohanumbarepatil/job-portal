import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function RecommendedJobs() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await axiosInstance.get('/ai/recommendations/jobs');
        if (res.data.data) {
          setRecommendations(res.data.data);
        }
      } catch (e) {
        console.error("Failed to load recommendations", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500 font-bold animate-pulse">✨ AI is finding your best matches...</div>;
  }

  if (recommendations.length === 0) {
    return <div className="p-4 text-center text-gray-500 border rounded-xl bg-gray-50">No AI recommendations yet. Make sure your profile is complete!</div>;
  }

  return (
    <div className="grid gap-4">
      {recommendations.map(ranking => (
        <div 
          key={ranking.rankingId}
          onClick={() => navigate(`/jobs/${ranking.jobId}`)}
          className="border rounded-xl p-4 bg-white hover:shadow-lg transition-all cursor-pointer flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Recommended Job #{ranking.jobId.substring(0,6)}</h3>
            <p className="text-sm text-gray-500 mt-1 italic">"{ranking.aiExplanation}"</p>
          </div>
          <div className="text-center">
            <span className="text-3xl font-black text-green-500">{ranking.totalScore}%</span>
            <p className="text-xs font-bold text-gray-400 mt-1">Match</p>
          </div>
        </div>
      ))}
    </div>
  );
}
