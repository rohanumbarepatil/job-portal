package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "interviews", indexes = {
    @Index(name = "idx_interview_app", columnList = "application_id"),
    @Index(name = "idx_interview_cand", columnList = "candidate_uid")
})
public class InterviewEntity {
    @Id
    @Column(length = 36)
    private String interviewId;

    @Column(name = "application_id", length = 36, nullable = false)
    private String applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", insertable = false, updatable = false)
    @JsonIgnore
    private ApplicationEntity application;

    @Column(name = "job_id", length = 36)
    private String jobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", insertable = false, updatable = false)
    @JsonIgnore
    private JobEntity job;

    @Column(name = "candidate_uid", length = 36)
    private String candidateUid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_uid", insertable = false, updatable = false)
    @JsonIgnore
    private UserEntity candidate;

    @Column(length = 36)
    private String recruiterUid;

    @Column(length = 36)
    private String companyId;
    
    private String roundName;

    @Column(length = 50)
    private String roundType; // HR, TECHNICAL, CODING, SYSTEM_DESIGN, MANAGERIAL, FINAL
    
    @Column(length = 50)
    private String interviewMode; // ONLINE, OFFLINE, PHONE
    
    @Column(length = 100)
    private String interviewerName;
    
    @Column(length = 50)
    private String status; // SCHEDULED, COMPLETED, CANCELLED, NO_SHOW, RESCHEDULED
    
    private String scheduledAt;
    private int durationMinutes;
    private String meetingLink;
    private String location;

    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(updatable = false)
    private String createdAt;
    private String updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now().toString();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now().toString();
    }
}
