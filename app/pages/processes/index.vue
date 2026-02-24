<script setup lang="ts">
definePageMeta({ title: 'Processes' })
const { t } = useI18n()
const flowable = useFlowable()
const toast = useToast()

const { data: definitions, refresh: refreshDefs } = await useAsyncData('proc-defs', () => flowable.getProcessDefinitions({ latest: true }))
const { data: instances, refresh: refreshInsts } = await useAsyncData('proc-insts', () => flowable.getProcessInstances())

const selectedDef = ref(null)
const showStartModal = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function openStartModal(definition: any) {
  selectedDef.value = definition
  showStartModal.value = true
}

async function onProcessStarted() {
  await refreshInsts()
}

function triggerFileUpload() {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    await flowable.deployProcess(formData)
    toast.add({ title: 'Process deployed successfully', color: 'success' })
    await refreshDefs()
  } catch (error) {
    toast.add({ title: 'Failed to deploy process', color: 'error' })
  } finally {
    uploading.value = false
    // Reset input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Definitions -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Available Processes</h3>
            <div>
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden" 
                accept=".xml,.bpmn,.bpmn20.xml" 
                @change="handleFileUpload" 
              />
              <UButton 
                icon="i-heroicons-arrow-up-tray" 
                size="sm" 
                color="primary" 
                variant="solid" 
                :loading="uploading"
                @click="triggerFileUpload"
              >
                Upload Process
              </UButton>
            </div>
          </div>
        </template>
        <UTable :data="(definitions as any)?.data || []" :columns="[{id: 'name', accessorKey: 'name', header: 'Name'}, {id: 'actions', accessorKey: 'id', header: ''}] as any">
          <template #name-cell="{ cell }">
            <NuxtLink 
              :to="`/processes/${(cell.row.original as any).id}`" 
              class="font-bold text-primary-500 hover:text-primary-400 transition-colors"
              :data-testid="`process-link-${(cell.row.original as any).key}`"
            >
              {{ (cell.row.original as any).name || 'Untitled Process' }}
            </NuxtLink>
          </template>
          <template #actions-cell="{ cell }">
            <div class="flex items-center gap-2">
              <UButton 
                icon="i-heroicons-eye" 
                size="xs" 
                color="neutral" 
                variant="ghost" 
                :to="`/processes/${(cell.row.original as any).id}`" 
                data-testid="view-process"
              />
              <UButton 
                icon="i-heroicons-play" 
                size="xs" 
                color="neutral" 
                variant="ghost" 
                @click="openStartModal(cell.row.original)" 
                data-testid="start-process"
              />
            </div>
          </template>
        </UTable>
      </UCard>

      <!-- Active Instances -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header><h3 class="font-bold">Active Instances</h3></template>
        <UTable :data="(instances as any)?.data || []" :columns="[{id: 'processDefinitionName', accessorKey: 'processDefinitionName', header: 'Process'}, {id: 'startTime', accessorKey: 'startTime', header: 'Started'}] as any">
          <template #processDefinitionName-cell="{ cell }">
            <NuxtLink :to="`/instances/${(cell.row.original as any).id}`" class="font-bold text-primary-500 hover:text-primary-400 transition-colors">
              {{ (cell.row.original as any).processDefinitionName || 'Unknown Process' }}
            </NuxtLink>
          </template>
          <template #startTime-cell="{ cell }">
            {{ new Date((cell.row.original as any).startTime).toLocaleString() }}
          </template>
        </UTable>
      </UCard>
    </div>

    <!-- Start Process Modal -->
    <FlowableStartProcessModal
      v-model="showStartModal"
      :definition="selectedDef"
      @success="onProcessStarted"
    />
  </div>
</template>
