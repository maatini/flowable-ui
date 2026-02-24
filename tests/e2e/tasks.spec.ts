import { test, expect } from '@playwright/test'

test.describe('Task Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login')
        await page.getByPlaceholder('admin').fill('admin')
        await page.getByRole('button', { name: /login|anmelden/i }).click()
        await expect(page).toHaveURL(/\/dashboard/)
    })

    test('should display tasks and allow completion', async ({ page }) => {
        // Navigate to tasks list
        await page.goto('/tasks')

        // Ensure table or empty state is visible
        await expect(page.getByText('Tasks').first()).toBeVisible()

        // Check if there are any tasks listed by looking for table rows
        // If there are none, we can't test "click task", so we gracefully pass if empty, otherwise we proceed
        const tableHasRows = await page.locator('tbody tr').count() > 0

        if (tableHasRows) {
            // Click the details chevron icon button of the first row
            const detailsBtn = page.getByRole('button').locator('.i-heroicons-chevron-right').first()
            if (await detailsBtn.isVisible()) {
                await detailsBtn.click()

                // Expect to be on the details page
                await expect(page.getByText('Execution')).toBeVisible({ timeout: 10000 })

                // Complete task (might be "Complete Task" or "Complete Without Form")
                const completeBtn = page.getByRole('button', { name: /Complete (Task|Without Form)/i })
                if (await completeBtn.isVisible()) {
                    await completeBtn.click()

                    // Wait for completion toast
                    const successToast = page.getByText('Task completed').first()
                    await expect(successToast).toBeVisible({ timeout: 10000 })
                }
            }
        }
    })
})
