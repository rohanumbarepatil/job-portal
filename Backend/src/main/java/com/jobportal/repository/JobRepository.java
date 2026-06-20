package com.jobportal.repository;

import com.jobportal.entity.JobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobEntity, String>, JpaSpecificationExecutor<JobEntity> {

    List<JobEntity> findByRecruiterUid(String recruiterUid);
    
    List<JobEntity> findByRecruiterUidOrderByCreatedAtDesc(String recruiterUid);

    @Query("SELECT j FROM JobEntity j WHERE j.status = 'ACTIVE' ORDER BY j.createdAt DESC")
    List<JobEntity> findActiveJobs();

    // Note: For searchActiveJobs, we will use a custom specification or QueryDSL in the service layer, 
    // or a simplified query here. Here is a simplified version:
    @Query("SELECT j FROM JobEntity j JOIN j.searchTags t WHERE j.status = 'ACTIVE' " +
           "AND (:keyword IS NULL OR t = :keyword) " +
           "AND (:location IS NULL OR j.location = :location) " +
           "AND (:type IS NULL OR j.employmentType = :type)")
    List<JobEntity> searchActiveJobs(String keyword, String location, String type);
    
    long countByStatus(String status);
    
    List<JobEntity> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT j FROM JobEntity j WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY j.createdAt DESC")
    List<JobEntity> findByStatusAndSearch(@Param("status") String status, @Param("search") String search);
}
