package com.jobportal.service;

import com.jobportal.entity.CompanyEntity;
import com.jobportal.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public boolean isSlugAvailable(String slug) throws Exception {
        return companyRepository.findBySlug(slug) == null;
    }

    public CompanyEntity createCompany(String ownerUid, CompanyEntity request) throws Exception {
        if (!isSlugAvailable(request.getCompanySlug())) {
            throw new RuntimeException("Company slug is already taken");
        }

        CompanyEntity company = new CompanyEntity();
        company.setCompanyId(UUID.randomUUID().toString());
        company.setOwnerUid(ownerUid);
        company.setCompanySlug(request.getCompanySlug());
        company.setVerificationStatus("PENDING");
        company.setIsHiring(false);
        company.setRating(0.0);
        company.setFollowers(0);

        CompanyEntity.TeamMember owner = new CompanyEntity.TeamMember(ownerUid, "OWNER");
        company.setTeamMembers(List.of(owner));
        company.setTeamMemberUids(List.of(ownerUid));

        company.setCompanyInfo(request.getCompanyInfo());
        company.setBranding(request.getBranding());
        company.setAnalytics(new CompanyEntity.Analytics(0, 0, 0, 0.0));

        companyRepository.save(company);
        return company;
    }

    public CompanyEntity updateCompany(String uid, String companyId, CompanyEntity request) throws Exception {
        CompanyEntity existing = companyRepository.findById(companyId);
        if (existing == null) throw new RuntimeException("Company not found");

        if (existing.getTeamMemberUids() == null || !existing.getTeamMemberUids().contains(uid)) {
            throw new RuntimeException("Unauthorized: Not a team member");
        }

        if (request.getCompanyInfo() != null) existing.setCompanyInfo(request.getCompanyInfo());
        if (request.getBranding() != null) existing.setBranding(request.getBranding());
        if (request.getIsHiring() != null) {
            existing.setIsHiring(request.getIsHiring());
        }

        companyRepository.save(existing);
        return existing;
    }

    public List<CompanyEntity> getMyCompanies(String uid) throws Exception {
        return companyRepository.findByTeamMemberUid(uid);
    }

    public CompanyEntity getCompanyBySlug(String slug) throws Exception {
        CompanyEntity company = companyRepository.findBySlug(slug);
        if (company == null) throw new RuntimeException("Company not found");
        
        CompanyEntity.Analytics a = company.getAnalytics();
        if (a != null) {
            a.setProfileViews(a.getProfileViews() + 1);
            companyRepository.save(company);
        }
        return company;
    }
}
