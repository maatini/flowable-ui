<script setup lang="ts">
import BpmnNavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-js.css'

const props = defineProps<{
  xml: string
  loading?: boolean
  activeActivities?: string[]
}>()

const canvas = ref<HTMLElement | null>(null)
let viewer: any = null

onMounted(() => {
  if (canvas.value) {
    viewer = new BpmnNavigatedViewer({
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

watch(() => props.activeActivities, (newActivities) => {
    applyHighlights(newActivities)
}, { deep: true })

async function renderDiagram(xml: string) {
  try {
    if (!xml.includes('BPMNDiagram') || !xml.includes('BPMNPlane')) {
      console.warn('The provided BPMN XML lacks Diagram Interchange (DI) layout details. Nodes might be missing positions or sequence edges.')
    }

    await viewer.importXML(xml)
    const viewerCanvas = viewer.get('canvas')
    // Automatically fit diagram into the viewport
    viewerCanvas.zoom('fit-viewport')
    
    // Apply highlights if any
    applyHighlights(props.activeActivities)
  } catch (err) {
    console.error('Error rendering BPMN diagram:', err)
  }
}

function applyHighlights(activities?: string[]) {
    if (!viewer) return
    const viewerCanvas = viewer.get('canvas')
    const registry = viewer.get('elementRegistry')
    
    // Zuerst alle alten Highlighi-Marker entfernen (vereinfacht: wir clearen überall wo 'highlight' dran ist, 
    // oder iterieren über alle registry objekte)
    registry.forEach((element: any) => {
        if (viewerCanvas.hasMarker(element.id, 'highlight')) {
            viewerCanvas.removeMarker(element.id, 'highlight')
        }
    })

    // Neue Marker setzen
    if (activities && activities.length > 0) {
        activities.forEach(id => {
            if (registry.get(id)) {
                viewerCanvas.addMarker(id, 'highlight')
            }
        })
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

/* Custom Highlight Markers for BPMN Nodes */
.highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #10b981 !important; /* Emerald 500 */
  stroke-width: 4px !important;
  fill: #ecfdf5 !important;   /* Emerald 50 */
}
/* For dark mode */
.dark .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
    fill: #064e3b !important; /* Emerald 900 */
}
</style>
