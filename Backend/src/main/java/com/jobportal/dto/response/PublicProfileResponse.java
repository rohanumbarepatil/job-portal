package com.jobportal.dto.response;

import com.jobportal.entity.JobSeekerProfile;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PublicProfileResponse {
    private String username;
    private String headline;
    private boolean openToWork;
    private List<String> skills;
    private List<JobSeekerProfile.Education> education;
    private List<JobSeekerProfile.Experience> experience;
    private List<JobSeekerProfile.Project> projects;
    private List<JobSeekerProfile.Certification> certifications;
    private List<String> achievements;
    private JobSeekerProfile.SocialLinks socialLinks;
    private JobSeekerProfile.Metrics metrics;
    private String bio;
}
