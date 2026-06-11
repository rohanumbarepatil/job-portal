package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedJobEntity {
    private String id; // format: {userId}_{jobId}
    private String userId;
    private String jobId;
    private String savedAt;
    
    private JobSnapshot jobSnapshot;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobSnapshot {
        private String title;
        private String companyName;
        private String logoUrl;
        private String location;
        private String locationType;
        private String employmentType;
        private String status;
    }
}
