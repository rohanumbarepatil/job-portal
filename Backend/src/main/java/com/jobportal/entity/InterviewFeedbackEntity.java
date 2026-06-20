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
@Table(name = "interview_feedbacks")
public class InterviewFeedbackEntity {
    @Id
    @Column(length = 36)
    private String feedbackId;
    
    @Column(length = 36)
    private String interviewId;
    
    @Column(length = 100)
    private String interviewerName;
    
    private int technicalScore;
    private int communicationScore;
    private int problemSolvingScore;
    private int overallRating;
    
    @Column(length = 50)
    private String recommendation; // PROCEED, HOLD, REJECT
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @Column(updatable = false)
    private String createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now().toString();
        }
    }
}
