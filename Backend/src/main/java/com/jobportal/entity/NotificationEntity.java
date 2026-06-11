package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEntity {
    private String notificationId;
    private String userUid;
    private String type; // APPLICATION_UPDATE, INTERVIEW_INVITE, NEW_APPLICATION
    private String title;
    private String message;
    private String actionUrl;
    private boolean isRead;
    private String createdAt;
}
