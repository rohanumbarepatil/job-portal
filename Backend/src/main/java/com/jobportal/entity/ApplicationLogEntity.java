package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationLogEntity {
    private String logId;
    private String applicationId;
    private String action; // APPLIED, STATUS_CHANGED, NOTE_ADDED
    private String oldStatus;
    private String newStatus;
    private String performedBy;
    private String notes;
    private String timestamp;
}
