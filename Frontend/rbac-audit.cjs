const axios = require('axios');
const fs = require('fs');

const API_KEY = "AIzaSyAbnYSVdl4WZ5rKWXpn-igHZYaoNkjvJDc";
const BASE_URL = "http://localhost:8080/api/v1";
const AUTH_URL_SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
const AUTH_URL_LOGIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

const ts = Date.now();
const CAND_EMAIL = `rbac_cand_${ts}@test.com`;
const REC_EMAIL = `rbac_rec_${ts}@test.com`;
const PASSWORD = "RbacTest123!";

const results = { summary: {}, matrix: [], escalation_attacks: [], bugs: [] };

async function signUp(email, password) {
    const res = await axios.post(AUTH_URL_SIGNUP, { email, password, returnSecureToken: true });
    return { token: res.data.idToken, uid: res.data.localId };
}

async function signIn(email, password) {
    const res = await axios.post(AUTH_URL_LOGIN, { email, password, returnSecureToken: true });
    return { token: res.data.idToken, uid: res.data.localId };
}

function makeAxios(token) {
    return axios.create({
        baseURL: BASE_URL,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        validateStatus: () => true,
        timeout: 10000
    });
}

async function testEndpoint(label, role, axiosInst, method, url, data) {
    try {
        let res;
        if (method === 'GET') res = await axiosInst.get(url);
        else if (method === 'POST') res = await axiosInst.post(url, data || {});
        else if (method === 'PUT') res = await axiosInst.put(url, data || {});
        else if (method === 'PATCH') res = await axiosInst.patch(url, data || {});
        else if (method === 'DELETE') res = await axiosInst.delete(url, { data: data });
        return { endpoint: url, method, role, label, status: res.status, message: res.data?.message || '', success: res.data?.success || false };
    } catch (e) {
        return { endpoint: url, method, role, label, status: e.response?.status || 'ERR', message: e.response?.data?.message || e.message, success: false };
    }
}

