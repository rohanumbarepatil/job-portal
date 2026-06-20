package com.jobportal.repository;

import com.jobportal.entity.InterviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<InterviewEntity, String> {
    List<InterviewEntity> findByCandidateUidOrderByScheduledAtDesc(String candidateUid);
    List<InterviewEntity> findByRecruiterUidOrderByScheduledAtDesc(String recruiterUid);
    List<InterviewEntity> findByApplicationIdOrderByScheduledAtDesc(String applicationId);
}
