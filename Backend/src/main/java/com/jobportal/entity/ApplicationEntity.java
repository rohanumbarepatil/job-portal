package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationEntity {
    private String applicationId;
    private String jobId;
    private String companyId;
    private String candidateUid;
    private String recruiterUid;
    
    private String resumeUrl;
    private String coverLetter;
    private double atsMatchScore;
    
    private String status; // APPLIED, REVIEWING, SHORTLISTED, INTERVIEW_SCHEDULED, INTERVIEWED, OFFERED, HIRED, REJECTED, WITHDRAWN
    
    private CandidateSnapshot candidateSnapshot;
    private JobSnapshot jobSnapshot;
    
    private String createdAt;
    private String updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateSnapshot {
        private String name;
        private String email;
        private String headline;
        private List<String> skills;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobSnapshot {
        private String title;
        private String companyName;
    }
}