(async () => {
    console.log("=== RBAC Security Audit ===\n");

    // ——— Phase 1: Create users with proper roles via backend registration ———
    console.log("PHASE 1: Creating test users with proper Firebase custom claims...");

    // 1a. Sign up via Firebase
    const candFirebase = await signUp(CAND_EMAIL, PASSWORD);
    const recFirebase = await signUp(REC_EMAIL, PASSWORD);
    console.log(`  Firebase SignUp: Candidate(${candFirebase.uid}), Recruiter(${recFirebase.uid})`);

    // 1b. Register through backend to set custom claims
    const tmpCandAxios = makeAxios(candFirebase.token);
    const tmpRecAxios = makeAxios(recFirebase.token);

    const candRegRes = await tmpCandAxios.post('/auth/register', {
        email: CAND_EMAIL,
        fullName: "RBAC Candidate",
        role: "ROLE_JOB_SEEKER",
        provider: "EMAIL"
    });
    console.log(`  Backend register Candidate: ${candRegRes.status} - ${candRegRes.data?.message}`);

    const recRegRes = await tmpRecAxios.post('/auth/register', {
        email: REC_EMAIL,
        fullName: "RBAC Recruiter",
        role: "ROLE_RECRUITER",
        provider: "EMAIL"
    });
    console.log(`  Backend register Recruiter: ${recRegRes.status} - ${recRegRes.data?.message}`);
    // Note: recruiter gets ROLE_PENDING_RECRUITER from AuthService. Check what claim is actually set.
    const recAssignedRole = recRegRes.data?.data?.role;
    console.log(`  Recruiter assigned role: ${recAssignedRole}`);

    // 1c. Re-login to get fresh tokens with updated custom claims
    // Firebase custom claims need a token refresh to take effect.
    // We wait a moment then re-sign-in.
    await new Promise(r => setTimeout(r, 2000));

    const candAuth = await signIn(CAND_EMAIL, PASSWORD);
    const recAuth = await signIn(REC_EMAIL, PASSWORD);
    console.log(`  Re-login complete. Fresh tokens acquired.\n`);

    const candAxios = makeAxios(candAuth.token);
    const recAxios = makeAxios(recAuth.token);
    const noAuthAxios = makeAxios(null);

    // ——— Phase 2: Verify token roles by calling /auth/me ———
    console.log("PHASE 2: Verifying token roles...");
    const candMe = await candAxios.get('/auth/me');
    const recMe = await recAxios.get('/auth/me');
    console.log(`  Candidate /auth/me: ${candMe.status} role=${candMe.data?.data?.role}`);
    console.log(`  Recruiter /auth/me: ${recMe.status} role=${recMe.data?.data?.role}`);

    const candRole = candMe.data?.data?.role;
    const recRole = recMe.data?.data?.role;

    // Determine expected behavior based on actual roles
    // If recruiter got ROLE_PENDING_RECRUITER, they won't have ROLE_RECRUITER authority
    const recIsRecruiter = recRole === 'ROLE_RECRUITER';
    const recIsPending = recRole === 'ROLE_PENDING_RECRUITER';

    if (recIsPending) {
        console.log(`\n  ⚠️  IMPORTANT: Recruiter was assigned ROLE_PENDING_RECRUITER (requires admin approval).`);
        console.log(`  RBAC tests will use this role. Recruiter-only endpoints SHOULD return 403.\n`);
    }

    // ——— Phase 3: Full Permission Matrix ———
    console.log("PHASE 3: Generating Permission Matrix...\n");

    // Expected status codes:
    // For recruiter endpoints: if recIsPending, recruiter should get 403 (correct behavior!)
    // 403 = RBAC blocked, 400 = business logic error (passed RBAC), 200 = success
    const recExpectForRecOnly = recIsPending ? 403 : [200, 400]; // 400 is acceptable (business error after passing RBAC)

    const TESTS = [
        // --- JOB CONTROLLER ---
        { label: "Create Job", method: "POST", url: "/jobs", data: { title: "RBAC Test", description: "test", status: "ACTIVE" },
          expectCand: 403, expectRec: recIsPending ? 403 : 200, expectNoAuth: [401, 403] },
        { label: "Delete Job", method: "DELETE", url: "/jobs/nonexistent-id",
          expectCand: 403, expectRec: recIsPending ? 403 : [400], expectNoAuth: [401, 403] },
        { label: "Search Jobs (public GET)", method: "GET", url: "/jobs",
          expectCand: 200, expectRec: 200, expectNoAuth: 200 },
        { label: "Job Details (public GET)", method: "GET", url: "/jobs/details/nonexistent",
          expectCand: [200, 400], expectRec: [200, 400], expectNoAuth: [200, 400] },

        // --- COMPANY CONTROLLER ---
        { label: "Create Company", method: "POST", url: "/companies", data: { companySlug: `rbac-${ts}`, companyInfo: { name: "RBAC Co" }, branding: { socialLinks: {} } },
          expectCand: 403, expectRec: recIsPending ? 403 : 200, expectNoAuth: [401, 403] },
        { label: "Get My Companies", method: "GET", url: "/companies/me",
          expectCand: 403, expectRec: recIsPending ? 403 : 200, expectNoAuth: [200, 401, 403] },
        { label: "Update Company", method: "PUT", url: "/companies/fake-id", data: {},
          expectCand: 403, expectRec: recIsPending ? 403 : [400], expectNoAuth: [401, 403] },

        // --- APPLICATION CONTROLLER ---
        { label: "Apply for Job (Cand only)", method: "POST", url: "/applications/apply/fake-job-id", data: { coverLetter: "test" },
          expectCand: [400], expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Get My Applications (Cand)", method: "GET", url: "/applications/me",
          expectCand: [200, 400], expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Get Job Applications (Rec)", method: "GET", url: "/applications/job/fake-job-id",
          expectCand: 403, expectRec: recIsPending ? 403 : [200, 400], expectNoAuth: [401, 403] },
        { label: "Update App Status (Rec)", method: "PATCH", url: "/applications/fake-id/status", data: { status: "SCREENING" },
          expectCand: 403, expectRec: recIsPending ? 403 : [400], expectNoAuth: [401, 403] },

        // --- INTERVIEW CONTROLLER ---
        { label: "Schedule Interview (Rec)", method: "POST", url: "/interviews", data: { applicationId: "fake" },
          expectCand: 403, expectRec: recIsPending ? 403 : [400], expectNoAuth: [401, 403] },
        { label: "Get Company Interviews (Rec)", method: "GET", url: "/interviews/company",
          expectCand: 403, expectRec: recIsPending ? 403 : [200], expectNoAuth: [401, 403] },
        { label: "Get My Interviews (any auth)", method: "GET", url: "/interviews/me",
          expectCand: [200, 400], expectRec: [200, 400], expectNoAuth: [401, 403] },
        { label: "Interview Analytics (Rec)", method: "GET", url: "/interviews/analytics",
          expectCand: 403, expectRec: recIsPending ? 403 : [200], expectNoAuth: [401, 403] },

        // --- JOB SEEKER CONTROLLER ---
        { label: "Get Seeker Profile (Cand)", method: "GET", url: "/seekers/me",
          expectCand: [200, 400], expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Update Seeker Profile (Cand)", method: "PUT", url: "/seekers/me", data: { headline: "test" },
          expectCand: [200, 400], expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Resume Parse (Cand)", method: "POST", url: "/seekers/resume/parse",
          expectCand: [200, 400], expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Public Profile (permitAll)", method: "GET", url: "/seekers/public/testuser",
          expectCand: [200, 400], expectRec: [200, 400], expectNoAuth: [200, 400] },

        // --- AI CONTROLLER ---
        { label: "AI Recommended Jobs (Cand)", method: "GET", url: "/ai/recommendations/jobs",
          expectCand: [200, 400], expectRec: 403, expectNoAuth: [401, 403] },
        { label: "AI Recommended Candidates (Rec)", method: "GET", url: "/ai/recommendations/candidates/fake-id",
          expectCand: 403, expectRec: recIsPending ? 403 : [400], expectNoAuth: [401, 403] },
        { label: "AI Analytics (Rec)", method: "GET", url: "/ai/analytics",
          expectCand: 403, expectRec: recIsPending ? 403 : [200, 400], expectNoAuth: [401, 403] },

        // --- NOTIFICATION CONTROLLER (any authenticated) ---
        { label: "Get Notifications", method: "GET", url: "/notifications",
          expectCand: [200, 400], expectRec: [200, 400], expectNoAuth: [401, 403] },

        // --- ADMIN CONTROLLER ---
        { label: "Admin KPIs", method: "GET", url: "/admin/analytics/kpis",
          expectCand: 403, expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Admin Charts", method: "GET", url: "/admin/analytics/charts",
          expectCand: 403, expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Admin Verifications", method: "GET", url: "/admin/verifications",
          expectCand: 403, expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Admin Logs", method: "GET", url: "/admin/logs",
          expectCand: 403, expectRec: 403, expectNoAuth: [401, 403] },
        { label: "Admin Suspend User", method: "PATCH", url: "/admin/users/fake-uid/suspend", data: { reason: "test" },
          expectCand: 403, expectRec: 403, expectNoAuth: [401, 403] },
    ];

    function statusMatches(actual, expected) {
        if (Array.isArray(expected)) return expected.includes(actual);
        return actual === expected;
    }

    let passCount = 0, failCount = 0;

    for (const test of TESTS) {
        const candResult = await testEndpoint(test.label, "CANDIDATE", candAxios, test.method, test.url, test.data);
        const recResult = await testEndpoint(test.label, "RECRUITER", recAxios, test.method, test.url, test.data);
        const noAuthResult = await testEndpoint(test.label, "NO_AUTH", noAuthAxios, test.method, test.url, test.data);

        const candPass = statusMatches(candResult.status, test.expectCand);
        const recPass = statusMatches(recResult.status, test.expectRec);
        const noAuthPass = statusMatches(noAuthResult.status, test.expectNoAuth);

        const row = {
            label: test.label,
            endpoint: `${test.method} ${test.url}`,
            candidate: { status: candResult.status, expected: test.expectCand, pass: candPass },
            recruiter: { status: recResult.status, expected: test.expectRec, pass: recPass },
            noAuth: { status: noAuthResult.status, expected: test.expectNoAuth, pass: noAuthPass }
        };
        results.matrix.push(row);

        if (candPass && recPass && noAuthPass) {
            passCount++;
            console.log(`  ✅ ${test.label} | C:${candResult.status} R:${recResult.status} N:${noAuthResult.status}`);
        } else {
            failCount++;
            console.log(`  ❌ ${test.label} | C:${candResult.status} R:${recResult.status} N:${noAuthResult.status}`);
            if (!candPass) console.log(`     CAND: got ${candResult.status}, expected ${test.expectCand} — ${candResult.message}`);
            if (!recPass) console.log(`     REC: got ${recResult.status}, expected ${test.expectRec} — ${recResult.message}`);
            if (!noAuthPass) console.log(`     NOAUTH: got ${noAuthResult.status}, expected ${test.expectNoAuth}`);
            results.bugs.push({ label: test.label, endpoint: `${test.method} ${test.url}`,
                candidate: { actual: candResult.status, expected: test.expectCand, msg: candResult.message },
                recruiter: { actual: recResult.status, expected: test.expectRec, msg: recResult.message },
                noAuth: { actual: noAuthResult.status, expected: test.expectNoAuth } });
        }
    }

    // ——— Phase 4: Privilege Escalation Attacks ———
    console.log("\nPHASE 4: Privilege Escalation Attacks...\n");

    const ESCALATION = [
        { label: "Candidate → Delete Job", method: "DELETE", url: "/jobs/fake-id", actor: "CANDIDATE", ax: candAxios },
        { label: "Candidate → Create Job", method: "POST", url: "/jobs", actor: "CANDIDATE", ax: candAxios, data: { title: "Hacked" } },
        { label: "Candidate → Create Company", method: "POST", url: "/companies", actor: "CANDIDATE", ax: candAxios, data: { companySlug: "hacked" } },
        { label: "Candidate → Update ATS Status", method: "PATCH", url: "/applications/x/status", actor: "CANDIDATE", ax: candAxios, data: { status: "SELECTED" } },
        { label: "Candidate → Schedule Interview", method: "POST", url: "/interviews", actor: "CANDIDATE", ax: candAxios, data: {} },
        { label: "Candidate → Admin KPIs", method: "GET", url: "/admin/analytics/kpis", actor: "CANDIDATE", ax: candAxios },
        { label: "Candidate → Admin Suspend", method: "PATCH", url: "/admin/users/x/suspend", actor: "CANDIDATE", ax: candAxios, data: { reason: "hack" } },
        { label: "Candidate → AI Candidate Recs", method: "GET", url: "/ai/recommendations/candidates/x", actor: "CANDIDATE", ax: candAxios },
        { label: "Recruiter → Admin KPIs", method: "GET", url: "/admin/analytics/kpis", actor: "RECRUITER", ax: recAxios },
        { label: "Recruiter → Admin Suspend", method: "PATCH", url: "/admin/users/x/suspend", actor: "RECRUITER", ax: recAxios, data: { reason: "hack" } },
        { label: "Recruiter → Seeker Profile", method: "GET", url: "/seekers/me", actor: "RECRUITER", ax: recAxios },
        { label: "Recruiter → Apply for Job", method: "POST", url: "/applications/apply/x", actor: "RECRUITER", ax: recAxios, data: {} },
        { label: "Recruiter → AI Job Recs (cand only)", method: "GET", url: "/ai/recommendations/jobs", actor: "RECRUITER", ax: recAxios },
        { label: "NoAuth → Create Job", method: "POST", url: "/jobs", actor: "NO_AUTH", ax: noAuthAxios, data: {} },
        { label: "NoAuth → Admin KPIs", method: "GET", url: "/admin/analytics/kpis", actor: "NO_AUTH", ax: noAuthAxios },
        { label: "NoAuth → Seeker Profile", method: "GET", url: "/seekers/me", actor: "NO_AUTH", ax: noAuthAxios },
    ];

    for (const test of ESCALATION) {
        const result = await testEndpoint(test.label, test.actor, test.ax, test.method, test.url, test.data);
        const blocked = result.status === 403 || result.status === 401;
        results.escalation_attacks.push({
            label: test.label, actor: test.actor, endpoint: `${test.method} ${test.url}`,
            actualStatus: result.status, blocked, message: result.message
        });

        if (blocked) {
            passCount++;
            console.log(`  🛡️  BLOCKED: ${test.label} → ${result.status}`);
        } else {
            failCount++;
            console.log(`  🚨 BREACH: ${test.label} → ${result.status} "${result.message}"`);
            results.bugs.push({ severity: "P0_CRITICAL_BREACH", label: test.label,
                endpoint: `${test.method} ${test.url}`, actor: test.actor,
                actualStatus: result.status, message: result.message });
        }
    }

    // ——— Summary ———
    const total = passCount + failCount;
    const securityScore = Math.round((passCount / total) * 100);
    const breaches = results.bugs.filter(b => b.severity === "P0_CRITICAL_BREACH");

    results.summary = {
        totalTests: total,
        passed: passCount,
        failed: failCount,
        securityScore: `${securityScore}%`,
        breachCount: breaches.length,
        totalBugs: results.bugs.length,
        candidateRole: candRole,
        recruiterRole: recRole,
        productionReady: breaches.length === 0 && securityScore >= 85
    };

    console.log(`\n${'='.repeat(50)}`);
    console.log(`RBAC Audit Complete`);
    console.log(`${'='.repeat(50)}`);
    console.log(`Candidate Role: ${candRole}`);
    console.log(`Recruiter Role: ${recRole}`);
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Security Score: ${securityScore}%`);
    console.log(`P0 Breaches: ${breaches.length}`);
    console.log(`Production Ready: ${results.summary.productionReady}`);

    fs.writeFileSync('rbac_audit_results.json', JSON.stringify(results, null, 2));
    console.log(`\nResults saved to rbac_audit_results.json`);
})();
