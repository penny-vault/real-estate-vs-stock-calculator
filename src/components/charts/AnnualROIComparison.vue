<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatPercent } from '../../utils/formatters'

const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ yearResults: YearResult[]; totalInvested: number }>()

const chartData = computed(() => {
  let prevAppreciation = 0
  return props.yearResults.map((r, i) => {
    const appreciationReturn = ((r.appreciationGain - prevAppreciation) / props.totalInvested) * 100
    prevAppreciation = r.appreciationGain
    const cashFlowReturn = (r.afterTaxCashFlow / props.totalInvested) * 100
    const principalReturn = (r.principalPaydown / props.totalInvested) * 100

    // Stock return for the year
    const prevStock = i === 0 ? props.totalInvested : props.yearResults[i - 1].indexFundValue
    const stockReturn = ((r.indexFundValue - prevStock) / prevStock) * 100

    return {
      year: r.year,
      appreciationReturn,
      cashFlowReturn,
      principalReturn,
      totalRental: appreciationReturn + cashFlowReturn + principalReturn,
      stockReturn,
    }
  })
})

const option = computed(() => {
  const data = chartData.value
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string; color: string }>) => {
        let html = `<div style="font-size:10px;color:#71717a;margin-bottom:4px">Year ${params[0]!.axisValue}</div>`
        params.forEach(p => {
          html += `<div style="display:flex;align-items:center;gap:6px;line-height:1.5">
            <span style="width:6px;height:6px;border-radius:1px;background:${p.color};display:inline-block"></span>
            <span style="flex:1;color:#a1a1aa">${p.seriesName}</span>
            <span style="font-weight:600">${formatPercent(p.value)}</span>
          </div>`
        })
        return html
      },
    },
    legend: {
      data: ['Appreciation', 'Cash Flow', 'Principal', 'Stock Return'],
      textStyle: { color: LABEL, fontSize: 10, fontFamily: 'Inter' },
      top: 4, right: 4, itemWidth: 12, itemHeight: 2,
    },
    grid: { top: 36, right: 12, bottom: 20, left: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.year),
      axisLine: { lineStyle: { color: GRID } },
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace', formatter: (v: number) => `${v.toFixed(0)}%` },
      splitLine: { lineStyle: { color: GRID, type: 'dotted' as const } },
    },
    series: [
      {
        name: 'Appreciation', type: 'bar', stack: 'rental',
        data: data.map(d => +d.appreciationReturn.toFixed(2)),
        itemStyle: { color: '#f59e0b', borderRadius: [0, 0, 0, 0] },
        barWidth: '30%',
      },
      {
        name: 'Cash Flow', type: 'bar', stack: 'rental',
        data: data.map(d => +d.cashFlowReturn.toFixed(2)),
        itemStyle: { color: '#8b5cf6' },
      },
      {
        name: 'Principal', type: 'bar', stack: 'rental',
        data: data.map(d => +d.principalReturn.toFixed(2)),
        itemStyle: { color: '#06b6d4', borderRadius: [3, 3, 0, 0] },
      },
      {
        name: 'Stock Return', type: 'bar',
        data: data.map(d => +d.stockReturn.toFixed(2)),
        itemStyle: { color: '#3b82f6', borderRadius: [3, 3, 0, 0] },
        barWidth: '30%',
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-sm font-semibold text-text-primary">Annual Return Breakdown</h3>
      <p class="text-[11px] text-text-muted mt-0.5">Rental components vs stock portfolio return each year</p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 280px" />
    </div>
  </div>
</template>
