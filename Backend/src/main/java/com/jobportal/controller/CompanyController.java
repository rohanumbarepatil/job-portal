package com.jobportal.controller;

import com.jobportal.entity.CompanyEntity;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public ResponseEntity<GlobalResponse<CompanyEntity>> createCompany(@RequestBody CompanyEntity request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            CompanyEntity company = companyService.createCompany(auth.getName(), request);
            return ResponseEntity.ok(GlobalResponse.success("Company created", company));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<List<CompanyEntity>>> getMyCompanies() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<CompanyEntity> companies = companyService.getMyCompanies(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Fetched companies", companies));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<GlobalResponse<CompanyEntity>> updateCompany(@PathVariable String companyId, @RequestBody CompanyEntity request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            CompanyEntity company = companyService.updateCompany(auth.getName(), companyId, request);
            return ResponseEntity.ok(GlobalResponse.success("Company updated", company));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<GlobalResponse<CompanyEntity>> getCompanyBySlug(@PathVariable String slug) {
        try {
            CompanyEntity company = companyService.getCompanyBySlug(slug);
            return ResponseEntity.ok(GlobalResponse.success("Fetched company", company));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
