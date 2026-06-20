package com.jobportal.config;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Configuration
@Profile("test")
public class DemoDataSeeder {

    @Bean
    CommandLineRunner seedDemoData(
            UserRepository userRepo,
            CompanyRepository companyRepo,
            JobRepository jobRepo,
            JobSeekerProfileRepository profileRepo,
            ApplicationRepository appRepo,
            NotificationRepository notifRepo,
            SavedJobRepository savedJobRepo,
            VerificationRequestRepository verificationRepo,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepo.findByEmail("admin@jobportal.com").isPresent()) {
                System.out.println(">>> Demo data already exists. Skipping seed.");
                return;
            }

            System.out.println(">>> Seeding upgraded demo data (5 recruiters, 50 seekers, 10 companies, 100 jobs)...");
            String encodedPassword = passwordEncoder.encode("Demo@123");
            String now = Instant.now().toString();
            Random rand = new Random(42);

            // ========== 1. ADMIN ==========
            userRepo.save(UserEntity.builder()
                    .uid("admin-uid-001").email("admin@jobportal.com").password(encodedPassword)
                    .fullName("Priya Sharma").role("ROLE_ADMIN").verificationStatus("APPROVED")
                    .profileCompleted(true).isActive(true)
                    .createdAt(Instant.now().minus(180, ChronoUnit.DAYS).toString())
                    .lastLogin(now).provider("EMAIL").build());

            // ========== 2. RECRUITERS (5) ==========
            String[][] recruiterData = {
                {"rec-uid-001", "recruiter1@jobportal.com", "Anika Verma"},
                {"rec-uid-002", "recruiter2@jobportal.com", "Rajesh Khanna"},
                {"rec-uid-003", "recruiter3@jobportal.com", "David Chen"},
                {"rec-uid-004", "recruiter4@jobportal.com", "Sarah Thompson"},
                {"rec-uid-005", "recruiter5@jobportal.com", "Mohammed Al-Rashid"},
            };
            List<UserEntity> recruiters = new ArrayList<>();
            for (int i = 0; i < recruiterData.length; i++) {
                String[] r = recruiterData[i];
                recruiters.add(userRepo.save(UserEntity.builder()
                        .uid(r[0]).email(r[1]).password(encodedPassword).fullName(r[2])
                        .role("ROLE_RECRUITER").verificationStatus("APPROVED")
                        .profileCompleted(true).isActive(true)
                        .createdAt(Instant.now().minus(150 - i * 10L, ChronoUnit.DAYS).toString())
                        .lastLogin(now).provider("EMAIL").build()));
            }

            // Add a PENDING_RECRUITER for verification demo
            userRepo.save(UserEntity.builder()
                    .uid("rec-uid-006").email("pending.recruiter@company.com").password(encodedPassword)
                    .fullName("Kavya Reddy").role("ROLE_PENDING_RECRUITER").verificationStatus("PENDING")
                    .profileCompleted(false).isActive(true)
                    .createdAt(Instant.now().minus(3, ChronoUnit.DAYS).toString())
                    .lastLogin(now).provider("EMAIL").build());

