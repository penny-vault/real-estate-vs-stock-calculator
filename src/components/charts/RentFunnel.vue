<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const props = defineProps<{ yearResults: YearResult[] }>()
const selectedYear = ref(0)

const row = computed(() => props.yearResults[selectedYear.value]!)

const option = computed(() => {
  const r = row.value
  const grossIncome = r.grossRent + r.otherIncome

  const stages = [
    { name: 'Gross Income', value: Math.round(grossIncome), color: '#f59e0b' },
    { name: 'After Vacancy', value: Math.round(r.effectiveIncome), color: '#e5953e' },
    { name: 'After Expenses (NOI)', value: Math.round(r.noi), color: '#06b6d4' },
    { name: 'After Mortgage', value: Math.round(r.preTaxCashFlow), color: '#8b5cf6' },
    { name: 'After Tax (Net)', value: Math.round(r.afterTaxCashFlow), color: r.afterTaxCashFlow >= 0 ? '#22c55e' : '#ef4444' },
  ]

  // For funnel, all values must be positive. Use the gross as the reference.
  // Show the "leakage" labels to the right.
  const leakage = [
    null,
    { label: `Vacancy: -${formatCurrency(r.vacancy)}`, pct: ((r.vacancy / grossIncome) * 100).toFixed(0) },
    { label: `Expenses: -${formatCurrency(r.totalExpenses)}`, pct: ((r.totalExpenses / grossIncome) * 100).toFixed(0) },
    { label: `Mortgage: -${formatCurrency(r.mortgagePayment)}`, pct: ((r.mortgagePayment / grossIncome) * 100).toFixed(0) },
    { label: r.taxBenefit >= 0 ? `Tax savings: +${formatCurrency(r.taxBenefit)}` : `Tax: -${formatCurrency(Math.abs(r.taxBenefit))}`, pct: ((Math.abs(r.taxBenefit) / grossIncome) * 100).toFixed(0) },
  ]

  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: { name: string; value: number; dataIndex: number }) => {
        const idx = params.dataIndex
        let html = `<b>${params.name}</b><br/>${formatCurrency(params.value)}/year`
        const leak = leakage[idx]
        if (leak) {
          html += `<br/><span style="color:#71717a">${leak.label} (${leak.pct}% of income)</span>`
        }
        return html
      },
    },
    series: [{
      type: 'funnel',
      left: '15%',
      right: '15%',
      top: 12,
      bottom: 12,
      width: '70%',
      minSize: '15%',
      maxSize: '100%',
      sort: 'descending' as const,
      gap: 4,
      label: {
        show: true,
        position: 'inside' as const,
        color: '#fafafa',
        fontSize: 11,
        fontFamily: 'Inter',
        fontWeight: 500,
        formatter: (params: { name: string; value: number }) => {
          return `${params.name}\n${formatCurrency(params.value)}`
        },
        lineHeight: 16,
      },
      labelLine: { show: false },
      itemStyle: { borderWidth: 0 },
      data: stages.map(s => ({
        name: s.name,
        value: Math.max(1, Math.abs(s.value)),
        itemStyle: { color: s.color },
      })),
    }],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border flex items-center justify-between">
      <div>
        <h3 class="text-[12px] font-medium text-text-primary">Income Funnel</h3>
        <p class="text-[10px] text-text-muted mt-0.5">How gross rent narrows to net cash flow</p>
      </div>
      <select v-model="selectedYear" class="input-field w-auto py-1 px-2 text-[11px]">
        <option v-for="(r, i) in yearResults" :key="r.year" :value="i">Year {{ r.year }}</option>
      </select>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 300px" />
    </div>
  </div>
</template>
