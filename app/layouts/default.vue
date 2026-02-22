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
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900">
      <div class="p-6 flex items-center gap-2">
        <div class="size-8 bg-primary-500 rounded flex items-center justify-center text-white font-bold">F</div>
        <h1 class="text-xl font-bold tracking-tight">Flowable UI</h1>
      </div>
      
      <div class="flex-1 px-4 overflow-y-auto">
        <UNavigationTree :links="links" />
      </div>

      <div class="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
        <div class="flex items-center justify-between px-2">
          <UButton
            variant="ghost"
            color="gray"
            :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            @click="toggleColorMode"
          />
          
          <USelectMenu
            v-model="locale"
            :options="locales"
            value-attribute="code"
            option-attribute="name"
            class="w-32"
          />
        </div>

        <UDropdown :items="userMenuItems" :popper="{ placement: 'top-start' }">
          <UButton
            variant="ghost"
            color="gray"
            class="w-full justify-start"
            icon="i-heroicons-user-circle"
          >
            {{ auth.user?.firstName || 'Account' }}
          </UButton>
        </UDropdown>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 bg-white dark:bg-gray-950">
        <h2 class="text-lg font-semibold">{{ $route.meta.title || '' }}</h2>
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-bell" variant="ghost" color="gray" />
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
