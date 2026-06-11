package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.EmailLogEntity;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class EmailLogRepository {
    private static final String COLLECTION_NAME = "email_logs";

    public void save(EmailLogEntity log) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(log.getLogId()).set(log).get();
    }
}
