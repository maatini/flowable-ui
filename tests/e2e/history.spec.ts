import { test, expect } from '@playwright/test'

test.describe('History', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login')
        await page.getByPlaceholder('admin').fill('admin')
        await page.getByRole('button', { name: /login|anmelden/i }).click()
        await expect(page).toHaveURL(/\/dashboard/)
    })

    test('should display historic tasks and process instances', async ({ page }) => {
        // Navigate to history view
        await page.goto('/history')

        // Assert headers
        await expect(page.getByText('Completed Tasks')).toBeVisible()
        await expect(page.getByText('Finished Process Instances')).toBeVisible()

        // Implicitly it should not throw errors and show the tables (even if empty)
        await expect(page.locator('table').first()).toBeVisible()
    })
})
