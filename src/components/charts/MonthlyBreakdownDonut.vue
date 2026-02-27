<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const props = defineProps<{ yearResults: YearResult[] }>()
const selectedYear = ref(0)

const option = computed(() => {
  const r = props.yearResults[selectedYear.value]!
  const data = [
    { value: Math.round(r.mortgagePayment), name: 'Mortgage', itemStyle: { color: '#ef4444' } },
    { value: Math.round(r.propertyTax), name: 'Prop Tax', itemStyle: { color: '#f59e0b' } },
    { value: Math.round(r.insurance), name: 'Insurance', itemStyle: { color: '#06b6d4' } },
    { value: Math.round(r.maintenance), name: 'Maint.', itemStyle: { color: '#8b5cf6' } },
    { value: Math.round(r.propertyManagement), name: 'Mgmt', itemStyle: { color: '#ec4899' } },
    { value: Math.round(r.vacancy), name: 'Vacancy', itemStyle: { color: '#f43f5e' } },
    { value: Math.round(r.hoa), name: 'HOA', itemStyle: { color: '#71717a' } },
    { value: Math.round(r.otherExpenses), name: 'Other', itemStyle: { color: '#52525b' } },
  ].filter(d => d.value > 0)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: { name: string; value: number; percent: number }) =>
        `${params.name}<br/><b>${formatCurrency(params.value)}</b> (${params.percent.toFixed(1)}%)`,
    },
    series: [{
      type: 'pie', radius: ['48%', '72%'], center: ['50%', '52%'],
      data,
      label: { show: true, position: 'outside', color: '#71717a', fontSize: 10, fontFamily: 'Inter', formatter: '{b}' },
      labelLine: { lineStyle: { color: '#27272a' } },
      emphasis: { itemStyle: { shadowBlur: 0 } },
      itemStyle: { borderRadius: 3, borderColor: '#111113', borderWidth: 2 },
    }],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border flex items-center justify-between">
      <h3 class="text-sm font-semibold text-text-primary">Expense Breakdown</h3>
      <select v-model="selectedYear" class="input-field w-auto py-1 px-2 text-[11px]">
        <option v-for="(r, i) in yearResults" :key="r.year" :value="i">Yr {{ r.year }}</option>
      </select>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 240px" />
    </div>
  </div>
</template>
