<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ yearResults: YearResult[]; totalInvested: number }>()

// Compute cumulative cost totals for the summary strip
const totals = computed(() => {
  let totalMortgage = 0
  let totalInterest = 0
  let totalPrincipal = 0
  let totalExpenses = 0

  props.yearResults.forEach(r => {
    totalMortgage += r.mortgagePayment
    totalInterest += r.mortgagePayment - r.principalPaydown
    totalPrincipal += r.principalPaydown
    totalExpenses += r.totalExpenses
  })

  const last = props.yearResults[props.yearResults.length - 1]
  const first = props.yearResults[0]

  return {
    totalMortgage,
    totalInterest,
    totalPrincipal,
    totalExpenses,
    totalCost: totalMortgage + totalExpenses,
    startValue: first ? first.propertyValue : 0,
    endValue: last ? last.propertyValue : 0,
    startLoan: first ? first.loanBalance + first.principalPaydown : 0,
    endLoan: last ? last.loanBalance : 0,
    endEquity: last ? last.equity : 0,
  }
})

const option = computed(() => {
  const years = props.yearResults.map(r => r.year)
  const propValues = props.yearResults.map(r => Math.round(r.propertyValue))
  const loanValues = props.yearResults.map(r => Math.round(r.loanBalance))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: Array<{ seriesName: string; value: number; color: string; axisValue: string }>) => {
        const year = params[0]!.axisValue
        const yi = parseInt(year) - 1
        const r = props.yearResults[yi]
        if (!r) return ''

        return `<div style="font-size:10px;color:#71717a;margin-bottom:6px">Year ${year}</div>
          <div style="display:flex;justify-content:space-between;gap:20px;line-height:1.6">
            <span style="color:#e5953e">Property Value</span>
            <span style="font-weight:600">${formatCurrency(r.propertyValue)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;gap:20px;line-height:1.6">
            <span style="color:#ef4444">Loan Balance</span>
            <span style="font-weight:600">${formatCurrency(r.loanBalance)}</span>
          </div>
          <div style="border-top:1px solid #27272a;margin:4px 0;padding-top:4px;display:flex;justify-content:space-between;gap:20px;line-height:1.6">
            <span style="color:#22c55e;font-weight:600">Equity</span>
            <span style="font-weight:600;color:#22c55e">${formatCurrency(r.equity)}</span>
          </div>`
      },
    },
    legend: { show: false },
    grid: { top: 16, right: 12, bottom: 20, left: 8, containLabel: true },
    xAxis: {
      type: 'category', data: years, boundaryGap: false,
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
      // Property value line (top boundary)
      {
        name: 'Property Value', type: 'line',
        data: propValues, smooth: 0.3,
        lineStyle: { width: 2, color: '#e5953e' },
        itemStyle: { color: '#e5953e' },
        symbol: 'circle', symbolSize: 4,
        areaStyle: { color: 'rgba(34,197,94,0.10)' },
        z: 2,
      },
      // Loan balance line (bottom boundary) - area under it masks the equity fill
      {
        name: 'Loan Balance', type: 'line',
        data: loanValues, smooth: 0.3,
        lineStyle: { width: 2, color: '#ef4444' },
        itemStyle: { color: '#ef4444' },
        symbol: 'circle', symbolSize: 4,
        areaStyle: { color: '#111113' },
        z: 3,
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-[12px] font-medium text-text-primary">Property Equity Buildup</h3>
      <p class="text-[10px] text-text-muted mt-0.5">
        <span style="color:#e5953e">Property value</span> rises,
        <span style="color:#ef4444">loan balance</span> falls --
        the <span style="color:#22c55e">green area</span> is your equity
      </p>
    </div>

    <div class="p-3">
      <VChart :option="option" autoresize style="height: 280px" />
    </div>

    <!-- Summary strip -->
    <div class="border-t border-card-border px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div>
        <div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Final Equity</div>
        <div class="text-sm font-semibold font-mono text-positive">{{ formatCurrency(totals.endEquity) }}</div>
      </div>
      <div>
        <div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Principal Paid</div>
        <div class="text-sm font-semibold font-mono text-text-secondary">{{ formatCurrency(totals.totalPrincipal) }}</div>
      </div>
      <div>
        <div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Interest Paid</div>
        <div class="text-sm font-semibold font-mono text-negative">{{ formatCurrency(totals.totalInterest) }}</div>
      </div>
      <div>
        <div class="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Total Expenses</div>
        <div class="text-sm font-semibold font-mono text-negative">{{ formatCurrency(totals.totalExpenses) }}</div>
      </div>
    </div>
  </div>
</template>
