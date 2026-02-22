<script setup lang="ts">
const route = useRoute()
const taskId = route.params.id as string
const flowable = useFlowable()
const toast = useToast()

const { data: task, refresh: refreshTask } = await useAsyncData(`task-${taskId}`, () => flowable.getTask(taskId))
const { data: form } = await useAsyncData(`task-form-${taskId}`, async () => {
  if (task.value?.formKey) {
    // Fetch form definition/model if formKey exists
    // Simplified for demo: assuming we fetch by key or task id
    return await $fetch(`/api/flowable/runtime/tasks/${taskId}/form`)
  }
  return null
})

const formData = ref({})
const completing = ref(false)

async function onComplete() {
  completing.ref = true
  try {
    await flowable.completeTask(taskId, { values: formData.value })
    toast.add({ title: 'Task completed', color: 'green' })
    navigateTo('/tasks')
  } catch (error) {
    toast.add({ title: 'Error completing task', color: 'red' })
  } finally {
    completing.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="flex items-center gap-4">
      <UButton icon="i-heroicons-arrow-left" variant="ghost" to="/tasks" />
      <h1 class="text-2xl font-bold tracking-tight">{{ task?.name || 'Task Details' }}</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Area -->
      <UCard class="lg:col-span-2 ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Execution</h3>
            <UBadge color="primary" variant="soft">{{ task?.id }}</UBadge>
          </div>
        </template>

        <div v-if="form" class="space-y-8">
          <FlowableFormRenderer v-model="formData" :form="form" />
          
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <UButton variant="outline" color="gray" to="/tasks">Cancel</UButton>
            <UButton :loading="completing" @click="onComplete">Complete Task</UButton>
          </div>
        </div>
        
        <div v-else class="py-12 text-center text-gray-500">
          <UIcon name="i-heroicons-document-text" class="size-12 mx-auto mb-4 opacity-20" />
          <p>No form associated with this task.</p>
          <UButton class="mt-6" :loading="completing" @click="onComplete">Complete Without Form</UButton>
        </div>
      </UCard>

      <!-- Meta Info -->
      <div class="space-y-6">
        <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
          <template #header><h3 class="font-bold text-sm uppercase tracking-wider text-gray-500">Task Info</h3></template>
          <dl class="space-y-4 text-sm">
            <div>
              <dt class="text-gray-500">Created</dt>
              <dd class="font-medium">{{ task ? new Date(task.createTime).toLocaleString() : '-' }}</dd>
            </div>
            <div>
              <dt class="text-gray-500">Priority</dt>
              <dd class="font-medium">{{ task?.priority }}</dd>
            </div>
            <div>
              <dt class="text-gray-500">Assignee</dt>
              <dd class="font-medium">
                <UAvatar v-if="task?.assignee" size="xs" :alt="task.assignee" class="mr-2" />
                {{ task?.assignee || 'Unassigned' }}
              </dd>
            </div>
          </dl>
        </UCard>
      </div>
    </div>
  </div>
</template>
