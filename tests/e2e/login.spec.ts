import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
    test('should redirect to login if not authenticated', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveURL(/\/login/)
    })

    test('should show error on invalid login', async ({ page }) => {
        await page.goto('/login')

        // Wait for the form to be visible
        await page.waitForSelector('input', { state: 'visible' })

        // Use more robust selectors
        await page.getByPlaceholder('admin').fill('wronguser')
        await page.locator('input[type="password"]').fill('wrongpass')
        await page.getByRole('button', { name: /login/i }).click()

        // Check for error message text instead of specific class
        // authStore.error is set on login failure
        await expect(page.getByText(/Invalid credentials|Login failed/i)).toBeVisible({ timeout: 15000 })
    })
})
