package com.jobportal.repository;
import com.jobportal.entity.AICandidateRankingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AICandidateRankingRepository extends JpaRepository<AICandidateRankingEntity, String> {
    List<AICandidateRankingEntity> findByJobId(String jobId);
    List<AICandidateRankingEntity> findByCandidateUid(String candidateUid);
}
