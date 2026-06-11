package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewEntity {
    private String interviewId;
    private String applicationId;
    private String jobId;
    private String candidateUid;
    private String recruiterUid;
    private String companyId;
    
    private String roundName;
    private String roundType; // HR, TECHNICAL, CODING, SYSTEM_DESIGN, MANAGERIAL, FINAL
    private String status; // SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED
    
    private String scheduledAt;
    private int durationMinutes;
    private String meetingLink;
    private String location;
    private String notes;
    
    private String createdAt;
    private String updatedAt;
}
