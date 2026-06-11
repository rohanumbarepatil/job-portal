package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceEntity {
    private String userUid;
    private boolean emailEnabled;
    private boolean pushEnabled;
    private boolean inAppEnabled;
    private List<String> fcmTokens;
    private String updatedAt;
}
