import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Process Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login')
        await page.getByPlaceholder('admin').fill('admin')
        await page.getByRole('button', { name: /login|anmelden/i }).click()
        await expect(page).toHaveURL(/\/dashboard/)
    })

    test('should upload a BPMN process successfully', async ({ page }) => {
        // Navigate to processes page
        await page.goto('/processes')

        // Ensure we are on the processes page
        await expect(page.getByText('Available Processes')).toBeVisible({ timeout: 10000 })

        // Determine the path to the dummy process file (relative to project root where playwright runs)
        const filePath = path.resolve('resources/processes/simple-process.bpmn20.xml')

        // Playwright can interact with hidden file inputs using setInputFiles
        // We locate the file input by its accept attribute
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'Upload Process' }).click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath)

        // Wait for the success toast message
        const successToast = page.getByText('Process deployed successfully').first()
        await expect(successToast).toBeVisible({ timeout: 10000 })

        // 1. Verify it is shown in the list
        // `simple-process.bpmn20.xml` defines `<process id="simpleProcess" name="Einfacher Prozess" ...`
        const processLink = page.getByRole('link', { name: 'Einfacher Prozess' }).first()
        await expect(processLink).toBeVisible({ timeout: 10000 })

        // 2. Click it and verify it renders in the viewer
        await processLink.click()

        await expect(page).toHaveURL(/\/processes\/.+/)
        await expect(page.getByText('Visual Workflow Representation')).toBeVisible({ timeout: 10000 })

        // Wait for the BPMN canvas to be attached and have SVG nodes (meaning it rendered)
        const canvasSvg = page.locator('.bjs-container svg').first()
        await expect(canvasSvg).toBeVisible({ timeout: 10000 })
    })

    test('should start a process from the list', async ({ page }) => {
        await page.goto('/processes')
        await expect(page.getByText('Available Processes')).toBeVisible({ timeout: 10000 })

        // Check if there are processes in the list
        const tableHasRows = await page.locator('tbody tr').count() > 0
        if (tableHasRows) {
            // Click play button (start process)
            const playBtn = page.locator('tbody tr').first().locator('button', { has: page.locator('.i-heroicons-play') })

            if (await playBtn.isVisible()) {
                await playBtn.click()

                // Wait for the success toast message
                const startToast = page.getByText('Process started').first()
                await expect(startToast).toBeVisible({ timeout: 10000 })
            }
        }
    })

    test('should open process details and render BPMN viewer', async ({ page }) => {
        await page.goto('/processes')
        await expect(page.getByText('Available Processes')).toBeVisible({ timeout: 10000 })

        // Check if there are processes in the list
        const tableHasRows = await page.locator('tbody tr').count() > 0
        if (tableHasRows) {
            // Click view details button (eye icon)
            const viewBtn = page.locator('tbody tr').first().locator('button', { has: page.locator('.i-heroicons-eye') })

            if (await viewBtn.isVisible()) {
                await viewBtn.click()

                // Assert viewer title and container
                await expect(page.getByText('Visual Workflow Representation')).toBeVisible({ timeout: 10000 })
                // Let the diagram render
                await page.waitForTimeout(2000)
            }
        }
    })
})
