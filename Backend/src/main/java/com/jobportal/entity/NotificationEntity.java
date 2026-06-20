package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class NotificationEntity {
    @Id
    @Column(length = 36)
    private String notificationId;

    @Column(name = "user_uid", length = 36, nullable = false)
    private String userUid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_uid", insertable = false, updatable = false)
    @JsonIgnore
    private UserEntity user;

    @Column(length = 50)
    private String type; // APPLICATION_UPDATE, INTERVIEW_INVITE, NEW_APPLICATION
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    private String actionUrl;
    private boolean isRead;
    
    @Column(updatable = false)
    private String createdAt;
    private String updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now().toString();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now().toString();
    }
}