            // ========== 3. JOB SEEKERS (50) ==========
            String[][] seekerMeta = {
                {"seek-uid-001","seeker1@jobportal.com","Arjun Patel","arjunpatel","Senior Full Stack Developer","Bangalore, India"},
                {"seek-uid-002","seeker2@jobportal.com","Meera Nair","meeranair","UI/UX Designer","Mumbai, India"},
                {"seek-uid-003","seeker3@jobportal.com","Vikram Singh","vikramsingh","DevOps Engineer","Delhi, India"},
                {"seek-uid-004","seeker4@jobportal.com","Sophia Martinez","sophiamartinez","Data Scientist","Pune, India"},
                {"seek-uid-005","seeker5@jobportal.com","Liam O'Brien","liamobrien","Mobile Developer","Hyderabad, India"},
                {"seek-uid-006","seeker6@jobportal.com","Fatima Al-Hassan","fatimaalhassan","Cybersecurity Analyst","Chennai, India"},
                {"seek-uid-007","seeker7@jobportal.com","Yuki Tanaka","yukitanaka","Backend Engineer","Remote"},
                {"seek-uid-008","seeker8@jobportal.com","Carlos Rivera","carlosrivera","Product Manager","Singapore"},
                {"seek-uid-009","seeker9@jobportal.com","Emily Johnson","emilyjohnson","QA Engineer","Bangalore, India"},
                {"seek-uid-010","seeker10@jobportal.com","Rahul Gupta","rahulgupta","Junior Software Engineer","Mumbai, India"},
                {"seek-uid-011","seeker11@jobportal.com","Aisha Patel","aishapatel","ML Engineer","Bangalore, India"},
                {"seek-uid-012","seeker12@jobportal.com","Tom Williams","tomwilliams","Frontend Developer","Pune, India"},
                {"seek-uid-013","seeker13@jobportal.com","Preethi Kumar","preethikumar","Business Analyst","Chennai, India"},
                {"seek-uid-014","seeker14@jobportal.com","James Chen","jameschen","Cloud Architect","Singapore"},
                {"seek-uid-015","seeker15@jobportal.com","Ananya Rao","ananyarao","Technical Writer","Remote"},
                {"seek-uid-016","seeker16@jobportal.com","Daniel Kim","danielkim","Full Stack Developer","Seoul"},
                {"seek-uid-017","seeker17@jobportal.com","Shreya Mishra","shreyamishra","Data Analyst","Hyderabad, India"},
                {"seek-uid-018","seeker18@jobportal.com","Oliver Brown","oliverbrown","SRE Engineer","London"},
                {"seek-uid-019","seeker19@jobportal.com","Nia Okafor","niaokafor","Product Designer","Lagos"},
                {"seek-uid-020","seeker20@jobportal.com","Haruto Sato","harutosato","Java Developer","Tokyo"},
                {"seek-uid-021","seeker21@jobportal.com","Aditi Sharma","aditisharma","React Developer","Bangalore, India"},
                {"seek-uid-022","seeker22@jobportal.com","Ben Adams","benadams","Node.js Developer","Dublin"},
                {"seek-uid-023","seeker23@jobportal.com","Kavita Joshi","kavitajoshi","AI Engineer","Mumbai, India"},
                {"seek-uid-024","seeker24@jobportal.com","Lucas Santos","lucassantos","Mobile Dev","São Paulo"},
                {"seek-uid-025","seeker25@jobportal.com","Zara Ahmed","zaraahmed","HR Tech Specialist","Dubai"},
                {"seek-uid-026","seeker26@jobportal.com","Ivan Petrov","ivanpetrov","Backend Developer","Moscow"},
                {"seek-uid-027","seeker27@jobportal.com","Hannah Lee","hannahlee","UX Researcher","Seoul"},
                {"seek-uid-028","seeker28@jobportal.com","Raj Malhotra","rajmalhotra","DevSecOps","Delhi, India"},
                {"seek-uid-029","seeker29@jobportal.com","Clara Dubois","claradubois","Data Engineer","Paris"},
                {"seek-uid-030","seeker30@jobportal.com","Ali Hassan","alihassan","Security Engineer","Dubai"},
                {"seek-uid-031","seeker31@jobportal.com","Neha Kapoor","nehakapoor","Product Manager","Mumbai, India"},
                {"seek-uid-032","seeker32@jobportal.com","Alex Turner","alexturner","Infrastructure Eng","New York"},
                {"seek-uid-033","seeker33@jobportal.com","Tanvi Mehta","tanvimehta","ML Researcher","Ahmedabad, India"},
                {"seek-uid-034","seeker34@jobportal.com","Ryan Park","ryanpark","Web Developer","Vancouver"},
                {"seek-uid-035","seeker35@jobportal.com","Ishita Roy","ishitaroy","Scrum Master","Kolkata, India"},
                {"seek-uid-036","seeker36@jobportal.com","Noah Miller","noahmiller","Cloud Engineer","Sydney"},
                {"seek-uid-037","seeker37@jobportal.com","Pooja Tiwari","poojatiwari","SQL Developer","Lucknow, India"},
                {"seek-uid-038","seeker38@jobportal.com","Marco Romano","marcoromano","Fullstack Dev","Rome"},
                {"seek-uid-039","seeker39@jobportal.com","Sana Mirza","sanamirza","Data Scientist","Lahore"},
                {"seek-uid-040","seeker40@jobportal.com","Ethan Clarke","ethanclarke","Platform Engineer","Toronto"},
                {"seek-uid-041","seeker41@jobportal.com","Nandini Iyer","nandiniiyer","Compliance Analyst","Bangalore, India"},
                {"seek-uid-042","seeker42@jobportal.com","Oscar Fernandez","oscarfernandez","IoT Engineer","Madrid"},
                {"seek-uid-043","seeker43@jobportal.com","Sunita Yadav","sunitayadav","HR Manager","Delhi, India"},
                {"seek-uid-044","seeker44@jobportal.com","Ayaan Khan","ayaankhan","Python Developer","Karachi"},
                {"seek-uid-045","seeker45@jobportal.com","Layla Hassan","laylahassan","Frontend Developer","Cairo"},
                {"seek-uid-046","seeker46@jobportal.com","Amit Saxena","amitsaxena","System Architect","Noida, India"},
                {"seek-uid-047","seeker47@jobportal.com","Nora Johansen","norajohansen","Tech Lead","Oslo"},
                {"seek-uid-048","seeker48@jobportal.com","Karan Bajaj","karanbajaj","Angular Developer","Jaipur, India"},
                {"seek-uid-049","seeker49@jobportal.com","Ana Silva","anasilva","Data Analyst","Lisbon"},
                {"seek-uid-050","seeker50@jobportal.com","Ravi Shankar","ravishankar","Java Architect","Bangalore, India"},
            };

