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
        return repository.findByUsername(username).isEmpty();
    }

    public JobSeekerProfile getProfile(String uid) throws Exception {
        JobSeekerProfile profile = repository.findById(uid).orElse(null);
        if (profile == null) throw new RuntimeException("Profile not found");
        return profile;
    }

    public JobSeekerProfile updateProfile(String uid, JobSeekerProfile updateRequest) throws Exception {
        JobSeekerProfile existing = repository.findById(uid).orElse(null);
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
        existing.setEducation(updateCollection(existing.getEducation(), updateRequest.getEducation(), existing));
        existing.setExperience(updateCollection(existing.getExperience(), updateRequest.getExperience(), existing));
        existing.setProjects(updateCollection(existing.getProjects(), updateRequest.getProjects(), existing));
        existing.setCertifications(updateCollection(existing.getCertifications(), updateRequest.getCertifications(), existing));
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
        JobSeekerProfile profile = repository.findByUsername(username).orElse(null);
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

    private <T> java.util.List<T> updateCollection(java.util.List<T> existing, java.util.List<T> update, JobSeekerProfile profile) {
        if (existing == null) {
            existing = new java.util.ArrayList<>();
        }
        existing.clear();
        if (update != null) {
            for (T item : update) {
                if (item instanceof com.jobportal.entity.ProfileEducation) {
                    ((com.jobportal.entity.ProfileEducation) item).setProfile(profile);
                } else if (item instanceof com.jobportal.entity.ProfileExperience) {
                    ((com.jobportal.entity.ProfileExperience) item).setProfile(profile);
                } else if (item instanceof com.jobportal.entity.ProfileProject) {
                    ((com.jobportal.entity.ProfileProject) item).setProfile(profile);
                } else if (item instanceof com.jobportal.entity.ProfileCertification) {
                    ((com.jobportal.entity.ProfileCertification) item).setProfile(profile);
                }
            }
            existing.addAll(update);
        }
        return existing;
    }
}
