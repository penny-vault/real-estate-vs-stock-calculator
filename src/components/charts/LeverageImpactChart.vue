<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { AllInputs } from '../../types/inputs'
import { runFullCalculation } from '../../engine/summary'
import { formatPercent } from '../../utils/formatters'

const RENTAL = '#e5953e'
const INDEX = '#3b82f6'
const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ inputs: AllInputs }>()

const downPayments = [5, 10, 15, 20, 25, 30, 40, 50, 100]

const chartData = computed(() => {
  return downPayments.map(dp => {
    const modified = JSON.parse(JSON.stringify(props.inputs)) as AllInputs
    modified.property.downPaymentPercent = dp
    const result = runFullCalculation(modified)
    return {
      downPayment: dp,
      rentalROI: result.summary.rentalTotalROI,
      rentalCAGR: result.summary.rentalCAGR,
      stockROI: result.summary.indexFundTotalROI,
      stockCAGR: result.summary.indexFundCAGR,
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
        let html = `<div style="font-size:10px;color:#71717a;margin-bottom:4px">${params[0]!.axisValue}% Down Payment</div>`
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
      data: ['Rental CAGR', 'Stock CAGR'],
      textStyle: { color: LABEL, fontSize: 10, fontFamily: 'Inter' },
      top: 4, right: 4, itemWidth: 12, itemHeight: 2,
    },
    grid: { top: 36, right: 12, bottom: 20, left: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: downPayments.map(d => `${d}`),
      name: 'Down Payment %',
      nameLocation: 'center' as const,
      nameGap: 24,
      nameTextStyle: { color: LABEL, fontSize: 9 },
      axisLine: { lineStyle: { color: GRID } },
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace', formatter: (v: string) => `${v}%` },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: 'CAGR',
      nameTextStyle: { color: LABEL, fontSize: 9 },
      axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace', formatter: (v: number) => `${v.toFixed(0)}%` },
      splitLine: { lineStyle: { color: GRID, type: 'dotted' as const } },
    },
    series: [
      {
        name: 'Rental CAGR', type: 'line',
        data: data.map(d => +d.rentalCAGR.toFixed(2)),
        smooth: 0.3,
        lineStyle: { width: 2, color: RENTAL },
        itemStyle: { color: RENTAL },
        symbol: 'circle', symbolSize: 6,
        areaStyle: { color: 'rgba(229,149,62,0.08)' },
      },
      {
        name: 'Stock CAGR', type: 'line',
        data: data.map(d => +d.stockCAGR.toFixed(2)),
        smooth: 0.3,
        lineStyle: { width: 2, color: INDEX, type: 'dashed' as const },
        itemStyle: { color: INDEX },
        symbol: 'circle', symbolSize: 6,
      },
    ],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-[12px] font-medium text-text-primary">Leverage Impact</h3>
      <p class="text-[10px] text-text-muted mt-0.5">How down payment % affects annualized returns via leverage</p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 280px" />
    </div>
  </div>
</template>
