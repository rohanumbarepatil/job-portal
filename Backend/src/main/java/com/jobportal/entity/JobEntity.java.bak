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
public class JobEntity {
    private String jobId;
    private String companyId;
    private String recruiterUid;
    private String status; // DRAFT, ACTIVE, CLOSED
    
    private String title;
    private String description;
    
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private List<String> benefits;
    
    private String locationType; // REMOTE, ONSITE, HYBRID
    private String location;
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
    private String experienceLevel; // ENTRY, MID, SENIOR, EXECUTIVE
    
    private SalaryRange salaryRange;
    
    private int openPositions;
    private boolean isFeatured;
    private boolean isUrgentHiring;
    
    private List<String> searchTags; // For fast querying
    
    private CompanyMetadata companyMetadata;
    private Metrics metrics;
    
    private String applicationDeadline; // ISO String
    private String createdAt; // ISO String
    private String updatedAt; // ISO String

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalaryRange {
        private long min;
        private long max;
        private String currency;
        private boolean isDisclosed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyMetadata {
        private String name;
        private String logoUrl;
        private String slug;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Metrics {
        private int views;
        private int saves;
        private int applications;
    }
}
