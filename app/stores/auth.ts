import { defineStore } from 'pinia'
import type { FlowableUser } from '~/shared/types/flowable'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as FlowableUser | null,
        token: null as string | null,
        isAuthenticated: false,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async login(credentials: { username: string; password: string; rememberMe: boolean }) {
            this.loading = true
            this.error = null

            try {
                // In a real application, you might call a dedicated auth endpoint
                // For Flowable Basic Auth, we can verify by calling /idm/users/{id}
                const data = await $fetch<FlowableUser>(`/api/flowable/idm/users/${credentials.username}`)

                this.user = data
                this.isAuthenticated = true
                // Set token or other session data if necessary

                return true
            } catch (err: any) {
                this.error = 'Login failed. Please check your credentials.'
                this.isAuthenticated = false
                return false
            } finally {
                this.loading = false
            }
        },
        logout() {
            this.user = null
            this.token = null
            this.isAuthenticated = false
            navigateTo('/login')
        }
    },
    persist: true // Enabled by pinia-plugin-persistedstate
})
