package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailLogEntity {
    private String logId;
    private String userUid;
    private String emailAddress;
    private String templateType;
    private String subject;
    private String status; // PENDING, SENT, FAILED
    private String errorMessage;
    private String createdAt;
}
