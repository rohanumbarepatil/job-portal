package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRankingResponseDTO {
    private int skillsMatch;       // Max 40
    private int experienceMatch;   // Max 25
    private int educationMatch;    // Max 10
    private int profileStrength;   // Max 15
    private int resumeQuality;     // Max 10
    private int totalScore;        // Sum of above (Max 100)
    private String aiExplanation;
}
