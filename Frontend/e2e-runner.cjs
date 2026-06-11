const axios = require('axios');
const fs = require('fs');

const API_KEY = "AIzaSyAbnYSVdl4WZ5rKWXpn-igHZYaoNkjvJDc";
const BASE_URL = "http://localhost:8080/api/v1";

const auditLog = {
    phases: {},
    bugs: [],
    payloads: []
};

function logPayload(endpoint, method, request, response, status) {
    auditLog.payloads.push({ endpoint, method, request, response, status });
}

async function registerFirebaseUser(email, password) {
    const res = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
        email, password, returnSecureToken: true
    });
    return { token: res.data.idToken, uid: res.data.localId };
}

async function loginFirebaseUser(email, password) {
    const res = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        email, password, returnSecureToken: true
    });
    return { token: res.data.idToken, uid: res.data.localId };
}


async function runAudit() {
    try {
        console.log("=== Starting Scripted Integration Audit ===");
        let candidateAuth, recruiterAuth;

        const ts = Date.now();
        const CAND_EMAIL = `cand_e2e_${ts}@test.com`;
        const REC_EMAIL = `rec_e2e_${ts}@test.com`;
        const PASSWORD = "Password123!";

        // PHASE 3: Auth Validation
        console.log("PHASE 3: Authentication");
        try {
            // 1. Sign up via Firebase
            candidateAuth = await registerFirebaseUser(CAND_EMAIL, PASSWORD);
            recruiterAuth = await registerFirebaseUser(REC_EMAIL, PASSWORD);

            // 2. Register through backend to set custom claims
            const tmpCandAxios = axios.create({ baseURL: BASE_URL, headers: { Authorization: `Bearer ${candidateAuth.token}` }, validateStatus: () => true });
            const tmpRecAxios = axios.create({ baseURL: BASE_URL, headers: { Authorization: `Bearer ${recruiterAuth.token}` }, validateStatus: () => true });

            await tmpCandAxios.post('/auth/register', {
                email: CAND_EMAIL, fullName: "E2E Candidate", role: "ROLE_JOB_SEEKER", provider: "EMAIL"
            });
            await tmpRecAxios.post('/auth/register', {
                email: REC_EMAIL, fullName: "E2E Recruiter", role: "ROLE_RECRUITER", provider: "EMAIL"
            });

            // 3. Refresh tokens to pick up custom claims
            await new Promise(r => setTimeout(r, 2000));
            candidateAuth = await loginFirebaseUser(CAND_EMAIL, PASSWORD);
            recruiterAuth = await loginFirebaseUser(REC_EMAIL, PASSWORD);

            auditLog.phases['auth'] = "PASS";
        } catch (e) {
            if(e.response && e.response.data.error.message === "EMAIL_EXISTS"){
                candidateAuth = await loginFirebaseUser(CAND_EMAIL, PASSWORD);
                recruiterAuth = await loginFirebaseUser(REC_EMAIL, PASSWORD);
                auditLog.phases['auth'] = "PASS (Existing Users)";
            } else {
                throw e;
            }
        }
        logPayload("Firebase Auth", "POST", "Credentials", "JWT Tokens Acquired", 200);

        // Sync to backend
        const candAxios = axios.create({ baseURL: BASE_URL, headers: { Authorization: `Bearer ${candidateAuth.token}` }, validateStatus: () => true });
        const recAxios = axios.create({ baseURL: BASE_URL, headers: { Authorization: `Bearer ${recruiterAuth.token}` }, validateStatus: () => true });

        // PHASE 4: End-to-End ATS Validation
        // 1. Recruiter Creates Company
        console.log("PHASE 4: Recruiter Creating Company");
        let compRes;
        try {
            const ts = Date.now();
            compRes = await recAxios.post('/companies', {
                companySlug: `e2e-tech-${ts}`,
                companyInfo: {
                    name: "E2E Tech Corp",
                    about: "Test Company"
                },
                branding: {
                    socialLinks: {
                        website: "https://e2etech.com"
                    }
                }
            });
            logPayload("/companies", "POST", "Company Data", compRes.data, compRes.status);
        } catch (e) {
            logPayload("/companies", "POST", "Company Data", e.response?.data || e.message, e.response?.status);
            auditLog.bugs.push({ phase: "Recruiter Flow", issue: "Failed to create company", sev: "P0 Critical", details: e.response?.data });
        }

        // 2. Recruiter Posts Job
        console.log("PHASE 4: Recruiter Posting Job");
        let jobId;
        try {
            const jobRes = await recAxios.post('/jobs', {
                title: "E2E Senior Developer",
                description: "Must know integration testing.",
                requiredSkills: ["Node.js", "Java", "Testing"],
                experienceLevel: "MID",
                salaryRange: {
                    min: 100000,
                    max: 150000,
                    currency: "USD",
                    isDisclosed: true
                },
                employmentType: "FULL_TIME",
                locationType: "REMOTE",
                location: "Remote",
                status: "ACTIVE"
            });
            jobId = jobRes.data.data.jobId || jobRes.data.data.id;
            logPayload("/jobs", "POST", "Job Data", jobRes.data, jobRes.status);
        } catch (e) {
            logPayload("/jobs", "POST", "Job Data", e.response?.data || e.message, e.response?.status);
            auditLog.bugs.push({ phase: "Recruiter Flow", issue: "Failed to post job", sev: "P0 Critical", details: e.response?.data });
        }

        // 3. Candidate Completes Profile
        console.log("PHASE 4: Candidate Updating Profile");
        try {
            const profRes = await candAxios.put('/seekers/me', {
                headline: "Experienced QA and Developer",
                skills: ["Node.js", "Testing", "Java"],
                experience: [
                    {
                        title: "Senior Developer",
                        company: "ATS Builders Inc",
                        startDate: "2020",
                        endDate: "2024",
                        description: "Built ATS systems",
                        isCurrent: true
                    }
                ],
                education: [
                    {
                        degree: "BS Computer Science",
                        institution: "Tech University",
                        startYear: "2016",
                        endYear: "2020"
                    }
                ]
            });
            logPayload("/seekers/me", "PUT", "Profile Data", profRes.data, profRes.status);
        } catch (e) {
            logPayload("/seekers/me", "PUT", "Profile Data", e.response?.data || e.message, e.response?.status);
            auditLog.bugs.push({ phase: "Candidate Flow", issue: "Profile update failed", sev: "P1 High", details: e.response?.data });
        }

        // 4. Candidate Applies for Job
        console.log("PHASE 4: Candidate Applying for Job");
        let appId;
        try {
            const appRes = await candAxios.post(`/applications/apply/${jobId}`, {
                coverLetter: "I am perfect for this E2E job."
            });
            appId = appRes.data.data.applicationId || appRes.data.data.id;
            logPayload(`/applications/apply/${jobId}`, "POST", {jobId}, appRes.data, appRes.status);
        } catch (e) {
            logPayload(`/applications/apply/${jobId}`, "POST", {jobId}, e.response?.data || e.message, e.response?.status);
            auditLog.bugs.push({ phase: "ATS Flow", issue: "Job application failed", sev: "P0 Critical", details: e.response?.data });
        }

        // 5. Recruiter Moves ATS Status
        console.log("PHASE 4: Recruiter ATS Movement");
        try {
            const statusRes = await recAxios.patch(`/applications/${appId}/status`, {
                status: "SCREENING",
                notes: "Moving to screening via API"
            });
            logPayload(`/applications/${appId}/status`, "PATCH", {status: "SCREENING"}, statusRes.data, statusRes.status);
        } catch (e) {
            logPayload(`/applications/${appId}/status`, "PATCH", {status: "SCREENING"}, e.response?.data || e.message, e.response?.status);
            auditLog.bugs.push({ phase: "ATS Flow", issue: "Status update failed", sev: "P1 High", details: e.response?.data });
        }

        // PHASE 5: AI Resume Ranking
        console.log("PHASE 5: Requesting AI Score (This may take a few seconds)");
        try {
            const aiRes = await recAxios.get(`/ai/rankings/${jobId}/${candidateAuth.uid}`);
            logPayload(`/ai/rankings`, "GET", {jobId, uid: candidateAuth.uid}, aiRes.data, aiRes.status);
        } catch (e) {
            logPayload(`/ai/rankings`, "GET", {jobId}, e.response?.data || e.message, e.response?.status);
            auditLog.bugs.push({ phase: "AI Validation", issue: "AI Ranking Generation Failed", sev: "P1 High", details: e.response?.data });
        }

        // PHASE 6: Notification Validation (Check candidate notifications)
        console.log("PHASE 6: Notification Validation");
        try {
            const notifRes = await candAxios.get('/notifications');
            logPayload(`/notifications`, "GET", "Fetch Unread", notifRes.data, notifRes.status);
        } catch (e) {
            logPayload(`/notifications`, "GET", "Fetch Unread", e.response?.data || e.message, e.response?.status);
            auditLog.bugs.push({ phase: "Notification Validation", issue: "Failed to fetch notifications", sev: "P2 Medium", details: e.response?.data });
        }

        // Negative Testing
        console.log("PHASE 7: Security Negative Testing");
        try {
            await candAxios.delete(`/jobs/${jobId}`); // Candidate trying to delete a job
            auditLog.bugs.push({ phase: "Security", issue: "Candidate was able to delete a job!", sev: "P0 Critical", details: "RBAC Failure" });
        } catch (e) {
            logPayload(`/jobs/${jobId}`, "DELETE (Candidate)", "Attempt Delete", e.response?.data || e.message, e.response?.status);
            if(e.response?.status === 403) {
                // Good!
            } else {
                auditLog.bugs.push({ phase: "Security", issue: "Unexpected status on unauthorized delete", sev: "P2 Medium", details: e.response?.status });
            }
        }

        fs.writeFileSync('audit_results.json', JSON.stringify(auditLog, null, 2));
        console.log("=== Integration Audit Complete. Results saved to audit_results.json ===");

    } catch (error) {
        console.error("FATAL AUDIT CRASH:", error);
    }
}

runAudit();
