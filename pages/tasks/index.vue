<script setup lang="ts">
definePageMeta({ title: 'Tasks' })
const { t } = useI18n()
const flowable = useFlowable()

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'assignee', label: 'Assignee' },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'createTime', label: 'Created' },
  { key: 'actions', label: '' }
]

const { data: response, pending, refresh } = await useAsyncData('tasks-list', () => flowable.getTasks())

const tasks = computed(() => response.value?.data || [])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight">{{ t('tasks.title') }}</h1>
      <UButton icon="i-heroicons-arrow-path" variant="ghost" @click="refresh" />
    </div>

    <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
      <UTable :rows="tasks" :columns="columns" :loading="pending">
        <template #name-data="{ row }">
          <NuxtLink :to="`/tasks/${row.id}`" class="font-medium text-primary-600 dark:text-primary-400">
            {{ row.name || 'Untitled Task' }}
          </NuxtLink>
        </template>
        
        <template #createTime-data="{ row }">
          {{ new Date(row.createTime).toLocaleDateString() }}
        </template>

        <template #priority-data="{ row }">
          <UBadge :color="row.priority > 50 ? 'red' : 'green'" variant="subtle">
            {{ row.priority }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <UButton
            icon="i-heroicons-chevron-right"
            variant="ghost"
            color="gray"
            :to="`/tasks/${row.id}`"
          />
        </template>
      </UTable>
    </UCard>
  </div>
</template>
