package com.jobportal.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminAnalyticsService {

    // In a real application, this would run aggregation queries on Firestore or 
    // fetch pre-computed metrics from a specialized analytics collection.
    public Map<String, Object> getPlatformKPIs() throws Exception {
        Map<String, Object> kpis = new HashMap<>();
        
        // Mocked KPI data for demonstration
        kpis.put("totalUsers", 10245);
        kpis.put("totalJobSeekers", 8500);
        kpis.put("totalRecruiters", 1745);
        kpis.put("totalCompanies", 850);
        kpis.put("totalJobs", 3200);
        kpis.put("activeJobs", 1200);
        kpis.put("closedJobs", 2000);
        kpis.put("totalApplications", 45000);
        kpis.put("hiringConversionRate", 4.5); // 4.5%
        
        return kpis;
    }

    public Map<String, Object> getGrowthCharts() throws Exception {
        Map<String, Object> charts = new HashMap<>();
        
        // Mocked Growth Data for Recharts
        charts.put("userGrowth", new Object[]{
                Map.of("month", "Jan", "seekers", 4000, "recruiters", 400),
                Map.of("month", "Feb", "seekers", 5000, "recruiters", 600),
                Map.of("month", "Mar", "seekers", 6500, "recruiters", 1000),
                Map.of("month", "Apr", "seekers", 7200, "recruiters", 1300),
                Map.of("month", "May", "seekers", 8000, "recruiters", 1500),
                Map.of("month", "Jun", "seekers", 8500, "recruiters", 1745)
        });

        charts.put("hiringFunnel", new Object[]{
                Map.of("stage", "Applied", "count", 45000),
                Map.of("stage", "Reviewing", "count", 20000),
                Map.of("stage", "Shortlisted", "count", 8000),
                Map.of("stage", "Interviewed", "count", 4000),
                Map.of("stage", "Offered", "count", 2500),
                Map.of("stage", "Hired", "count", 2025)
        });
        
        return charts;
    }
}
