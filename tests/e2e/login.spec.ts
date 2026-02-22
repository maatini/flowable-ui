import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
    test('should redirect to login if not authenticated', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveURL(/\/login/)
    })

    test('should show error on invalid login', async ({ page }) => {
        await page.goto('/login')

        // Fill credentials
        await page.getByPlaceholder('admin').fill('wronguser')
        await page.locator('input[type="password"]').fill('wrongpass')

        // Use a more specific click and wait for response
        const loginButton = page.getByRole('button', { name: /login/i })
        await loginButton.click()

        // The error message comes from auth.ts
        // "Login failed. Please check your credentials."
        await expect(page.locator('div').filter({ hasText: /Login failed/i }).first()).toBeVisible({ timeout: 15000 })
    })
})
