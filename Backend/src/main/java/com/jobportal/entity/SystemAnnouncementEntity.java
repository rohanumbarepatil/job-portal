package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemAnnouncementEntity {
    private String announcementId;
    private String targetAudience; // ALL, RECRUITERS_ONLY, SEEKERS_ONLY
    private String title;
    private String message;
    private String createdByAdminUid;
    private String createdAt;
}
