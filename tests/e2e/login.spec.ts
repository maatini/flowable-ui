import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
    test('should redirect to login if not authenticated', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveURL(/\/login/)
    })

    test('should show error on invalid login', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[name="username"]', 'wronguser')
        await page.fill('input[type="password"]', 'wrongpass')
        await page.click('button[type="submit"]')

        await expect(page.locator('.u-alert')).toBeVisible()
        await expect(page.locator('.u-alert')).toContainText('Login failed')
    })
})
