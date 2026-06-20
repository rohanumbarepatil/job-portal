import { test, expect } from '@playwright/test';

test.describe.serial('Recruiter Flow', () => {
  const email = `recruiter_${Date.now()}@example.com`;
  const password = 'Password123!';
  const companySlug = `comp_${Date.now()}`;

  test.beforeAll(async ({ browser }) => {
    // Register the user
    const page = await browser.newPage();
    await page.goto('/register');
    await page.fill('label:has-text("Full Name") + input', 'Recruiter Test User');
    await page.fill('label:has-text("Email") + input', email);
    await page.fill('label:has-text("Password") + input', password);
    await page.selectOption('label:has-text("I am a...") + select', 'ROLE_RECRUITER');
    await page.click('button:has-text("Sign Up")');
    await expect(page).toHaveURL(/\/dashboard/);
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('label:has-text("Email") + input', email);
    await page.fill('label:has-text("Password") + input', password);
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Create Company Profile', async ({ page }) => {
    // Go to company profile page
    await page.goto('/dashboard/company/edit');
    
    // It should prompt to create a company if not exists
    await expect(page.locator('text=No Company Profile Found')).toBeVisible();
    
    // Intercept prompt and click the create button
    page.on('dialog', dialog => dialog.accept(companySlug));
    await page.click('button:has-text("Create Employer Profile")');
    
    // Verify it was created
    await expect(page.locator('text=Employer Branding Editor')).toBeVisible({ timeout: 10000 });
    
    // Fill basic info
    await page.fill('input[placeholder="Company Name"]', 'Playwright Inc');
    await page.fill('input[placeholder="Industry"]', 'Software');
    await page.click('button:has-text("Save Info")');
    
    await expect(page.locator('text=Saved successfully').first()).toBeVisible();
  });

  test('Create Job Posting', async ({ page }) => {
    await page.goto('/dashboard/jobs/new');
    
    await expect(page.locator('text=Post a New Job')).toBeVisible();
    
    await page.fill('input[placeholder="e.g. Senior Java Developer"]', 'Playwright Tester');
    await page.fill('textarea[placeholder="Describe the role..."]', 'This is a test job description.');
    await page.fill('input[placeholder="e.g. Java, Spring Boot, React"]', 'Playwright, QA');
    
    await page.click('button:has-text("Save Job")');
    
    await expect(page.locator('text=Job posted successfully!').first()).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/jobs/);
  });
});
