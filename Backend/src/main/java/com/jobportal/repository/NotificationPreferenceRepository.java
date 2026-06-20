package com.jobportal.repository;
import com.jobportal.entity.NotificationPreferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreferenceEntity, String> {
    Optional<NotificationPreferenceEntity> findByUserUid(String userUid);
}
