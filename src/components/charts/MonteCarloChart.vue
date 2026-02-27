<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { MonteCarloSummary } from '../../types/monteCarlo'
import { formatCurrency, formatPercent, formatCompact } from '../../utils/formatters'

const RENTAL = '#e5953e'
const INDEX = '#3b82f6'
const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ result: MonteCarloSummary }>()

const option = computed(() => {
  const { bands } = props.result
  const years = bands.years

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 10, fontFamily: 'GeistMono, monospace' },
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string }>) => {
        let html = `<div style="color:#71717a;margin-bottom:4px">Year ${params[0].axisValue}</div>`
        const rental = params.filter(p => p.seriesName.startsWith('R-'))
        const index = params.filter(p => p.seriesName.startsWith('I-'))
        if (rental.length) {
          html += `<div style="color:${RENTAL};font-weight:600;font-size:10px;margin-bottom:2px">Rental</div>`
          rental.filter(p => p.value != null).forEach(p => {
            html += `<div style="font-size:10px">${p.seriesName.replace('R-', '')}: ${formatCurrency(p.value)}</div>`
          })
        }
        if (index.length) {
          html += `<div style="color:${INDEX};font-weight:600;font-size:10px;margin-top:3px;margin-bottom:2px">Stock</div>`
          index.filter(p => p.value != null).forEach(p => {
            html += `<div style="font-size:10px">${p.seriesName.replace('I-', '')}: ${formatCurrency(p.value)}</div>`
          })
        }
        return html
      },
    },
    legend: {
      data: ['R-Median', 'I-Median'],
      textStyle: { color: LABEL, fontSize: 10 }, top: 4, right: 4, itemWidth: 12, itemHeight: 2,
    },
    grid: { top: 36, right: 12, bottom: 20, left: 8, containLabel: true },
    xAxis: {
      type: 'category', data: years, boundaryGap: false,
      axisLine: { lineStyle: { color: GRID } },
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace', formatter: (v: number) => v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K` },
      splitLine: { lineStyle: { color: GRID, type: 'dotted' as const } },
    },
    series: [
      { name: 'R-P10', type: 'line', data: bands.rental.p10, lineStyle: { width: 0 }, symbol: 'none', stack: 'rb', areaStyle: { color: 'transparent' } },
      { name: 'R-P90', type: 'line', data: bands.rental.p90.map((v, i) => v - bands.rental.p10[i]), lineStyle: { width: 0 }, symbol: 'none', stack: 'rb', areaStyle: { color: 'rgba(229,149,62,0.06)' } },
      { name: 'R-P25', type: 'line', data: bands.rental.p25, lineStyle: { width: 0 }, symbol: 'none', stack: 'ri', areaStyle: { color: 'transparent' } },
      { name: 'R-P75', type: 'line', data: bands.rental.p75.map((v, i) => v - bands.rental.p25[i]), lineStyle: { width: 0 }, symbol: 'none', stack: 'ri', areaStyle: { color: 'rgba(229,149,62,0.14)' } },
      { name: 'R-Median', type: 'line', data: bands.rental.p50, lineStyle: { width: 2, color: RENTAL }, itemStyle: { color: RENTAL }, symbol: 'none', smooth: true },
      { name: 'I-P10', type: 'line', data: bands.index.p10, lineStyle: { width: 0 }, symbol: 'none', stack: 'ib', areaStyle: { color: 'transparent' } },
      { name: 'I-P90', type: 'line', data: bands.index.p90.map((v, i) => v - bands.index.p10[i]), lineStyle: { width: 0 }, symbol: 'none', stack: 'ib', areaStyle: { color: 'rgba(59,130,246,0.06)' } },
      { name: 'I-P25', type: 'line', data: bands.index.p25, lineStyle: { width: 0 }, symbol: 'none', stack: 'ii', areaStyle: { color: 'transparent' } },
      { name: 'I-P75', type: 'line', data: bands.index.p75.map((v, i) => v - bands.index.p25[i]), lineStyle: { width: 0 }, symbol: 'none', stack: 'ii', areaStyle: { color: 'rgba(59,130,246,0.14)' } },
      { name: 'I-Median', type: 'line', data: bands.index.p50, lineStyle: { width: 2, color: INDEX }, itemStyle: { color: INDEX }, symbol: 'none', smooth: true },
    ],
  }
})
</script>

<template>
  <div>
    <VChart :option="option" autoresize style="height: 320px" />
    <div class="grid grid-cols-2 gap-4 mt-3 px-1">
      <div class="space-y-1.5">
        <div class="text-[10px] font-medium text-rental uppercase tracking-wider">Rental</div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] font-mono">
          <span class="text-text-muted">Mean</span><span class="text-text-secondary">{{ formatCompact(result.rentalMean) }}</span>
          <span class="text-text-muted">Median</span><span class="text-text-secondary">{{ formatCompact(result.rentalMedian) }}</span>
          <span class="text-text-muted">Best</span><span class="text-positive">{{ formatCompact(result.rentalBest) }}</span>
          <span class="text-text-muted">Worst</span><span class="text-negative">{{ formatCompact(result.rentalWorst) }}</span>
        </div>
      </div>
      <div class="space-y-1.5">
        <div class="text-[10px] font-medium text-index uppercase tracking-wider">Stock Portfolio</div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] font-mono">
          <span class="text-text-muted">Mean</span><span class="text-text-secondary">{{ formatCompact(result.indexMean) }}</span>
          <span class="text-text-muted">Median</span><span class="text-text-secondary">{{ formatCompact(result.indexMedian) }}</span>
          <span class="text-text-muted">Best</span><span class="text-positive">{{ formatCompact(result.indexBest) }}</span>
          <span class="text-text-muted">Worst</span><span class="text-negative">{{ formatCompact(result.indexWorst) }}</span>
        </div>
      </div>
      <div class="col-span-2 pt-2 border-t border-card-border">
        <div class="flex items-center justify-center gap-2 text-[12px] font-mono">
          <span class="text-text-muted">P(Rental wins):</span>
          <span class="font-semibold" :class="result.probRentalWins > 50 ? 'text-rental' : 'text-index'">
            {{ formatPercent(result.probRentalWins) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
