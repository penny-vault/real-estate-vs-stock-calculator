<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

defineProps<{ text: string }>()

const show = ref(false)
const tipStyle = ref({ top: '0px', left: '0px' })
const triggerEl = ref<HTMLElement | null>(null)

function onEnter() {
  if (!triggerEl.value) return
  const rect = triggerEl.value.getBoundingClientRect()
  tipStyle.value = {
    top: `${rect.top - 6}px`,
    left: `${Math.max(8, Math.min(rect.left, window.innerWidth - 220))}px`,
  }
  show.value = true
}

function onLeave() {
  show.value = false
}

onBeforeUnmount(() => { show.value = false })
</script>

<template>
  <span
    ref="triggerEl"
    class="cursor-default"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <svg class="w-3 h-3 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
    </svg>
    <Teleport to="body">
      <div
        v-if="show"
        class="fixed z-[9999] px-2.5 py-2 text-[11px] leading-relaxed text-text-secondary bg-[#18181b] border border-card-border rounded-md shadow-xl w-52 pointer-events-none"
        :style="{ top: tipStyle.top, left: tipStyle.left, transform: 'translateY(-100%)' }"
      >{{ text }}</div>
    </Teleport>
  </span>
</template>
