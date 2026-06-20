package com.jobportal.repository;
import com.jobportal.entity.AIScoringLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIScoringLogRepository extends JpaRepository<AIScoringLogEntity, String> {}
