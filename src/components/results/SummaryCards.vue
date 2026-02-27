<script setup lang="ts">
import { computed } from 'vue'
import type { Summary } from '../../types/outputs'
import { formatCurrency, formatPercent, formatCompact } from '../../utils/formatters'

const props = defineProps<{ summary: Summary }>()

const cards = computed(() => [
  {
    label: 'Total Invested',
    value: formatCurrency(props.summary.totalInvested),
    mono: true,
  },
  {
    label: 'Rental Wealth',
    value: formatCompact(props.summary.rentalFinalWealth),
    sub: `${formatPercent(props.summary.rentalCAGR)} CAGR`,
    color: 'text-rental',
    mono: true,
  },
  {
    label: 'Stock Portfolio',
    value: formatCompact(props.summary.indexFundFinalWealth),
    sub: `${formatPercent(props.summary.indexFundCAGR)} CAGR`,
    color: 'text-index',
    mono: true,
  },
  {
    label: props.summary.rentalWins ? 'Rental wins by' : 'Stock portfolio wins by',
    value: formatCompact(Math.abs(props.summary.outperformance)),
    color: props.summary.rentalWins ? 'text-positive' : 'text-negative',
    mono: true,
  },
  {
    label: 'Total Cash Flow',
    value: formatCurrency(props.summary.totalCashFlow),
    color: props.summary.totalCashFlow >= 0 ? 'text-positive' : 'text-negative',
    mono: true,
  },
  {
    label: 'Avg Cash-on-Cash',
    value: formatPercent(props.summary.averageCashOnCash),
    mono: true,
  },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
    <div
      v-for="(c, i) in cards"
      :key="i"
      class="card px-4 py-3.5 animate-in"
      :style="{ animationDelay: `${i * 50}ms` }"
    >
      <div class="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1.5">{{ c.label }}</div>
      <div
        class="text-lg font-semibold tracking-tight"
        :class="[c.color || 'text-text-primary', c.mono ? 'font-mono' : '']"
      >{{ c.value }}</div>
      <div v-if="c.sub" class="text-[11px] text-text-muted mt-0.5 font-mono">{{ c.sub }}</div>
    </div>
  </div>
</template>
