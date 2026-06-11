package com.jobportal.service;

import com.jobportal.dto.response.PublicProfileResponse;
import com.jobportal.entity.JobSeekerProfile;
import com.jobportal.repository.JobSeekerProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class JobSeekerProfileService {
    
    private final JobSeekerProfileRepository repository;
    private final ProfileMetricsEngine metricsEngine;
    private final ResumeRankingService rankingService;

    public JobSeekerProfileService(JobSeekerProfileRepository repository, 
                                   ProfileMetricsEngine metricsEngine,
                                   ResumeRankingService rankingService) {
        this.repository = repository;
        this.metricsEngine = metricsEngine;
        this.rankingService = rankingService;
    }

    public boolean isUsernameAvailable(String username) throws Exception {
        return repository.findByUsername(username) == null;
    }

    public JobSeekerProfile getProfile(String uid) throws Exception {
        return repository.findById(uid);
    }

    public JobSeekerProfile updateProfile(String uid, JobSeekerProfile updateRequest) throws Exception {
        JobSeekerProfile existing = repository.findById(uid);
        if (existing == null) {
            existing = new JobSeekerProfile();
            existing.setUid(uid);
        }

        if (updateRequest.getUsername() != null && !updateRequest.getUsername().equals(existing.getUsername())) {
            if (!isUsernameAvailable(updateRequest.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            existing.setUsername(updateRequest.getUsername());
        }

        existing.setProfileVisibility(updateRequest.getProfileVisibility() != null ? updateRequest.getProfileVisibility() : existing.getProfileVisibility());
        existing.setOpenToWork(updateRequest.isOpenToWork());
        existing.setHeadline(updateRequest.getHeadline());
        existing.setPersonalInfo(updateRequest.getPersonalInfo());
        existing.setSkills(updateRequest.getSkills());
        existing.setEducation(updateRequest.getEducation());
        existing.setExperience(updateRequest.getExperience());
        existing.setProjects(updateRequest.getProjects());
        existing.setCertifications(updateRequest.getCertifications());
        existing.setAchievements(updateRequest.getAchievements());
        existing.setSocialLinks(updateRequest.getSocialLinks());
        
        if (updateRequest.getResume() != null) {
            existing.setResume(updateRequest.getResume());
        }

        existing.setMetrics(metricsEngine.calculateMetrics(existing));

        repository.save(existing);
        
        // Invalidate AI caches
        try {
            rankingService.invalidateCandidateRankings(uid);
        } catch (Exception ignore) {}

        return existing;
    }

    public PublicProfileResponse getPublicProfile(String username) throws Exception {
        JobSeekerProfile profile = repository.findByUsername(username);
        if (profile == null) {
            throw new RuntimeException("Profile not found");
        }

        if ("PRIVATE".equalsIgnoreCase(profile.getProfileVisibility())) {
            throw new RuntimeException("Profile is private");
        }

        profile.setProfileViews(profile.getProfileViews() + 1);
        repository.save(profile);

        return PublicProfileResponse.builder()
                .username(profile.getUsername())
                .headline(profile.getHeadline())
                .openToWork(profile.isOpenToWork())
                .skills(profile.getSkills())
                .education(profile.getEducation())
                .experience(profile.getExperience())
                .projects(profile.getProjects())
                .certifications(profile.getCertifications())
                .achievements(profile.getAchievements())
                .socialLinks(profile.getSocialLinks())
                .metrics(profile.getMetrics())
                .bio(profile.getPersonalInfo() != null ? profile.getPersonalInfo().getBio() : null)
                .build();
    }
}
