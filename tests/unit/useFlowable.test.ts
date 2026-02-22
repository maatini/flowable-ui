import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFlowable } from '~/composables/useFlowable'

// Mock useAuthStore - Using vi.mock to intercept the auto-imported store
vi.mock('~/app/stores/auth', () => ({
    useAuthStore: vi.fn(() => ({
        logout: vi.fn()
    }))
}))

// Mock navigateTo
vi.stubGlobal('navigateTo', vi.fn())

// Mock $fetch.create
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', {
    create: vi.fn(() => mockFetch)
})

describe('useFlowable', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('calls the correct endpoint when fetching tasks', async () => {
        const { getTasks } = useFlowable()
        mockFetch.mockResolvedValueOnce({ data: [], total: 0 })

        await getTasks({ size: 10 })

        expect(mockFetch).toHaveBeenCalledWith('/runtime/tasks', { query: { size: 10 } })
    })

    it('calls the correct endpoint when fetching a specific task', async () => {
        const { getTask } = useFlowable()
        mockFetch.mockResolvedValueOnce({ id: '123' })

        await getTask('123')

        expect(mockFetch).toHaveBeenCalledWith('/runtime/tasks/123')
    })

    it('calls the correct endpoint when completing a task', async () => {
        const { completeTask } = useFlowable()
        mockFetch.mockResolvedValueOnce({})

        await completeTask('123', { values: { approved: true } })

        expect(mockFetch).toHaveBeenCalledWith('/runtime/tasks/123', {
            method: 'POST',
            body: { action: 'complete', values: { approved: true } }
        })
    })
})
