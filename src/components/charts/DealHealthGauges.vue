<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import type { Summary } from '../../types/outputs'

const props = defineProps<{ yearResults: YearResult[]; summary: Summary }>()

const selectedYear = ref(0)
const row = computed(() => props.yearResults[selectedYear.value]!)

// Cap rate = NOI / property value
const capRate = computed(() => {
  const r = row.value
  return r ? (r.noi / r.propertyValue) * 100 : 0
})

// Debt service coverage ratio = NOI / annual mortgage
const dscr = computed(() => {
  const r = row.value
  return r ? r.noi / r.mortgagePayment : 0
})

// Cash on cash return
const coc = computed(() => {
  const r = row.value
  return r ? r.cashOnCashReturn : 0
})

// Gross rent multiplier = price / annual gross rent
const grm = computed(() => {
  const r = row.value
  return r ? r.propertyValue / r.grossRent : 0
})

function makeGauge(title: string, value: number, min: number, max: number, suffix: string, thresholds: [number, string][]) {
  return {
    backgroundColor: 'transparent',
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min,
      max,
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        width: 10,
        itemStyle: {
          color: (() => {
            for (const [threshold, color] of thresholds) {
              if (value <= threshold) return color
            }
            return thresholds[thresholds.length - 1]?.[1] ?? '#22c55e'
          })(),
        },
      },
      axisLine: {
        lineStyle: { width: 10, color: [[1, '#1c1c1f']] },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: {
        show: true,
        offsetCenter: [0, '70%'],
        fontSize: 10,
        color: '#71717a',
        fontFamily: 'Inter',
      },
      detail: {
        fontSize: 18,
        fontFamily: 'GeistMono, monospace',
        fontWeight: 600,
        color: '#fafafa',
        offsetCenter: [0, '30%'],
        formatter: (v: number) => {
          if (suffix === 'x') return `${v.toFixed(2)}x`
          if (suffix === '%') return `${v.toFixed(1)}%`
          return `${v.toFixed(1)}`
        },
      },
      data: [{ value: Math.min(value, max), name: title }],
    }],
  }
}

const capRateOption = computed(() =>
  makeGauge('Cap Rate', capRate.value, 0, 12, '%', [
    [3, '#ef4444'], [5, '#f59e0b'], [7, '#22c55e'], [12, '#15803d'],
  ])
)

const dscrOption = computed(() =>
  makeGauge('Debt Service', dscr.value, 0, 2.5, 'x', [
    [0.8, '#ef4444'], [1.0, '#f59e0b'], [1.25, '#e5953e'], [2.5, '#22c55e'],
  ])
)

const cocOption = computed(() =>
  makeGauge('Cash-on-Cash', coc.value, -15, 20, '%', [
    [0, '#ef4444'], [4, '#f59e0b'], [8, '#22c55e'], [20, '#15803d'],
  ])
)

const grmOption = computed(() =>
  makeGauge('Rent Multiplier', grm.value, 0, 30, 'x', [
    [10, '#15803d'], [15, '#22c55e'], [20, '#f59e0b'], [30, '#ef4444'],
  ])
)

// Rating helpers
function rateValue(value: number, thresholds: [number, string][]): { label: string; color: string } {
  for (const [threshold, rating] of thresholds) {
    if (value <= threshold) return { label: rating, color: rating === 'Poor' ? '#ef4444' : rating === 'Fair' ? '#f59e0b' : rating === 'Good' ? '#22c55e' : '#15803d' }
  }
  const last = thresholds[thresholds.length - 1]
  return { label: last?.[1] ?? 'Good', color: '#22c55e' }
}

const capRateRating = computed(() => rateValue(capRate.value, [[3, 'Poor'], [5, 'Fair'], [7, 'Good'], [12, 'Great']]))
const dscrRating = computed(() => rateValue(dscr.value, [[0.8, 'Poor'], [1.0, 'Fair'], [1.25, 'Fair'], [2.5, 'Good']]))
const cocRating = computed(() => rateValue(coc.value, [[0, 'Poor'], [4, 'Fair'], [8, 'Good'], [20, 'Great']]))
const grmRating = computed(() => rateValue(grm.value, [[10, 'Great'], [15, 'Good'], [20, 'Fair'], [30, 'Poor']]))
</script>

<template>
  <div class="card overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-card-border">
      <div>
        <h3 class="text-sm font-semibold text-text-primary">Deal Health</h3>
        <p class="text-[11px] text-text-muted mt-0.5">Key investment metrics at a glance</p>
      </div>
      <select v-model="selectedYear" class="input-field w-auto py-1 px-2 text-[11px]">
        <option v-for="(r, i) in yearResults" :key="r.year" :value="i">Year {{ r.year }}</option>
      </select>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4">
      <div class="border-r border-b lg:border-b-0 border-card-border">
        <div class="p-2 pb-0">
          <VChart :option="capRateOption" autoresize style="height: 140px" />
        </div>
        <div class="px-3 pb-3 text-center">
          <span class="text-[11px] font-semibold" :style="{ color: capRateRating.color }">{{ capRateRating.label }}</span>
          <p class="text-[11px] text-text-muted mt-0.5 leading-tight">NOI as % of property value. Above 5% is typically solid for residential.</p>
        </div>
      </div>
      <div class="border-b lg:border-b-0 lg:border-r border-card-border">
        <div class="p-2 pb-0">
          <VChart :option="dscrOption" autoresize style="height: 140px" />
        </div>
        <div class="px-3 pb-3 text-center">
          <span class="text-[11px] font-semibold" :style="{ color: dscrRating.color }">{{ dscrRating.label }}</span>
          <p class="text-[11px] text-text-muted mt-0.5 leading-tight">Can income cover the mortgage? Above 1.25x means comfortable margin.</p>
        </div>
      </div>
      <div class="border-r border-card-border">
        <div class="p-2 pb-0">
          <VChart :option="cocOption" autoresize style="height: 140px" />
        </div>
        <div class="px-3 pb-3 text-center">
          <span class="text-[11px] font-semibold" :style="{ color: cocRating.color }">{{ cocRating.label }}</span>
          <p class="text-[11px] text-text-muted mt-0.5 leading-tight">Annual cash flow divided by total cash invested. 8%+ is strong.</p>
        </div>
      </div>
      <div>
        <div class="p-2 pb-0">
          <VChart :option="grmOption" autoresize style="height: 140px" />
        </div>
        <div class="px-3 pb-3 text-center">
          <span class="text-[11px] font-semibold" :style="{ color: grmRating.color }">{{ grmRating.label }}</span>
          <p class="text-[11px] text-text-muted mt-0.5 leading-tight">Years of gross rent to equal price. Lower is better -- under 15 is solid.</p>
        </div>
      </div>
    </div>
  </div>
</template>
