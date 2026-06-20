package com.jobportal.repository;
import com.jobportal.entity.VerificationRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VerificationRequestRepository extends JpaRepository<VerificationRequestEntity, String> {
    List<VerificationRequestEntity> findByStatus(String status);
}
