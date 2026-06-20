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
@Table(name = "system_announcements")
public class SystemAnnouncementEntity {
    @Id
    @Column(length = 36)
    private String announcementId;
    
    @Column(length = 50)
    private String targetAudience; // ALL, RECRUITERS_ONLY, SEEKERS_ONLY
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(length = 36)
    private String createdByAdminUid;
    
    @Column(updatable = false)
    private String createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now().toString();
        }
    }
}
