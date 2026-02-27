<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const RENTAL = '#e5953e'
const INDEX = '#3b82f6'
const PROP_VAL = '#71717a'
const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{
  yearResults: YearResult[]
  appreciationStdDev: number
  indexReturnStdDev: number
}>()

// Compute confidence bands that widen over time using log-normal model
// P10/P90 band (z = 1.28) for the outer band
const Z = 1.28

function rentalBands(yearResults: YearResult[], stdDev: number) {
  const sigma = stdDev / 100
  return yearResults.map((r, i) => {
    const y = i + 1
    // Uncertainty driven by property value; cash flow portion is more predictable
    const spread = r.propertyValue * (Math.exp(Z * sigma * Math.sqrt(y)) - 1)
    return {
      upper: Math.round(r.totalRentalWealth + spread),
      lower: Math.round(r.totalRentalWealth - spread),
    }
  })
}

function stockBands(yearResults: YearResult[], stdDev: number) {
  const sigma = stdDev / 100
  return yearResults.map((r, i) => {
    const y = i + 1
    // Entire portfolio value is uncertain
    const upper = r.indexFundValue * Math.exp(Z * sigma * Math.sqrt(y))
    const lower = r.indexFundValue * Math.exp(-Z * sigma * Math.sqrt(y))
    return {
      upper: Math.round(upper),
      lower: Math.round(lower),
    }
  })
}

const option = computed(() => {
  const rBands = rentalBands(props.yearResults, props.appreciationStdDev)
  const sBands = stockBands(props.yearResults, props.indexReturnStdDev)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181b',
      borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string; color: string }>) => {
        const year = params[0]!.axisValue
        const yi = parseInt(year) - 1
        let html = `<div style="font-size:10px;color:#71717a;margin-bottom:4px">Year ${year}</div>`

        // Show the main lines with their confidence ranges
        params.forEach(p => {
          if (p.seriesName === 'Rental') {
            const rb = rBands[yi]
            html += `<div style="display:flex;justify-content:space-between;gap:20px;line-height:1.6">
              <span style="color:${RENTAL}">Rental</span>
              <span style="font-weight:600">${formatCurrency(p.value)}</span>
            </div>`
            if (rb) {
              html += `<div style="font-size:10px;color:#71717a;padding-left:4px;line-height:1.4">90% CI: ${formatCurrency(rb.lower)} - ${formatCurrency(rb.upper)}</div>`
            }
          } else if (p.seriesName === 'Stock Portfolio') {
            const sb = sBands[yi]
            html += `<div style="display:flex;justify-content:space-between;gap:20px;line-height:1.6">
              <span style="color:${INDEX}">Stock Portfolio</span>
              <span style="font-weight:600">${formatCurrency(p.value)}</span>
            </div>`
            if (sb) {
              html += `<div style="font-size:10px;color:#71717a;padding-left:4px;line-height:1.4">90% CI: ${formatCurrency(sb.lower)} - ${formatCurrency(sb.upper)}</div>`
            }
          } else if (p.seriesName === 'Property Value') {
            html += `<div style="display:flex;justify-content:space-between;gap:20px;line-height:1.6">
              <span style="color:${PROP_VAL}">Property Value</span>
              <span style="font-weight:600">${formatCurrency(p.value)}</span>
            </div>`
          }
        })
        return html
      },
    },
    legend: {
      data: ['Rental', 'Stock Portfolio', 'Property Value'],
      textStyle: { color: LABEL, fontSize: 10, fontFamily: 'Inter' },
      top: 4, right: 4,
      itemWidth: 12, itemHeight: 2,
    },
    grid: { top: 36, right: 12, bottom: 20, left: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: props.yearResults.map(r => r.year),
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
      // Rental confidence band (P10-P90)
      {
        name: 'R-Lower', type: 'line',
        data: rBands.map(b => b.lower),
        lineStyle: { width: 0 }, symbol: 'none', stack: 'rental-band',
        areaStyle: { color: 'transparent' },
        tooltip: { show: false },
      },
      {
        name: 'R-Band', type: 'line',
        data: rBands.map((b, i) => b.upper - rBands[i].lower),
        lineStyle: { width: 0 }, symbol: 'none', stack: 'rental-band',
        areaStyle: { color: 'rgba(229,149,62,0.08)' },
        tooltip: { show: false },
      },
      // Stock confidence band (P10-P90)
      {
        name: 'S-Lower', type: 'line',
        data: sBands.map(b => b.lower),
        lineStyle: { width: 0 }, symbol: 'none', stack: 'stock-band',
        areaStyle: { color: 'transparent' },
        tooltip: { show: false },
      },
      {
        name: 'S-Band', type: 'line',
        data: sBands.map((b, i) => b.upper - sBands[i].lower),
        lineStyle: { width: 0 }, symbol: 'none', stack: 'stock-band',
        areaStyle: { color: 'rgba(59,130,246,0.08)' },
        tooltip: { show: false },
      },
      // Main lines
      {
        name: 'Rental',
        type: 'line',
        data: props.yearResults.map(r => Math.round(r.totalRentalWealth)),
        smooth: 0.3,
        lineStyle: { width: 2, color: RENTAL },
        itemStyle: { color: RENTAL, borderWidth: 0 },
        symbol: 'circle', symbolSize: 4,
      },
      {
        name: 'Stock Portfolio',
        type: 'line',
        data: props.yearResults.map(r => Math.round(r.indexFundValue)),
        smooth: 0.3,
        lineStyle: { width: 2, color: INDEX },
        itemStyle: { color: INDEX, borderWidth: 0 },
        symbol: 'circle', symbolSize: 4,
      },
      {
        name: 'Property Value',
        type: 'line',
        data: props.yearResults.map(r => Math.round(r.propertyValue)),
        smooth: 0.3,
        lineStyle: { width: 1.5, color: PROP_VAL, type: 'dashed' as const },
        itemStyle: { color: PROP_VAL, borderWidth: 0 },
        symbol: 'none',
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-sm font-semibold text-text-primary">Total Wealth Over Time</h3>
      <p class="text-[11px] text-text-muted mt-0.5">Shaded bands show 90% confidence interval</p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 300px" />
    </div>
  </div>
</template>
