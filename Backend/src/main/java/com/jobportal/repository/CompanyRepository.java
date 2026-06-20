package com.jobportal.repository;

import com.jobportal.entity.CompanyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, String> {
    Optional<CompanyEntity> findByCompanySlug(String slug);
    Optional<CompanyEntity> findByOwnerUid(String ownerUid);
    List<CompanyEntity> findByTeamMemberUidsContaining(String uid);
    
    long countByVerificationStatus(String status);
    
    List<CompanyEntity> findTop8ByOrderByFollowersDesc();
    
    @Query("SELECT c FROM CompanyEntity c WHERE " +
           "(:status IS NULL OR c.verificationStatus = :status) AND " +
           "(:search IS NULL OR LOWER(c.companyInfo.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.companyInfo.name ASC")
    List<CompanyEntity> findByStatusAndSearch(@Param("status") String status, @Param("search") String search);
}
