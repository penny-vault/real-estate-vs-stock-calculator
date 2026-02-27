<script setup lang="ts">
import type { AllInputs } from '../../types/inputs'
import { INDEX_FUND_LABELS } from '../../constants/labels'
import PercentInput from './fields/PercentInput.vue'

defineProps<{ inputs: AllInputs }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <PercentInput v-model="inputs.indexFund.annualReturnPercent" :label="INDEX_FUND_LABELS.annualReturnPercent.label" :tooltip="INDEX_FUND_LABELS.annualReturnPercent.tooltip" />
    <PercentInput v-model="inputs.indexFund.expenseRatioPercent" :label="INDEX_FUND_LABELS.expenseRatioPercent.label" :tooltip="INDEX_FUND_LABELS.expenseRatioPercent.tooltip" />
    <PercentInput v-model="inputs.indexFund.dividendYieldPercent" :label="INDEX_FUND_LABELS.dividendYieldPercent.label" :tooltip="INDEX_FUND_LABELS.dividendYieldPercent.tooltip" />
    <PercentInput v-model="inputs.indexFund.dividendTaxRate" :label="INDEX_FUND_LABELS.dividendTaxRate.label" :tooltip="INDEX_FUND_LABELS.dividendTaxRate.tooltip" />
  </div>
</template>
