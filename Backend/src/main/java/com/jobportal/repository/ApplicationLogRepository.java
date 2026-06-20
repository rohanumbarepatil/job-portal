package com.jobportal.repository;
import com.jobportal.entity.ApplicationLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationLogRepository extends JpaRepository<ApplicationLogEntity, String> {
    List<ApplicationLogEntity> findByApplicationIdOrderByTimestampDesc(String applicationId);
}
