package com.jobportal.repository;

import com.jobportal.entity.SavedJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJobEntity, String> {
    List<SavedJobEntity> findByUserIdOrderBySavedAtDesc(String userId);
}
