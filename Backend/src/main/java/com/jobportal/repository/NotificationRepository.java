package com.jobportal.repository;

import com.jobportal.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, String> {
    List<NotificationEntity> findTop50ByUserUidOrderByCreatedAtDesc(String userUid);
}
