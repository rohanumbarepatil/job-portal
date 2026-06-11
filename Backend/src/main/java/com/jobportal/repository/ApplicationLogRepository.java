package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.ApplicationLogEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class ApplicationLogRepository {
    private static final String COLLECTION_NAME = "application_activity_logs";

    public void save(ApplicationLogEntity log) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(log.getLogId()).set(log).get();
    }

    public List<ApplicationLogEntity> findByApplicationId(String applicationId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("applicationId", applicationId)
                .orderBy("timestamp", Query.Direction.ASCENDING);
        List<ApplicationLogEntity> logs = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            logs.add(doc.toObject(ApplicationLogEntity.class));
        }
        return logs;
    }
}
