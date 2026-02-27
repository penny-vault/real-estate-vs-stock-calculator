<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const RENTAL = '#e5953e'
const INDEX = '#3b82f6'
const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ yearResults: YearResult[] }>()

const crossoverYear = computed(() => {
  for (let i = 0; i < props.yearResults.length; i++) {
    const r = props.yearResults[i]
    if (r.totalRentalWealth >= r.indexFundValue) return r.year
  }
  return null
})

const option = computed(() => {
  const years = props.yearResults.map(r => r.year)
  const rentalData = props.yearResults.map(r => Math.round(r.totalRentalWealth))
  const stockData = props.yearResults.map(r => Math.round(r.indexFundValue))
  const diffData = props.yearResults.map(r => Math.round(r.totalRentalWealth - r.indexFundValue))

  // Mark lines for crossover
  const markLines: Array<{ xAxis: number; label: { formatter: string; color: string; fontSize: number }; lineStyle: { color: string; type: string } }> = []
  const cy = crossoverYear.value
  if (cy !== null) {
    markLines.push({
      xAxis: cy,
      label: { formatter: `Break-even: Year ${cy}`, color: '#22c55e', fontSize: 10 },
      lineStyle: { color: '#22c55e', type: 'dashed' },
    })
  }

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string; color: string }>) => {
        const year = params[0]!.axisValue
        let html = `<div style="font-size:10px;color:#71717a;margin-bottom:4px">Year ${year}</div>`
        params.forEach(p => {
          html += `<div style="display:flex;align-items:center;gap:6px;line-height:1.5">
            <span style="width:6px;height:6px;border-radius:1px;background:${p.color};display:inline-block"></span>
            <span style="flex:1;color:#a1a1aa">${p.seriesName}</span>
            <span style="font-weight:600">${formatCurrency(p.value)}</span>
          </div>`
        })
        return html
      },
    },
    legend: {
      data: ['Rental', 'Stock Portfolio', 'Difference'],
      textStyle: { color: LABEL, fontSize: 10, fontFamily: 'Inter' },
      top: 4, right: 4, itemWidth: 12, itemHeight: 2,
    },
    grid: { top: 36, right: 12, bottom: 20, left: 8, containLabel: true },
    xAxis: {
      type: 'category', data: years,
      axisLine: { lineStyle: { color: GRID } },
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace',
        formatter: (v: number) => v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K`,
      },
      splitLine: { lineStyle: { color: GRID, type: 'dotted' as const } },
    },
    series: [
      {
        name: 'Rental', type: 'line',
        data: rentalData, smooth: 0.3,
        lineStyle: { width: 2, color: RENTAL },
        itemStyle: { color: RENTAL }, symbol: 'circle', symbolSize: 4,
        markLine: markLines.length ? {
          symbol: 'none',
          data: markLines.map(m => ({ xAxis: m.xAxis, label: m.label, lineStyle: m.lineStyle })),
        } : undefined,
      },
      {
        name: 'Stock Portfolio', type: 'line',
        data: stockData, smooth: 0.3,
        lineStyle: { width: 2, color: INDEX },
        itemStyle: { color: INDEX }, symbol: 'circle', symbolSize: 4,
      },
      {
        name: 'Difference', type: 'bar',
        data: diffData,
        itemStyle: {
          color: (params: { value: number }) => params.value >= 0 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
          borderRadius: [2, 2, 0, 0],
        },
        barWidth: '40%',
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-[12px] font-medium text-text-primary">Break-Even Analysis</h3>
      <p class="text-[10px] text-text-muted mt-0.5">
        <template v-if="crossoverYear !== null">Rental surpasses stock portfolio at year {{ crossoverYear }}</template>
        <template v-else>Rental does not surpass stock portfolio within the holding period</template>
      </p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 280px" />
    </div>
  </div>
</template>
