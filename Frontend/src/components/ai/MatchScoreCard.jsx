import React, { useState } from 'react';

export default function MatchScoreCard({ scoreData, loading }) {
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 animate-pulse text-blue-600 p-2 border rounded-xl bg-blue-50/50">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-bold">AI Magic...</span>
      </div>
    );
  }

  if (!scoreData) return null;

  const score = scoreData.totalScore;
  let color = 'text-green-500';
  let bgColor = 'bg-green-100';
  if (score < 80) { color = 'text-yellow-500'; bgColor = 'bg-yellow-100'; }
  if (score < 50) { color = 'text-red-500'; bgColor = 'bg-red-100'; }

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className={`flex items-center space-x-2 cursor-pointer p-2 rounded-xl transition-all hover:scale-105 ${bgColor}`}
        title="Click for AI breakdown"
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-300"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className={color}
                strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
            <span className={`absolute text-xs font-black ${color}`}>{score}</span>
        </div>
        <span className={`text-sm font-bold ${color}`}>AI Match</span>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <span className="text-2xl">✨</span> AI Match Breakdown
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center mb-6">
                 <div className={`text-5xl font-black ${color}`}>{score}%</div>
              </div>
              
              <div className="space-y-4">
                <BreakdownRow label="Skills Match" score={scoreData.skillsMatch} max={40} />
                <BreakdownRow label="Experience" score={scoreData.experienceMatch} max={25} />
                <BreakdownRow label="Education" score={scoreData.educationMatch} max={10} />
                <BreakdownRow label="Profile Strength" score={scoreData.profileStrength} max={15} />
                <BreakdownRow label="Resume Quality" score={scoreData.resumeQuality} max={10} />
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-900 italic">
                  "{scoreData.aiExplanation}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BreakdownRow({ label, score, max }) {
  const percentage = (score / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
        <span>{label}</span>
        <span>{score} / {max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
