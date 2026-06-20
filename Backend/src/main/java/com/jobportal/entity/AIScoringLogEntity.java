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
@Table(name = "ai_scoring_logs")
public class AIScoringLogEntity {
    @Id
    @Column(length = 36)
    private String logId;
    
    @Column(length = 50)
    private String type; // RANKING_GENERATED, CACHE_INVALIDATED
    
    @Column(length = 72)
    private String targetId; // jobId_candidateUid
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @Column(updatable = false)
    private String timestamp;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now().toString();
        }
    }
}
