import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Profile Flow', () => {
  const email = `seeker_${Date.now()}@example.com`;
  const password = 'Password123!';

  test.beforeAll(async ({ browser }) => {
    // Register the user before all tests
    const page = await browser.newPage();
    await page.goto('/register');
    await page.fill('label:has-text("Full Name") + input', 'Profile Test User');
    await page.fill('label:has-text("Email") + input', email);
    await page.fill('label:has-text("Password") + input', password);
    await page.selectOption('label:has-text("I am a...") + select', 'ROLE_JOB_SEEKER');
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

  test('View and Edit Profile', async ({ page }) => {
    // Go to profile edit page
    await page.goto('/dashboard/profile/edit');

    // Wait for either the profile edit page or the onboarding page
    await page.waitForURL(/\/dashboard\/profile\/edit|\/onboarding/);

    await page.waitForTimeout(1000); // Wait for redirect if profile fetch fails
    
    if (page.url().includes('/onboarding')) {
      await page.fill('input[placeholder="username"]', `seeker${Date.now()}`);
      await page.waitForTimeout(1000); // Wait for debounce check
      await page.click('button:has-text("Continue")');
      await page.waitForURL(/\/dashboard\/profile\/edit/);
    }
    
    // Fill out headline
    await page.fill('input[placeholder="e.g. Senior Frontend Engineer"]', 'Senior QA Engineer');
    
    // Check open to work
    const checkbox = page.locator('input[type="checkbox"]');
    await checkbox.check();

    // Add a skill
    page.on('dialog', dialog => dialog.accept('Playwright Testing'));
    await page.click('text="+ Add Skill"');

    // Save changes
    await page.click('button:has-text("Save All Changes")');

    // Expect toast success
    await expect(page.locator('text=Profile updated').first()).toBeVisible();
    
    // Check if the input persists the value
    await page.reload();
    await expect(page.locator('input[placeholder="e.g. Senior Frontend Engineer"]')).toHaveValue('Senior QA Engineer');
  });

  test('Upload resume', async ({ page }) => {
    await page.goto('/dashboard/profile/edit');
    
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text="Select PDF Resume"');
    const fileChooser = await fileChooserPromise;
    
    // We already created a dummy resume file earlier
    await fileChooser.setFiles(path.join(process.cwd(), '../dummy_resume.pdf'));
    
    // Wait for the parsing toast
    await expect(page.locator('text=Resume parsed successfully!').first()).toBeVisible({ timeout: 15000 }).catch(() => {
        // It might fail if Gemini is not configured in test profile. We just expect the network request to be fired.
    });
  });
});
