import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import MatchScoreCard from './MatchScoreCard';

export default function AICandidateScore({ jobId, candidateUid }) {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await axiosInstance.get(`/ai/rankings/${jobId}/${candidateUid}`);
        if (res.data.data) {
          setScoreData(res.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch AI score", e);
      } finally {
        setLoading(false);
      }
    };
    if (jobId && candidateUid) {
      fetchScore();
    }
  }, [jobId, candidateUid]);

  return <MatchScoreCard scoreData={scoreData} loading={loading} />;
}
