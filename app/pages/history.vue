<script setup lang="ts">
definePageMeta({ title: 'History' })
const flowable = useFlowable()

const { data: historicTasks } = await useAsyncData('hist-tasks', () => $fetch('/api/flowable/query/historic-task-instances', { method: 'POST', body: { finished: true } }))
const { data: historicProcesses } = await useAsyncData('hist-procs', () => $fetch('/api/flowable/query/historic-process-instances', { method: 'POST', body: { finished: true } }))

const taskColumns = [
  { id: 'name', accessorKey: 'name', header: 'Task Name' },
  { id: 'endTime', accessorKey: 'endTime', header: 'Completed At' },
  { id: 'durationInMillis', accessorKey: 'durationInMillis', header: 'Duration' }
]
</script>

<template>
  <div class="space-y-8">
    <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
      <template #header><h3 class="font-bold">Completed Tasks</h3></template>
      <UTable :data="(historicTasks as any)?.data || []" :columns="taskColumns as any">
        <template #endTime-cell="{ cell }">
            {{ new Date(cell.row.original.endTime).toLocaleString() }}
        </template>
        <template #durationInMillis-cell="{ cell }">
            {{ (cell.row.original.durationInMillis / 1000).toFixed(1) }}s
        </template>
      </UTable>
    </UCard>

    <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
      <template #header><h3 class="font-bold">Finished Process Instances</h3></template>
      <UTable :data="(historicProcesses as any)?.data || []" :columns="[{id: 'processDefinitionName', accessorKey: 'processDefinitionName', header: 'Process'}, {id: 'endTime', accessorKey: 'endTime', header: 'Finished At'}] as any">
        <template #endTime-cell="{ cell }">
            {{ new Date(cell.row.original.endTime).toLocaleString() }}
        </template>
      </UTable>
    </UCard>
  </div>
</template>
