package com.jobportal.service;

import com.jobportal.entity.ApplicationEntity;
import com.jobportal.entity.ApplicationLogEntity;
import com.jobportal.entity.JobEntity;
import com.jobportal.entity.JobSeekerProfile;
import com.jobportal.repository.ApplicationLogRepository;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.jobportal.repository.UserRepository;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ApplicationLogRepository applicationLogRepository;
    private final JobRepository jobRepository;
    private final ApplicationScoringService scoringService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
            ApplicationLogRepository applicationLogRepository,
            JobRepository jobRepository,
            ApplicationScoringService scoringService,
            NotificationService notificationService,
            UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.applicationLogRepository = applicationLogRepository;
        this.jobRepository = jobRepository;
        this.scoringService = scoringService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public ApplicationEntity applyForJob(String candidateUid, String jobId, String resumeUrl, String coverLetter)
            throws Exception {
        // 1. Prevent duplicate applications
        if (applicationRepository.existsByCandidateUidAndJobId(candidateUid, jobId)) {
            throw new RuntimeException("You have already applied for this job.");
        }

        // 2. Fetch Job Details
        JobEntity job = jobRepository.findById(jobId).orElse(null);
        if (job == null || !"ACTIVE".equals(job.getStatus())) {
            throw new RuntimeException("Job is not active or does not exist.");
        }

        // 3. Mock Seeker Fetch & Match Scoring (In real impl, fetch from SeekerRepo)
        JobSeekerProfile mockSeeker = new JobSeekerProfile(); // Mocked
        double atsScore = scoringService.calculateMatchScore(mockSeeker, job, resumeUrl);

        // 4. Create Application
        String timestamp = Instant.now().toString();
        ApplicationEntity application = ApplicationEntity.builder()
                .applicationId(UUID.randomUUID().toString())
                .jobId(jobId)
                .companyId(job.getCompanyId())
                .candidateUid(candidateUid)
                .recruiterUid(job.getRecruiterUid())
                .resumeUrl(resumeUrl)
                .coverLetter(coverLetter)
                .atsMatchScore(atsScore)
                .status("APPLIED")
                .candidateSnapshot(new ApplicationEntity.CandidateSnapshot("Candidate Name", "email@test.com",
                        "Headline", List.of("Java")))
                .jobSnapshot(new ApplicationEntity.JobSnapshot(job.getTitle(),
                        job.getCompanyMetadata() != null ? job.getCompanyMetadata().getCompanyName() : ""))
                .createdAt(timestamp)
                .updatedAt(timestamp)
                .build();

        applicationRepository.save(application);

        // 5. Activity Log
        logActivity(application.getApplicationId(), "APPLIED", null, "APPLIED", candidateUid,
                "Application submitted successfully.");

        // 6. Notify Recruiter (In-App)
        notificationService.sendNotification(
                job.getRecruiterUid(),
                "NEW_APPLICATION",
                "New Application Received",
                "A new candidate applied for " + job.getTitle(),
                "/dashboard/applications/" + application.getApplicationId());

        // Notify Candidate (Email)
        String candidateEmail = userRepository.findById(candidateUid).map(com.jobportal.entity.UserEntity::getEmail).orElse(null);
        notificationService.sendNotification(
                candidateUid,
                "APPLICATION_SUBMITTED",
                "Application Submitted successfully",
                "Your application for " + job.getTitle() + " has been received and is currently under review.",
                "/dashboard/applications",
                candidateEmail);

        // 7. Update Job Analytics (Applications Counter)
        // jobRepository.incrementMetric(jobId, "applications", 1);

        return application;
    }

    public void updateApplicationStatus(String recruiterUid, String applicationId, String newStatus, String notes)
            throws Exception {
        ApplicationEntity application = applicationRepository.findById(applicationId).orElse(null);
        if (application == null)
            throw new RuntimeException("Application not found.");

        if (!application.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized to update this application.");
        }

        String oldStatus = application.getStatus();
        application.setStatus(newStatus);
        application.setUpdatedAt(Instant.now().toString());

        applicationRepository.save(application);

        // Audit Log
        logActivity(applicationId, "STATUS_CHANGED", oldStatus, newStatus, recruiterUid, notes);

        // Notify Candidate
        String notifType = "APPLICATION_UPDATE";
        String message = "Your application for " + application.getJobSnapshot().getTitle() + " has been updated to " + newStatus;
        
        if ("SHORTLISTED".equalsIgnoreCase(newStatus)) {
            notifType = "APPLICATION_SHORTLISTED";
            message = "Congratulations! You have been shortlisted for " + application.getJobSnapshot().getTitle() + ". We will be in touch shortly to schedule the next steps.";
        } else if ("SELECTED".equalsIgnoreCase(newStatus) || "OFFERED".equalsIgnoreCase(newStatus)) {
            notifType = "CANDIDATE_SELECTED";
            message = "Congratulations! You have been selected for the position of " + application.getJobSnapshot().getTitle() + ". Please review the offer details.";
        } else if ("REJECTED".equalsIgnoreCase(newStatus)) {
            notifType = "APPLICATION_REJECTED";
            message = "We appreciate your interest, but unfortunately we will not be moving forward with your application for " + application.getJobSnapshot().getTitle() + " at this time.";
        }
        
        String candidateEmail = userRepository.findById(application.getCandidateUid()).map(com.jobportal.entity.UserEntity::getEmail).orElse(null);
        
        notificationService.sendNotification(
                application.getCandidateUid(),
                notifType,
                "Application Status Update",
                message,
                "/dashboard/applications",
                candidateEmail);
    }

    public List<ApplicationEntity> getCandidateApplications(String candidateUid) throws Exception {
        return applicationRepository.findByCandidateUidOrderByCreatedAtDesc(candidateUid);
    }

    public List<ApplicationEntity> getJobApplications(String recruiterUid, String jobId) throws Exception {
        JobEntity job = jobRepository.findById(jobId).orElse(null);
        if (job == null || !job.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized to view applications for this job.");
        }
        return applicationRepository.findByJobIdOrderByCreatedAtDesc(jobId);
    }

    public ApplicationEntity getApplicationDetails(String applicationId) throws Exception {
        return applicationRepository.findById(applicationId).orElse(null);
    }

    public List<ApplicationLogEntity> getApplicationLogs(String applicationId) throws Exception {
        return applicationLogRepository.findByApplicationIdOrderByTimestampDesc(applicationId);
    }

    private void logActivity(String applicationId, String action, String oldStatus, String newStatus,
            String performedBy, String notes) throws Exception {
        ApplicationLogEntity log = ApplicationLogEntity.builder()
                .logId(UUID.randomUUID().toString())
                .applicationId(applicationId)
                .action(action)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .performedBy(performedBy)
                .notes(notes)
                .timestamp(Instant.now().toString())
                .build();
        applicationLogRepository.save(log);
    }
}
