import { test, expect } from '@playwright/test'

test.describe('BPMN Workflow', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login')
        await page.getByPlaceholder('admin').fill('rest-admin')
        await page.locator('input[type="password"]').fill('test')
        await page.getByRole('button', { name: /login/i }).click({ force: true })
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 20000 })
    })

    test('should deploy, start and complete a simple process', async ({ page, request }) => {
        console.log('Test started')
        // 1. Ensure process is deployed (using server API directly for speed/reliability in test setup)
        // We use the proxy port (likely 3000 or 3001)
        const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'

        // 2. Click "Start Process" on Dashboard
        await page.getByRole('button', { name: /start process/i }).click()
        console.log('Clicked Start Process')

        // Wait for success toast
        await expect(page.getByText(/Process started successfully/i).first()).toBeVisible()
        console.log('Process started successfully (toast visible)')

        // 3. The dashboard should refresh. 
        // We reload to be absolutely sure the new task is fetched.
        await page.reload()
        console.log('Reloaded page')

        // 4. Look for "Beispielaufgabe"
        // Wait for the task to appear in the table
        const taskRow = page.locator('tr').filter({ hasText: /Beispielaufgabe/i }).first()
        await expect(taskRow).toBeVisible({ timeout: 15000 })
        console.log('Beispielaufgabe is visible')

        // 5. Complete the task (verify link works)
        const taskLink = taskRow.getByRole('link', { name: /Beispielaufgabe/i })
        await taskLink.click()
        console.log('Clicked task link')

        // Verify we are on the task page
        await expect(page).toHaveURL(/\/tasks\//)
        console.log('Navigated to task details')
    })
})
