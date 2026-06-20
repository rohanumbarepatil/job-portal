package com.jobportal.controller;

import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.response.GlobalResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
public class PublicController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public PublicController(UserRepository userRepository, 
                            CompanyRepository companyRepository, 
                            JobRepository jobRepository, 
                            ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<GlobalResponse<Map<String, Long>>> getPublicStats() {
        try {
            long candidates = userRepository.countByRole("ROLE_JOB_SEEKER");
            long companies = companyRepository.countByVerificationStatus("VERIFIED") + companyRepository.countByVerificationStatus("PENDING");
            // Or just count all companies:
            long allCompanies = companyRepository.count();
            long activeJobs = jobRepository.countByStatus("ACTIVE");
            long placements = applicationRepository.countByStatusIn(List.of("SELECTED", "HIRED"));

            Map<String, Long> stats = new HashMap<>();
            stats.put("candidates", candidates);
            stats.put("companies", allCompanies);
            stats.put("activeJobs", activeJobs);
            stats.put("placements", placements);

            return ResponseEntity.ok(GlobalResponse.success("Public stats fetched", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
