package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.InterviewEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class InterviewRepository {
    private static final String COLLECTION_NAME = "interviews";

    public void save(InterviewEntity interview) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(interview.getInterviewId()).set(interview).get();
    }

    public InterviewEntity findById(String interviewId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var doc = db.collection(COLLECTION_NAME).document(interviewId).get().get();
        if (doc.exists()) {
            return doc.toObject(InterviewEntity.class);
        }
        return null;
    }

    public List<InterviewEntity> findByCandidateUid(String candidateUid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("candidateUid", candidateUid)
                .orderBy("scheduledAt", Query.Direction.DESCENDING);
        List<InterviewEntity> list = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            list.add(doc.toObject(InterviewEntity.class));
        }
        return list;
    }

    public List<InterviewEntity> findByRecruiterUid(String recruiterUid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("recruiterUid", recruiterUid)
                .orderBy("scheduledAt", Query.Direction.DESCENDING);
        List<InterviewEntity> list = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            list.add(doc.toObject(InterviewEntity.class));
        }
        return list;
    }

    public List<InterviewEntity> findByApplicationId(String applicationId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("applicationId", applicationId)
                .orderBy("scheduledAt", Query.Direction.DESCENDING);
        List<InterviewEntity> list = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            list.add(doc.toObject(InterviewEntity.class));
        }
        return list;
    }
}
