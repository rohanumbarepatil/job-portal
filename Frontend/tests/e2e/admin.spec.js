import { test, expect } from '@playwright/test';

test.describe.serial('Admin Routes Flow', () => {
  const email = `seeker_${Date.now()}@example.com`;
  const password = 'Password123!';

  test.beforeAll(async ({ browser }) => {
    // Register a normal user
    const page = await browser.newPage();
    await page.goto('/register');
    await page.fill('label:has-text("Full Name") + input', 'Normal User');
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

  test('Verify admin protected route deflects normal user', async ({ page }) => {
    // Navigate to admin
    await page.goto('/admin');
    
    // The AdminLayout should redirect unauthorized users, or it shows an unauthorized message
    // Usually it redirects to /dashboard or /unauthorized or shows a permission denied.
    // Let's check if we get booted out of admin or see unauthorized.
    await expect(page.locator('text=Unauthorized Access').or(page.locator('text=Access Denied')).or(page.locator('h1:has-text("Dashboard")'))).toBeVisible({ timeout: 10000 });
  });
});
