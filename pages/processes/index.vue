<script setup lang="ts">
definePageMeta({ title: 'Processes' })
const { t } = useI18n()
const flowable = useFlowable()
const toast = useToast()

const { data: definitions, refresh: refreshDefs } = await useAsyncData('proc-defs', () => flowable.getProcessDefinitions())
const { data: instances, refresh: refreshInsts } = await useAsyncData('proc-insts', () => flowable.getProcessInstances())

const selectedDef = ref(null)
const starting = ref(false)

async function startProcess(definition: any) {
  starting.value = true
  try {
    await flowable.startProcess({ processDefinitionId: definition.id })
    toast.add({ title: 'Process started', color: 'green' })
    refreshInsts()
  } catch (error) {
    toast.add({ title: 'Failed to start process', color: 'red' })
  } finally {
    starting.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Definitions -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header><h3 class="font-bold">Available Processes</h3></template>
        <UTable :rows="definitions?.data || []" :columns="[{key: 'name', label: 'Name'}, {key: 'actions', label: ''}]">
          <template #actions-data="{ row }">
            <UButton icon="i-heroicons-play" size="xs" color="gray" variant="ghost" @click="startProcess(row)" />
          </template>
        </UTable>
      </UCard>

      <!-- Active Instances -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header><h3 class="font-bold">Active Instances</h3></template>
        <UTable :rows="instances?.data || []" :columns="[{key: 'processDefinitionName', label: 'Process'}, {key: 'startTime', label: 'Started'}]">
          <template #startTime-data="{ row }">
            {{ new Date(row.startTime).toLocaleString() }}
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>
