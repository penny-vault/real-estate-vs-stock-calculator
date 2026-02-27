<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ yearResults: YearResult[]; totalInvested: number }>()

const chartData = computed(() => {
  let cumPrincipal = 0
  return props.yearResults.map(r => {
    cumPrincipal += r.principalPaydown
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
})

// Final year breakdown for the summary strip
const finalYear = computed(() => {
  const d = chartData.value
  return d[d.length - 1]
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
        let html = `<div style="font-size:10px;color:#71717a;margin-bottom:6px">Year ${params[0]!.axisValue}</div>`

        // Rental components
        const rentalItems = params.filter(p => p.seriesName !== 'Stock Portfolio')
        const stockItem = params.find(p => p.seriesName === 'Stock Portfolio')
        const d = data.find(x => String(x.year) === params[0]!.axisValue)

        rentalItems.forEach(p => {
          html += `<div style="display:flex;align-items:center;gap:6px;line-height:1.6">
            <span style="width:6px;height:6px;border-radius:1px;background:${p.color};display:inline-block"></span>
            <span style="flex:1;color:#a1a1aa">${p.seriesName}</span>
            <span style="font-weight:600">${formatCurrency(p.value)}</span>
          </div>`
        })

        if (d) {
          html += `<div style="border-top:1px solid #27272a;margin-top:4px;padding-top:4px;display:flex;justify-content:space-between;line-height:1.6">
            <span style="color:#e5953e;font-weight:600">Total Rental</span>
            <span style="font-weight:600">${formatCurrency(d.totalRentalWealth)}</span>
          </div>`
        }

        if (stockItem) {
          html += `<div style="display:flex;align-items:center;gap:6px;line-height:1.6;margin-top:2px">
            <span style="width:6px;height:6px;border-radius:1px;background:${stockItem.color};display:inline-block"></span>
            <span style="flex:1;color:#a1a1aa">${stockItem.seriesName}</span>
            <span style="font-weight:600">${formatCurrency(stockItem.value)}</span>
          </div>`
        }

        return html
      },
    },
    legend: {
      data: ['Down Payment', 'Principal Paid', 'Appreciation', 'Cash Flow', 'Stock Portfolio'],
      textStyle: { color: LABEL, fontSize: 10, fontFamily: 'Inter' },
      top: 4, right: 4, itemWidth: 12, itemHeight: 8,
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
      axisLabel: {
        color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace',
        formatter: (v: number) => v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K`,
      },
      splitLine: { lineStyle: { color: GRID, type: 'dotted' as const } },
    },
    series: [
      {
        name: 'Down Payment', type: 'bar', stack: 'rental',
        data: data.map(d => d.initialEquity),
        itemStyle: { color: '#a1a1aa' },
        barWidth: '50%',
      },
      {
        name: 'Principal Paid', type: 'bar', stack: 'rental',
        data: data.map(d => d.cumPrincipal),
        itemStyle: { color: '#14b8a6' },
      },
      {
        name: 'Appreciation', type: 'bar', stack: 'rental',
        data: data.map(d => d.appreciation),
        itemStyle: { color: '#f59e0b' },
      },
      {
        name: 'Cash Flow', type: 'bar', stack: 'rental',
        data: data.map(d => d.cashFlow),
        itemStyle: { color: '#a855f7', borderRadius: [3, 3, 0, 0] },
      },
      {
        name: 'Stock Portfolio', type: 'line',
        data: data.map(d => d.stockPortfolio),
        lineStyle: { width: 2.5, color: '#3b82f6', type: 'dashed' as const },
        itemStyle: { color: '#3b82f6' }, symbol: 'circle', symbolSize: 5,
        z: 10,
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-sm font-semibold text-text-primary">Where Rental Wealth Comes From</h3>
      <p class="text-[11px] text-text-muted mt-0.5">Each bar breaks down your rental equity into its sources. The dashed line shows the stock alternative.</p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 300px" />
    </div>
    <div v-if="finalYear" class="px-4 py-2.5 border-t border-card-border grid grid-cols-5 gap-2 text-center">
      <div>
        <p class="text-[11px] text-text-muted uppercase tracking-wider">Down Pmt</p>
        <p class="text-[12px] font-semibold font-mono mt-0.5 text-[#a1a1aa]">{{ formatCurrency(finalYear.initialEquity) }}</p>
      </div>
      <div>
        <p class="text-[11px] text-text-muted uppercase tracking-wider">Principal</p>
        <p class="text-[12px] font-semibold font-mono mt-0.5 text-[#14b8a6]">{{ formatCurrency(finalYear.cumPrincipal) }}</p>
      </div>
      <div>
        <p class="text-[11px] text-text-muted uppercase tracking-wider">Apprec.</p>
        <p class="text-[12px] font-semibold font-mono mt-0.5 text-[#f59e0b]">{{ formatCurrency(finalYear.appreciation) }}</p>
      </div>
      <div>
        <p class="text-[11px] text-text-muted uppercase tracking-wider">Cash Flow</p>
        <p class="text-[12px] font-semibold font-mono mt-0.5 text-[#a855f7]">{{ formatCurrency(finalYear.cashFlow) }}</p>
      </div>
      <div>
        <p class="text-[11px] text-text-muted uppercase tracking-wider">Stock Alt.</p>
        <p class="text-[12px] font-semibold font-mono mt-0.5 text-[#3b82f6]">{{ formatCurrency(finalYear.stockPortfolio) }}</p>
      </div>
    </div>
  </div>
</template>
