<script setup lang="ts">
import type { Summary } from '../../types/outputs'
import { formatCompact, formatPercent } from '../../utils/formatters'

defineProps<{ summary: Summary; visible: boolean }>()
</script>

<template>
  <Transition name="slide">
    <div
      v-if="visible"
      class="fixed top-0 left-0 right-0 z-[60] bg-bg/95 backdrop-blur-sm border-b border-card-border"
    >
      <div class="max-w-[1440px] mx-auto px-5 lg:px-8 h-10 flex items-center justify-between gap-6 overflow-x-auto">
        <div class="flex items-center gap-5 text-[11px] font-mono whitespace-nowrap">
          <div>
            <span class="text-text-muted mr-1.5">Rental</span>
            <span class="font-semibold text-rental">{{ formatCompact(summary.rentalFinalWealth) }}</span>
          </div>
          <div>
            <span class="text-text-muted mr-1.5">Index</span>
            <span class="font-semibold text-index">{{ formatCompact(summary.indexFundFinalWealth) }}</span>
          </div>
          <div>
            <span class="font-semibold" :class="summary.rentalWins ? 'text-positive' : 'text-negative'">
              {{ summary.rentalWins ? '+' : '-' }}{{ formatCompact(Math.abs(summary.outperformance)) }}
            </span>
          </div>
        </div>
        <div class="hidden sm:flex items-center gap-3 text-[11px] font-mono text-text-muted">
          <span><span class="text-rental">{{ formatPercent(summary.rentalCAGR) }}</span> vs <span class="text-index">{{ formatPercent(summary.indexFundCAGR) }}</span> CAGR</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
