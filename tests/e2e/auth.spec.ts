import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
    test('should login successfully with username', async ({ page }) => {
        // Navigate to login page
        await page.goto('/login')

        // Expect the login page title
        await expect(page.locator('h2')).toContainText('Flowable')

        // Fill the username field
        await page.getByPlaceholder('admin').fill('admin')

        // Click the login button
        await page.getByRole('button', { name: /login|anmelden/i }).click()

        // Expect to be redirected to the dashboard
        await expect(page).toHaveURL(/\/dashboard/)

        // Verify dashboard content is visible
        await expect(page.locator('h3').filter({ hasText: 'Recent Tasks' })).toBeVisible({ timeout: 10000 })
    })
})
