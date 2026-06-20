package com.jobportal.service;

import com.jobportal.entity.JobEntity;
import com.jobportal.entity.SavedJobEntity;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobSpecification;
import org.springframework.data.jpa.domain.Specification;

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

        // Fetch company and set companyId and companyMetadata
        var companyList = companyRepository.findByTeamMemberUidsContaining(recruiterUid);
        if (companyList != null && !companyList.isEmpty()) {
            var company = companyList.get(0);
            request.setCompanyId(company.getCompanyId());
            
            String compName = company.getCompanyInfo() != null ? company.getCompanyInfo().getName() : null;
            String compLogo = company.getBranding() != null ? company.getBranding().getLogoUrl() : null;
            
            request.setCompanyMetadata(new JobEntity.CompanyMetadata(
                compName,
                compLogo,
                company.getCompanySlug()
            ));
        } else {
            throw new RuntimeException("Recruiter must create a company profile first.");
        }

        jobRepository.save(request);
        return request;
    }

    public JobEntity updateJob(String recruiterUid, String jobId, JobEntity request, boolean isAdmin) throws Exception {
        JobEntity existing = jobRepository.findById(jobId).orElse(null);
        if (existing == null) {
            throw new RuntimeException("Job not found");
        }
        if (!isAdmin && !existing.getRecruiterUid().equals(recruiterUid)) {
            throw new RuntimeException("Unauthorized to edit this job");
        }

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setLocation(request.getLocation());
        existing.setLocationType(request.getLocationType());
        existing.setEmploymentType(request.getEmploymentType());
        existing.setSalaryRange(request.getSalaryRange());
        existing.setRequiredSkills(request.getRequiredSkills());
        existing.setExperienceLevel(request.getExperienceLevel());
        existing.setOpenPositions(request.getOpenPositions());
        existing.setStatus(request.getStatus());
        existing.setUpdatedAt(Instant.now().toString());

        jobRepository.save(existing);

        // Invalidate AI caches
        try {
            rankingService.invalidateJobRankings(jobId);
        } catch (Exception ignore) {
        }

        return existing;
    }

    public void deleteJob(String recruiterUid, String jobId, boolean isAdmin) throws Exception {
        JobEntity existing = jobRepository.findById(jobId).orElse(null);
        if (existing != null) {
            if (!isAdmin && !existing.getRecruiterUid().equals(recruiterUid)) {
                throw new RuntimeException("Unauthorized to delete this job");
            }
            jobRepository.deleteById(jobId);
        }
    }

    public JobEntity getJobDetails(String jobId) throws Exception {
        JobEntity job = jobRepository.findById(jobId).orElse(null);
        if (job != null) {
            // jobRepository.incrementMetric(jobId, "views", 1);
        }
        return job;
    }

    public List<JobEntity> getRecruiterJobs(String recruiterUid) throws Exception {
        return jobRepository.findByRecruiterUid(recruiterUid);
    }

    public List<JobEntity> searchActiveJobs(String keyword, String location, String type, String experienceLevel, Long minSalary, String locationType, String companyId, List<String> skills) throws Exception {
        Specification<JobEntity> spec = JobSpecification.searchJobs(keyword, location, type, experienceLevel, minSalary, locationType, companyId, skills);
        return jobRepository.findAll(spec);
    }

    public SavedJobEntity saveJob(String userId, String jobId) throws Exception {
        JobEntity job = jobRepository.findById(jobId).orElse(null);
        if (job == null)
            throw new RuntimeException("Job not found");

        String savedJobId = userId + "_" + jobId;
        SavedJobEntity savedJob = SavedJobEntity.builder()
                .id(savedJobId)
                .userId(userId)
                .jobId(jobId)
                .savedAt(Instant.now().toString())
                .jobSnapshot(new SavedJobEntity.JobSnapshot(
                        job.getTitle(),
                        job.getCompanyMetadata() != null ? job.getCompanyMetadata().getCompanyName() : "",
                        job.getCompanyMetadata() != null ? job.getCompanyMetadata().getCompanyLogoUrl() : "",
                        job.getLocation(),
                        job.getLocationType(),
                        job.getEmploymentType(),
                        job.getStatus()))
                .build();

        savedJobRepository.save(savedJob);
        // jobRepository.incrementMetric(jobId, "saves", 1);
        return savedJob;
    }

    public void unsaveJob(String userId, String jobId) throws Exception {
        String savedJobId = userId + "_" + jobId;
        savedJobRepository.deleteById(savedJobId);
        // jobRepository.incrementMetric(jobId, "saves", -1);
    }

    public List<SavedJobEntity> getSavedJobs(String userId) throws Exception {
        return savedJobRepository.findByUserIdOrderBySavedAtDesc(userId);
    }
}
