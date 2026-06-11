package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.AdminLogEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class AdminLogRepository {
    private static final String COLLECTION_NAME = "admin_logs";

    public void save(AdminLogEntity log) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(log.getLogId()).set(log).get();
    }

    public List<AdminLogEntity> findAllLogs() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).orderBy("timestamp", Query.Direction.DESCENDING).limit(100);
        List<AdminLogEntity> logs = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            logs.add(doc.toObject(AdminLogEntity.class));
        }
        return logs;
    }
}
