# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flow >> Logout
- Location: tests\e2e\auth.spec.js:24:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Logout')
    - locator resolved to <button class="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors">Logout</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action
    - <div class="go2072408551">…</div> from <div data-rht-toaster="">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div role="status" aria-live="polite" class="go3958317564">Successfully logged in</div> from <div data-rht-toaster="">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div role="status" aria-live="polite" class="go3958317564">Successfully logged in</div> from <div data-rht-toaster="">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    54 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div role="status" aria-live="polite" class="go3958317564">Successfully logged in</div> from <div data-rht-toaster="">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - link "JobPortal." [ref=e7] [cursor=pointer]:
        - /url: /
        - img [ref=e9]
        - generic [ref=e11]: JobPortal.
      - generic [ref=e12]:
        - link "Search Jobs" [ref=e13] [cursor=pointer]:
          - /url: /jobs
        - link "My Applications" [ref=e14] [cursor=pointer]:
          - /url: /dashboard/applications
        - link "Interviews" [ref=e15] [cursor=pointer]:
          - /url: /dashboard/interviews
        - generic [ref=e17]:
          - generic [ref=e18]: Playwright
          - button "Logout" [ref=e19]
    - generic [ref=e20]:
      - generic [ref=e21]:
        - heading "Professional Career Overview" [level=1] [ref=e22]
        - paragraph [ref=e23]: Track your progress, improve your profile, and discover your next role.
      - generic [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]: Profile Completion
          - generic [ref=e27]: 82%
        - generic [ref=e28]:
          - generic [ref=e29]: ATS Resume Score
          - generic [ref=e30]: 85%
        - generic [ref=e31]:
          - generic [ref=e32]: Applications
          - generic [ref=e33]: "0"
        - generic [ref=e34]:
          - generic [ref=e35]: Interviews
          - generic [ref=e36]: "0"
        - generic [ref=e37]:
          - generic [ref=e38]: Saved Jobs
          - generic [ref=e39]: "12"
      - generic [ref=e40]:
        - generic [ref=e41]:
          - generic [ref=e42]:
            - heading "Hiring Pipeline" [level=2] [ref=e44]
            - generic [ref=e45]:
              - generic [ref=e46]:
                - generic [ref=e47]: "0"
                - generic [ref=e48]: Applied
              - generic [ref=e50]:
                - generic [ref=e51]: "0"
                - generic [ref=e52]: Under Review
              - generic [ref=e54]:
                - generic [ref=e55]: "0"
                - generic [ref=e56]: Shortlisted
              - generic [ref=e58]:
                - generic [ref=e59]: "0"
                - generic [ref=e60]: Interview
              - generic [ref=e62]:
                - generic [ref=e63]: "0"
                - generic [ref=e64]: Selected
              - generic [ref=e66]:
                - generic [ref=e67]: "0"
                - generic [ref=e68]: Rejected
          - generic [ref=e69]:
            - generic [ref=e70]:
              - heading "Recommended Jobs For You" [level=2] [ref=e71]
              - generic [ref=e72] [cursor=pointer]: View All
            - generic [ref=e73]:
              - img [ref=e74]
              - generic [ref=e76]: No job recommendations yet.
              - generic [ref=e77]: Complete your profile to unlock AI matching.
          - generic [ref=e78]:
            - heading "ATS Resume Analysis" [level=2] [ref=e80]
            - generic [ref=e82]:
              - generic [ref=e83]:
                - generic [ref=e84]: 85%
                - generic [ref=e85]: "Industry Benchmark: 72%"
              - generic [ref=e86]: Top 15% Candidate
              - generic [ref=e87]:
                - generic [ref=e88]:
                  - generic [ref=e89]: Strengths Detected
                  - list [ref=e90]:
                    - listitem [ref=e91]:
                      - generic [ref=e92]: ✓
                      - text: Java / Spring Boot
                    - listitem [ref=e93]:
                      - generic [ref=e94]: ✓
                      - text: React.js
                    - listitem [ref=e95]:
                      - generic [ref=e96]: ✓
                      - text: System Design
                - generic [ref=e97]:
                  - generic [ref=e98]: Missing Keywords
                  - list [ref=e99]:
                    - listitem [ref=e100]:
                      - generic [ref=e101]: "!"
                      - text: Docker / Kubernetes
                    - listitem [ref=e102]:
                      - generic [ref=e103]: "!"
                      - text: AWS / Cloud
        - generic [ref=e104]:
          - generic [ref=e105]:
            - heading "Profile Strength" [level=2] [ref=e107]
            - generic [ref=e108]:
              - generic [ref=e111]: 82%
              - generic [ref=e112]:
                - generic [ref=e113]: Intermediate
                - generic [ref=e114]: Complete your profile to stand out to recruiters.
            - generic [ref=e115]: Missing Items
            - list [ref=e116]:
              - listitem [ref=e117]: Upload Latest Resume
              - listitem [ref=e119]: Add Certifications
            - link "Complete Profile" [ref=e121] [cursor=pointer]:
              - /url: /dashboard/profile/edit
          - generic [ref=e122]:
            - heading "Upcoming Interviews" [level=2] [ref=e124]
            - generic [ref=e125]:
              - generic [ref=e126]: 📅
              - generic [ref=e127]: No upcoming interviews
              - generic [ref=e128]: Browse opportunities and keep applying.
          - generic [ref=e129]:
            - heading "Career Insights" [level=2] [ref=e131]
            - generic [ref=e132]:
              - generic [ref=e133]:
                - generic [ref=e134]: Applications Sent This Week
                - generic [ref=e135]: "3"
              - generic [ref=e136]:
                - generic [ref=e137]: Profile Views
                - generic [ref=e138]: "14"
              - generic [ref=e139]:
                - generic [ref=e140]: Search Appearances
                - generic [ref=e141]: "42"
              - generic [ref=e142]:
                - generic [ref=e143]: Response Rate
                - generic [ref=e144]: 28%
          - generic [ref=e145]:
            - heading "Recent Activity" [level=2] [ref=e147]
            - generic [ref=e148]:
              - generic [ref=e151]:
                - generic [ref=e152]: Saved Full Stack Engineer at Acme
                - generic [ref=e153]: 2 days ago
              - generic [ref=e156]:
                - generic [ref=e157]: Profile completed to 82%
                - generic [ref=e158]: 1 week ago
          - generic [ref=e159]:
            - heading "Notifications" [level=2] [ref=e161]
            - generic [ref=e162]:
              - generic [ref=e163]: Your application for Java Developer was viewed.
              - generic [ref=e164]: 2 hours ago
            - generic [ref=e165]:
              - generic [ref=e166]: 3 new recommended jobs match your profile.
              - generic [ref=e167]: 1 day ago
  - status [ref=e173]: Successfully logged in
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | test.describe.serial('Authentication Flow', () => {
  3  |   const email = `testuser_${Date.now()}@example.com`;
  4  |   const password = 'Password123!';
  5  | 
  6  |   test('Register a new account', async ({ page }) => {
  7  |     await page.goto('/register');
  8  |     
  9  |     await page.fill('label:has-text("Full Name") + input', 'Playwright Test User');
  10 |     await page.fill('label:has-text("Email") + input', email);
  11 |     await page.fill('label:has-text("Password") + input', password);
  12 |     await page.selectOption('label:has-text("I am a...") + select', 'ROLE_JOB_SEEKER');
  13 |     
  14 |     await page.click('button:has-text("Sign Up")');
  15 |     
  16 |     // Check if it redirects to dashboard
  17 |     await expect(page).toHaveURL(/\/dashboard/);
  18 |     
  19 |     // Check if we are successfully logged in by verifying some element or localstorage
  20 |     const token = await page.evaluate(() => localStorage.getItem('token'));
  21 |     expect(token).toBeTruthy();
  22 |   });
  23 | 
  24 |   test('Logout', async ({ page }) => {
  25 |     // Need to login first to logout
  26 |     await page.goto('/login');
  27 |     await page.fill('label:has-text("Email") + input', email);
  28 |     await page.fill('label:has-text("Password") + input', password);
  29 |     await page.click('button:has-text("Sign In")');
  30 |     
  31 |     await expect(page).toHaveURL(/\/dashboard/);
  32 |     
  33 |     // Find logout button
  34 |     // The logout button is usually in the Navbar.
> 35 |     await page.click('text=Logout');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  36 |     
  37 |     // Check if token is cleared and redirected to login or home
  38 |     await expect(page).toHaveURL(/\/login|\//);
  39 |     const token = await page.evaluate(() => localStorage.getItem('token'));
  40 |     expect(token).toBeFalsy();
  41 |   });
  42 | 
  43 |   test('Invalid login', async ({ page }) => {
  44 |     await page.goto('/login');
  45 |     await page.fill('label:has-text("Email") + input', 'wrong@example.com');
  46 |     await page.fill('label:has-text("Password") + input', 'WrongPass!');
  47 |     await page.click('button:has-text("Sign In")');
  48 |     
  49 |     // Should show error toast or message
  50 |     await expect(page.locator('text=Bad credentials').or(page.locator('text=Invalid'))).toBeVisible({ timeout: 5000 }).catch(() => {});
  51 |     await expect(page).toHaveURL(/\/login/);
  52 |   });
  53 |   
  54 |   test('JWT persistence after refresh', async ({ page }) => {
  55 |     // Login
  56 |     await page.goto('/login');
  57 |     await page.fill('label:has-text("Email") + input', email);
  58 |     await page.fill('label:has-text("Password") + input', password);
  59 |     await page.click('button:has-text("Sign In")');
  60 |     await expect(page).toHaveURL(/\/dashboard/);
  61 |     
  62 |     // Refresh page
  63 |     await page.reload();
  64 |     
  65 |     // Should still be on dashboard, not redirected to login
  66 |     await expect(page).toHaveURL(/\/dashboard/);
  67 |   });
  68 | });
  69 | 
```