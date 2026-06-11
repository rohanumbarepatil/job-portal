package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.AIScoringLogEntity;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class AIScoringLogRepository {
    private static final String COLLECTION_NAME = "ai_scoring_logs";

    public void save(AIScoringLogEntity log) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION_NAME).document(log.getLogId()).set(log);
        } catch (Exception e) {
            System.err.println("Failed to save scoring log: " + e.getMessage());
        }
    }
}
