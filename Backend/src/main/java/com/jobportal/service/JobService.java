package com.jobportal.service;

import com.jobportal.entity.JobEntity;
import com.jobportal.entity.SavedJobEntity;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class JobService {
    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final ResumeRankingService rankingService;
    private final CompanyRepository companyRepository;

    public JobService(JobRepository jobRepository, 
                      CompanyRepository companyRepository, 
                      SavedJobRepository savedJobRepository,
                      ResumeRankingService rankingService) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.savedJobRepository = savedJobRepository;
        this.rankingService = rankingService;
    }

    public JobEntity createJob(String recruiterUid, JobEntity request) throws Exception {
        request.setJobId(UUID.randomUUID().toString());
        request.setRecruiterUid(recruiterUid);
        request.setCreatedAt(Instant.now().toString());
        request.setUpdatedAt(Instant.now().toString());
        
        if (request.getStatus() == null) {
            request.setStatus("DRAFT");
        }
        if (request.getMetrics() == null) {
            request.setMetrics(new JobEntity.Metrics(0, 0, 0));
        }

        jobRepository.save(request);
        return request;
    }

    public JobEntity updateJob(String recruiterUid, String jobId, JobEntity request, boolean isAdmin) throws Exception {
        JobEntity existing = jobRepository.findById(jobId);
        if (existing == null) {
            throw new RuntimeException("Job not found");
        }
        if (!isAdmin && !existing.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized to edit this job");
        }

        request.setJobId(jobId);
        request.setRecruiterUid(existing.getRecruiterUid());
        request.setCreatedAt(existing.getCreatedAt());
        request.setUpdatedAt(Instant.now().toString());
        existing.setUpdatedAt(Instant.now().toString());

        jobRepository.save(existing);
        
        // Invalidate AI caches
        try {
            rankingService.invalidateJobRankings(jobId);
        } catch (Exception ignore) {}

        return existing;
    }

    public void deleteJob(String recruiterUid, String jobId, boolean isAdmin) throws Exception {
        JobEntity existing = jobRepository.findById(jobId);
        if (existing != null) {
            if (!isAdmin && !existing.getRecruiterUid().equals(recruiterUid)) {
                throw new RuntimeException("Unauthorized to delete this job");
            }
            jobRepository.delete(jobId);
        }
    }

    public JobEntity getJobDetails(String jobId) throws Exception {
        JobEntity job = jobRepository.findById(jobId);
        if (job != null) {
            jobRepository.incrementMetric(jobId, "views", 1);
        }
        return job;
    }

    public List<JobEntity> getRecruiterJobs(String recruiterUid) throws Exception {
        return jobRepository.findByRecruiterUid(recruiterUid);
    }

    public List<JobEntity> searchActiveJobs(String keyword, String location, String type) throws Exception {
        return jobRepository.searchActiveJobs(keyword, location, type);
    }

    public SavedJobEntity saveJob(String userId, String jobId) throws Exception {
        JobEntity job = jobRepository.findById(jobId);
        if (job == null) throw new RuntimeException("Job not found");

        String savedJobId = userId + "_" + jobId;
        SavedJobEntity savedJob = SavedJobEntity.builder()
                .id(savedJobId)
                .userId(userId)
                .jobId(jobId)
                .savedAt(Instant.now().toString())
                .jobSnapshot(new SavedJobEntity.JobSnapshot(
                        job.getTitle(),
                        job.getCompanyMetadata() != null ? job.getCompanyMetadata().getName() : "",
                        job.getCompanyMetadata() != null ? job.getCompanyMetadata().getLogoUrl() : "",
                        job.getLocation(),
                        job.getLocationType(),
                        job.getEmploymentType(),
                        job.getStatus()
                ))
                .build();
        
        savedJobRepository.save(savedJob);
        jobRepository.incrementMetric(jobId, "saves", 1);
        return savedJob;
    }

    public void unsaveJob(String userId, String jobId) throws Exception {
        String savedJobId = userId + "_" + jobId;
        savedJobRepository.delete(savedJobId);
        jobRepository.incrementMetric(jobId, "saves", -1);
    }

    public List<SavedJobEntity> getSavedJobs(String userId) throws Exception {
        return savedJobRepository.findByUserId(userId);
    }
}
