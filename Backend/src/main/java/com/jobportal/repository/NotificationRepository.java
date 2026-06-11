package com.jobportal.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.NotificationEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class NotificationRepository {
    private static final String COLLECTION_NAME = "notifications";

    public void save(NotificationEntity notification) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(notification.getNotificationId()).set(notification).get();
    }

    public List<NotificationEntity> findByUserUid(String userUid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        // Removed orderBy to prevent composite index requirement in Firestore
        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("userUid", userUid);
        List<NotificationEntity> notifications = new ArrayList<>();
        for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
            notifications.add(doc.toObject(NotificationEntity.class));
        }
        
        // Sort in memory (descending by createdAt)
        notifications.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        
        // Limit to 50
        if (notifications.size() > 50) {
            return notifications.subList(0, 50);
        }
        return notifications;
    }

    public NotificationEntity findById(String notificationId)
            throws ExecutionException, InterruptedException {

        Firestore db = FirestoreClient.getFirestore();

        var document = db.collection(COLLECTION_NAME)
                .document(notificationId)
                .get()
                .get();

        if (!document.exists()) {
            return null;
        }

        return document.toObject(NotificationEntity.class);
    }
}
