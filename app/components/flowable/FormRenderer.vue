<script setup lang="ts">
const props = defineProps<{
  form: any; // Flowable Form JSON
  modelValue: Record<string, any>;
}>()

const emit = defineEmits(['update:modelValue'])

// Use a local reactive copy to handle input state
const localData = ref({ ...props.modelValue })

// Keep local state in sync with incoming props
watch(() => props.modelValue, (newVal) => {
  localData.value = { ...newVal }
}, { deep: true })

const getComponent = (type: string) => {
  switch (type) {
    case 'text':
    case 'string':
      return 'UInput'
    case 'integer':
    case 'number':
      return 'UInput' 
    case 'boolean':
      return 'UCheckbox'
    case 'date':
      return 'UInput' 
    default:
      return 'UInput'
  }
}

const onUpdate = (fieldId: string, value: any) => {
  localData.value[fieldId] = value
  emit('update:modelValue', { ...localData.value })
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="field in form.fields" :key="field.id">
      <UFormGroup :label="field.name" :name="field.id" :help="field.placeholder">
        <component
          :is="getComponent(field.type)"
          :model-value="localData[field.id]"
          @update:model-value="(val: any) => onUpdate(field.id, val)"
          :placeholder="field.placeholder"
          :type="field.type === 'date' ? 'date' : (field.type === 'integer' ? 'number' : 'text')"
          class="w-full"
        />
      </UFormGroup>
    </div>
  </div>
</template>