            String[] skillPool = {"React","Node.js","TypeScript","Python","Java","AWS","Docker","Kubernetes","Figma","SQL","Go","Flutter","TensorFlow","PyTorch","Spring Boot","GraphQL","CI/CD","Linux","Agile","REST APIs","MongoDB","Redis","Kafka","Terraform","Selenium","PostgreSQL","Git","HTML","CSS","Angular","Vue.js","PHP","C++","C#",".NET","Spark","Airflow","ML","NLP","Android","iOS","SwiftUI","Dart","Firebase","gRPC","Microservices","DevOps","SRE"};

            List<UserEntity> seekers = new ArrayList<>();
            for (int i = 0; i < seekerMeta.length; i++) {
                String[] s = seekerMeta[i];
                // Distribute createdAt over last 6 months
                long daysAgo = 10 + (long)(i * 3.3); // spread from ~10 to ~175 days ago
                seekers.add(userRepo.save(UserEntity.builder()
                        .uid(s[0]).email(s[1]).password(encodedPassword).fullName(s[2])
                        .role("ROLE_JOB_SEEKER").verificationStatus("APPROVED")
                        .profileCompleted(i < 45).isActive(i < 48)
                        .createdAt(Instant.now().minus(daysAgo, ChronoUnit.DAYS).toString())
                        .lastLogin(now).provider("EMAIL").build()));
            }

