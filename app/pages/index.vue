<script setup lang="ts">
// Simple redirect from root to dashboard
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/dashboard')
    }
  ]
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <ULoader />
  </div>
</template>
