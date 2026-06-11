package com.jobportal.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.ActivityLogEntity;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public class ActivityLogRepository {
    private static final String COLLECTION_NAME = "activity_logs";

    public void logActivity(String userId, String action) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            ActivityLogEntity logEntity = ActivityLogEntity.builder()
                    .userId(userId)
                    .action(action)
                    .timestamp(Instant.now().toString())
                    .build();
            
            ApiFuture<DocumentReference> future = db.collection(COLLECTION_NAME).add(logEntity);
            future.get(); // wait for completion
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
