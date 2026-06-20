package com.jobportal.controller;

import java.util.List;
import com.jobportal.entity.NotificationPreferenceEntity;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.NotificationService;
import com.jobportal.repository.NotificationPreferenceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationPreferenceRepository preferenceRepository;

    public NotificationController(NotificationService notificationService,
            NotificationPreferenceRepository preferenceRepository) {
        this.notificationService = notificationService;
        this.preferenceRepository = preferenceRepository;
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<List<com.jobportal.entity.NotificationEntity>>> getNotifications() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return ResponseEntity.ok(GlobalResponse.success("Notifications fetched",
                    notificationService.getUserNotifications(auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<GlobalResponse<Void>> markAsRead(@PathVariable String id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            notificationService.markAsRead(auth.getName(), id);
            return ResponseEntity.ok(GlobalResponse.success("Marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/read-all")
    public ResponseEntity<GlobalResponse<Void>> markAllAsRead() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            notificationService.markAllAsRead(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("All marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/preferences")
    public ResponseEntity<GlobalResponse<NotificationPreferenceEntity>> getPreferences() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            NotificationPreferenceEntity pref = preferenceRepository.findByUserUid(auth.getName()).orElse(null);
            if (pref == null) {
                // Default preferences
                pref = NotificationPreferenceEntity.builder()
                        .userUid(auth.getName())
                        .emailEnabled(true)
                        .pushEnabled(true)
                        .inAppEnabled(true)
                        .fcmTokens(new ArrayList<>())
                        .updatedAt(Instant.now().toString())
                        .build();
            }
            return ResponseEntity.ok(GlobalResponse.success("Preferences fetched", pref));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/preferences")
    public ResponseEntity<GlobalResponse<Void>> updatePreferences(@RequestBody Map<String, Boolean> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            NotificationPreferenceEntity pref = preferenceRepository.findByUserUid(auth.getName()).orElse(null);
            if (pref == null) {
                pref = new NotificationPreferenceEntity();
                pref.setUserUid(auth.getName());
                pref.setFcmTokens(new ArrayList<>());
            }
            if (payload.containsKey("emailEnabled"))
                pref.setEmailEnabled(payload.get("emailEnabled"));
            if (payload.containsKey("pushEnabled"))
                pref.setPushEnabled(payload.get("pushEnabled"));
            if (payload.containsKey("inAppEnabled"))
                pref.setInAppEnabled(payload.get("inAppEnabled"));
            pref.setUpdatedAt(Instant.now().toString());

            preferenceRepository.save(pref);
            return ResponseEntity.ok(GlobalResponse.success("Preferences updated", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/fcm-token")
    public ResponseEntity<GlobalResponse<Void>> registerFcmToken(@RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String token = payload.get("token");
            if (token == null || token.isEmpty())
                throw new RuntimeException("Token missing");

            NotificationPreferenceEntity pref = preferenceRepository.findByUserUid(auth.getName()).orElse(null);
            if (pref == null) {
                pref = NotificationPreferenceEntity.builder()
                        .userUid(auth.getName())
                        .emailEnabled(true)
                        .pushEnabled(true)
                        .inAppEnabled(true)
                        .fcmTokens(new ArrayList<>())
                        .updatedAt(Instant.now().toString())
                        .build();
            }
            if (pref.getFcmTokens() == null)
                pref.setFcmTokens(new ArrayList<>());

            if (!pref.getFcmTokens().contains(token)) {
                pref.getFcmTokens().add(token);
                pref.setUpdatedAt(Instant.now().toString());
                preferenceRepository.save(pref);
            }
            return ResponseEntity.ok(GlobalResponse.success("Token registered", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
