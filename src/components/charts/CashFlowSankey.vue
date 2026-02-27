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

  // Build nodes and links for the Sankey
  const nodes = [
    { name: 'Gross Income' },
    { name: 'Vacancy Loss' },
    { name: 'Effective Income' },
    { name: 'Property Tax' },
    { name: 'Insurance' },
    { name: 'Maintenance' },
    { name: 'Management' },
    ...(r.hoa > 0 ? [{ name: 'HOA' }] : []),
    ...(r.otherExpenses > 0 ? [{ name: 'Other Costs' }] : []),
    { name: 'NOI' },
    { name: 'Mortgage Interest' },
    { name: 'Principal Paydown' },
    { name: 'Pre-Tax Cash Flow' },
    ...(r.taxBenefit !== 0 ? [{ name: r.taxBenefit > 0 ? 'Tax Savings' : 'Tax Owed' }] : []),
    { name: 'Net Cash Flow' },
  ]

  const interest = r.mortgagePayment - r.principalPaydown
  const links: Array<{ source: string; target: string; value: number }> = []

  // Income splits
  if (r.vacancy > 0) {
    links.push({ source: 'Gross Income', target: 'Vacancy Loss', value: Math.round(r.vacancy) })
  }
  links.push({ source: 'Gross Income', target: 'Effective Income', value: Math.round(r.effectiveIncome) })

  // Expenses from effective income
  if (r.propertyTax > 0) links.push({ source: 'Effective Income', target: 'Property Tax', value: Math.round(r.propertyTax) })
  if (r.insurance > 0) links.push({ source: 'Effective Income', target: 'Insurance', value: Math.round(r.insurance) })
  if (r.maintenance > 0) links.push({ source: 'Effective Income', target: 'Maintenance', value: Math.round(r.maintenance) })
  if (r.propertyManagement > 0) links.push({ source: 'Effective Income', target: 'Management', value: Math.round(r.propertyManagement) })
  if (r.hoa > 0) links.push({ source: 'Effective Income', target: 'HOA', value: Math.round(r.hoa) })
  if (r.otherExpenses > 0) links.push({ source: 'Effective Income', target: 'Other Costs', value: Math.round(r.otherExpenses) })

  // NOI
  links.push({ source: 'Effective Income', target: 'NOI', value: Math.max(1, Math.round(r.noi)) })

  // Mortgage split
  links.push({ source: 'NOI', target: 'Mortgage Interest', value: Math.round(interest) })
  links.push({ source: 'NOI', target: 'Principal Paydown', value: Math.round(r.principalPaydown) })

  // What's left after mortgage
  const preTaxCF = Math.round(r.preTaxCashFlow)

  if (preTaxCF >= 0) {
    links.push({ source: 'NOI', target: 'Pre-Tax Cash Flow', value: Math.max(1, preTaxCF) })
  } else {
    // NOI doesn't cover mortgage - show the shortfall
    links.push({ source: 'NOI', target: 'Pre-Tax Cash Flow', value: 1 })
  }

  // Tax impact
  if (r.taxBenefit > 0) {
    links.push({ source: 'Tax Savings', target: 'Net Cash Flow', value: Math.round(r.taxBenefit) })
    links.push({ source: 'Pre-Tax Cash Flow', target: 'Net Cash Flow', value: Math.max(1, Math.abs(preTaxCF)) })
  } else if (r.taxBenefit < 0) {
    links.push({ source: 'Pre-Tax Cash Flow', target: 'Tax Owed', value: Math.round(Math.abs(r.taxBenefit)) })
    links.push({ source: 'Pre-Tax Cash Flow', target: 'Net Cash Flow', value: Math.max(1, preTaxCF - Math.round(Math.abs(r.taxBenefit))) })
  } else {
    links.push({ source: 'Pre-Tax Cash Flow', target: 'Net Cash Flow', value: Math.max(1, Math.abs(preTaxCF)) })
  }

  // Color mapping
  const nodeColors: Record<string, string> = {
    'Gross Income': '#f59e0b',
    'Effective Income': '#e5953e',
    'NOI': '#06b6d4',
    'Pre-Tax Cash Flow': '#8b5cf6',
    'Net Cash Flow': r.afterTaxCashFlow >= 0 ? '#22c55e' : '#ef4444',
    'Tax Savings': '#22c55e',
    'Principal Paydown': '#3b82f6',
    'Vacancy Loss': '#f43f5e',
    'Property Tax': '#f59e0b',
    'Insurance': '#06b6d4',
    'Maintenance': '#8b5cf6',
    'Management': '#ec4899',
    'HOA': '#71717a',
    'Other Costs': '#52525b',
    'Mortgage Interest': '#ef4444',
    'Tax Owed': '#ef4444',
  }

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: { data: { source?: string; target?: string; value?: number }; name?: string; value?: number }) => {
        if (params.data.source) {
          return `${params.data.source} → ${params.data.target}<br/><b>${formatCurrency(params.data.value ?? 0)}</b>`
        }
        return `<b>${params.name}</b>`
      },
    },
    series: [{
      type: 'sankey',
      layout: 'none',
      emphasis: { focus: 'adjacency' },
      nodeAlign: 'left' as const,
      nodeWidth: 14,
      nodeGap: 10,
      layoutIterations: 0,
      data: nodes.map(n => ({
        ...n,
        itemStyle: { color: nodeColors[n.name] || '#52525b', borderWidth: 0 },
        label: {
          color: '#a1a1aa',
          fontSize: 10,
          fontFamily: 'Inter',
        },
      })),
      links: links.filter(l => l.value > 0),
      lineStyle: {
        color: 'gradient' as const,
        opacity: 0.3,
        curveness: 0.5,
      },
      label: {
        position: 'right' as const,
        formatter: (params: { name: string; value: number }) => {
          return `${params.name}\n${formatCurrency(params.value)}`
        },
        rich: {},
      },
    }],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border flex items-center justify-between">
      <div>
        <h3 class="text-[12px] font-medium text-text-primary">Money Flow</h3>
        <p class="text-[10px] text-text-muted mt-0.5">Where every dollar of rental income goes</p>
      </div>
      <select v-model="selectedYear" class="input-field w-auto py-1 px-2 text-[11px]">
        <option v-for="(r, i) in yearResults" :key="r.year" :value="i">Year {{ r.year }}</option>
      </select>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 380px" />
    </div>
  </div>
</template>
