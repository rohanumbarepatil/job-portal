package com.jobportal.repository;

import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.ApplicationEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class ApplicationRepository {
    private static final String COLLECTION_NAME = "applications";

    public void save(ApplicationEntity application) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(application.getApplicationId()).set(application).get();
    }

    public ApplicationEntity findById(String applicationId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot doc = db.collection(COLLECTION_NAME).document(applicationId).get().get();
        if (doc.exists()) {
            return doc.toObject(ApplicationEntity.class);
        }
        return null;
    }

    public List<ApplicationEntity> findByCandidateUid(String candidateUid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("candidateUid", candidateUid)
                .orderBy("createdAt", Query.Direction.DESCENDING);
        List<ApplicationEntity> apps = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            apps.add(doc.toObject(ApplicationEntity.class));
        }
        return apps;
    }

    public List<ApplicationEntity> findByJobId(String jobId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("jobId", jobId)
                .orderBy("createdAt", Query.Direction.DESCENDING);
        List<ApplicationEntity> apps = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            apps.add(doc.toObject(ApplicationEntity.class));
        }
        return apps;
    }

    public boolean existsByCandidateAndJob(String candidateUid, String jobId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("candidateUid", candidateUid)
                .whereEqualTo("jobId", jobId)
                .limit(1);
        return !query.get().get().isEmpty();
    }
}
