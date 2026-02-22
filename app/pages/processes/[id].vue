<script setup lang="ts">
const route = useRoute()
const flowable = useFlowable()

const id = route.params.id as string

const { data: definition, pending: loadingDef } = await useAsyncData(`proc-def-${id}`, () => flowable.getProcessDefinition(id))
const { data: xml, pending: loadingXml } = await useAsyncData(`proc-xml-${id}`, () => flowable.getProcessModel(id))

const definitionAny = computed(() => definition.value as any)

definePageMeta({
    title: 'Process Detail'
})
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <UIcon name="i-heroicons-document-text" class="text-primary-500" />
          {{ definitionAny?.name || 'Process Model' }}
        </h1>
        <p class="text-slate-500 font-medium mt-1">
          ID: {{ id }} • Version: {{ definitionAny?.version }}
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
            Visual Workflow Representation
          </span>
          <UBadge v-if="definitionAny?.suspended" color="warning" variant="subtle">Suspended</UBadge>
          <UBadge v-else color="success" variant="subtle">Active</UBadge>
        </div>
      </template>

      <BpmnViewer 
        v-if="xml" 
        :xml="xml as any" 
        :loading="loadingXml" 
      />
      <div v-else-if="!loadingXml" class="h-[500px] flex flex-col items-center justify-center text-slate-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
        <UIcon name="i-heroicons-exclamation-circle" class="size-12 mb-4 opacity-20" />
        <p>Model data could not be retrieved from Flowable API.</p>
      </div>
    </UCard>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
            <template #header><h3 class="font-bold">Metadata</h3></template>
            <dl class="space-y-4">
                <div>
                    <dt class="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Key</dt>
                    <dd class="text-slate-800 dark:text-white font-medium">{{ definitionAny?.key }}</dd>
                </div>
                <div>
                    <dt class="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Category</dt>
                    <dd class="text-slate-800 dark:text-white font-medium">{{ definitionAny?.category || 'None' }}</dd>
                </div>
                <div>
                    <dt class="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Deployment ID</dt>
                    <dd class="text-slate-800 dark:text-white font-medium">{{ definitionAny?.deploymentId }}</dd>
                </div>
            </dl>
        </UCard>

        <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
            <template #header><h3 class="font-bold">Information</h3></template>
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                This diagram represents the executable process model. You can examine the logical flow, service tasks, and user decision points. Zoom and pan controls are available at the bottom right of the viewer.
            </p>
        </UCard>
    </div>
  </div>
</template>
