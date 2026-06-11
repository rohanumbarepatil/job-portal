package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerProfile {
    private String uid; // Primary Key mapping to UserEntity
    private String username; // Unique for public profile
    private String profileVisibility; // PUBLIC, PRIVATE, RECRUITERS_ONLY
    private boolean openToWork;
    private int profileViews;
    
    private String headline;
    private PersonalInfo personalInfo;
    private List<String> skills;
    private List<Education> education;
    private List<Experience> experience;
    private List<Project> projects;
    private List<Certification> certifications;
    private List<String> achievements;
    private SocialLinks socialLinks;
    private Resume resume;
    private Metrics metrics;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonalInfo {
        private String phone;
        private String location;
        private String bio;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Education {
        private String degree;
        private String institution;
        private String startYear;
        private String endYear;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Experience {
        private String title;
        private String company;
        private String startDate;
        private String endDate;
        private String description;
        private boolean isCurrent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Project {
        private String name;
        private String description;
        private String link;
        private boolean featured;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Certification {
        private String name;
        private String issuer;
        private String date;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLinks {
        private String linkedin;
        private String github;
        private String portfolio;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Resume {
        private String url;
        private String filename;
        private String uploadedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Metrics {
        private int profileCompletionPercentage;
        private int atsScore;
        private String strength;
    }
}
