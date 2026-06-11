package com.jobportal.service;

import com.jobportal.entity.ApplicationEntity;
import com.jobportal.entity.InterviewEntity;
import com.jobportal.entity.InterviewFeedbackEntity;
import com.jobportal.repository.InterviewFeedbackRepository;
import com.jobportal.repository.InterviewRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class InterviewService {
    
    private final InterviewRepository interviewRepository;
    private final InterviewFeedbackRepository feedbackRepository;
    private final ApplicationService applicationService;
    private final NotificationService notificationService;

    public InterviewService(InterviewRepository interviewRepository, 
                            InterviewFeedbackRepository feedbackRepository,
                            ApplicationService applicationService,
                            NotificationService notificationService) {
        this.interviewRepository = interviewRepository;
        this.feedbackRepository = feedbackRepository;
        this.applicationService = applicationService;
        this.notificationService = notificationService;
    }

    public InterviewEntity scheduleInterview(String recruiterUid, String applicationId, InterviewEntity payload) throws Exception {
        ApplicationEntity app = applicationService.getApplicationDetails(applicationId);
        if (app == null || !app.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized to schedule interview for this application.");
        }

        InterviewEntity interview = InterviewEntity.builder()
                .interviewId(UUID.randomUUID().toString())
                .applicationId(applicationId)
                .jobId(app.getJobId())
                .candidateUid(app.getCandidateUid())
                .recruiterUid(recruiterUid)
                .companyId(app.getCompanyId())
                .roundName(payload.getRoundName())
                .roundType(payload.getRoundType())
                .status("SCHEDULED")
                .scheduledAt(payload.getScheduledAt())
                .durationMinutes(payload.getDurationMinutes())
                .meetingLink(payload.getMeetingLink())
                .location(payload.getLocation())
                .notes(payload.getNotes())
                .createdAt(Instant.now().toString())
                .updatedAt(Instant.now().toString())
                .build();

        interviewRepository.save(interview);

        // ATS Integration: Move to INTERVIEW_SCHEDULED
        applicationService.updateApplicationStatus(recruiterUid, applicationId, "INTERVIEW_SCHEDULED", 
                "Interview Scheduled: " + payload.getRoundName() + " on " + payload.getScheduledAt());

        // Notify Candidate
        notificationService.sendNotification(app.getCandidateUid(), "INTERVIEW_SCHEDULED", 
                "Interview Scheduled", "You have a new interview for " + app.getJobSnapshot().getTitle(), 
                "/dashboard/interviews");

        return interview;
    }

    public void submitFeedback(String recruiterUid, String interviewId, InterviewFeedbackEntity feedbackPayload, String nextStepStatus) throws Exception {
        InterviewEntity interview = interviewRepository.findById(interviewId);
        if (interview == null || !interview.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized");
        }

        feedbackPayload.setFeedbackId(UUID.randomUUID().toString());
        feedbackPayload.setInterviewId(interviewId);
        feedbackPayload.setCreatedAt(Instant.now().toString());

        feedbackRepository.save(feedbackPayload);

        interview.setStatus("COMPLETED");
        interview.setUpdatedAt(Instant.now().toString());
        interviewRepository.save(interview);

        // Move candidate to next status (INTERVIEWED, NEXT_ROUND, OFFERED, REJECTED)
        applicationService.updateApplicationStatus(recruiterUid, interview.getApplicationId(), nextStepStatus, 
                "Interview Completed. Recommendation: " + feedbackPayload.getRecommendation());

        // Notify candidate of status change (but not feedback)
        notificationService.sendNotification(interview.getCandidateUid(), "APPLICATION_UPDATE", 
                "Application Status Update", "Your application has moved to " + nextStepStatus, 
                "/dashboard/applications");
    }

    public List<InterviewEntity> getCandidateInterviews(String candidateUid) throws Exception {
        return interviewRepository.findByCandidateUid(candidateUid);
    }

    public List<InterviewEntity> getRecruiterInterviews(String recruiterUid) throws Exception {
        return interviewRepository.findByRecruiterUid(recruiterUid);
    }
    
    public InterviewFeedbackEntity getFeedback(String recruiterUid, String interviewId) throws Exception {
        InterviewEntity interview = interviewRepository.findById(interviewId);
        if (interview == null || !interview.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized");
        }
        return feedbackRepository.findByInterviewId(interviewId);
    }
}
