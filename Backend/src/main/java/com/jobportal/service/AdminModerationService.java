package com.jobportal.service;

import com.jobportal.entity.AdminLogEntity;
import com.jobportal.repository.AdminLogRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class AdminModerationService {

    private final AdminLogRepository adminLogRepository;

    public AdminModerationService(AdminLogRepository adminLogRepository) {
        this.adminLogRepository = adminLogRepository;
    }

    public void logAdminAction(String adminUid, String actionType, String targetId, String reason) throws Exception {
        AdminLogEntity log = AdminLogEntity.builder()
                .logId(UUID.randomUUID().toString())
                .adminUid(adminUid)
                .actionType(actionType)
                .targetId(targetId)
                .reason(reason)
                .timestamp(Instant.now().toString())
                .build();
        adminLogRepository.save(log);
    }

    public void suspendUser(String adminUid, String targetUid, String reason) throws Exception {
        // Here we would interact with MySQL to actually disable the user
        // user.setActive(false);
        // userRepository.save(user);
        
        // Log action
        logAdminAction(adminUid, "USER_SUSPENDED", targetUid, reason);
    }

    public void reactivateUser(String adminUid, String targetUid, String reason) throws Exception {
        // user.setActive(true);
        // userRepository.save(user);
        logAdminAction(adminUid, "USER_REACTIVATED", targetUid, reason);
    }

    public void removeJob(String adminUid, String jobId, String reason) throws Exception {
        // Fetch job and set status to REMOVED or delete it
        logAdminAction(adminUid, "JOB_REMOVED", jobId, reason);
    }
}
