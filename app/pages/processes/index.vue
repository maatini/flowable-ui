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
    toast.add({ title: 'Process started', color: 'success' })
    refreshInsts()
  } catch (error) {
    toast.add({ title: 'Failed to start process', color: 'error' })
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
        <UTable :data="(definitions as any)?.data || []" :columns="[{id: 'name', accessorKey: 'name', header: 'Name'}, {id: 'actions', accessorKey: 'id', header: ''}] as any">
          <template #name-cell="{ cell }">
            <NuxtLink :to="`/processes/${cell.row.original.id}`" class="font-bold text-primary-500 hover:text-primary-400 transition-colors">
              {{ cell.row.original.name || 'Untitled Process' }}
            </NuxtLink>
          </template>
          <template #actions-cell="{ cell }">
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-eye" size="xs" color="neutral" variant="ghost" :to="`/processes/${cell.row.original.id}`" />
              <UButton icon="i-heroicons-play" size="xs" color="neutral" variant="ghost" @click="startProcess(cell.row.original)" />
            </div>
          </template>
        </UTable>
      </UCard>

      <!-- Active Instances -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header><h3 class="font-bold">Active Instances</h3></template>
        <UTable :data="(instances as any)?.data || []" :columns="[{id: 'processDefinitionName', accessorKey: 'processDefinitionName', header: 'Process'}, {id: 'startTime', accessorKey: 'startTime', header: 'Started'}] as any">
          <template #startTime-cell="{ cell }">
            {{ new Date((cell.row.original as any).startTime).toLocaleString() }}
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>
