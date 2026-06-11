package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminLogEntity {
    private String logId;
    private String adminUid;
    private String actionType; // USER_SUSPENDED, COMPANY_VERIFIED, JOB_REMOVED, BROADCAST_SENT, etc.
    private String targetId;
    private String reason;
    private String timestamp;
}
