<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatPercent } from '../../utils/formatters'

const RENTAL = '#e5953e'
const GRID = '#1c1c1f'
const LABEL = '#52525b'

const props = defineProps<{ yearResults: YearResult[] }>()

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#18181b', borderColor: '#27272a',
    textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
    formatter: (params: Array<{ value: number; axisValue: string }>) =>
      `<span style="color:#71717a">Year ${params[0].axisValue}</span><br/><b>${formatPercent(params[0].value)}</b>`,
  },
  grid: { top: 12, right: 8, bottom: 20, left: 8, containLabel: true },
  xAxis: {
    type: 'category',
    data: props.yearResults.map(r => r.year),
    axisLine: { lineStyle: { color: GRID } },
    axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace' },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: LABEL, fontSize: 10, fontFamily: 'GeistMono, monospace', formatter: (v: number) => `${v.toFixed(0)}%` },
    splitLine: { lineStyle: { color: GRID, type: 'dotted' as const } },
  },
  series: [{
    type: 'bar',
    data: props.yearResults.map(r => ({
      value: parseFloat(r.cashOnCashReturn.toFixed(2)),
      itemStyle: {
        color: r.cashOnCashReturn >= 0 ? RENTAL : '#ef4444',
        borderRadius: r.cashOnCashReturn >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3],
      },
    })),
    barWidth: '55%',
  }],
}))
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-sm font-semibold text-text-primary">Cash-on-Cash Return</h3>
      <p class="text-[11px] text-text-muted mt-0.5">After-tax cash flow divided by your total cash invested (down payment + closing costs + repairs). Measures the annual yield on the cash you actually put in, ignoring appreciation and equity buildup.</p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 240px" />
    </div>
  </div>
</template>