            // ========== 4. COMPANIES (10) ==========
            String[][] companyData = {
                {"comp-uid-001","rec-uid-001","nexaflow-technologies","NexaFlow Technologies","Information Technology","50-200","2018","Bangalore, India","VERIFIED","#6366f1","NF","NexaFlow builds next-gen workflow automation for enterprises."},
                {"comp-uid-002","rec-uid-002","greenshift-energy","GreenShift Energy","Clean Energy","200-500","2015","Mumbai, India","VERIFIED","#22c55e","GS","GreenShift pioneers affordable solar and wind energy solutions."},
                {"comp-uid-003","rec-uid-003","atlas-fintech","Atlas Fintech","Financial Technology","500-1000","2012","Singapore","VERIFIED","#f59e0b","AF","Atlas Fintech is a leading digital payments platform in SE Asia."},
                {"comp-uid-004","rec-uid-004","healthpulse-ai","HealthPulse AI","Healthcare Technology","20-50","2020","Hyderabad, India","VERIFIED","#ef4444","HP","HealthPulse builds AI-driven diagnostic tools for hospitals."},
                {"comp-uid-005","rec-uid-005","orion-logistics","Orion Logistics","Supply Chain & Logistics","100-200","2017","Chennai, India","VERIFIED","#8b5cf6","OL","Orion optimizes last-mile delivery with ML-powered routing."},
                {"comp-uid-006","rec-uid-001","edutech-global","EduTech Global","Education Technology","50-100","2019","Delhi, India","VERIFIED","#06b6d4","EG","EduTech builds personalized learning platforms for K-12."},
                {"comp-uid-007","rec-uid-002","blockverse-labs","Blockverse Labs","Blockchain/Web3","10-20","2021","Bangalore, India","PENDING","#7c3aed","BL","Blockverse builds decentralized finance and NFT infrastructure."},
                {"comp-uid-008","rec-uid-003","safecloud-security","SafeCloud Security","Cybersecurity","30-80","2016","Mumbai, India","VERIFIED","#dc2626","SC","SafeCloud provides enterprise-grade cloud security solutions."},
                {"comp-uid-009","rec-uid-004","agritech-innovations","AgriTech Innovations","Agriculture Technology","20-50","2019","Pune, India","VERIFIED","#84cc16","AI","AgriTech connects farmers with precision agriculture tools."},
                {"comp-uid-010","rec-uid-005","cloudnine-travel","CloudNine Travel","Travel & Hospitality","50-100","2018","Goa, India","VERIFIED","#f97316","CT","CloudNine reimagines travel booking with personalized AI."},
            };

            List<CompanyEntity> allCompanies = new ArrayList<>();
            String[] benefits = {"Health Insurance","Stock Options","Remote Work","Learning Budget","Gym Membership"};
            for (String[] cd : companyData) {
                String logoUrl = "https://ui-avatars.com/api/?name=" + cd[11] + "&background=" + cd[9].replace("#","") + "&color=fff&size=128";
                CompanyEntity c = CompanyEntity.builder()
                        .companyId(cd[0]).ownerUid(cd[1]).companySlug(cd[2])
                        .verificationStatus(cd[8]).isHiring(true).rating(3.8 + rand.nextDouble() * 1.2).followers(100 + rand.nextInt(2000))
                        .teamMemberUids(List.of(cd[1]))
                        .teamMembers(List.of(new CompanyEntity.TeamMember(cd[1], "OWNER")))
                        .companyInfo(new CompanyEntity.CompanyInfo(cd[3], cd[4], cd[5], Integer.parseInt(cd[6]), cd[7], cd[11]))
                        .branding(new CompanyEntity.Branding(logoUrl, null, "We foster innovation and growth.", Arrays.asList(benefits),
                                new CompanyEntity.SocialLinks("https://linkedin.com/company/" + cd[2], null, "https://" + cd[2] + ".com"),
                                new CompanyEntity.Media(List.of(), List.of(), null)))
                        .analytics(new CompanyEntity.Analytics(500 + rand.nextInt(5000), 1000 + rand.nextInt(10000), 50 + rand.nextInt(500), 5.0 + rand.nextDouble() * 15.0))
                        .build();
                allCompanies.add(companyRepo.save(c));
            }

            // ========== 5. VERIFICATION REQUESTS ==========
            verificationRepo.save(VerificationRequestEntity.builder()
                    .requestId("vreq-uid-001")
                    .entityType("RECRUITER")
                    .entityId("rec-uid-006")
                    .status("PENDING")
                    .submittedAt(Instant.now().minus(3, ChronoUnit.DAYS).toString())
                    .build());
            verificationRepo.save(VerificationRequestEntity.builder()
                    .requestId("vreq-uid-002")
                    .entityType("COMPANY")
                    .entityId("comp-uid-007")
                    .status("PENDING")
                    .submittedAt(Instant.now().minus(1, ChronoUnit.DAYS).toString())
                    .build());

