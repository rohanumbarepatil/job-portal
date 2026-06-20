package com.jobportal.repository;
import com.jobportal.entity.AdminLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminLogRepository extends JpaRepository<AdminLogEntity, String> {}
