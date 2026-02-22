<script setup lang="ts">
const props = defineProps<{
  form: any; // Flowable Form JSON
  modelValue: Record<string, any>;
}>()

const emit = defineEmits(['update:modelValue'])

const formData = useVModel(props, 'modelValue', emit)

const getComponent = (type: string) => {
  switch (type) {
    case 'text':
    case 'string':
      return 'UInput'
    case 'integer':
    case 'number':
      return 'UInput' // maybe type="number"
    case 'boolean':
      return 'UCheckbox'
    case 'date':
      return 'UInput' // type="date"
    default:
      return 'UInput'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="field in form.fields" :key="field.id">
      <UFormGroup :label="field.name" :name="field.id" :help="field.placeholder">
        <component
          :is="getComponent(field.type)"
          v-model="formData[field.id]"
          :placeholder="field.placeholder"
          :type="field.type === 'date' ? 'date' : (field.type === 'integer' ? 'number' : 'text')"
          class="w-full"
        />
      </UFormGroup>
    </div>
  </div>
</template>
