<script setup lang="ts">
import { ref } from 'vue'
import type { YearResult } from '../../types/outputs'
import { formatCurrency, formatPercent } from '../../utils/formatters'

defineProps<{ yearResults: YearResult[] }>()

const expandedYear = ref<number | null>(null)

function toggleYear(year: number) {
  expandedYear.value = expandedYear.value === year ? null : year
}
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-card-border">
      <h3 class="text-[12px] font-medium text-text-primary">Year-by-Year</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-[12px]">
        <thead>
          <tr class="border-b border-card-border">
            <th class="text-left px-3 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-wider">Yr</th>
            <th class="text-right px-3 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-wider">Value</th>
            <th class="text-right px-3 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-wider">Equity</th>
            <th class="text-right px-3 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-wider">Cash Flow</th>
            <th class="text-right px-3 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-wider">CoC</th>
            <th class="text-right px-3 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-wider">Rental</th>
            <th class="text-right px-3 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-wider">Stock</th>
            <th class="w-6 px-1"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in yearResults" :key="row.year">
            <tr
              class="border-b border-card-border/50 hover:bg-card-hover cursor-pointer transition-colors"
              @click="toggleYear(row.year)"
            >
              <td class="px-3 py-2 text-text-secondary font-mono">{{ row.year }}</td>
              <td class="px-3 py-2 text-right text-text-secondary font-mono">{{ formatCurrency(row.propertyValue) }}</td>
              <td class="px-3 py-2 text-right text-text-secondary font-mono">{{ formatCurrency(row.equity) }}</td>
              <td class="px-3 py-2 text-right font-mono" :class="row.afterTaxCashFlow >= 0 ? 'text-positive' : 'text-negative'">
                {{ formatCurrency(row.afterTaxCashFlow) }}
              </td>
              <td class="px-3 py-2 text-right font-mono" :class="row.cashOnCashReturn >= 0 ? 'text-positive' : 'text-negative'">
                {{ formatPercent(row.cashOnCashReturn) }}
              </td>
              <td class="px-3 py-2 text-right text-rental font-mono">{{ formatCurrency(row.totalRentalWealth) }}</td>
              <td class="px-3 py-2 text-right text-index font-mono">{{ formatCurrency(row.indexFundValue) }}</td>
              <td class="px-1 text-center">
                <svg
                  class="w-3 h-3 text-text-muted transition-transform duration-150 mx-auto"
                  :class="{ 'rotate-180': expandedYear === row.year }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </td>
            </tr>
            <tr v-if="expandedYear === row.year">
              <td colspan="8" class="px-3 py-3 bg-bg">
                <div class="grid grid-cols-3 gap-x-6 gap-y-1.5 text-[11px]">
                  <div class="flex justify-between"><span class="text-text-muted">Gross Rent</span><span class="text-text-secondary font-mono">{{ formatCurrency(row.grossRent) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Vacancy</span><span class="text-negative font-mono">-{{ formatCurrency(row.vacancy) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Effective</span><span class="text-text-secondary font-mono">{{ formatCurrency(row.effectiveIncome) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Prop Tax</span><span class="text-text-muted font-mono">{{ formatCurrency(row.propertyTax) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Insurance</span><span class="text-text-muted font-mono">{{ formatCurrency(row.insurance) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Maint.</span><span class="text-text-muted font-mono">{{ formatCurrency(row.maintenance) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Mgmt</span><span class="text-text-muted font-mono">{{ formatCurrency(row.propertyManagement) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Mortgage</span><span class="text-text-muted font-mono">{{ formatCurrency(row.mortgagePayment) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Depreciation</span><span class="text-text-muted font-mono">{{ formatCurrency(row.depreciation) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Tax Benefit</span><span class="text-positive font-mono">{{ formatCurrency(row.taxBenefit) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Loan Bal.</span><span class="text-text-muted font-mono">{{ formatCurrency(row.loanBalance) }}</span></div>
                  <div class="flex justify-between"><span class="text-text-muted">Princ. Paid</span><span class="text-text-secondary font-mono">{{ formatCurrency(row.principalPaydown) }}</span></div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
