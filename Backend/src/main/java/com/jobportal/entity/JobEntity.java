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
@Table(name = "jobs")
public class JobEntity {
    @Id
    @Column(length = 36)
    private String jobId;

    @Column(length = 36, nullable = false)
    private String companyId;

    @Column(length = 36, nullable = false)
    private String recruiterUid;

    @Column(length = 50)
    private String status; // DRAFT, ACTIVE, CLOSED
    
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "job_required_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> requiredSkills;

    @ElementCollection
    @CollectionTable(name = "job_preferred_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> preferredSkills;

    @ElementCollection
    @CollectionTable(name = "job_benefits", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "benefit")
    private List<String> benefits;
    
    @Column(length = 50)
    private String locationType; // REMOTE, ONSITE, HYBRID
    private String location;

    @Column(length = 50)
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP

    @Column(length = 50)
    private String experienceLevel; // ENTRY, MID, SENIOR, EXECUTIVE
    
    @Embedded
    private SalaryRange salaryRange;
    
    private int openPositions;
    private boolean isFeatured;
    private boolean isUrgentHiring;
    
    @ElementCollection
    @CollectionTable(name = "job_search_tags", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "tag")
    private List<String> searchTags; // For fast querying
    
    @Embedded
    private CompanyMetadata companyMetadata;

    @Embedded
    private Metrics metrics;
    
    private String applicationDeadline; // ISO String
    private String createdAt; // ISO String
    private String updatedAt; // ISO String

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class SalaryRange {
        private long minSalary;
        private long maxSalary;
        private String currency;
        private boolean isDisclosed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class CompanyMetadata {
        private String companyName;
        private String companyLogoUrl;
        private String companySlug;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class Metrics {
        private int views;
        private int saves;
        private int applicationsCount;
    }
}
