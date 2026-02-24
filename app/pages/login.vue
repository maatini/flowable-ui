<script setup lang="ts">
definePageMeta({
  layout: false,
  title: 'Login'
})

const { t } = useI18n()
const auth = useAuthStore()

const state = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// Always redirect if somehow reaching this page
watchEffect(() => {
  if (auth.isAuthenticated) {
    navigateTo('/dashboard')
  }
})

async function handleLogin() {
  const success = await auth.login(state)
  if (success) {
    navigateTo('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen relative flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Animated background orbs -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 blur-[120px] animate-pulse" />
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style="animation-delay: 2s" />
    
    <div class="max-w-md w-full animate-slow-fade">
      <UCard class="glass-dark border-white/10 shadow-2xl overflow-hidden">
        <div class="text-center p-6 bg-gradient-to-b from-white/5 to-transparent">
          <div class="flex justify-center mb-6">
             <div class="p-4 rounded-3xl bg-primary-500/20 ring-1 ring-primary-500/30 shadow-lg shadow-primary-500/20">
               <UIcon name="i-heroicons-bolt" class="size-10 text-primary-400" />
             </div>
          </div>
          <h2 class="text-4xl font-black text-white tracking-tighter mb-2">
            Flowable <span class="text-primary-400">Nuxt</span>
          </h2>
          <p class="text-slate-400 font-medium">
            Workflow Intelligence Portal
          </p>
        </div>

        <div class="px-8 pb-8 pt-2">
          <UForm :state="state" class="space-y-6" @submit="handleLogin">
            <UFormField :label="t('common.username')" name="username">
              <UInput 
                v-model="state.username" 
                icon="i-heroicons-user" 
                placeholder="admin" 
                size="xl"
                variant="subtle"
                autofocus 
                class="w-full" 
              />
            </UFormField>



            <div class="flex items-center justify-between">
              <UCheckbox v-model="state.rememberMe" :label="t('common.rememberMe')" />
              <NuxtLink class="text-xs text-primary-400 hover:underline">Forgot password?</NuxtLink>
            </div>

            <UButton
              type="submit"
              block
              :loading="auth.loading"
              size="xl"
              class="font-bold py-4 bg-gradient-to-r from-primary-600 to-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary-500/20"
            >
              {{ t('common.login') }}
            </UButton>

            <UAlert
              v-if="auth.error"
              color="error"
              variant="subtle"
              icon="i-heroicons-exclamation-triangle"
              :title="auth.error"
              class="mt-4"
            />
          </UForm>
        </div>
      </UCard>
      
      <p class="mt-8 text-center text-xs text-slate-500 tracking-widest uppercase">
        Powered by High-Performance Flowable REST
      </p>
    </div>
    
    <!-- Decorative texture -->
    <div class="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 32px 32px" />
  </div>
</template>
