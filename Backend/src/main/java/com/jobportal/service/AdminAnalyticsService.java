package com.jobportal.service;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final VerificationRequestRepository verificationRequestRepository;
    private final InterviewRepository interviewRepository;

    public AdminAnalyticsService(UserRepository userRepository,
                                  JobRepository jobRepository,
                                  CompanyRepository companyRepository,
                                  ApplicationRepository applicationRepository,
                                  VerificationRequestRepository verificationRequestRepository,
                                  InterviewRepository interviewRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
        this.verificationRequestRepository = verificationRequestRepository;
        this.interviewRepository = interviewRepository;
    }

    public Map<String, Object> getPlatformKPIs() throws Exception {
        Map<String, Object> kpis = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalJobSeekers = userRepository.countByRole("ROLE_JOB_SEEKER");
        long totalRecruiters = userRepository.countByRole("ROLE_RECRUITER") + userRepository.countByRole("ROLE_PENDING_RECRUITER");
        long totalCompanies = companyRepository.count();
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus("ACTIVE");
        long closedJobs = jobRepository.countByStatus("CLOSED");
        long totalApplications = applicationRepository.count();
        long totalInterviews = interviewRepository.count();
        long scheduledInterviews = interviewRepository.findAll().stream()
            .filter(i -> "SCHEDULED".equals(i.getStatus())).count();

        // Pending verifications
        long pendingVerifications = verificationRequestRepository.findAll().stream()
            .filter(v -> "PENDING".equals(v.getStatus())).count();

        double conversionRate = totalApplications > 0
            ? Math.round(((double) totalJobSeekers / Math.max(totalApplications, 1)) * 100.0 * 10.0) / 10.0
            : 0;

        kpis.put("totalUsers", totalUsers);
        kpis.put("totalJobSeekers", totalJobSeekers);
        kpis.put("totalRecruiters", totalRecruiters);
        kpis.put("totalCompanies", totalCompanies);
        kpis.put("totalJobs", totalJobs);
        kpis.put("activeJobs", activeJobs);
        kpis.put("closedJobs", closedJobs);
        kpis.put("totalApplications", totalApplications);
        kpis.put("totalInterviews", totalInterviews);
        kpis.put("scheduledInterviews", scheduledInterviews);
        kpis.put("pendingVerifications", pendingVerifications);
        kpis.put("hiringConversionRate", conversionRate);

        // Recent registrations (top 10 users by createdAt)
        List<Map<String, Object>> recentRegistrations = userRepository.findTop10ByOrderByCreatedAtDesc()
            .stream().map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("uid", u.getUid());
                m.put("fullName", u.getFullName());
                m.put("email", u.getEmail());
                m.put("role", u.getRole());
                m.put("createdAt", u.getCreatedAt());
                m.put("isActive", u.isActive());
                return m;
            }).collect(Collectors.toList());
        kpis.put("recentRegistrations", recentRegistrations);

        // Recent job posts
        List<Map<String, Object>> recentJobs = jobRepository.findTop10ByOrderByCreatedAtDesc()
            .stream().map(j -> {
                Map<String, Object> m = new HashMap<>();
                m.put("jobId", j.getJobId());
                m.put("title", j.getTitle());
                m.put("status", j.getStatus());
                m.put("createdAt", j.getCreatedAt());
                m.put("companyName", j.getCompanyMetadata() != null ? j.getCompanyMetadata().getCompanyName() : "N/A");
                return m;
            }).collect(Collectors.toList());
        kpis.put("recentJobs", recentJobs);

        return kpis;
    }

    public Map<String, Object> getGrowthCharts() throws Exception {
        Map<String, Object> charts = new HashMap<>();

        // Build monthly growth from real data
        List<UserEntity> allUsers = userRepository.findAll();
        List<JobEntity> allJobs = jobRepository.findAll();
        List<ApplicationEntity> allApps = applicationRepository.findAll();

        // Generate last 6 months
        List<String> months = new ArrayList<>();
        List<Map<String, Object>> userGrowth = new ArrayList<>();
        List<Map<String, Object>> jobTrend = new ArrayList<>();
        List<Map<String, Object>> appTrend = new ArrayList<>();
        List<Map<String, Object>> recruiterActivity = new ArrayList<>();

        LocalDate now = LocalDate.now();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM");

        for (int i = 5; i >= 0; i--) {
            LocalDate month = now.minusMonths(i);
            String monthLabel = month.format(fmt);
            String monthPrefix = month.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            months.add(monthLabel);

            long seekers = allUsers.stream()
                .filter(u -> "ROLE_JOB_SEEKER".equals(u.getRole()) && u.getCreatedAt() != null && u.getCreatedAt().startsWith(monthPrefix))
                .count();
            long recruiters = allUsers.stream()
                .filter(u -> ("ROLE_RECRUITER".equals(u.getRole()) || "ROLE_PENDING_RECRUITER".equals(u.getRole())) 
                    && u.getCreatedAt() != null && u.getCreatedAt().startsWith(monthPrefix))
                .count();
            long jobsPosted = allJobs.stream()
                .filter(j -> j.getCreatedAt() != null && j.getCreatedAt().startsWith(monthPrefix))
                .count();
            long applications = allApps.stream()
                .filter(a -> a.getCreatedAt() != null && a.getCreatedAt().startsWith(monthPrefix))
                .count();

            Map<String, Object> ugEntry = new HashMap<>();
            ugEntry.put("month", monthLabel);
            ugEntry.put("seekers", seekers);
            ugEntry.put("recruiters", recruiters);
            userGrowth.add(ugEntry);

            Map<String, Object> jtEntry = new HashMap<>();
            jtEntry.put("month", monthLabel);
            jtEntry.put("jobs", jobsPosted);
            jobTrend.add(jtEntry);

            Map<String, Object> atEntry = new HashMap<>();
            atEntry.put("month", monthLabel);
            atEntry.put("applications", applications);
            appTrend.add(atEntry);

            Map<String, Object> raEntry = new HashMap<>();
            raEntry.put("month", monthLabel);
            raEntry.put("recruiterPosts", jobsPosted);
            raEntry.put("seekerApps", applications);
            recruiterActivity.add(raEntry);
        }

        // Hiring funnel from real app statuses
        Map<String, Long> statusCounts = allApps.stream()
            .collect(Collectors.groupingBy(a -> a.getStatus() != null ? a.getStatus() : "APPLIED", Collectors.counting()));
        
        List<Map<String, Object>> hiringFunnel = new ArrayList<>();
        for (String stage : new String[]{"APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEW_SCHEDULED", "OFFERED", "HIRED"}) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("stage", stage.replace("_", " "));
            entry.put("count", statusCounts.getOrDefault(stage, 0L));
            hiringFunnel.add(entry);
        }

        charts.put("userGrowth", userGrowth);
        charts.put("jobTrend", jobTrend);
        charts.put("applicationTrend", appTrend);
        charts.put("recruiterActivity", recruiterActivity);
        charts.put("hiringFunnel", hiringFunnel);

        return charts;
    }
}
