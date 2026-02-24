<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  definition: any
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const { t } = useI18n()
const flowable = useFlowable()
const toast = useToast()

const variables = ref<{ name: string; value: any; type: string }[]>([])
const starting = ref(false)

const variableTypes = [
  { label: t('processes.types.string'), value: 'string' },
  { label: t('processes.types.integer'), value: 'integer' },
  { label: t('processes.types.boolean'), value: 'boolean' },
  { label: t('processes.types.date'), value: 'date' }
]

function addVariable() {
  variables.value.push({ name: '', value: '', type: 'string' })
}

function removeVariable(index: number) {
  variables.value.splice(index, 1)
}

async function startProcess() {
  starting.value = true
  try {
    const formattedVariables = variables.value
      .filter(v => v.name.trim() !== '')
      .map(v => {
        let val = v.value
        if (v.type === 'integer') val = parseInt(v.value) || 0
        if (v.type === 'boolean') val = v.value === 'true' || v.value === true
        return { name: v.name, value: val, type: v.type }
      })

    await flowable.startProcess({
      processDefinitionId: props.definition.id,
      variables: formattedVariables
    })
    
    toast.add({ title: t('processes.startProcess'), color: 'success' })
    emit('success')
    emit('update:modelValue', false)
    variables.value = []
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  } finally {
    starting.value = false
  }
}
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" data-testid="start-process-modal">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-black tracking-tight dark:text-white">
            {{ t('processes.startProcess') }}: {{ definition?.name || 'Untitled' }}
          </h3>
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="emit('update:modelValue', false)" />
        </div>
      </template>

      <div class="space-y-6 py-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-bold uppercase tracking-widest text-slate-500">{{ t('processes.variables') }}</h4>
          <UButton 
            icon="i-heroicons-plus-circle" 
            size="sm" 
            color="primary" 
            variant="subtle" 
            @click="addVariable"
          >
            {{ t('processes.addVariable') }}
          </UButton>
        </div>

        <div v-if="variables.length === 0" class="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p class="text-sm text-slate-500">{{ t('processes.noVariables') }}</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="(variable, index) in variables" :key="index" class="flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
            <UFormGroup class="flex-1">
              <UInput v-model="variable.name" :placeholder="t('processes.name')" />
            </UFormGroup>
            
            <UFormGroup class="flex-1">
              <USelect v-if="variable.type === 'boolean'" v-model="variable.value" :options="[{label: 'True', value: 'true'}, {label: 'False', value: 'false'}]" />
              <UInput v-else-if="variable.type === 'integer'" type="number" v-model="variable.value" :placeholder="t('processes.value')" />
              <UInput v-else-if="variable.type === 'date'" type="date" v-model="variable.value" />
              <UInput v-else v-model="variable.value" :placeholder="t('processes.value')" />
            </UFormGroup>

            <UFormGroup class="w-32">
              <USelect v-model="variable.type" :options="variableTypes" />
            </UFormGroup>

            <UButton icon="i-heroicons-trash" color="error" variant="ghost" @click="removeVariable(index)" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton variant="ghost" color="neutral" @click="emit('update:modelValue', false)">
            {{ t('common.cancel') }}
          </UButton>
          <UButton 
            color="primary" 
            icon="i-heroicons-play" 
            :loading="starting" 
            @click="startProcess"
          >
            {{ t('processes.startProcess') }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
