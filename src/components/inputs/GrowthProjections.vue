<script setup lang="ts">
import type { AllInputs } from '../../types/inputs'
import { PROPERTY_LABELS, RENTAL_INCOME_LABELS, OPERATING_EXPENSE_LABELS } from '../../constants/labels'
import PercentInput from './fields/PercentInput.vue'
import NumberInput from './fields/NumberInput.vue'

defineProps<{ inputs: AllInputs }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <PercentInput
      v-model="inputs.property.annualAppreciationPercent"
      :label="PROPERTY_LABELS.annualAppreciationPercent.label"
      :tooltip="PROPERTY_LABELS.annualAppreciationPercent.tooltip"
    />
    <PercentInput
      v-model="inputs.rentalIncome.annualRentGrowthPercent"
      :label="RENTAL_INCOME_LABELS.annualRentGrowthPercent.label"
      :tooltip="RENTAL_INCOME_LABELS.annualRentGrowthPercent.tooltip"
    />
    <PercentInput
      v-model="inputs.operatingExpenses.annualExpenseGrowthPercent"
      :label="OPERATING_EXPENSE_LABELS.annualExpenseGrowthPercent.label"
      :tooltip="OPERATING_EXPENSE_LABELS.annualExpenseGrowthPercent.tooltip"
    />
    <NumberInput
      v-model="inputs.holdingPeriodYears"
      label="Holding Period"
      tooltip="How many years you plan to hold the property before selling."
      suffix="years"
    />
  </div>
</template>
