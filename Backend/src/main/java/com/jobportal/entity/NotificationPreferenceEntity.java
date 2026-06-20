package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification_preferences")
public class NotificationPreferenceEntity {
    @Id
    @Column(length = 36)
    private String userUid;
    
    private boolean emailEnabled;
    private boolean pushEnabled;
    private boolean inAppEnabled;
    
    @ElementCollection
    @CollectionTable(name = "notification_preference_tokens", joinColumns = @JoinColumn(name = "user_uid"))
    @Column(name = "fcm_token")
    private List<String> fcmTokens;
    
    private String updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now().toString();
    }
}
