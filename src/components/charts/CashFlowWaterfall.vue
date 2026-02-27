<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const GRID = '#1c1c1f'
const LABEL = '#52525b'

// Per-item semantic colors
const ITEM_COLORS: Record<string, string> = {
  'Gross Rent':    '#22c55e',
  'Other Income':  '#22c55e',
  'Vacancy':       '#f43f5e',
  'Prop. Tax':     '#f59e0b',
  'Insurance':     '#06b6d4',
  'Maintenance':   '#8b5cf6',
  'Management':    '#ec4899',
  'HOA':           '#71717a',
  'Other Exp.':    '#52525b',
  'Mortgage':      '#ef4444',
  'Tax Benefit':   '#22c55e',
}

const props = defineProps<{ yearResults: YearResult[] }>()
const selectedYear = ref(0)

const row = computed(() => props.yearResults[selectedYear.value]!)

const option = computed(() => {
  const r = row.value
  const items = [
    { name: 'Gross Rent', value: r.grossRent },
    { name: 'Other Income', value: r.otherIncome },
    { name: 'Vacancy', value: -r.vacancy },
    { name: 'Prop. Tax', value: -r.propertyTax },
    { name: 'Insurance', value: -r.insurance },
    { name: 'Maintenance', value: -r.maintenance },
    { name: 'Management', value: -r.propertyManagement },
    { name: 'Mortgage', value: -r.mortgagePayment },
    { name: 'Tax Benefit', value: r.taxBenefit },
  ].filter(item => Math.abs(item.value) > 0)

  const net = r.afterTaxCashFlow
  items.push({ name: 'Net Cash Flow', value: net })

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: Array<{ name: string; value: number; axisValue: string }>) => {
        const name = params[0].axisValue
        const item = items.find(i => i.name === name)
        if (!item) return ''
        const color = item.value >= 0 ? '#22c55e' : '#ef4444'
        return `<span style="color:#71717a">${name}</span><br/><span style="color:${color};font-weight:600">${formatCurrency(item.value)}</span>`
      },
    },
    grid: { top: 12, right: 12, bottom: 24, left: 8, containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: LABEL, fontSize: 9, fontFamily: 'GeistMono, monospace',
        formatter: (v: number) => `$${(Math.abs(v) / 1e3).toFixed(0)}K`,
      },
      splitLine: { lineStyle: { color: GRID, type: 'dotted' as const } },
    },
    yAxis: {
      type: 'category',
      data: items.map(i => i.name).reverse(),
      axisLine: { show: false },
      axisLabel: { color: LABEL, fontSize: 9, fontFamily: 'Inter' },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: items.map(item => ({
          value: Math.round(item.value),
          itemStyle: {
            color: item.name === 'Net Cash Flow'
              ? (item.value >= 0 ? '#22c55e' : '#ef4444')
              : (ITEM_COLORS[item.name] ?? '#52525b'),
            borderRadius: item.value >= 0 ? [0, 3, 3, 0] : [3, 0, 0, 3],
          },
        })).reverse(),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          color: LABEL,
          fontSize: 9,
          fontFamily: 'GeistMono, monospace',
          formatter: (p: { value: number }) => formatCurrency(p.value),
        },
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border flex items-center justify-between">
      <h3 class="text-sm font-semibold text-text-primary">Annual Cash Flow</h3>
      <select v-model="selectedYear" class="input-field w-auto py-1 px-2 text-[11px]">
        <option v-for="(r, i) in yearResults" :key="r.year" :value="i">Yr {{ r.year }}</option>
      </select>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 280px" />
    </div>
  </div>
</template>