            // ========== 6. JOBS (100 jobs) ==========
            String[] jobTitles = {
                "Senior Full Stack Engineer","DevOps Engineer","Product Designer","ML Engineer","Frontend Developer",
                "QA Automation Engineer","Technical Writer","Backend Developer","Solar Systems Engineer","IoT Developer",
                "Data Analyst","Project Manager","Sustainability Analyst","Electrical Engineer","Marketing Manager",
                "Senior Backend Engineer (Go)","Mobile Engineer (Flutter)","Security Engineer","Data Engineer","Product Manager",
                "Compliance Analyst","Site Reliability Engineer","UX Researcher","Junior Software Engineer","Cloud Architect",
                "Scrum Master","Business Intelligence Analyst","Software Architect","Android Developer","iOS Developer",
                "Database Administrator","Network Engineer","Systems Administrator","React Developer","Node.js Developer",
                "Python Developer","Java Developer","TypeScript Developer","API Developer","Platform Engineer",
                "Infrastructure Engineer","Release Manager","Customer Success Engineer","Solutions Architect","Integration Engineer",
                "Data Warehouse Engineer","AI Research Engineer","NLP Engineer","Computer Vision Engineer","Robotics Engineer",
                "Blockchain Developer","Smart Contract Auditor","DeFi Developer","Web3 Developer","Metaverse Developer",
                "EdTech Platform Developer","Content Management Developer","Learning Experience Designer","Course Creator","eLearning Developer",
                "Cybersecurity Analyst","Penetration Tester","Security Architect","SOC Analyst","Incident Response Specialist",
                "Supply Chain Analyst","Logistics Platform Developer","Fleet Management Engineer","Route Optimization Specialist","Warehouse Systems Developer",
                "Healthcare Data Analyst","HIPAA Compliance Specialist","Medical Device Engineer","Clinical Data Manager","Health IT Consultant",
                "AgriTech Developer","Drone Software Engineer","Precision Agriculture Analyst","Farm Management Consultant","Agricultural Data Scientist",
                "Travel Tech Developer","Hotel Integration Engineer","Revenue Management Analyst","Customer Experience Designer","Booking Engine Developer",
                "Executive Assistant (Tech)","Technical Recruiter","HR Systems Admin","L&D Specialist","Culture & Engagement Manager",
                "FinTech Developer","Payment Gateway Engineer","KYC/AML Analyst","Fraud Detection Engineer","Treasury Tech Specialist",
                "Growth Hacker","SEO Specialist","Content Strategist","Brand Designer","Email Marketing Manager",
                "Intern - Software Engineering","Intern - Product Design","Intern - Data Science","Intern - Marketing","Intern - Business Development"
            };

            String[] experienceLevels = {"ENTRY","MID","SENIOR","EXECUTIVE"};
            String[] locationTypes = {"REMOTE","ONSITE","HYBRID"};
            String[] empTypes = {"FULL_TIME","PART_TIME","CONTRACT","INTERNSHIP"};
            String[] locations = {"Bangalore, India","Mumbai, India","Delhi, India","Hyderabad, India","Chennai, India","Pune, India","Singapore","Remote","London","New York"};
            String[] statuses = {"ACTIVE","ACTIVE","ACTIVE","ACTIVE","ACTIVE","ACTIVE","ACTIVE","CLOSED"};

