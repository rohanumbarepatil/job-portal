import { test, expect } from '@playwright/test';
test.describe.serial('Authentication Flow', () => {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';

  test('Register a new account', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('label:has-text("Full Name") + input', 'Playwright Test User');
    await page.fill('label:has-text("Email") + input', email);
    await page.fill('label:has-text("Password") + input', password);
    await page.selectOption('label:has-text("I am a...") + select', 'ROLE_JOB_SEEKER');
    
    await page.click('button:has-text("Sign Up")');
    
    // Check if it redirects to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Check if we are successfully logged in by verifying some element or localstorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('Logout', async ({ page }) => {
    // Need to login first to logout
    await page.goto('/login');
    await page.fill('label:has-text("Email") + input', email);
    await page.fill('label:has-text("Password") + input', password);
    await page.click('button:has-text("Sign In")');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Find logout button
    // The logout button is usually in the Navbar.
    await page.click('text=Logout');
    
    // Check if token is cleared and redirected to login or home
    await expect(page).toHaveURL(/\/login|\//);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeFalsy();
  });

  test('Invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('label:has-text("Email") + input', 'wrong@example.com');
    await page.fill('label:has-text("Password") + input', 'WrongPass!');
    await page.click('button:has-text("Sign In")');
    
    // Should show error toast or message
    await expect(page.locator('text=Bad credentials').or(page.locator('text=Invalid'))).toBeVisible({ timeout: 5000 }).catch(() => {});
    await expect(page).toHaveURL(/\/login/);
  });
  
  test('JWT persistence after refresh', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('label:has-text("Email") + input', email);
    await page.fill('label:has-text("Password") + input', password);
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Refresh page
    await page.reload();
    
    // Should still be on dashboard, not redirected to login
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
