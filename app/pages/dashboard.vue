<script setup lang="ts">
definePageMeta({
  title: 'Dashboard'
})

const { t } = useI18n()
const flowable = useFlowable()

const stats = ref([
  { label: 'Pending Tasks', value: '0', icon: 'i-heroicons-inbox' },
  { label: 'Active Processes', value: '0', icon: 'i-heroicons-play' },
  { label: 'Completed Today', value: '0', icon: 'i-heroicons-check-circle' },
  { label: 'Alerts', value: '0', icon: 'i-heroicons-exclamation-triangle' }
])

const { data: response, pending, refresh: refreshTasks } = await useAsyncData('dashboard-tasks', () => flowable.getTasks({ size: 5 }))
const { data: procResponse, refresh: refreshProcesses } = await useAsyncData('dashboard-processes', () => flowable.getProcessInstances({ size: 5 }))


const toast = useToast()

const startWorkflow = async () => {
  try {
    await flowable.startProcess({
      processDefinitionKey: 'simpleProcess'
    })
    toast.add({
      title: 'Success',
      description: 'Process started successfully',
      color: 'success'
    })
    await Promise.all([refreshTasks(), refreshProcesses()])
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to start process',
      color: 'error'
    })
  }
}

const dashColumns = [
  { id: 'name', accessorKey: 'name', header: 'Task Name' },
  { id: 'createTime', accessorKey: 'createTime', header: 'Created' }
]

watchEffect(() => {
  if (response.value) {
    stats.value[0].value = (response.value as any).total.toString()
  }
  if (procResponse.value) {
    stats.value[1].value = (procResponse.value as any).total.toString()
  }
})
</script>

<template>
  <div class="space-y-10 pb-20">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <UCard 
        v-for="stat in stats" 
        :key="stat?.label" 
        class="border-none shadow-xl hover:scale-[1.03] transition-transform duration-300 bg-white/80 dark:bg-white/5 backdrop-blur-xl ring-1 ring-white/10"
      >
        <div class="flex items-center gap-5">
          <div class="p-4 bg-primary-500/10 dark:bg-primary-500/20 rounded-2xl shadow-inner shadow-primary-500/10">
            <UIcon :name="stat?.icon" class="size-7 text-primary-500 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ stat?.label }}</p>
            <p class="text-3xl font-black tracking-tighter text-slate-800 dark:text-white">{{ stat?.value || '0' }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <!-- Recent Tasks -->
      <UCard 
        class="border-none shadow-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl ring-1 ring-white/10"
        :ui="{ header: 'border-white/5' }"
      >
        <template #header>
          <div class="flex items-center justify-between p-2">
            <div>
              <h3 class="text-xl font-black tracking-tight dark:text-white">Recent Tasks</h3>
              <p class="text-xs text-slate-500">Action items requiring attention</p>
            </div>
            <UButton to="/tasks" variant="subtle" color="primary" icon="i-heroicons-arrow-right-circle" class="rounded-full">View all</UButton>
          </div>
        </template>
        
        <UTable 
          :data="(response as any)?.data || []" 
          :columns="dashColumns"
          :loading="pending"
        >
          <template #name-cell="{ cell }">
            <NuxtLink :to="`/tasks/${cell.row.original.id}`" class="font-bold text-primary-500 hover:text-primary-400 transition-colors">
              {{ cell.row.original.name || 'Untitled Task' }}
            </NuxtLink>
          </template>
          <template #createTime-cell="{ cell }">
            <span class="text-xs font-medium text-slate-500">
              {{ cell.row.original.createTime ? new Date(cell.row.original.createTime).toLocaleDateString() : 'N/A' }}
            </span>
          </template>
        </UTable>
      </UCard>

      <!-- Quick Actions -->
      <UCard class="border-none shadow-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl ring-1 ring-white/10 overflow-hidden">
        <template #header>
          <div class="p-2">
            <h3 class="text-xl font-black tracking-tight dark:text-white">Quick Actions</h3>
            <p class="text-xs text-slate-500">Frequently used operations</p>
          </div>
        </template>
        
        <div class="grid grid-cols-2 gap-6 p-2">
          <UButton 
            v-for="action in ([
              { label: 'Start Process', icon: 'i-heroicons-plus-circle', color: 'primary', variant: 'solid', action: startWorkflow },
              { label: 'Team Tasks', icon: 'i-heroicons-user-group', variant: 'subtle', color: 'neutral' },
              { label: 'Reports', icon: 'i-heroicons-document-text', variant: 'subtle', color: 'neutral' },
              { label: 'Find Process', icon: 'i-heroicons-magnifying-glass', variant: 'subtle', color: 'neutral' }
            ] as const)"
            :key="action.label"
            :icon="action.icon"
            :variant="action.variant"
            :color="action.color"
            @click="(action as any).action?.()"
            class="justify-center py-6 text-sm font-black rounded-3xl hover:scale-[1.05] transition-transform active:scale-95"
          >
            {{ action.label }}
          </UButton>
        </div>
        
        <div class="mt-10 p-6 bg-primary-500/5 rounded-3xl border border-primary-500/10 flex items-center justify-between">
          <div>
            <h4 class="font-bold text-primary-400">Need Help?</h4>
            <p class="text-xs text-slate-500">Check the Flowable documentation</p>
          </div>
          <UButton icon="i-heroicons-book-open" variant="ghost" color="primary" />
        </div>
      </UCard>
    </div>
  </div>
</template>
