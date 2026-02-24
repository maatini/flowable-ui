<script setup lang="ts">
const props = defineProps<{
  instanceId: string
}>()

const { t } = useI18n()
const flowable = useFlowable()
const toast = useToast()

const { data: variables, refresh: refreshVars, pending: loading } = await useAsyncData(
  `proc-vars-${props.instanceId}`,
  () => flowable.getProcessInstanceVariables(props.instanceId)
)

const editingVar = ref<string | null>(null)
const editValue = ref<any>(null)
const editType = ref<string>('string')

const showAddModal = ref(false)
const newVar = ref({ name: '', value: '', type: 'string' })

const variableTypes = [
  { label: t('processes.types.string'), value: 'string' },
  { label: t('processes.types.integer'), value: 'integer' },
  { label: t('processes.types.boolean'), value: 'boolean' },
  { label: t('processes.types.date'), value: 'date' }
]

function startEdit(variable: any) {
  editingVar.value = variable.name
  editValue.value = variable.value
  editType.value = variable.type
}

async function saveEdit() {
  if (!editingVar.value) return
  
  try {
    let val = editValue.value
    if (editType.value === 'integer') val = parseInt(editValue.value) || 0
    if (editType.value === 'boolean') val = editValue.value === 'true' || editValue.value === true
    
    await flowable.updateProcessInstanceVariable(props.instanceId, editingVar.value, {
      name: editingVar.value,
      value: val,
      type: editType.value
    })
    
    toast.add({ title: t('processes.save'), color: 'success' })
    editingVar.value = null
    refreshVars()
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  }
}

async function deleteVariable(name: string) {
  try {
    await flowable.deleteProcessInstanceVariable(props.instanceId, name)
    toast.add({ title: t('processes.delete'), color: 'success' })
    refreshVars()
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  }
}

async function addVariable() {
  try {
    let val: any = newVar.value.value
    if (newVar.value.type === 'integer') val = parseInt(newVar.value.value) || 0
    if (newVar.value.type === 'boolean') val = (newVar.value.value as any) === 'true' || (newVar.value.value as any) === true

    // Note: The API for adding is often the same as updating a single var if it doesn't exist, 
    // but Flowable REST usually supports POST to /variables for bulk or PUT for single.
    await flowable.updateProcessInstanceVariable(props.instanceId, newVar.value.name, {
      name: newVar.value.name,
      value: val,
      type: newVar.value.type
    })
    
    toast.add({ title: t('processes.addVariable'), color: 'success' })
    showAddModal.value = false
    newVar.value = { name: '', value: '', type: 'string' }
    refreshVars()
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  }
}

const columns = [
  { key: 'name', label: t('processes.name') },
  { key: 'value', label: t('processes.value') },
  { key: 'type', label: t('processes.type') },
  { key: 'actions', label: '' }
]
</script>

<template>
  <UCard class="ring-1 ring-gray-200 dark:ring-gray-800" data-testid="variables-card">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-bold flex items-center gap-2">
          <UIcon name="i-heroicons-variable" />
          {{ t('processes.variables') }}
        </h3>
        <UButton 
          icon="i-heroicons-plus" 
          size="xs" 
          color="primary" 
          variant="subtle" 
          @click="showAddModal = true"
        >
          {{ t('processes.addVariable') }}
        </UButton>
      </div>
    </template>

    <UTable 
      :data="(variables as any) || []" 
      :columns="(columns as any)" 
      :loading="loading"
    >
      <template #value-cell="{ cell, row }">
        <div v-if="editingVar === (row as any).name" class="flex items-center gap-2">
          <USelect v-if="editType === 'boolean'" v-model="editValue" :options="[{label: 'True', value: 'true'}, {label: 'False', value: 'false'}]" size="sm" />
          <UInput v-else-if="editType === 'integer'" type="number" v-model="editValue" size="sm" />
          <UInput v-else-if="editType === 'date'" type="date" v-model="editValue" size="sm" />
          <UInput v-else v-model="editValue" size="sm" />
        </div>
        <span v-else class="font-medium text-slate-600 dark:text-slate-400">
          {{ (cell as any).getValue() }}
        </span>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center justify-end gap-2">
          <template v-if="editingVar === (row as any).name">
            <UButton icon="i-heroicons-check" size="xs" color="success" variant="ghost" @click="saveEdit" />
            <UButton icon="i-heroicons-x-mark" size="xs" color="neutral" variant="ghost" @click="editingVar = null" />
          </template>
          <template v-else>
            <UButton icon="i-heroicons-pencil" size="xs" color="neutral" variant="ghost" @click="startEdit(row)" />
            <UButton icon="i-heroicons-trash" size="xs" color="error" variant="ghost" @click="deleteVariable((row as any).name)" />
          </template>
        </div>
      </template>
    </UTable>

    <!-- Add Variable Modal -->
    <UModal v-model="showAddModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">{{ t('processes.addVariable') }}</h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="showAddModal = false" />
          </div>
        </template>
        
        <div class="space-y-4 py-2">
          <UFormGroup :label="t('processes.name')">
            <UInput v-model="newVar.name" />
          </UFormGroup>
          <UFormGroup :label="t('processes.type')">
            <USelect v-model="newVar.type" :options="variableTypes" />
          </UFormGroup>
          <UFormGroup :label="t('processes.value')">
            <USelect v-if="newVar.type === 'boolean'" v-model="newVar.value" :options="[{label: 'True', value: 'true'}, {label: 'False', value: 'false'}]" />
            <UInput v-else-if="newVar.type === 'integer'" type="number" v-model="newVar.value" />
            <UInput v-else-if="newVar.type === 'date'" type="date" v-model="newVar.value" />
            <UInput v-else v-model="newVar.value" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" color="neutral" @click="showAddModal = false">{{ t('common.cancel') }}</UButton>
            <UButton color="primary" @click="addVariable">{{ t('common.submit') }}</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UCard>
</template>
