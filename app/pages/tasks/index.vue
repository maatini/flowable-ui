<script setup lang="ts">
definePageMeta({ title: 'Tasks' })
const { t } = useI18n()
const flowable = useFlowable()

const columns = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'assignee', accessorKey: 'assignee.id', header: 'Assignee' }, // Changed accessorKey to assignee.id
  { id: 'priority', accessorKey: 'priority', header: 'Priority' },
  { id: 'createTime', accessorKey: 'createTime', header: 'Created' },
  { id: 'actions', accessorKey: 'id', header: '' }
]

const { data: response, pending, refresh } = await useAsyncData('tasks-list', () => flowable.getTasks())

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight">{{ t('tasks.title') }}</h1>
      <UButton icon="i-heroicons-arrow-path" variant="ghost" @click="() => refresh()" />
    </div>

    <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
      <UTable :data="(response as any)?.data || []" :columns="columns as any" :loading="pending">
        <template #name-cell="{ cell }">
          <NuxtLink :to="`/tasks/${cell.row.original.id}`" class="font-medium text-primary-600 dark:text-primary-400">
            {{ cell.row.original.name || 'Untitled Task' }}
          </NuxtLink>
        </template>
        
        <template #createTime-cell="{ cell }">
          {{ cell.row.original.createTime ? new Date(cell.row.original.createTime).toLocaleDateString() : 'N/A' }}
        </template>

        <template #priority-cell="{ cell }">
          <UBadge :color="cell.row.original.priority > 50 ? 'error' : 'success'" variant="subtle">
            {{ cell.row.original.priority }}
          </UBadge>
        </template>

        <template #actions-cell="{ cell }">
          <UButton
            icon="i-heroicons-chevron-right"
            variant="ghost"
            color="neutral"
            :to="`/tasks/${cell.row.original.id}`"
          />
        </template>
      </UTable>
    </UCard>
  </div>
</template>
