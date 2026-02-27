<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const RENTAL = '#e5953e'
const STOCK = '#3b82f6'
const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ yearResults: YearResult[]; totalInvested: number }>()

const chartData = computed(() => {
  let rentalCashIn = props.totalInvested

  return props.yearResults.map(r => {
    if (r.afterTaxCashFlow < 0) {
      rentalCashIn += Math.abs(r.afterTaxCashFlow)
    }
    const stockCashIn = props.totalInvested + r.indexFundContributions

    const rentalProfit = Math.round(r.totalRentalWealth - rentalCashIn)
    const stockProfit = Math.round(r.indexFundValue - stockCashIn)

    return {
      year: r.year,
      rentalCashIn: Math.round(rentalCashIn),
      rentalProfit,
      rentalMultiplier: rentalCashIn > 0 ? r.totalRentalWealth / rentalCashIn : 0,
      stockCashIn: Math.round(stockCashIn),
      stockProfit,
      stockMultiplier: stockCashIn > 0 ? r.indexFundValue / stockCashIn : 0,
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
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string; color: string; seriesIndex: number }>) => {
        const yr = params[0]!.axisValue
        const d = data.find(x => String(x.year) === yr)
        if (!d) return ''

        return `<div style="font-size:10px;color:#71717a;margin-bottom:6px">Year ${yr}</div>
          <div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:2px 12px;font-size:11px">
            <div></div>
            <div style="color:${RENTAL};font-weight:600;text-align:right">Rental</div>
            <div style="color:${STOCK};font-weight:600;text-align:right">Stock</div>
            <div style="color:#71717a">Cash In</div>
            <div style="text-align:right">${formatCurrency(d.rentalCashIn)}</div>
            <div style="text-align:right">${formatCurrency(d.stockCashIn)}</div>
            <div style="color:#71717a">Profit</div>
            <div style="text-align:right;color:${d.rentalProfit >= 0 ? '#22c55e' : '#ef4444'}">${formatCurrency(d.rentalProfit)}</div>
            <div style="text-align:right;color:${d.stockProfit >= 0 ? '#22c55e' : '#ef4444'}">${formatCurrency(d.stockProfit)}</div>
            <div style="color:#71717a;border-top:1px solid #27272a;padding-top:2px">Multiplier</div>
            <div style="text-align:right;font-weight:600;border-top:1px solid #27272a;padding-top:2px">${d.rentalMultiplier.toFixed(2)}x</div>
            <div style="text-align:right;font-weight:600;border-top:1px solid #27272a;padding-top:2px">${d.stockMultiplier.toFixed(2)}x</div>
          </div>`
      },
    },
    legend: {
      data: ['Rental Cash In', 'Rental Profit', 'Stock Cash In', 'Stock Profit'],
      textStyle: { color: LABEL, fontSize: 10, fontFamily: 'Inter' },
      top: 4, right: 4, itemWidth: 12, itemHeight: 8,
    },
    grid: { top: 36, right: 12, bottom: 20, left: 8, containLabel: true },
    xAxis: {
      type: 'category', data: data.map(d => d.year),
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
      // Rental: cash invested (base) + profit (top)
      {
        name: 'Rental Cash In', type: 'bar', stack: 'rental',
        data: data.map(d => d.rentalCashIn),
        itemStyle: { color: 'rgba(229,149,62,0.25)', borderRadius: [0, 0, 0, 0] },
        barWidth: '28%',
        barGap: '30%',
      },
      {
        name: 'Rental Profit', type: 'bar', stack: 'rental',
        data: data.map(d => Math.max(0, d.rentalProfit)),
        itemStyle: { color: RENTAL, borderRadius: [3, 3, 0, 0] },
        label: {
          show: true, position: 'top', color: RENTAL,
          fontSize: 9, fontFamily: 'GeistMono, monospace',
          formatter: (p: { dataIndex: number }) => {
            const m = data[p.dataIndex]?.rentalMultiplier ?? 0
            return m > 0 ? `${m.toFixed(1)}x` : ''
          },
        },
      },
      // Stock: cash invested (base) + profit (top)
      {
        name: 'Stock Cash In', type: 'bar', stack: 'stock',
        data: data.map(d => d.stockCashIn),
        itemStyle: { color: 'rgba(59,130,246,0.25)', borderRadius: [0, 0, 0, 0] },
        barWidth: '28%',
      },
      {
        name: 'Stock Profit', type: 'bar', stack: 'stock',
        data: data.map(d => Math.max(0, d.stockProfit)),
        itemStyle: { color: STOCK, borderRadius: [3, 3, 0, 0] },
        label: {
          show: true, position: 'top', color: STOCK,
          fontSize: 9, fontFamily: 'GeistMono, monospace',
          formatter: (p: { dataIndex: number }) => {
            const m = data[p.dataIndex]?.stockMultiplier ?? 0
            return m > 0 ? `${m.toFixed(1)}x` : ''
          },
        },
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-sm font-semibold text-text-primary">Capital Efficiency</h3>
      <p class="text-[11px] text-text-muted mt-0.5">Cash invested (dim) vs profit generated (bright), with wealth multiplier labels. Rental uses leverage to amplify returns.</p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 300px" />
    </div>
  </div>
</template>
