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
@Table(name = "admin_logs")
public class AdminLogEntity {
    @Id
    @Column(length = 36)
    private String logId;

    @Column(length = 36)
    private String adminUid;
    
    @Column(length = 50)
    private String actionType; // USER_SUSPENDED, COMPANY_VERIFIED, JOB_REMOVED, BROADCAST_SENT, etc.
    
    @Column(length = 36)
    private String targetId;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @Column(updatable = false)
    private String timestamp;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now().toString();
        }
    }
}
