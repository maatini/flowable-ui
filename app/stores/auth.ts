import { defineStore } from 'pinia'
import type { FlowableUser } from '../../shared/types/flowable'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {} as FlowableUser,
        token: '',
        isAuthenticated: false,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async login(credentials: { username: string; password?: string; rememberMe?: boolean }) {
            this.loading = true
            this.error = null

            try {
                // By-pass password / API check completely as requested
                this.user = {
                    id: credentials.username || 'admin',
                    firstName: 'Demo',
                    lastName: 'User',
                    email: credentials.username + '@flowable.com',
                    privileges: ['access-admin', 'access-rest-api']
                }

                this.isAuthenticated = true
                return true
            } catch (err: any) {
                this.error = 'Login failed.'
                this.isAuthenticated = false
                return false
            } finally {
                this.loading = false
            }
        },
        logout() {
            this.user = {} as FlowableUser
            this.token = ''
            this.isAuthenticated = false
            navigateTo('/login')
        }
    },
    persist: true
})
