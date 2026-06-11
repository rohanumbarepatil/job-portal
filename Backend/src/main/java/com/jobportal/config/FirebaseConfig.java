package com.jobportal.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            FirebaseOptions options;
            
            // 1. Check for standard GCP GOOGLE_APPLICATION_CREDENTIALS
            String gcpCreds = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
            // 2. Check for custom FIREBASE_CREDENTIALS env var (e.g. for Render or local)
            String firebaseCreds = System.getenv("FIREBASE_CREDENTIALS");
            
            if (gcpCreds != null && !gcpCreds.isEmpty()) {
                System.out.println("Initializing Firebase via GOOGLE_APPLICATION_CREDENTIALS");
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
            } else if (firebaseCreds != null && !firebaseCreds.isEmpty()) {
                System.out.println("Initializing Firebase via FIREBASE_CREDENTIALS env var (JSON string)");
                // Assuming FIREBASE_CREDENTIALS holds the raw JSON string
                java.io.ByteArrayInputStream stream = new java.io.ByteArrayInputStream(firebaseCreds.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(stream))
                        .build();
            } else {
                // Fallback: Check local resource or default (Development only)
                InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");
                if (serviceAccount != null) {
                    System.out.println("Initializing Firebase via local firebase-service-account.json");
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                } else {
                    System.out.println("No Firebase credentials found. Falling back to application default credentials.");
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.getApplicationDefault())
                            .build();
                }
            }

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize Firebase Admin SDK:");
            e.printStackTrace();
        }
    }
}
