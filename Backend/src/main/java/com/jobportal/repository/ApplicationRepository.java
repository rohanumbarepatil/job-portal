package com.jobportal.repository;

import com.jobportal.entity.ApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, String> {
    List<ApplicationEntity> findByCandidateUidOrderByCreatedAtDesc(String candidateUid);
    List<ApplicationEntity> findByJobIdOrderByCreatedAtDesc(String jobId);
    boolean existsByCandidateUidAndJobId(String candidateUid, String jobId);
    long countByStatusIn(List<String> statuses);
}
