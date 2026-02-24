import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Assume the user is logged in natively via auth store state, but we need to pass login anyway for tests if not patched
        await page.goto('/login')
        await page.getByPlaceholder('admin').fill('admin')
        await page.getByRole('button', { name: /login|anmelden/i }).click()
        await expect(page).toHaveURL(/\/dashboard/)
    })

    test('should render KPI cards and allow starting a process from Quick Actions', async ({ page }) => {
        // Assert KPI Cards
        await expect(page.getByText('Pending Tasks')).toBeVisible()
        await expect(page.getByText('Active Processes')).toBeVisible()
        await expect(page.getByText('Quick Actions')).toBeVisible()

        // Start a process from Quick Actions
        // Find the "Start Process" button and click it
        const startProcessBtn = page.getByRole('button', { name: 'Start Process' }).first()
        await startProcessBtn.click()

        // Wait for the success toast
        const successToast = page.getByText('Process started successfully').first()
        await expect(successToast).toBeVisible({ timeout: 10000 })
    })
})
