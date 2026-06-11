package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.InterviewFeedbackEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class InterviewFeedbackRepository {
    private static final String COLLECTION_NAME = "interview_feedback";

    public void save(InterviewFeedbackEntity feedback) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(feedback.getFeedbackId()).set(feedback).get();
    }

    public InterviewFeedbackEntity findByInterviewId(String interviewId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("interviewId", interviewId).limit(1);
        var docs = query.get().get().getDocuments();
        if (!docs.isEmpty()) {
            return docs.get(0).toObject(InterviewFeedbackEntity.class);
        }
        return null;
    }
}
