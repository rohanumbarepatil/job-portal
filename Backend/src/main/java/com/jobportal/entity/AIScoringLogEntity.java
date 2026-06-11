package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIScoringLogEntity {
    private String logId;
    private String type; // RANKING_GENERATED, CACHE_INVALIDATED
    private String targetId; // jobId_candidateUid
    private String reason;
    private String timestamp;
}
