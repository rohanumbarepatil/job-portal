package com.jobportal.repository;

import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.SavedJobEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class SavedJobRepository {
    private static final String COLLECTION_NAME = "saved_jobs";

    public void save(SavedJobEntity savedJob) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(savedJob.getId()).set(savedJob).get();
    }

    public void delete(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(id).delete().get();
    }

    public List<SavedJobEntity> findByUserId(String userId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("userId", userId).orderBy("savedAt", Query.Direction.DESCENDING);
        List<SavedJobEntity> savedJobs = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            savedJobs.add(doc.toObject(SavedJobEntity.class));
        }
        return savedJobs;
    }
    
    public SavedJobEntity findById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot doc = db.collection(COLLECTION_NAME).document(id).get().get();
        if (doc.exists()) {
            return doc.toObject(SavedJobEntity.class);
        }
        return null;
    }
}
