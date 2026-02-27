<script setup lang="ts">
import type { AllInputs } from '../../types/inputs'
import { OPERATING_EXPENSE_LABELS } from '../../constants/labels'
import CurrencyInput from './fields/CurrencyInput.vue'
import PercentInput from './fields/PercentInput.vue'

defineProps<{ inputs: AllInputs }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <PercentInput
      v-model="inputs.operatingExpenses.propertyTaxPercent"
      :label="OPERATING_EXPENSE_LABELS.propertyTaxPercent.label"
      :tooltip="OPERATING_EXPENSE_LABELS.propertyTaxPercent.tooltip"
    />
    <CurrencyInput
      v-model="inputs.operatingExpenses.insuranceAnnual"
      :label="OPERATING_EXPENSE_LABELS.insuranceAnnual.label"
      :tooltip="OPERATING_EXPENSE_LABELS.insuranceAnnual.tooltip"
    />
    <PercentInput
      v-model="inputs.operatingExpenses.maintenancePercent"
      :label="OPERATING_EXPENSE_LABELS.maintenancePercent.label"
      :tooltip="OPERATING_EXPENSE_LABELS.maintenancePercent.tooltip"
    />
    <PercentInput
      v-model="inputs.operatingExpenses.propertyManagementPercent"
      :label="OPERATING_EXPENSE_LABELS.propertyManagementPercent.label"
      :tooltip="OPERATING_EXPENSE_LABELS.propertyManagementPercent.tooltip"
    />
    <CurrencyInput
      v-model="inputs.operatingExpenses.hoaMonthly"
      :label="OPERATING_EXPENSE_LABELS.hoaMonthly.label"
      :tooltip="OPERATING_EXPENSE_LABELS.hoaMonthly.tooltip"
    />
    <CurrencyInput
      v-model="inputs.operatingExpenses.otherExpensesMonthly"
      :label="OPERATING_EXPENSE_LABELS.otherExpensesMonthly.label"
      :tooltip="OPERATING_EXPENSE_LABELS.otherExpensesMonthly.tooltip"
    />
    <PercentInput
      v-model="inputs.operatingExpenses.annualExpenseGrowthPercent"
      :label="OPERATING_EXPENSE_LABELS.annualExpenseGrowthPercent.label"
      :tooltip="OPERATING_EXPENSE_LABELS.annualExpenseGrowthPercent.tooltip"
    />
  </div>
</template>
