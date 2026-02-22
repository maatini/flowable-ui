import type { UseFetchOptions } from '#app'

export const useFlowable = () => {
    const auth = useAuthStore()

    const apiFetch = $fetch.create({
        baseURL: '/api/flowable',
        headers: {
            // Basic Auth or JWT could be injected here if not handled by server proxy
        },
        async onResponseError({ response }) {
            if (response.status === 401) {
                // Handle unauthorized (logout user)
                auth.logout()
                navigateTo('/login')
            }
        }
    })

    return {
        getTasks: (params?: any) => apiFetch('/runtime/tasks', { query: params }),
        getTask: (id: string) => apiFetch(`/runtime/tasks/${id}`),
        getProcessInstances: (params?: any) => apiFetch('/runtime/process-instances', { query: params }),
        getProcessDefinitions: (params?: any) => apiFetch('/repository/process-definitions', { query: params }),
        getProcessDefinition: (id: string) => apiFetch(`/repository/process-definitions/${id}`),
        getProcessModel: (id: string) => apiFetch(`/repository/process-definitions/${id}/resourcedata`, { parseResponse: (txt) => txt }),
        startProcess: (data: any) => apiFetch('/runtime/process-instances', { method: 'POST', body: data }),
        completeTask: (id: string, data: any) => apiFetch(`/runtime/tasks/${id}`, { method: 'POST', body: { action: 'complete', ...data } }),
        // Add more as needed
    }
}
