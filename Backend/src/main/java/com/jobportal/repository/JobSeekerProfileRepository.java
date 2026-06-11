package com.jobportal.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.JobSeekerProfile;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class JobSeekerProfileRepository {
    private static final String COLLECTION_NAME = "job_seekers";

    public void save(JobSeekerProfile profile) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = db.collection(COLLECTION_NAME).document(profile.getUid()).set(profile);
        collectionsApiFuture.get();
    }

    public JobSeekerProfile findById(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(uid);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            return document.toObject(JobSeekerProfile.class);
        } else {
            return null;
        }
    }

    public JobSeekerProfile findByUsername(String username) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference jobSeekers = db.collection(COLLECTION_NAME);
        Query query = jobSeekers.whereEqualTo("username", username);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        
        if (!querySnapshot.get().getDocuments().isEmpty()) {
            return querySnapshot.get().getDocuments().get(0).toObject(JobSeekerProfile.class);
        }
        return null;
    }
}
