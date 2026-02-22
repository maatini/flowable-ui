<script setup lang="ts">
const { t, locale, locales } = useI18n()
const auth = useAuthStore()
const colorMode = useColorMode()

const links = computed(() => [
  { label: t('common.dashboard'), icon: 'i-heroicons-home', to: '/dashboard' },
  { label: t('common.tasks'), icon: 'i-heroicons-inbox', to: '/tasks' },
  { label: t('common.processes'), icon: 'i-heroicons-arrow-path', to: '/processes' },
  { label: t('common.history'), icon: 'i-heroicons-clock', to: '/history' },
  { label: t('common.admin'), icon: 'i-heroicons-cog-6-tooth', to: '/admin' }
])

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const userMenuItems = [
  [{
    label: auth.user?.firstName || 'User',
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => auth.logout()
  }]
]
</script>

<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
    <!-- Sidebar -->
    <aside class="w-72 flex flex-col glass-dark border-r border-white/5 z-20">
      <div class="p-8 flex items-center gap-3">
        <div class="size-10 bg-gradient-to-br from-primary-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/20">F</div>
        <div>
          <h1 class="text-xl font-black tracking-tight text-white leading-none">Flowable</h1>
          <p class="text-[10px] uppercase tracking-widest text-primary-400 font-bold mt-1">Intelligence</p>
        </div>
      </div>
      
      <div class="flex-1 px-4 py-2 overflow-y-auto space-y-1">
        <UNavigationMenu :items="links" orientation="vertical" class="px-2" />
      </div>

      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between bg-white/5 rounded-2xl p-2 border border-white/5">
          <UButton
            variant="ghost"
            color="neutral"
            :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            @click="toggleColorMode"
            class="hover:bg-white/10"
          />
          
          <USelectMenu
            v-model="locale"
            :options="locales"
            value-attribute="code"
            option-attribute="name"
            variant="none"
            class="flex-1"
          />
        </div>

        <UDropdownMenu :items="userMenuItems" :content="{ align: 'start', side: 'top', class: 'glass-dark' }">
          <UButton
            variant="subtle"
            color="primary"
            class="w-full justify-start py-3 px-4 rounded-2xl font-bold shadow-lg"
            icon="i-heroicons-user-circle"
          >
            {{ auth.user?.firstName || 'Account' }}
          </UButton>
        </UDropdownMenu>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Top header -->
      <header class="h-20 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            {{ $route.meta.title || 'Overview' }}
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-bell" variant="subtle" color="neutral" class="rounded-full size-10" />
          <UButton icon="i-heroicons-magnifying-glass" variant="subtle" color="neutral" class="rounded-full size-10" />
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-slate-950">
        <div class="max-w-7xl mx-auto animate-slow-fade">
          <slot />
        </div>
      </div>
      
      <!-- Subtle background glow -->
      <div class="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 blur-[150px] pointer-events-none" />
    </main>
  </div>
</template>
