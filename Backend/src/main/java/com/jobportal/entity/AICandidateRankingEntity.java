package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AICandidateRankingEntity {
    private String rankingId; // Format: jobId_candidateUid
    private String candidateUid;
    private String jobId;
    
    private int totalScore;
    private int skillsMatch;       // Max 40
    private int experienceMatch;   // Max 25
    private int educationMatch;    // Max 10
    private int profileStrength;   // Max 15
    private int resumeQuality;     // Max 10
    
    private String aiExplanation;
    
    private boolean stale;
    private String updatedAt;
}
