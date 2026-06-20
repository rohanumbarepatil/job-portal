package com.jobportal.service;

import com.jobportal.entity.VerificationRequestEntity;
import com.jobportal.repository.VerificationRequestRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AdminVerificationService {

    private final VerificationRequestRepository verificationRequestRepository;
    private final AdminModerationService adminModerationService;

    public AdminVerificationService(VerificationRequestRepository verificationRequestRepository, 
                                    AdminModerationService adminModerationService) {
        this.verificationRequestRepository = verificationRequestRepository;
        this.adminModerationService = adminModerationService;
    }

    public void createVerificationRequest(String entityType, String entityId) throws Exception {
        VerificationRequestEntity request = VerificationRequestEntity.builder()
                .requestId(UUID.randomUUID().toString())
                .entityType(entityType)
                .entityId(entityId)
                .status("PENDING")
                .submittedAt(Instant.now().toString())
                .build();
        verificationRequestRepository.save(request);
    }

    public void resolveRequest(String adminUid, String requestId, String status, String reason) throws Exception {
        VerificationRequestEntity request = verificationRequestRepository.findById(requestId).orElse(null);
        if (request == null) throw new RuntimeException("Request not found");

        request.setStatus(status);
        request.setResolvedAt(Instant.now().toString());
        request.setResolvedByAdminUid(adminUid);
        request.setReason(reason);

        verificationRequestRepository.save(request);

        // Also update the underlying entity (e.g., Company status = VERIFIED)
        // Log the action
        String action = status.equals("APPROVED") ? request.getEntityType() + "_VERIFIED" : request.getEntityType() + "_REJECTED";
        adminModerationService.logAdminAction(adminUid, action, request.getEntityId(), reason);
    }

    public List<VerificationRequestEntity> getAllRequests() throws Exception {
        return verificationRequestRepository.findAll();
    }
}
