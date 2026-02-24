<script setup lang="ts">
const route = useRoute()
const flowable = useFlowable()

const id = route.params.id as string

const { data: instance, pending: loadingInst } = await useAsyncData(`proc-inst-${id}`, () => flowable.getProcessInstance(id))
const { data: executions, pending: loadingExecs } = await useAsyncData(`proc-execs-${id}`, () => flowable.getProcessInstanceExecutions(id))

// To render the diagram, we need the XML of the definition related to this instance
const definitionId = computed(() => (instance.value as any)?.processDefinitionId)
const { data: xml, pending: loadingXml } = await useAsyncData(
    `proc-xml-by-def`, 
    () => definitionId.value ? flowable.getProcessModel(definitionId.value) : Promise.resolve(null),
    { watch: [definitionId] }
)

const activeActivityIds = computed(() => {
    // Extrahieren der activityIds aller aktiven Laufzeit-Executions
    const execs = (executions.value as any)?.data || []
    return execs
        .map((e: any) => e.activityId)
        .filter((id: string | null) => id !== null)
})

definePageMeta({
    title: 'Instance Detail'
})
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <UIcon name="i-heroicons-cpu-chip" class="text-primary-500" />
          Live Instance: {{ (instance as any)?.processDefinitionName || 'Loading...' }}
        </h1>
        <p class="text-slate-500 font-medium mt-1">
          Instance ID: {{ id }}
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <UButton :to="`/processes`" color="neutral" variant="subtle" icon="i-heroicons-arrow-left">Back to List</UButton>
      </div>
    </header>

    <UCard class="ring-1 ring-gray-200 dark:ring-gray-800 overflow-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-presentation-chart-line" />
            Live Workflow Representation
          </span>
          <UBadge v-if="(instance as any)?.suspended" color="warning" variant="subtle">Suspended</UBadge>
          <UBadge v-else-if="(instance as any)?.ended" color="neutral" variant="subtle">Ended</UBadge>
          <UBadge v-else color="success" variant="subtle">Running</UBadge>
        </div>
      </template>

      <BpmnViewer 
        v-if="xml" 
        :xml="xml as any" 
        :loading="loadingXml || loadingInst || loadingExecs" 
        :activeActivities="activeActivityIds"
      />
      <div v-else-if="!loadingXml && !loadingInst" class="h-[500px] flex flex-col items-center justify-center text-slate-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
        <UIcon name="i-heroicons-exclamation-circle" class="size-12 mb-4 opacity-20" />
        <p>Model data could not be retrieved from Flowable API.</p>
      </div>
    </UCard>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
            <template #header><h3 class="font-bold">Instance Information</h3></template>
            <dl class="space-y-4">
                <div>
                    <dt class="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Process Definition ID</dt>
                    <dd class="text-slate-800 dark:text-white font-medium">{{ (instance as any)?.processDefinitionId }}</dd>
                </div>
                <div>
                    <dt class="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Started By</dt>
                    <dd class="text-slate-800 dark:text-white font-medium">{{ (instance as any)?.startUserId || 'System' }}</dd>
                </div>
                <div>
                    <dt class="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Start Time</dt>
                    <dd class="text-slate-800 dark:text-white font-medium">{{ (instance as any)?.startTime ? new Date((instance as any).startTime).toLocaleString() : '-' }}</dd>
                </div>
            </dl>
        </UCard>

        <FlowableInstanceVariablesCard :instanceId="id" />
    </div>
  </div>
</template>
