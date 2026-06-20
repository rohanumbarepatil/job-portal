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

import com.jobportal.repository.UserRepository;

@Service
public class InterviewService {
    
    private final InterviewRepository interviewRepository;
    private final InterviewFeedbackRepository feedbackRepository;
    private final ApplicationService applicationService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public InterviewService(InterviewRepository interviewRepository, 
                            InterviewFeedbackRepository feedbackRepository,
                            ApplicationService applicationService,
                            NotificationService notificationService,
                            UserRepository userRepository) {
        this.interviewRepository = interviewRepository;
        this.feedbackRepository = feedbackRepository;
        this.applicationService = applicationService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
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
                .interviewMode(payload.getInterviewMode())
                .interviewerName(payload.getInterviewerName())
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
        String candidateEmail = userRepository.findById(app.getCandidateUid()).map(com.jobportal.entity.UserEntity::getEmail).orElse(null);
        String locationStr = "ONLINE".equalsIgnoreCase(payload.getInterviewMode()) ? payload.getMeetingLink() : payload.getLocation();
        String message = String.format("You have a new %s interview scheduled for %s on %s. Mode: %s. Details: %s", 
                payload.getRoundType(), app.getJobSnapshot().getTitle(), payload.getScheduledAt(), payload.getInterviewMode(), locationStr);
        
        notificationService.sendNotification(app.getCandidateUid(), "INTERVIEW_SCHEDULED", 
                "Interview Scheduled: " + payload.getRoundName(), message, 
                "/dashboard/interviews", candidateEmail);

        return interview;
    }

    public void submitFeedback(String recruiterUid, String interviewId, InterviewFeedbackEntity feedbackPayload, String nextStepStatus) throws Exception {
        InterviewEntity interview = interviewRepository.findById(interviewId).orElse(null);
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
        return interviewRepository.findByCandidateUidOrderByScheduledAtDesc(candidateUid);
    }

    public List<InterviewEntity> getRecruiterInterviews(String recruiterUid) throws Exception {
        return interviewRepository.findByRecruiterUidOrderByScheduledAtDesc(recruiterUid);
    }
    
    public InterviewFeedbackEntity getFeedback(String recruiterUid, String interviewId) throws Exception {
        InterviewEntity interview = interviewRepository.findById(interviewId).orElse(null);
        if (interview == null || !interview.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized");
        }
        return feedbackRepository.findByInterviewId(interviewId).orElse(null);
    }
}
