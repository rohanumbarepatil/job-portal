package com.jobportal.dto.response;

import com.jobportal.entity.*;
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
    private List<ProfileEducation> education;
    private List<ProfileExperience> experience;
    private List<ProfileProject> projects;
    private List<ProfileCertification> certifications;
    private List<String> achievements;
    private JobSeekerProfile.SocialLinks socialLinks;
    private JobSeekerProfile.Metrics metrics;
    private String bio;
}
