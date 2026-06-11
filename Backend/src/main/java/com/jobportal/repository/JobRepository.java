package com.jobportal.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.JobEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class JobRepository {
    private static final String COLLECTION_NAME = "jobs";

    public void save(JobEntity job) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(job.getJobId()).set(job).get();
    }

    public void delete(String jobId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(jobId).delete().get();
    }

    public JobEntity findById(String jobId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot doc = db.collection(COLLECTION_NAME).document(jobId).get().get();
        if (doc.exists()) {
            return doc.toObject(JobEntity.class);
        }
        return null;
    }

    public List<JobEntity> findByRecruiterUid(String recruiterUid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("recruiterUid", recruiterUid);
        List<JobEntity> jobs = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            jobs.add(doc.toObject(JobEntity.class));
        }
        return jobs;
    }

    public List<JobEntity> findActiveJobs() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("status", "ACTIVE").orderBy("createdAt", Query.Direction.DESCENDING).limit(50);
        List<JobEntity> jobs = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            jobs.add(doc.toObject(JobEntity.class));
        }
        return jobs;
    }

    public List<JobEntity> searchActiveJobs(String keyword, String location, String type) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("status", "ACTIVE");

        if (keyword != null && !keyword.isEmpty()) {
            query = query.whereArrayContains("searchTags", keyword.toLowerCase());
        }
        if (location != null && !location.isEmpty()) {
            query = query.whereEqualTo("location", location);
        }
        if (type != null && !type.isEmpty()) {
            query = query.whereEqualTo("employmentType", type);
        }
        
        query = query.limit(50);
        
        List<JobEntity> jobs = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            jobs.add(doc.toObject(JobEntity.class));
        }
        return jobs;
    }

    public void incrementMetric(String jobId, String metricField, int amount) {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(jobId);
        docRef.update("metrics." + metricField, FieldValue.increment(amount));
    }
}
