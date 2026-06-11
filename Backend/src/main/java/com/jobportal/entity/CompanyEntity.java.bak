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
public class CompanyEntity {
    private String companyId; // Primary Key
    private String ownerUid; // Founder / Initial Creator
    private String companySlug; // e.g. "google" for /company/google
    private String verificationStatus; // PENDING, VERIFIED, REJECTED
    private boolean isHiring;
    private double rating;
    private int followers;

    // For efficient Firestore querying: whereArrayContains("teamMemberUids", uid)
    private List<String> teamMemberUids;
    private List<TeamMember> teamMembers;
    
    private CompanyInfo companyInfo;
    private Branding branding;
    private Analytics analytics;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeamMember {
        private String uid;
        private String role; // OWNER, ADMIN, RECRUITER
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyInfo {
        private String name;
        private String industry;
        private String companySize;
        private Integer foundedYear;
        private String location;
        private String about;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Branding {
        private String logoUrl;
        private String bannerUrl;
        private String cultureDescription;
        private List<String> benefits;
        private SocialLinks socialLinks;
        private Media media;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLinks {
        private String linkedin;
        private String twitter;
        private String website;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Media {
        private List<String> officePhotos;
        private List<String> culturePhotos;
        private String videoUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Analytics {
        private int profileViews;
        private int jobViews;
        private int applicationsReceived;
        private double conversionRate;
    }
}
