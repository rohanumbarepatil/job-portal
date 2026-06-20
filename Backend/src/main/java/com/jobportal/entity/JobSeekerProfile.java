package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_seeker_profiles")
public class JobSeekerProfile {
    @Id
    @Column(length = 36)
    private String uid; // Primary Key mapping to UserEntity

    @Column(unique = true)
    private String username; // Unique for public profile
    
    @Column(length = 50)
    private String profileVisibility; // PUBLIC, PRIVATE, RECRUITERS_ONLY
    
    private boolean openToWork;
    private int profileViews;
    
    private String headline;
    
    @Embedded
    private PersonalInfo personalInfo;
    
    @ElementCollection
    @CollectionTable(name = "profile_skills", joinColumns = @JoinColumn(name = "profile_uid"))
    @Column(name = "skill")
    private List<String> skills;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileEducation> education = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileExperience> experience = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileProject> projects = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileCertification> certifications = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "profile_achievements", joinColumns = @JoinColumn(name = "profile_uid"))
    @Column(name = "achievement")
    private List<String> achievements;

    @Embedded
    private SocialLinks socialLinks;
    
    @Embedded
    private Resume resume;
    
    @Embedded
    private Metrics metrics;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class PersonalInfo {
        private String phone;
        private String location;
        @Column(columnDefinition = "TEXT")
        private String bio;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class SocialLinks {
        private String linkedin;
        private String github;
        private String portfolio;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class Resume {
        private String url;
        private String filename;
        private String uploadedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class Metrics {
        private int profileCompletionPercentage;
        private int atsScore;
        private String strength;
    }
}
