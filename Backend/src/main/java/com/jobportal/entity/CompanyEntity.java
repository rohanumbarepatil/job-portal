package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "companies")
public class CompanyEntity {
    @Id
    @Column(length = 36)
    private String companyId; 

    @Column(length = 36, nullable = false)
    private String ownerUid; 

    @Column(unique = true, nullable = false)
    private String companySlug; 

    @Column(length = 50)
    private String verificationStatus; // PENDING, VERIFIED, REJECTED
    private Boolean isHiring;
    private double rating;
    private int followers;

    @ElementCollection
    @CollectionTable(name = "company_team_member_uids", joinColumns = @JoinColumn(name = "company_id"))
    @Column(name = "uid")
    private List<String> teamMemberUids;

    @ElementCollection
    @CollectionTable(name = "company_team_members", joinColumns = @JoinColumn(name = "company_id"))
    private List<TeamMember> teamMembers;
    
    @Embedded
    private CompanyInfo companyInfo;

    @Embedded
    private Branding branding;

    @Embedded
    private Analytics analytics;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class TeamMember {
        private String uid;
        private String role; // OWNER, ADMIN, RECRUITER
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class CompanyInfo {
        private String name;
        private String industry;
        private String companySize;
        private Integer foundedYear;
        private String location;
        @Column(columnDefinition = "TEXT")
        private String about;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class Branding {
        private String logoUrl;
        private String bannerUrl;
        @Column(columnDefinition = "TEXT")
        private String cultureDescription;

        @ElementCollection
        @CollectionTable(name = "company_benefits", joinColumns = @JoinColumn(name = "company_id"))
        @Column(name = "benefit")
        private List<String> benefits;

        @Embedded
        private SocialLinks socialLinks;

        @Embedded
        private Media media;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class SocialLinks {
        private String linkedin;
        private String twitter;
        private String website;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class Media {
        @ElementCollection
        @CollectionTable(name = "company_office_photos", joinColumns = @JoinColumn(name = "company_id"))
        @Column(name = "photo_url")
        private List<String> officePhotos;

        @ElementCollection
        @CollectionTable(name = "company_culture_photos", joinColumns = @JoinColumn(name = "company_id"))
        @Column(name = "photo_url")
        private List<String> culturePhotos;

        private String videoUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class Analytics {
        private int profileViews;
        private int jobViews;
        private int applicationsReceived;
        private double conversionRate;
    }
}
