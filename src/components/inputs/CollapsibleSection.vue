<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  defaultOpen?: boolean
}>(), {
  defaultOpen: true,
})

const isOpen = ref(props.defaultOpen)
</script>

<template>
  <div class="card">
    <button
      class="w-full flex items-center justify-between px-4 py-3 text-left"
      @click="isOpen = !isOpen"
    >
      <h3 class="text-[12px] font-medium text-text-primary">{{ title }}</h3>
      <svg
        class="w-3.5 h-3.5 text-text-muted transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      class="grid transition-all duration-200 ease-in-out"
      :class="isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    >
      <div class="overflow-hidden">
        <div class="px-4 pb-4 pt-0.5 space-y-3">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
