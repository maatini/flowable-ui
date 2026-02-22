import { defineStore } from 'pinia'
import type { FlowableUser } from '../../shared/types/flowable'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {
            id: 'rest-admin',
            firstName: 'Rest',
            lastName: 'Admin',
            email: 'admin@flowable.com',
            privileges: ['access-admin', 'access-rest-api']
        } as FlowableUser,
        token: 'basic-auth-rest-admin',
        isAuthenticated: true,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async login(credentials: { username: string; password: string; rememberMe: boolean }) {
            this.loading = true
            this.error = null

            try {
                // In a real application, you might call a dedicated auth endpoint
                // For Flowable Basic Auth, we can verify by calling /identity/users/{id}
                const data = await $fetch<FlowableUser>(`/api/flowable/identity/users/${credentials.username}`)

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
    persist: true
})
