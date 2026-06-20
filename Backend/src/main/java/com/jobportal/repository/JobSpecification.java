package com.jobportal.repository;

import com.jobportal.entity.JobEntity;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import java.util.List;

public class JobSpecification {
    public static Specification<JobEntity> searchJobs(
            String keyword,
            String location,
            String employmentType,
            String experienceLevel,
            Long minSalary,
            String locationType,
            String companyId,
            List<String> skills) {
        
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Since we might join collections
            var predicates = criteriaBuilder.conjunction();
            
            // Only ACTIVE jobs
            predicates = criteriaBuilder.and(predicates, criteriaBuilder.equal(root.get("status"), "ACTIVE"));
            
            if (keyword != null && !keyword.isEmpty()) {
                Join<JobEntity, String> searchTags = root.join("searchTags", jakarta.persistence.criteria.JoinType.LEFT);
                predicates = criteriaBuilder.and(predicates, 
                    criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                        criteriaBuilder.equal(criteriaBuilder.lower(searchTags), keyword.toLowerCase())
                    )
                );
            }
            
            if (location != null && !location.isEmpty()) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            
            if (employmentType != null && !employmentType.isEmpty()) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.equal(root.get("employmentType"), employmentType));
            }
            
            if (experienceLevel != null && !experienceLevel.isEmpty()) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.equal(root.get("experienceLevel"), experienceLevel));
            }
            
            if (locationType != null && !locationType.isEmpty()) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.equal(root.get("locationType"), locationType));
            }
            
            if (companyId != null && !companyId.isEmpty()) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.equal(root.get("companyId"), companyId));
            }
            
            if (minSalary != null) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.greaterThanOrEqualTo(root.get("salaryRange").get("minSalary"), minSalary));
            }
            
            if (skills != null && !skills.isEmpty()) {
                Join<JobEntity, String> requiredSkills = root.join("requiredSkills", jakarta.persistence.criteria.JoinType.INNER);
                predicates = criteriaBuilder.and(predicates, requiredSkills.in(skills));
            }
            
            return predicates;
        };
    }
}
