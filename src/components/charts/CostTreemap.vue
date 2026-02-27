<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { YearResult } from '../../types/outputs'
import { formatCurrency } from '../../utils/formatters'

const props = defineProps<{ yearResults: YearResult[] }>()

// Muted palette that reads well on dark backgrounds without being garish
const COLORS: Record<string, string> = {
  'Interest':    '#b91c1c',  // dark red -- pure cost, largest block
  'Principal':   '#1d4ed8',  // dark blue -- builds equity
  'Vacancy':     '#9f1239',  // dark rose
  'Prop. Tax':   '#b45309',  // dark amber
  'Insurance':   '#0e7490',  // dark cyan
  'Maintenance': '#6d28d9',  // dark violet
  'Management':  '#9d174d',  // dark pink
  'HOA':         '#52525b',  // gray
  'Other':       '#3f3f46',  // dark gray
}

const option = computed(() => {
  let totalPropertyTax = 0
  let totalInsurance = 0
  let totalMaintenance = 0
  let totalManagement = 0
  let totalHoa = 0
  let totalOtherExp = 0
  let totalInterest = 0
  let totalPrincipal = 0
  let totalVacancy = 0

  props.yearResults.forEach(r => {
    totalPropertyTax += r.propertyTax
    totalInsurance += r.insurance
    totalMaintenance += r.maintenance
    totalManagement += r.propertyManagement
    totalHoa += r.hoa
    totalOtherExp += r.otherExpenses
    totalInterest += r.mortgagePayment - r.principalPaydown
    totalPrincipal += r.principalPaydown
    totalVacancy += r.vacancy
  })

  const items = [
    { name: 'Interest', value: Math.round(totalInterest) },
    { name: 'Principal', value: Math.round(totalPrincipal) },
    { name: 'Vacancy', value: Math.round(totalVacancy) },
    { name: 'Prop. Tax', value: Math.round(totalPropertyTax) },
    { name: 'Insurance', value: Math.round(totalInsurance) },
    { name: 'Maintenance', value: Math.round(totalMaintenance) },
    { name: 'Management', value: Math.round(totalManagement) },
    ...(totalHoa > 0 ? [{ name: 'HOA', value: Math.round(totalHoa) }] : []),
    ...(totalOtherExp > 0 ? [{ name: 'Other', value: Math.round(totalOtherExp) }] : []),
  ].filter(c => c.value > 0)

  const total = items.reduce((s, d) => s + d.value, 0)
  const years = props.yearResults.length

  const data = items.map(c => ({
    name: c.name,
    value: c.value,
    itemStyle: {
      color: COLORS[c.name] ?? '#52525b',
      borderColor: '#111113',
    },
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#18181b', borderColor: '#27272a',
      textStyle: { color: '#fafafa', fontSize: 11, fontFamily: 'GeistMono, monospace' },
      formatter: (params: { name: string; value: number }) => {
        const pct = ((params.value / total) * 100).toFixed(1)
        const perYear = formatCurrency(params.value / years)
        const isPrincipal = params.name === 'Principal'
        return `<b>${params.name}</b>${isPrincipal ? ' <span style="color:#3b82f6">(builds equity)</span>' : ''}<br/>
          ${formatCurrency(params.value)} total (${pct}%)<br/>
          <span style="color:#71717a">${perYear}/year avg</span>`
      },
    },
    series: [{
      type: 'treemap',
      data,
      width: '100%',
      height: '100%',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      label: {
        show: true,
        color: '#e4e4e7',
        fontSize: 12,
        fontFamily: 'Inter',
        fontWeight: 600,
        formatter: (params: { name: string; value: number }) => {
          const pct = ((params.value / total) * 100).toFixed(0)
          return `${params.name}\n${formatCurrency(params.value)}\n${pct}%`
        },
        lineHeight: 18,
      },
      upperLabel: { show: false },
      itemStyle: {
        borderColor: '#111113',
        borderWidth: 2,
        gapWidth: 2,
      },
      levels: [{
        itemStyle: {
          borderColor: '#111113',
          borderWidth: 3,
          gapWidth: 3,
        },
      }],
    }],
  }
})
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-sm font-semibold text-text-primary">Total Cost Breakdown</h3>
      <p class="text-[11px] text-text-muted mt-0.5">
        Every dollar spent over {{ yearResults.length }} years, sized by magnitude
      </p>
    </div>
    <div class="p-3">
      <VChart :option="option" autoresize style="height: 320px" />
    </div>
    <div class="px-4 py-2 border-t border-card-border flex items-center justify-center gap-6 text-[11px] text-text-muted">
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#1d4ed8"></span> Builds equity</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#b91c1c"></span> Pure cost</span>
    </div>
  </div>
</template>