            List<JobEntity> allJobs = new ArrayList<>();
            for (int i = 0; i < 100; i++) {
                CompanyEntity comp = allCompanies.get(i % allCompanies.size());
                // Find recruiter for this company
                String recUid = comp.getOwnerUid();
                String title = jobTitles[i];
                String level = experienceLevels[i % 4];
                String locType = locationTypes[i % 3];
                String location = locations[i % 10];
                String empType = i >= 95 ? "INTERNSHIP" : empTypes[i % 3];
                String status = statuses[i % 8];

                // Salary based on level
                long minSal = level.equals("ENTRY") ? 400000 : level.equals("MID") ? 1000000 : level.equals("SENIOR") ? 2000000 : 5000000;
                long maxSal = minSal * 2;

                // Build skills list
                List<String> skills = new ArrayList<>();
                skills.add(skillPool[i % skillPool.length]);
                skills.add(skillPool[(i + 5) % skillPool.length]);
                skills.add(skillPool[(i + 10) % skillPool.length]);

                // Distribute createdAt over last 6 months for realistic charts
                long jobDaysAgo = (long)(i * 1.8); // 0 to 180 days ago
                
                JobEntity job = JobEntity.builder()
                        .jobId("job-uid-" + String.format("%03d", i + 1))
                        .companyId(comp.getCompanyId())
                        .recruiterUid(recUid)
                        .status(status)
                        .title(title)
                        .description("We are looking for a talented " + title + " to join our growing team. You will work on exciting projects with a world-class engineering team.")
                        .requiredSkills(skills)
                        .preferredSkills(List.of())
                        .benefits(Arrays.asList(benefits))
                        .locationType(locType)
                        .location(location)
                        .employmentType(empType)
                        .experienceLevel(level)
                        .salaryRange(new JobEntity.SalaryRange(minSal, maxSal, "INR", true))
                        .openPositions(1 + i % 5)
                        .isFeatured(i < 10)
                        .isUrgentHiring(i % 7 == 0)
                        .searchTags(skills)
                        .companyMetadata(new JobEntity.CompanyMetadata(
                                comp.getCompanyInfo().getName(),
                                comp.getBranding().getLogoUrl(),
                                comp.getCompanySlug()))
                        .metrics(new JobEntity.Metrics(50 + i * 10, 5 + i, 3 + i / 5))
                        .applicationDeadline(Instant.now().plus(30 + i, ChronoUnit.DAYS).toString())
                        .createdAt(Instant.now().minus(jobDaysAgo, ChronoUnit.DAYS).toString())
                        .updatedAt(now)
                        .build();
                allJobs.add(jobRepo.save(job));
            }

