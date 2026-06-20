package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "verification_requests")
public class VerificationRequestEntity {
    @Id
    @Column(length = 36)
    private String requestId;
    
    @Column(length = 50)
    private String entityType; // RECRUITER or COMPANY
    
    @Column(length = 36)
    private String entityId;
    
    @Column(length = 50)
    private String status; // PENDING, APPROVED, REJECTED
    
    @Column(updatable = false)
    private String submittedAt;
    
    private String resolvedAt;
    
    @Column(length = 36)
    private String resolvedByAdminUid;
    
    @Column(columnDefinition = "TEXT")
    private String reason; // if rejected

    @PrePersist
    protected void onCreate() {
        if (this.submittedAt == null) {
            this.submittedAt = LocalDateTime.now().toString();
        }
    }
}
