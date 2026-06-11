package com.jobportal.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.jobportal.entity.CompanyEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class CompanyRepository {
    private static final String COLLECTION_NAME = "companies";

    public void save(CompanyEntity company) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = db.collection(COLLECTION_NAME).document(company.getCompanyId()).set(company);
        collectionsApiFuture.get();
    }

    public CompanyEntity findById(String companyId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(companyId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            return document.toObject(CompanyEntity.class);
        }
        return null;
    }

    public CompanyEntity findBySlug(String slug) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference companies = db.collection(COLLECTION_NAME);
        Query query = companies.whereEqualTo("companySlug", slug);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        if (!querySnapshot.get().getDocuments().isEmpty()) {
            return querySnapshot.get().getDocuments().get(0).toObject(CompanyEntity.class);
        }
        return null;
    }

    public List<CompanyEntity> findByTeamMemberUid(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference companies = db.collection(COLLECTION_NAME);
        
        Query query = companies.whereArrayContains("teamMemberUids", uid);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        List<CompanyEntity> result = new ArrayList<>();
        for (QueryDocumentSnapshot doc : querySnapshot.get().getDocuments()) {
            result.add(doc.toObject(CompanyEntity.class));
        }
        return result;
    }
}