            // ========== 7. JOB SEEKER PROFILES (50) ==========
            for (int i = 0; i < seekerMeta.length; i++) {
                String uid = seekerMeta[i][0];
                String username = seekerMeta[i][3];
                String headline = seekerMeta[i][4];
                String location = seekerMeta[i][5];

                List<String> skills = new ArrayList<>();
                skills.add(skillPool[i % skillPool.length]);
                skills.add(skillPool[(i + 7) % skillPool.length]);
                skills.add(skillPool[(i + 14) % skillPool.length]);
                skills.add(skillPool[(i + 21) % skillPool.length]);

                JobSeekerProfile profile = JobSeekerProfile.builder()
                        .uid(uid).username(username)
                        .profileVisibility("PUBLIC").openToWork(i < 40).profileViews(10 + i * 5)
                        .headline(headline)
                        .personalInfo(new JobSeekerProfile.PersonalInfo("98765" + String.format("%05d", i), location, "Experienced " + headline + " seeking new opportunities."))
                        .skills(skills)
                        .education(new ArrayList<>()).experience(new ArrayList<>())
                        .projects(new ArrayList<>()).certifications(new ArrayList<>())
                        .achievements(new ArrayList<>(List.of("Top Performer 2023")))
                        .socialLinks(new JobSeekerProfile.SocialLinks("https://linkedin.com/in/" + username, "https://github.com/" + username, "https://" + username + ".dev"))
                        .resume(new JobSeekerProfile.Resume("https://res.cloudinary.com/demo/raw/upload/v1/resumes/" + username + ".pdf", username + "_resume.pdf", now))
                        .metrics(new JobSeekerProfile.Metrics(50 + i * 2, 45 + i * 3, i < 10 ? "Expert" : i < 30 ? "Intermediate" : "Beginner"))
                        .build();
                JobSeekerProfile savedProfile = profileRepo.save(profile);

                // Education
                ProfileEducation edu = ProfileEducation.builder().profile(savedProfile)
                        .degree(i % 2 == 0 ? "B.Tech Computer Science" : "M.Sc Information Technology")
                        .institution(i % 4 == 0 ? "IIT Bombay" : i % 4 == 1 ? "NIT Trichy" : i % 4 == 2 ? "BITS Pilani" : "VIT Vellore")
                        .startYear(String.valueOf(2014 + i % 6)).endYear(String.valueOf(2018 + i % 6)).build();
                savedProfile.getEducation().add(edu);

                if (i < 48) { // most have experience
                    ProfileExperience exp = ProfileExperience.builder().profile(savedProfile)
                            .title(headline)
                            .company(i % 5 == 0 ? "Infosys" : i % 5 == 1 ? "TCS" : i % 5 == 2 ? "Wipro" : i % 5 == 3 ? "HCL" : "Cognizant")
                            .startDate("2020-" + String.format("%02d", (i % 12) + 1) + "-01")
                            .endDate(i % 2 == 0 ? null : "2024-01-01")
                            .description("Worked on enterprise software development and delivered key product features.")
                            .isCurrent(i % 2 == 0).build();
                    savedProfile.getExperience().add(exp);
                }

                ProfileProject proj = ProfileProject.builder().profile(savedProfile)
                        .name("Open Source Contribution #" + (i + 1))
                        .description("Contributed to popular open source projects in the " + headline + " domain.")
                        .link("https://github.com/" + username + "/project-" + i)
                        .featured(i < 20).build();
                savedProfile.getProjects().add(proj);

                ProfileCertification cert = ProfileCertification.builder().profile(savedProfile)
                        .name(i % 3 == 0 ? "AWS Solutions Architect" : i % 3 == 1 ? "Google Cloud Professional" : "Azure Fundamentals")
                        .issuer(i % 3 == 0 ? "Amazon Web Services" : i % 3 == 1 ? "Google Cloud" : "Microsoft")
                        .date("2023-" + String.format("%02d", (i % 12) + 1) + "-15").build();
                savedProfile.getCertifications().add(cert);

                profileRepo.save(savedProfile);
            }

            // ========== 8. APPLICATIONS (300) ==========
            String[] appStatuses = {"APPLIED","REVIEWING","SHORTLISTED","INTERVIEW_SCHEDULED","OFFERED","HIRED","REJECTED","WITHDRAWN","APPLIED","REVIEWING","APPLIED","SHORTLISTED"};
            int appCounter = 0;
            List<ApplicationEntity> allApps = new ArrayList<>();
            // Each of 50 seekers applies to ~6 jobs = 300 applications
            for (int seekerIdx = 0; seekerIdx < seekers.size(); seekerIdx++) {
                UserEntity seeker = seekers.get(seekerIdx);
                int numApps = 5 + rand.nextInt(3); // 5-7 apps each
                Set<Integer> usedJobs = new HashSet<>();
                for (int a = 0; a < numApps && a < allJobs.size(); a++) {
                    int jobIdx;
                    do { jobIdx = rand.nextInt(allJobs.size()); } while (usedJobs.contains(jobIdx));
                    usedJobs.add(jobIdx);
                    JobEntity job = allJobs.get(jobIdx);
                    // Distribute application dates over last 6 months
                    long appDaysAgo = (long)(rand.nextInt(170) + 5);
                    ApplicationEntity app = ApplicationEntity.builder()
                            .applicationId("app-uid-" + String.format("%04d", ++appCounter))
                            .jobId(job.getJobId()).companyId(job.getCompanyId())
                            .candidateUid(seeker.getUid()).recruiterUid(job.getRecruiterUid())
                            .resumeUrl("https://res.cloudinary.com/demo/raw/upload/resumes/" + seekerMeta[seekerIdx][3] + ".pdf")
                            .coverLetter("I am excited to apply for " + job.getTitle() + ".")
                            .atsMatchScore(30 + rand.nextInt(70))
                            .status(appStatuses[appCounter % appStatuses.length])
                            .candidateSnapshot(new ApplicationEntity.CandidateSnapshot(seeker.getFullName(), seeker.getEmail(), seekerMeta[seekerIdx][4], List.of(skillPool[(seekerIdx) % skillPool.length])))
                            .jobSnapshot(new ApplicationEntity.JobSnapshot(job.getTitle(), job.getCompanyMetadata().getCompanyName()))
                            .createdAt(Instant.now().minus(appDaysAgo, ChronoUnit.DAYS).toString())
                            .updatedAt(now).build();
                    allApps.add(appRepo.save(app));
                    if (appCounter >= 300) break;
                }
                if (appCounter >= 300) break;
            }

