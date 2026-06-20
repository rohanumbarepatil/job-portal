package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "saved_jobs", indexes = {
    @Index(name = "idx_saved_user", columnList = "user_id"),
    @Index(name = "idx_saved_job", columnList = "job_id")
})
public class SavedJobEntity {
    @Id
    @Column(length = 72)
    private String id; // format: {userId}_{jobId}
    
    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnore
    private UserEntity user;

    @Column(name = "job_id", length = 36, nullable = false)
    private String jobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", insertable = false, updatable = false)
    @JsonIgnore
    private JobEntity job;

    @Column(updatable = false)
    private String savedAt;
    
    @Convert(converter = SavedJobSnapshotConverter.class)
    @Column(columnDefinition = "TEXT")
    private JobSnapshot jobSnapshot;

    @PrePersist
    protected void onCreate() {
        if (this.savedAt == null) {
            this.savedAt = LocalDateTime.now().toString();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobSnapshot {
        private String title;
        private String companyName;
        private String logoUrl;
        private String location;
        private String locationType;
        private String employmentType;
        private String status;
    }

    @jakarta.persistence.Converter
    public static class SavedJobSnapshotConverter implements jakarta.persistence.AttributeConverter<JobSnapshot, String> {
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
