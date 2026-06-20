package com.jobportal.service;

import com.jobportal.entity.NotificationEntity;
import com.jobportal.entity.NotificationPreferenceEntity;
import com.jobportal.repository.NotificationPreferenceRepository;
import com.jobportal.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final EmailService emailService;

    // Only these types will trigger an actual email dispatch
    private static final java.util.List<String> EMAIL_ENABLED_TYPES = java.util.Arrays.asList(
            "WELCOME", "REGISTRATION_SUCCESS", "RECRUITER_APPROVED", "COMPANY_VERIFIED",
            "APPLICATION_SUBMITTED", "APPLICATION_SHORTLISTED",
            "INTERVIEW_SCHEDULED", "INTERVIEW_RESCHEDULED", "INTERVIEW_CANCELLED",
            "OFFER_RECEIVED", "CANDIDATE_SELECTED", "APPLICATION_REJECTED", "SYSTEM_ANNOUNCEMENT");

    public NotificationService(NotificationRepository notificationRepository,
            NotificationPreferenceRepository preferenceRepository,
            EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
        this.emailService = emailService;
    }

    public void sendNotification(String userUid, String type, String title, String message, String actionUrl,
            String emailAddress) {
        try {
            NotificationPreferenceEntity prefs = preferenceRepository.findByUserUid(userUid).orElse(null);
            boolean inAppEnabled = prefs == null || prefs.isInAppEnabled();
            boolean emailEnabled = prefs == null || prefs.isEmailEnabled();

            // 1. In-App Notification
            if (inAppEnabled) {
                NotificationEntity notification = NotificationEntity.builder()
                        .notificationId(UUID.randomUUID().toString())
                        .userUid(userUid)
                        .type(type)
                        .title(title)
                        .message(message)
                        .actionUrl(actionUrl)
                        .isRead(false)
                        .createdAt(Instant.now().toString())
                        .build();
                notificationRepository.save(notification);
            }

            // 2. FCM Push Notification (Removed)

            // 3. Email Notification
            if (emailEnabled && EMAIL_ENABLED_TYPES.contains(type)) {
                String targetEmail = emailAddress;

                if (targetEmail != null && !targetEmail.isEmpty()) {
                    String htmlContent = buildEmailContent(title, message, actionUrl);
                    emailService.sendEmailAsync(userUid, targetEmail, title, htmlContent, type);
                }
            }

        } catch (Exception e) {
            System.err.println("Failed to orchestrate notification: " + e.getMessage());
        }
    }

    // Overloaded method for backward compatibility
    public void sendNotification(String userUid, String type, String title, String message, String actionUrl) {
        // Without an email address, we can only do In-App and Push
        sendNotification(userUid, type, title, message, actionUrl, null);
    }

    public java.util.List<NotificationEntity> getUserNotifications(String userUid)
            throws Exception {

        return notificationRepository.findTop50ByUserUidOrderByCreatedAtDesc(userUid);
    }

    public void markAsRead(String userUid, String notificationId) throws Exception {
        NotificationEntity notif = notificationRepository.findById(notificationId).orElse(null);
        if (notif != null && notif.getUserUid().equals(userUid)) {
            notif.setRead(true);
            notificationRepository.save(notif);
        }
    }

    public void markAllAsRead(String userUid) throws Exception {
        var list = notificationRepository.findTop50ByUserUidOrderByCreatedAtDesc(userUid);
        for (var notif : list) {
            if (!notif.isRead()) {
                notif.setRead(true);
                notificationRepository.save(notif);
            }
        }
    }

    private String buildEmailContent(String title, String message, String actionUrl) {
        return "<html><body style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>"
                +
                "<div style='text-align: center; margin-bottom: 20px;'><h1 style='color: #2563eb;'>Job Portal ATS</h1></div>"
                +
                "<h2 style='color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;'>" + title + "</h2>"
                +
                "<p style='font-size: 16px; line-height: 1.5;'>" + message + "</p>" +
                (actionUrl != null ? "<div style='margin-top: 30px;'><a href='http://localhost:5173" + actionUrl
                        + "' style='background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>View Details</a></div>"
                        : "")
                +
                "<p style='margin-top: 40px; font-size: 12px; color: #9ca3af;'>This is an automated message. Please do not reply.</p>"
                +
                "</body></html>";
    }
}
