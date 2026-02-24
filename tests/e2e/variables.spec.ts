import { test, expect } from '@playwright/test'

test.describe('Variable Handling', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login')
        await page.getByLabel('Username').fill('admin')
        await page.getByLabel('Password').fill('test')
        await page.getByRole('button', { name: 'Login' }).click()
        await expect(page).toHaveURL('/dashboard')
    })

    test('should start process with variables and manage them in instance view', async ({ page }) => {
        // 1. Start process with initial variables
        await page.goto('/processes')

        // Wait for table to be visible
        await page.waitForSelector('table')

        // Target the "Available Processes" card specifically
        const availableCard = page.locator('div').filter({ has: page.locator('h3', { hasText: /Available Processes|Prozesse/i }) })

        // Find row by the link data-testid (key is simpleProcess)
        const processRow = availableCard.locator('tr').filter({ has: page.getByTestId('process-link-simpleProcess') })

        // Click the play button (start-process data-testid)
        await processRow.getByTestId('start-process').click()

        // Modal should be visible
        const modal = page.getByTestId('start-process-modal')
        await expect(modal).toBeVisible()

        // Add a string variable
        await modal.getByRole('button', { name: /Add Variable|Variable hinzufügen/i }).click()

        // New variable fields
        const nameInput = modal.locator('input[placeholder="Name"]')
        const valueInput = modal.locator('input[placeholder="Value"], input[placeholder="Wert"]')

        await nameInput.fill('initVar')
        await valueInput.fill('hello world')

        // Start button in modal footer
        const startBtn = modal.locator('footer button').filter({ hasText: /Start Process|Prozess starten/i })
        await startBtn.click()

        // Wait for success toast or redirection
        await expect(page.getByText(/Process started|Prozess gestartet/i)).toBeVisible()

        // 2. Navigate to the new instance
        const instancesCard = page.locator('div').filter({ has: page.locator('h3', { hasText: /Active Instances|Aktive Instanzen/i }) })
        // Click on the first link (Einfacher Prozess)
        await instancesCard.locator('a', { hasText: /Einfacher Prozess/i }).first().click()
        await expect(page).toHaveURL(/\/instances\/.+/)

        // 3. Verify variable is displayed
        const varsCard = page.getByTestId('variables-card')
        await expect(varsCard.getByText('initVar')).toBeVisible()
        await expect(varsCard.getByText('hello world')).toBeVisible()

        // 4. Edit the variable
        const varRow = varsCard.locator('tr').filter({ hasText: 'initVar' })
        await varRow.locator('button').filter({ has: page.locator('.i-heroicons-pencil') }).click()

        // Target the input in the row
        const editInput = varRow.locator('input')
        await editInput.clear()
        await editInput.fill('updated value')
        await varRow.locator('button').filter({ has: page.locator('.i-heroicons-check') }).click()

        // Verify update
        await expect(varsCard.getByText('updated value')).toBeVisible()

        // 5. Add a new variable (Integer)
        await varsCard.getByRole('button', { name: /Add Variable|Variable hinzufügen/i }).first().click()

        // The modal for adding a single variable is in InstanceVariablesCard. it doesn't have a testid yet but it's the only modal now.
        const addVarModal = page.locator('div[role="dialog"]')
        await addVarModal.getByLabel(/Name/i).fill('newIntVar')
        await addVarModal.getByLabel(/Type|Typ/i).selectOption('integer')
        await addVarModal.getByLabel(/Value|Wert/i).fill('42')
        await addVarModal.locator('footer button').filter({ hasText: /Submit|Speichern|Speichern|Hinzufügen/i }).click()

        await expect(varsCard.getByText('newIntVar')).toBeVisible()
        await expect(varsCard.getByText('42')).toBeVisible()

        // 6. Delete a variable
        const deleteRow = varsCard.locator('tr').filter({ hasText: 'initVar' })
        await deleteRow.locator('button').filter({ has: page.locator('.i-heroicons-trash') }).click()

        // Verify deletion
        await expect(varsCard.getByText('initVar')).not.toBeVisible()
    })
})
