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

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ApplicationLogRepository applicationLogRepository;
    private final JobRepository jobRepository;
    private final ApplicationScoringService scoringService;
    private final NotificationService notificationService;

    // TODO: Inject JobSeekerRepository once imported

    public ApplicationService(ApplicationRepository applicationRepository,
            ApplicationLogRepository applicationLogRepository,
            JobRepository jobRepository,
            ApplicationScoringService scoringService,
            NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.applicationLogRepository = applicationLogRepository;
        this.jobRepository = jobRepository;
        this.scoringService = scoringService;
        this.notificationService = notificationService;
    }

    public ApplicationEntity applyForJob(String candidateUid, String jobId, String resumeUrl, String coverLetter)
            throws Exception {
        // 1. Prevent duplicate applications
        if (applicationRepository.existsByCandidateAndJob(candidateUid, jobId)) {
            throw new RuntimeException("You have already applied for this job.");
        }

        // 2. Fetch Job Details
        JobEntity job = jobRepository.findById(jobId);
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
                        job.getCompanyMetadata() != null ? job.getCompanyMetadata().getName() : ""))
                .createdAt(timestamp)
                .updatedAt(timestamp)
                .build();

        applicationRepository.save(application);

        // 5. Activity Log
        logActivity(application.getApplicationId(), "APPLIED", null, "APPLIED", candidateUid,
                "Application submitted successfully.");

        // 6. Notify Recruiter
        notificationService.sendNotification(
                job.getRecruiterUid(),
                "NEW_APPLICATION",
                "New Application Received",
                "A new candidate applied for " + job.getTitle(),
                "/dashboard/applications/" + application.getApplicationId());

        // 7. Update Job Analytics (Applications Counter)
        jobRepository.incrementMetric(jobId, "applications", 1);

        return application;
    }

    public void updateApplicationStatus(String recruiterUid, String applicationId, String newStatus, String notes)
            throws Exception {
        ApplicationEntity application = applicationRepository.findById(applicationId);
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
        notificationService.sendNotification(
                application.getCandidateUid(),
                "APPLICATION_UPDATE",
                "Application Status Update",
                "Your application for " + application.getJobSnapshot().getTitle() + " has been updated to " + newStatus,
                "/applications/" + applicationId);
    }

    public List<ApplicationEntity> getCandidateApplications(String candidateUid) throws Exception {
        return applicationRepository.findByCandidateUid(candidateUid);
    }

    public List<ApplicationEntity> getJobApplications(String recruiterUid, String jobId) throws Exception {
        JobEntity job = jobRepository.findById(jobId);
        if (job == null || !job.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized to view applications for this job.");
        }
        return applicationRepository.findByJobId(jobId);
    }

    public ApplicationEntity getApplicationDetails(String applicationId) throws Exception {
        return applicationRepository.findById(applicationId);
    }

    public List<ApplicationLogEntity> getApplicationLogs(String applicationId) throws Exception {
        return applicationLogRepository.findByApplicationId(applicationId);
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
