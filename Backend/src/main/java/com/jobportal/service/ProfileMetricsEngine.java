package com.jobportal.service;

import com.jobportal.entity.JobSeekerProfile;
import org.springframework.stereotype.Service;

@Service
public class ProfileMetricsEngine {

    public JobSeekerProfile.Metrics calculateMetrics(JobSeekerProfile profile) {
        int completion = 0;

        if (profile.getPersonalInfo() != null && profile.getPersonalInfo().getBio() != null && !profile.getPersonalInfo().getBio().isEmpty()) {
            completion += 20;
        }
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            completion += 15;
        }
        if (profile.getEducation() != null && !profile.getEducation().isEmpty()) {
            completion += 15;
        }
        if (profile.getProjects() != null && !profile.getProjects().isEmpty()) {
            completion += 20;
        }
        if (profile.getExperience() != null && !profile.getExperience().isEmpty()) {
            completion += 20;
        }
        if (profile.getResume() != null && profile.getResume().getUrl() != null) {
            completion += 10;
        }

        String strength = "Beginner";
        if (completion >= 80) strength = "Industry Ready";
        else if (completion >= 60) strength = "Advanced";
        else if (completion >= 40) strength = "Intermediate";

        int atsScore = 0;
        if (completion == 100) atsScore += 50;
        else atsScore += (completion / 2);
        
        if (profile.getSkills() != null && profile.getSkills().size() >= 5) {
            atsScore += 20;
        }
        if (profile.getExperience() != null) {
            for (JobSeekerProfile.Experience exp : profile.getExperience()) {
                if (exp.getDescription() != null && exp.getDescription().length() > 50) {
                    atsScore += 10;
                }
            }
        }
        if (atsScore > 100) atsScore = 100;

        return new JobSeekerProfile.Metrics(completion, atsScore, strength);
    }
}
