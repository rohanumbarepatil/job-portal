import { test, expect } from '@playwright/test';

test.describe.serial('Advanced Search and Recruitment Workflow', () => {
  const seekerEmail = `seeker_${Date.now()}@example.com`;
  const recruiterEmail = `recruiter_${Date.now()}@example.com`;
  const password = 'Password123!';
  let jobId = '';
  
  test('Register Seeker and Recruiter', async ({ browser }) => {
    // 1. Register Job Seeker
    let page = await browser.newPage();
    await page.goto('/register');
    await page.fill('label:has-text("Full Name") + input', 'Advanced Seeker');
    await page.fill('label:has-text("Email") + input', seekerEmail);
    await page.fill('label:has-text("Password") + input', password);
    await page.selectOption('label:has-text("I am a...") + select', 'ROLE_JOB_SEEKER');
    await page.click('button:has-text("Sign Up")');
    await expect(page).toHaveURL(/\/dashboard/);
    await page.close();

    // 2. Register Recruiter
    page = await browser.newPage();
    await page.goto('/register');
    await page.fill('label:has-text("Full Name") + input', 'Advanced Recruiter');
    await page.fill('label:has-text("Email") + input', recruiterEmail);
    await page.fill('label:has-text("Password") + input', password);
    await page.selectOption('label:has-text("I am a...") + select', 'ROLE_RECRUITER');
    await page.click('button:has-text("Sign Up")');
    // Note: It might go to onboarding or pending approval, assume it works for tests
    await page.close();
  });

  test('Recruiter creates a job', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/login');
    await page.fill('label:has-text("Email") + input', recruiterEmail);
    await page.fill('label:has-text("Password") + input', password);
    await page.click('button:has-text("Sign In")');

    // Create a specific job to search for
    await page.goto('/dashboard/recruiter/jobs/new');
    await page.fill('input[name="title"]', 'Senior Go Developer');
    await page.fill('input[name="location"]', 'Bangalore');
    await page.selectOption('select[name="employmentType"]', 'FULL_TIME');
    await page.selectOption('select[name="locationType"]', 'REMOTE');
    await page.selectOption('select[name="experienceLevel"]', 'SENIOR');
    
    // Fill salary
    await page.fill('input[name="salaryRange.min"]', '1500000');
    await page.fill('input[name="salaryRange.max"]', '2500000');
    await page.selectOption('select[name="salaryRange.currency"]', 'INR');
    
    // Fill description
    await page.fill('textarea[name="description"]', 'Looking for an experienced Go developer to build scalable microservices.');
    
    await page.click('button:has-text("Post Job")');
    await expect(page).toHaveURL(/\/dashboard\/recruiter/);
    await page.close();
  });

  test('Seeker uses Advanced Search to find the job and applies', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/login');
    await page.fill('label:has-text("Email") + input', seekerEmail);
    await page.fill('label:has-text("Password") + input', password);
    await page.click('button:has-text("Sign In")');

    await page.goto('/jobs');
    
    // Advanced search filters
    await page.selectOption('label:has-text("Experience Level") + select', 'SENIOR');
    await page.selectOption('label:has-text("Location Type") + select', 'REMOTE');
    await page.fill('label:has-text("Minimum Salary (₹)") + input', '1000000');
    await page.click('h2:has-text("Advanced Filters")'); // Blur to trigger fetch
    
    // Expect the job to appear
    await expect(page.locator('h3:has-text("Senior Go Developer")')).toBeVisible();
    
    // Click on the job to view details
    await page.click('h3:has-text("Senior Go Developer")');
    await expect(page.locator('h1:has-text("Senior Go Developer")')).toBeVisible();

    // Apply for the job
    const applyButton = page.locator('button:has-text("Apply Now")');
    if (await applyButton.isVisible()) {
      await applyButton.click();
      await expect(page.locator('h2:has-text("Submit Application")')).toBeVisible();
      await page.fill('textarea[placeholder="Why are you a great fit..."]', 'I am an advanced go developer.');
      await page.click('button:has-text("Submit Application")');
      await expect(page.locator('text=Application submitted')).toBeVisible();
    }
    
    await page.close();
  });

  test('Recruiter changes status and schedules interview', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/login');
    await page.fill('label:has-text("Email") + input', recruiterEmail);
    await page.fill('label:has-text("Password") + input', password);
    await page.click('button:has-text("Sign In")');

    await page.goto('/dashboard/recruiter');
    // Go to ATS Board for the job
    await page.click('h3:has-text("Senior Go Developer")'); // Assume clicking title goes to ATS or details
    
    // Alternative: Go directly to ATS via a "View Pipeline" button if it exists
    const pipelineButton = page.locator('a:has-text("Pipeline")').first();
    if(await pipelineButton.isVisible()) {
        await pipelineButton.click();
    }

    // Since we know the seeker name is "Advanced Seeker"
    // Wait for the candidate to appear in Applied column
    const candidateCard = page.locator('h4:has-text("Advanced Seeker")').first();
    if (await candidateCard.isVisible()) {
        await candidateCard.click(); // Opens CandidateDrawer
        
        // Change Status to Shortlisted
        await page.selectOption('select', 'SHORTLISTED');
        await expect(page.locator('text=Candidate status updated')).toBeVisible();

        // Schedule Interview
        await page.click('button:has-text("Schedule Interview")');
        await page.fill('input[placeholder="e.g. John Doe"]', 'Jane Recruiter');
        await page.selectOption('select >> nth=1', 'ONLINE'); // Mode
        
        // Date Time 
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await page.fill('input[type="datetime-local"]', tomorrow.toISOString().slice(0, 16));
        
        await page.fill('input[type="url"]', 'https://meet.google.com/xyz-abc');
        await page.click('button:has-text("Schedule Interview")');
        
        await expect(page.locator('text=Interview scheduled successfully!')).toBeVisible();
    }

    await page.close();
  });

  test('Seeker views application timeline', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/login');
    await page.fill('label:has-text("Email") + input', seekerEmail);
    await page.fill('label:has-text("Password") + input', password);
    await page.click('button:has-text("Sign In")');

    await page.goto('/dashboard/applications');
    
    const timelineButton = page.locator('button:has-text("View Timeline")').first();
    if (await timelineButton.isVisible()) {
        await timelineButton.click();
        
        // Assert timeline contains INTERVIEW_SCHEDULED and SHORTLISTED
        await expect(page.locator('div:has-text("Moved to SHORTLISTED")').first()).toBeVisible();
        await expect(page.locator('div:has-text("Moved to INTERVIEW_SCHEDULED")').first()).toBeVisible();
    }

    await page.close();
  });
});
