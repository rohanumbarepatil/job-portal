package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.VerificationRequestEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class VerificationRequestRepository {
    private static final String COLLECTION_NAME = "verification_requests";

    public void save(VerificationRequestEntity request) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(request.getRequestId()).set(request).get();
    }

    public VerificationRequestEntity findById(String requestId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var doc = db.collection(COLLECTION_NAME).document(requestId).get().get();
        if (doc.exists()) {
            return doc.toObject(VerificationRequestEntity.class);
        }
        return null;
    }

    public List<VerificationRequestEntity> findByStatus(String status) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("status", status).orderBy("submittedAt", Query.Direction.ASCENDING);
        List<VerificationRequestEntity> requests = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            requests.add(doc.toObject(VerificationRequestEntity.class));
        }
        return requests;
    }
    
    public List<VerificationRequestEntity> findAll() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).orderBy("submittedAt", Query.Direction.DESCENDING);
        List<VerificationRequestEntity> requests = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            requests.add(doc.toObject(VerificationRequestEntity.class));
        }
        return requests;
    }
}
