package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ai_candidate_rankings")
public class AICandidateRankingEntity {
    @Id
    @Column(length = 72)
    private String rankingId; // Format: jobId_candidateUid
    
    @Column(length = 36)
    private String candidateUid;
    
    @Column(length = 36)
    private String jobId;
    
    private int totalScore;
    private int skillsMatch;       // Max 40
    private int experienceMatch;   // Max 25
    private int educationMatch;    // Max 10
    private int profileStrength;   // Max 15
    private int resumeQuality;     // Max 10
    
    @Column(columnDefinition = "TEXT")
    private String aiExplanation;
    
    private boolean stale;
    
    private String updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now().toString();
    }
}
