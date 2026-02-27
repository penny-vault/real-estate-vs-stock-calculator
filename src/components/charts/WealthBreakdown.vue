<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ yearResults: YearResult[]; totalInvested: number }>()

// Compute cumulative principal paydown and initial equity
const chartData = computed(() => {
  let cumPrincipal = 0
  const years = props.yearResults.map((r, i) => {
    cumPrincipal += r.principalPaydown

    // Initial equity = equity - cumPrincipal - appreciation
    // This is constant: down payment + (ARV - purchasePrice)
    const initialEquity = r.equity - cumPrincipal - r.appreciationGain

    return {
      year: r.year,
      initialEquity: Math.round(initialEquity),
      cumPrincipal: Math.round(cumPrincipal),
      appreciation: Math.round(r.appreciationGain),
      cashFlow: Math.round(r.cumulativeCashFlow),
      totalRentalWealth: Math.round(r.totalRentalWealth),
      stockPortfolio: Math.round(r.indexFundValue),
    }
  })
  return years
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
          if (p.value !== 0) {
            html += `<div style="display:flex;align-items:center;gap:6px;line-height:1.5">
              <span style="width:6px;height:6px;border-radius:1px;background:${p.color};display:inline-block"></span>
              <span style="flex:1;color:#a1a1aa">${p.seriesName}</span>
              <span style="font-weight:600">${formatCurrency(p.value)}</span>
            </div>`
          }
        })
        return html
      },
    },
    legend: {
      data: ['Down Payment', 'Principal Paid', 'Appreciation', 'Cash Flow', 'Stock Portfolio'],
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
      boundaryGap: false,
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
        name: 'Down Payment', type: 'line', stack: 'r',
        data: data.map(d => d.initialEquity),
        areaStyle: { color: 'rgba(161,161,170,0.12)' },
        lineStyle: { width: 1.5, color: '#a1a1aa' },
        itemStyle: { color: '#a1a1aa' }, symbol: 'none', smooth: true,
      },
      {
        name: 'Principal Paid', type: 'line', stack: 'r',
        data: data.map(d => d.cumPrincipal),
        areaStyle: { color: 'rgba(20,184,166,0.12)' },
        lineStyle: { width: 1.5, color: '#14b8a6' },
        itemStyle: { color: '#14b8a6' }, symbol: 'none', smooth: true,
      },
      {
        name: 'Appreciation', type: 'line', stack: 'r',
        data: data.map(d => d.appreciation),
        areaStyle: { color: 'rgba(245,158,11,0.12)' },
        lineStyle: { width: 1.5, color: '#f59e0b' },
        itemStyle: { color: '#f59e0b' }, symbol: 'none', smooth: true,
      },
      {
        name: 'Cash Flow', type: 'line', stack: 'r',
        data: data.map(d => d.cashFlow),
        areaStyle: { color: 'rgba(168,85,247,0.12)' },
        lineStyle: { width: 1.5, color: '#a855f7' },
        itemStyle: { color: '#a855f7' }, symbol: 'none', smooth: true,
      },
      {
        name: 'Stock Portfolio', type: 'line',
        data: data.map(d => d.stockPortfolio),
        lineStyle: { width: 2, color: '#3b82f6', type: 'dashed' as const },
        itemStyle: { color: '#3b82f6' }, symbol: 'none', smooth: true,
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-[12px] font-medium text-text-primary">Wealth Components vs Stock Portfolio</h3>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 300px" />
    </div>
  </div>
</template>
