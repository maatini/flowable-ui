<script setup lang="ts">
definePageMeta({
  title: 'Dashboard'
})

const { t } = useI18n()
const flowable = useFlowable()

const stats = ref([
  { label: 'Pending Tasks', value: '0', icon: 'i-heroicons-inbox' },
  { label: 'Active Processes', value: '0', icon: 'i-heroicons-play' },
  { label: 'Completed Today', value: '0', icon: 'i-heroicons-check-circle' },
  { label: 'Alerts', value: '0', icon: 'i-heroicons-exclamation-triangle' }
])

const { data: tasks, pending } = await useAsyncData('dashboard-tasks', () => flowable.getTasks({ size: 5 }))
const { data: processes } = await useAsyncData('dashboard-processes', () => flowable.getProcessInstances({ size: 5 }))

watchEffect(() => {
  if (tasks.value) stats.value[0].value = (tasks.value as any).total.toString()
  if (processes.value) stats.value[1].value = (processes.value as any).total.toString()
})
</script>

<template>
  <div class="space-y-8">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="stat in stats" :key="stat.label" class="ring-1 ring-gray-200 dark:ring-gray-800">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <UIcon :name="stat.icon" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Tasks -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Recent Tasks</h3>
            <UButton to="/tasks" variant="link" color="primary">View all</UButton>
          </div>
        </template>
        
        <UTable :rows="tasks?.data || []" :loading="pending">
          <template #name-data="{ row }">
            <NuxtLink :to="`/tasks/${row.id}`" class="text-primary-500 hover:underline">
              {{ row.name || 'Untitled Task' }}
            </NuxtLink>
          </template>
          <template #createTime-data="{ row }">
            {{ new Date(row.createTime).toLocaleString() }}
          </template>
        </UTable>
      </UCard>

      <!-- Quick Actions -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header>
          <h3 class="font-bold">Quick Actions</h3>
        </template>
        <div class="grid grid-cols-2 gap-4">
          <UButton icon="i-heroicons-plus-circle" class="justify-center">Start Process</UButton>
          <UButton icon="i-heroicons-user-group" variant="outline" class="justify-center">Team Tasks</UButton>
          <UButton icon="i-heroicons-document-text" variant="outline" class="justify-center">Reports</UButton>
          <UButton icon="i-heroicons-magnifying-glass" variant="outline" class="justify-center">Find Process</UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
