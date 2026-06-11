package com.jobportal.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FCMService {

    @Async
    public void sendPushNotification(List<String> tokens, String title, String body, String actionUrl) {
        if (tokens == null || tokens.isEmpty()) return;

        for (String token : tokens) {
            try {
                Message message = Message.builder()
                        .setToken(token)
                        .setNotification(Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .build())
                        .putData("actionUrl", actionUrl != null ? actionUrl : "/")
                        .build();

                String response = FirebaseMessaging.getInstance().send(message);
                // System.out.println("Successfully sent FCM message: " + response);
            } catch (Exception e) {
                System.err.println("Failed to send FCM message to token " + token + ": " + e.getMessage());
                // In production, catch FirebaseMessagingException and remove token if unregistered
            }
        }
    }
}
