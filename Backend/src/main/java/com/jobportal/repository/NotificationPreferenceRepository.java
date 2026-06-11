package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.NotificationPreferenceEntity;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class NotificationPreferenceRepository {
    private static final String COLLECTION_NAME = "notification_preferences";

    public void save(NotificationPreferenceEntity pref) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(pref.getUserUid()).set(pref).get();
    }

    public NotificationPreferenceEntity findByUserUid(String userUid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        var doc = db.collection(COLLECTION_NAME).document(userUid).get().get();
        if (doc.exists()) {
            return doc.toObject(NotificationPreferenceEntity.class);
        }
        return null;
    }
}
