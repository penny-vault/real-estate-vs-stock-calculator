<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import type { AllInputs } from '../../types/inputs'
import type { SensitivityHeatmapData } from '../../types/charts'
import { appreciationVsInterestRate, rentGrowthVsVacancy, downPaymentVsIndexReturn } from '../../engine/sensitivity'
import { formatCurrency } from '../../utils/formatters'

const LABEL = '#52525b'

const props = defineProps<{ inputs: AllInputs }>()

const heatmapIndex = ref(0)

const tabs = [
  {
    label: 'Appreciation vs Interest Rate',
    description: 'How property appreciation rate and mortgage interest rate affect whether rental beats stocks. Each cell shows the dollar advantage (green) or disadvantage (red) of rental over stocks.',
  },
  {
    label: 'Rent Growth vs Vacancy',
    description: 'How annual rent increases and vacancy rates change the outcome. Higher rent growth helps rental win; higher vacancy hurts it.',
  },
  {
    label: 'Down Payment vs Stock Return',
    description: 'How your down payment size and stock market returns shift the comparison. Lower down payments amplify leverage; higher stock returns raise the bar for rental to win.',
  },
]

const heatmapData = computed<SensitivityHeatmapData>(() => {
  switch (heatmapIndex.value) {
    case 0: return appreciationVsInterestRate(props.inputs)
    case 1: return rentGrowthVsVacancy(props.inputs)
    case 2: return downPaymentVsIndexReturn(props.inputs)
    default: return appreciationVsInterestRate(props.inputs)
  }
})

const option = computed(() => {
  const d = heatmapData.value
  const allValues = d.data.map(c => c.value)
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: { data: number[] }) => {
        const [x, y, val] = params.data as [number, number, number]
        const winner = val >= 0 ? 'Rental' : 'Stocks'
        const winColor = val >= 0 ? '#22c55e' : '#ef4444'
        return `<div style="margin-bottom:4px">
            <span style="color:#a1a1aa">${d.xName}:</span> <span style="font-weight:600">${d.xLabels[x]}</span>
            <span style="margin-left:8px;color:#a1a1aa">${d.yName}:</span> <span style="font-weight:600">${d.yLabels[y]}</span>
          </div>
          <div style="border-top:1px solid #27272a;padding-top:4px">
            <span style="color:${winColor};font-weight:600">${winner} wins by ${formatCurrency(Math.abs(val))}</span>
          </div>`
      },
    },
    grid: { top: 8, right: 60, bottom: 44, left: 8, containLabel: true },
    xAxis: {
      type: 'category', data: d.xLabels,
      name: d.xName, nameLocation: 'center' as const, nameGap: 28,
      nameTextStyle: { color: '#a1a1aa', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 },
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace' },
      axisLine: { lineStyle: { color: '#1c1c1f' } }, axisTick: { show: false },
    },
    yAxis: {
      type: 'category', data: d.yLabels,
      name: d.yName, nameLocation: 'center' as const, nameGap: 42,
      nameTextStyle: { color: '#a1a1aa', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 },
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace' },
      axisLine: { lineStyle: { color: '#1c1c1f' } }, axisTick: { show: false },
    },
    visualMap: {
      min: minVal, max: maxVal, calculable: false,
      orient: 'vertical' as const, right: 0, top: 'center',
      textStyle: { color: LABEL, fontSize: 9, fontFamily: 'GeistMono, monospace' },
      inRange: { color: ['#7f1d1d', '#991b1b', '#27272a', '#166534', '#15803d'] },
      itemWidth: 10,
      formatter: (v: number) => {
        const abs = Math.abs(v)
        return abs >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`
      },
    },
    series: [{
      type: 'heatmap',
      data: d.data.map(c => [c.x, c.y, c.value]),
      label: {
        show: true, fontSize: 10, fontFamily: 'GeistMono, monospace',
        color: '#d4d4d8',
        formatter: (params: { data: number[] }) => {
          const v = params.data[2] ?? 0
          const abs = Math.abs(v)
          if (abs >= 1e6) return `${v >= 0 ? '+' : '-'}$${(abs / 1e6).toFixed(1)}M`
          if (abs >= 1000) return `${v >= 0 ? '+' : '-'}$${(abs / 1000).toFixed(0)}K`
          return `${v >= 0 ? '+' : '-'}$${abs}`
        },
      },
      itemStyle: { borderRadius: 3, borderWidth: 2, borderColor: '#111113' },
    }],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-[12px] font-medium text-text-primary">Sensitivity Analysis</h3>
          <p class="text-[10px] text-text-muted mt-1 max-w-lg leading-relaxed">
            {{ tabs[heatmapIndex].description }}
          </p>
        </div>
        <div class="flex gap-1 shrink-0">
          <button
            v-for="(tab, i) in tabs" :key="i"
            class="text-[10px] px-2.5 py-1.5 rounded transition-colors whitespace-nowrap"
            :class="heatmapIndex === i ? 'bg-input-border text-text-primary' : 'text-text-muted hover:text-text-secondary'"
            @click="heatmapIndex = i"
          >{{ tab.label }}</button>
        </div>
      </div>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 340px" />
    </div>
    <div class="px-4 py-2 border-t border-card-border flex items-center justify-center gap-6 text-[10px] text-text-muted">
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#15803d"></span> Rental wins</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#27272a"></span> Break-even</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#991b1b"></span> Stocks win</span>
    </div>
  </div>
</template>
