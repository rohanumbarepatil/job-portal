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
@Table(name = "application_logs")
public class ApplicationLogEntity {
    @Id
    @Column(length = 36)
    private String logId;
    
    @Column(length = 36)
    private String applicationId;
    
    @Column(length = 50)
    private String action; // APPLIED, STATUS_CHANGED, NOTE_ADDED
    
    @Column(length = 50)
    private String oldStatus;
    
    @Column(length = 50)
    private String newStatus;
    
    @Column(length = 36)
    private String performedBy;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(updatable = false)
    private String timestamp;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now().toString();
        }
    }
}
