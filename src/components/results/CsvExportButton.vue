<script setup lang="ts">
import type { YearResult } from '../../types/outputs'
import { useCsvExport } from '../../composables/useCsvExport'

const props = defineProps<{ yearResults: YearResult[] }>()
const { exportCsv } = useCsvExport()
</script>

<template>
  <button
    class="btn-ghost flex items-center gap-1.5 text-[11px]"
    @click="exportCsv(yearResults)"
  >
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3M7 20h10a2 2 0 002-2V8l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
    </svg>
    CSV
  </button>
</template>
