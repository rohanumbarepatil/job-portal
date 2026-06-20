package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "applications", indexes = {
    @Index(name = "idx_app_candidate", columnList = "candidate_uid"),
    @Index(name = "idx_app_job", columnList = "job_id")
})
public class ApplicationEntity {
    @Id
    @Column(length = 36)
    private String applicationId;

    @Column(name = "job_id", length = 36, nullable = false)
    private String jobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", insertable = false, updatable = false)
    @JsonIgnore
    private JobEntity job;

    @Column(length = 36)
    private String companyId;

    @Column(name = "candidate_uid", length = 36, nullable = false)
    private String candidateUid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_uid", insertable = false, updatable = false)
    @JsonIgnore
    private UserEntity candidate;

    @Column(length = 36)
    private String recruiterUid;
    
    @Column(length = 500)
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;
    private double atsMatchScore;
    
    @Column(length = 50)
    private String status; // APPLIED, REVIEWING, SHORTLISTED, INTERVIEW_SCHEDULED, INTERVIEWED, OFFERED, HIRED, REJECTED, WITHDRAWN
    
    @Convert(converter = CandidateSnapshotConverter.class)
    @Column(columnDefinition = "TEXT")
    private CandidateSnapshot candidateSnapshot;

    @Convert(converter = JobSnapshotConverter.class)
    @Column(columnDefinition = "TEXT")
    private JobSnapshot jobSnapshot;
    
    private String createdAt;
    private String updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateSnapshot {
        private String name;
        private String email;
        private String headline;
        private List<String> skills;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobSnapshot {
        private String title;
        private String companyName;
    }

    @jakarta.persistence.Converter
    public static class CandidateSnapshotConverter implements jakarta.persistence.AttributeConverter<CandidateSnapshot, String> {
        private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

        @Override
        public String convertToDatabaseColumn(CandidateSnapshot attribute) {
            try {
                return attribute == null ? null : objectMapper.writeValueAsString(attribute);
            } catch (Exception e) {
                return null;
            }
        }

        @Override
        public CandidateSnapshot convertToEntityAttribute(String dbData) {
            try {
                return dbData == null ? null : objectMapper.readValue(dbData, CandidateSnapshot.class);
            } catch (Exception e) {
                return null;
            }
        }
    }

    @jakarta.persistence.Converter
    public static class JobSnapshotConverter implements jakarta.persistence.AttributeConverter<JobSnapshot, String> {
        private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

        @Override
        public String convertToDatabaseColumn(JobSnapshot attribute) {
            try {
                return attribute == null ? null : objectMapper.writeValueAsString(attribute);
            } catch (Exception e) {
                return null;
            }
        }

        @Override
        public JobSnapshot convertToEntityAttribute(String dbData) {
            try {
                return dbData == null ? null : objectMapper.readValue(dbData, JobSnapshot.class);
            } catch (Exception e) {
                return null;
            }
        }
    }
}
