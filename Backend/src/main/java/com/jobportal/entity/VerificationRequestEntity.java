package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationRequestEntity {
    private String requestId;
    private String entityType; // RECRUITER or COMPANY
    private String entityId;
    private String status; // PENDING, APPROVED, REJECTED
    private String submittedAt;
    private String resolvedAt;
    private String resolvedByAdminUid;
    private String reason; // if rejected
}
