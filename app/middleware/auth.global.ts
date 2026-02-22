export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()

    // Skip middleware on login page
    // if (to.path === '/login') {
    //     return
    // }

    // // Redirect to login if not authenticated
    // if (!auth.isAuthenticated) {
    //     return navigateTo('/login')
    // }

    // // Admin protection
    // if (to.path.startsWith('/admin') && auth.user?.privileges?.indexOf('access-admin') === -1) {
    //     return navigateTo('/dashboard')
    // }
})
