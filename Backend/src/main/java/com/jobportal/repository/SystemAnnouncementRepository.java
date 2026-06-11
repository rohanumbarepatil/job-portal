package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.SystemAnnouncementEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class SystemAnnouncementRepository {
    private static final String COLLECTION_NAME = "system_announcements";

    public void save(SystemAnnouncementEntity announcement) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(announcement.getAnnouncementId()).set(announcement).get();
    }

    public List<SystemAnnouncementEntity> findAll() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).orderBy("createdAt", Query.Direction.DESCENDING).limit(20);
        List<SystemAnnouncementEntity> announcements = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            announcements.add(doc.toObject(SystemAnnouncementEntity.class));
        }
        return announcements;
    }
}
