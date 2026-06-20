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
@Table(name = "email_logs")
public class EmailLogEntity {
    @Id
    @Column(length = 36)
    private String logId;
    
    @Column(length = 36)
    private String userUid;
    
    @Column(length = 100)
    private String emailAddress;
    
    @Column(length = 50)
    private String templateType;
    
    private String subject;
    
    @Column(length = 50)
    private String status; // PENDING, SENT, FAILED
    
    @Column(columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(updatable = false)
    private String createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now().toString();
        }
    }
}
