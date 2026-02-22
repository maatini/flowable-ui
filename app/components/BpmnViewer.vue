<script setup lang="ts">
import BpmnViewer from 'bpmn-js/lib/Viewer'
import { layoutProcess } from 'bpmn-auto-layout'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'

const props = defineProps<{
  xml: string
  loading?: boolean
}>()

const canvas = ref<HTMLElement | null>(null)
let viewer: any = null

onMounted(() => {
  if (canvas.value) {
    viewer = new BpmnViewer({
      container: canvas.value
    })
    if (props.xml) {
      renderDiagram(props.xml)
    }
  }
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
  }
})

watch(() => props.xml, (newXml) => {
  if (newXml && viewer) {
    renderDiagram(newXml)
  }
})

async function renderDiagram(xml: string) {
  try {
    let finalXml = xml
    
    // Check if XML contains DI (Diagram Interchange) info
    if (!xml.includes('BPMNDiagram') || !xml.includes('BPMNPlane')) {
      console.log('No DI info found, applying auto-layout...')
      try {
        finalXml = await layoutProcess(xml)
      } catch (layoutErr) {
        console.warn('Auto-layout failed, trying original XML:', layoutErr)
      }
    }

    await viewer.importXML(finalXml)
    const canvas = viewer.get('canvas')
    canvas.zoom('fit-viewport')
  } catch (err) {
    console.error('Error rendering BPMN diagram:', err)
  }
}

function handleZoomIn() {
  viewer?.get('canvas').zoom(viewer.get('canvas').zoom() * 1.2)
}

function handleZoomOut() {
  viewer?.get('canvas').zoom(viewer.get('canvas').zoom() * 0.8)
}

function handleResetZoom() {
  viewer?.get('canvas').zoom('fit-viewport')
}
</script>

<template>
  <div class="relative w-full h-[500px] border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 z-10">
      <UIcon name="i-heroicons-arrow-path" class="size-8 animate-spin text-primary-500" />
    </div>
    
    <div ref="canvas" class="w-full h-full" />

    <!-- Controls -->
    <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
      <UButton icon="i-heroicons-plus" size="xs" color="neutral" variant="solid" @click="handleZoomIn" />
      <UButton icon="i-heroicons-minus" size="xs" color="neutral" variant="solid" @click="handleZoomOut" />
      <UButton icon="i-heroicons-arrows-pointing-out" size="xs" color="neutral" variant="solid" @click="handleResetZoom" title="Fit Viewport" />
    </div>
  </div>
</template>

<style>
.bjs-powered-by {
  display: none;
}
</style>
