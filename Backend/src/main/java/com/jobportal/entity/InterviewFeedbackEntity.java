package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewFeedbackEntity {
    private String feedbackId;
    private String interviewId;
    private String interviewerName;
    
    private int technicalScore;
    private int communicationScore;
    private int problemSolvingScore;
    private int overallRating;
    
    private String recommendation; // PROCEED, HOLD, REJECT
    private String feedback;
    
    private String createdAt;
}
