<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-sm font-semibold text-text-primary">{{ title }}</h3>
    </div>
    <div class="p-3">
      <slot />
    </div>
  </div>
</template>
