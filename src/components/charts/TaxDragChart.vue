<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import type { AllInputs } from '../../types/inputs'
import { formatCurrency } from '../../utils/formatters'

const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ yearResults: YearResult[]; inputs: AllInputs }>()

const chartData = computed(() => {
  return props.yearResults.map(r => {
    // Stock: annual dividend tax paid
    const dividends = r.indexFundValue * (props.inputs.indexFund.dividendYieldPercent / 100)
    const dividendTax = dividends * (props.inputs.indexFund.dividendTaxRate / 100)

    return {
      year: r.year,
      // Rental: positive = tax savings, negative = tax owed
      rentalBenefit: Math.max(0, Math.round(r.taxBenefit)),
      rentalOwed: Math.min(0, Math.round(r.taxBenefit)),
      // Stock: always a cost (show as negative)
      stockTax: Math.round(-dividendTax),
    }
  })
})

// Cumulative totals for summary strip
const totals = computed(() => {
  let rentalTotal = 0
  let stockTotal = 0
  props.yearResults.forEach(r => {
    rentalTotal += r.taxBenefit
    const dividends = r.indexFundValue * (props.inputs.indexFund.dividendYieldPercent / 100)
    stockTotal += dividends * (props.inputs.indexFund.dividendTaxRate / 100)
  })
  return {
    rentalTotal: Math.round(rentalTotal),
    stockTotal: Math.round(-stockTotal),
    netAdvantage: Math.round(rentalTotal + stockTotal),
  }
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
        const yr = params[0]!.axisValue
        const d = data.find(x => String(x.year) === yr)
        if (!d) return ''
        const rentalNet = d.rentalBenefit + d.rentalOwed
        const lines = [
          `<div style="font-size:10px;color:#71717a;margin-bottom:4px">Year ${yr}</div>`,
          `<div style="display:flex;justify-content:space-between;gap:16px;line-height:1.6">`,
          `<span style="color:#a1a1aa">Rental tax</span>`,
          `<span style="font-weight:600;color:${rentalNet >= 0 ? '#22c55e' : '#ef4444'}">${rentalNet >= 0 ? 'saves' : 'costs'} ${formatCurrency(Math.abs(rentalNet))}</span>`,
          `</div>`,
          `<div style="display:flex;justify-content:space-between;gap:16px;line-height:1.6">`,
          `<span style="color:#a1a1aa">Stock dividend tax</span>`,
          `<span style="font-weight:600;color:#ef4444">costs ${formatCurrency(Math.abs(d.stockTax))}</span>`,
          `</div>`,
        ]
        return lines.join('')
      },
    },
    legend: {
      data: ['Rental: Tax Saved', 'Rental: Tax Owed', 'Stock: Dividend Tax'],
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
        formatter: (v: number) => {
          const abs = Math.abs(v)
          const sign = v >= 0 ? '' : '-'
          return abs >= 1e3 ? `${sign}$${(abs / 1e3).toFixed(0)}K` : `${sign}$${abs}`
        },
      },
      splitLine: { lineStyle: { color: GRID, type: 'dotted' as const } },
    },
    series: [
      {
        name: 'Rental: Tax Saved', type: 'bar', stack: 'rental',
        data: data.map(d => d.rentalBenefit),
        itemStyle: { color: '#22c55e', borderRadius: [3, 3, 0, 0] },
        barWidth: '30%',
        barGap: '20%',
      },
      {
        name: 'Rental: Tax Owed', type: 'bar', stack: 'rental',
        data: data.map(d => d.rentalOwed),
        itemStyle: { color: '#ef4444', borderRadius: [0, 0, 3, 3] },
      },
      {
        name: 'Stock: Dividend Tax', type: 'bar',
        data: data.map(d => d.stockTax),
        itemStyle: { color: '#3b82f6', borderRadius: [0, 0, 3, 3] },
        barWidth: '30%',
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-sm font-semibold text-text-primary">Annual Tax Impact</h3>
      <p class="text-[11px] text-text-muted mt-0.5">
        Rental properties generate tax deductions (depreciation, mortgage interest) early on, but may owe taxes as income grows. Stocks pay dividend taxes every year.
      </p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 260px" />
    </div>
    <div class="px-4 py-2.5 border-t border-card-border grid grid-cols-3 gap-4 text-center">
      <div>
        <p class="text-[11px] text-text-muted uppercase tracking-wider">Rental Net Tax</p>
        <p class="text-[13px] font-semibold font-mono mt-0.5" :class="totals.rentalTotal >= 0 ? 'text-green-400' : 'text-red-400'">
          {{ totals.rentalTotal >= 0 ? 'Saved' : 'Paid' }} {{ formatCurrency(Math.abs(totals.rentalTotal)) }}
        </p>
      </div>
      <div>
        <p class="text-[11px] text-text-muted uppercase tracking-wider">Stock Tax Paid</p>
        <p class="text-[13px] font-semibold font-mono mt-0.5 text-red-400">
          {{ formatCurrency(Math.abs(totals.stockTotal)) }}
        </p>
      </div>
      <div>
        <p class="text-[11px] text-text-muted uppercase tracking-wider">Rental Advantage</p>
        <p class="text-[13px] font-semibold font-mono mt-0.5" :class="totals.netAdvantage >= 0 ? 'text-green-400' : 'text-red-400'">
          {{ formatCurrency(Math.abs(totals.netAdvantage)) }}
        </p>
      </div>
    </div>
  </div>
</template>
