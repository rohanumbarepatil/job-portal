package com.jobportal.repository;

import com.jobportal.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByEmail(String email);
    
    long countByRole(String role);
    long countByIsActive(boolean isActive);
    
    List<UserEntity> findByRoleOrderByCreatedAtDesc(String role);
    
    @Query("SELECT u FROM UserEntity u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY u.createdAt DESC")
    List<UserEntity> findByRoleAndSearch(@Param("role") String role, @Param("search") String search);
    
    List<UserEntity> findTop10ByOrderByCreatedAtDesc();
}
