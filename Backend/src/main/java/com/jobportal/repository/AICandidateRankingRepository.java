package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.AICandidateRankingEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class AICandidateRankingRepository {
    private static final String COLLECTION_NAME = "ai_candidate_rankings";

    public void save(AICandidateRankingEntity ranking) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(ranking.getRankingId()).set(ranking).get();
    }

    public AICandidateRankingEntity findById(String rankingId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var doc = db.collection(COLLECTION_NAME).document(rankingId).get().get();
        if (doc.exists()) {
            return doc.toObject(AICandidateRankingEntity.class);
        }
        return null;
    }

    public List<AICandidateRankingEntity> findByJobId(String jobId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var docs = db.collection(COLLECTION_NAME).whereEqualTo("jobId", jobId).get().get().getDocuments();
        List<AICandidateRankingEntity> list = new ArrayList<>();
        for (var doc : docs) {
            list.add(doc.toObject(AICandidateRankingEntity.class));
        }
        return list;
    }

    public List<AICandidateRankingEntity> findByCandidateUid(String candidateUid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var docs = db.collection(COLLECTION_NAME).whereEqualTo("candidateUid", candidateUid).get().get().getDocuments();
        List<AICandidateRankingEntity> list = new ArrayList<>();
        for (var doc : docs) {
            list.add(doc.toObject(AICandidateRankingEntity.class));
        }
        return list;
    }
}