            // ========== 9. SAVED JOBS (50) ==========
            Set<String> savedPairs = new HashSet<>();
            int savedCount = 0;
            for (int i = 0; i < seekers.size() && savedCount < 50; i++) {
                int numSaved = 1 + rand.nextInt(2);
                for (int s = 0; s < numSaved && savedCount < 50; s++) {
                    int jobIdx = rand.nextInt(allJobs.size());
                    String pairKey = seekers.get(i).getUid() + "_" + allJobs.get(jobIdx).getJobId();
                    if (!savedPairs.contains(pairKey)) {
                        savedPairs.add(pairKey);
                        JobEntity job = allJobs.get(jobIdx);
                        SavedJobEntity saved = SavedJobEntity.builder()
                                .id(pairKey)
                                .userId(seekers.get(i).getUid())
                                .jobId(job.getJobId())
                                .savedAt(Instant.now().minus(rand.nextInt(60), ChronoUnit.DAYS).toString())
                                .jobSnapshot(new SavedJobEntity.JobSnapshot(
                                        job.getTitle(), job.getCompanyMetadata().getCompanyName(),
                                        job.getCompanyMetadata().getCompanyLogoUrl(),
                                        job.getLocation(), job.getLocationType(),
                                        job.getEmploymentType(), job.getStatus()))
                                .build();
                        savedJobRepo.save(saved);
                        savedCount++;
                    }
                }
            }

            // ========== 10. NOTIFICATIONS (100) ==========
            String[] notifTypes = {"APPLICATION_UPDATE","INTERVIEW_INVITE","NEW_APPLICATION","SYSTEM_ALERT","JOB_ALERT"};
            String[] notifTitles = {"Application Reviewed","Interview Scheduled","New Applicant","System Alert","New Job Match"};
            String[] notifMessages = {
                "Your application has been reviewed by the recruiter.",
                "You have been invited to an interview. Check your email.",
                "A new candidate has applied for your job posting.",
                "Platform analytics report has been generated.",
                "We found new jobs matching your profile."
            };
            for (int i = 0; i < 100; i++) {
                String targetUid = i < 70 ? seekers.get(i % seekers.size()).getUid() :
                                  i < 90 ? recruiters.get(i % recruiters.size()).getUid() : "admin-uid-001";
                int tIdx = i % 5;
                notifRepo.save(NotificationEntity.builder()
                        .notificationId("notif-uid-" + String.format("%03d", i + 1))
                        .userUid(targetUid)
                        .type(notifTypes[tIdx])
                        .title(notifTitles[tIdx])
                        .message(notifMessages[tIdx])
                        .actionUrl("/dashboard")
                        .isRead(i > 30)
                        .build());
            }

            System.out.println(">>> Demo data seeding complete!");
            System.out.println(">>> Users: 1 Admin + 5 Recruiters + 1 Pending Recruiter + 50 Job Seekers = 57 total");
            System.out.println(">>> Companies: " + allCompanies.size());
            System.out.println(">>> Jobs: " + allJobs.size());
            System.out.println(">>> Applications: " + appCounter);
            System.out.println(">>> Saved Jobs: " + savedCount);
            System.out.println(">>> Notifications: 100");
            System.out.println(">>> All accounts use password: Demo@123");
        };
    }
}
