<script setup lang="ts">
definePageMeta({ title: 'History' })
const flowable = useFlowable()

const { data: historicTasks } = await useAsyncData('hist-tasks', () => $fetch('/api/flowable/query/historic-task-instances', { method: 'POST', body: { finished: true } }))
const { data: historicProcesses } = await useAsyncData('hist-procs', () => $fetch('/api/flowable/query/historic-process-instances', { method: 'POST', body: { finished: true } }))

const taskColumns = [
  { key: 'name', label: 'Task Name' },
  { key: 'endTime', label: 'Completed At' },
  { key: 'durationInMillis', label: 'Duration' }
]
</script>

<template>
  <div class="space-y-8">
    <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
      <template #header><h3 class="font-bold">Completed Tasks</h3></template>
      <UTable :rows="historicTasks?.data || []" :columns="taskColumns">
        <template #endTime-data="{ row }">
            {{ new Date(row.endTime).toLocaleString() }}
        </template>
        <template #durationInMillis-data="{ row }">
            {{ (row.durationInMillis / 1000).toFixed(1) }}s
        </template>
      </UTable>
    </UCard>

    <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
      <template #header><h3 class="font-bold">Finished Process Instances</h3></template>
      <UTable :rows="historicProcesses?.data || []" :columns="[{key: 'processDefinitionName', label: 'Process'}, {key: 'endTime', label: 'FinishedAt'}]">
        <template #endTime-data="{ row }">
            {{ new Date(row.endTime).toLocaleString() }}
        </template>
      </UTable>
    </UCard>
  </div>
</template>
