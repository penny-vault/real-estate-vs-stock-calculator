<script setup lang="ts">
import type { AllInputs } from '../../types/inputs'
import { PROPERTY_LABELS, RENTAL_INCOME_LABELS } from '../../constants/labels'
import CurrencyInput from './fields/CurrencyInput.vue'
import PercentInput from './fields/PercentInput.vue'
import NumberInput from './fields/NumberInput.vue'

defineProps<{ inputs: AllInputs }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <CurrencyInput
      v-model="inputs.property.purchasePrice"
      :label="PROPERTY_LABELS.purchasePrice.label"
      :tooltip="PROPERTY_LABELS.purchasePrice.tooltip"
    />
    <CurrencyInput
      v-model="inputs.property.afterRepairValue"
      :label="PROPERTY_LABELS.afterRepairValue.label"
      :tooltip="PROPERTY_LABELS.afterRepairValue.tooltip"
    />
    <PercentInput
      v-model="inputs.property.downPaymentPercent"
      :label="PROPERTY_LABELS.downPaymentPercent.label"
      :tooltip="PROPERTY_LABELS.downPaymentPercent.tooltip"
    />
    <PercentInput
      v-model="inputs.property.closingCostsPercent"
      :label="PROPERTY_LABELS.closingCostsPercent.label"
      :tooltip="PROPERTY_LABELS.closingCostsPercent.tooltip"
    />
    <CurrencyInput
      v-model="inputs.property.repairCosts"
      :label="PROPERTY_LABELS.repairCosts.label"
      :tooltip="PROPERTY_LABELS.repairCosts.tooltip"
    />
    <PercentInput
      v-model="inputs.property.interestRate"
      :label="PROPERTY_LABELS.interestRate.label"
      :tooltip="PROPERTY_LABELS.interestRate.tooltip"
    />
    <NumberInput
      v-model="inputs.property.loanTermYears"
      :label="PROPERTY_LABELS.loanTermYears.label"
      :tooltip="PROPERTY_LABELS.loanTermYears.tooltip"
      suffix="years"
    />
    <CurrencyInput
      v-model="inputs.rentalIncome.monthlyRent"
      :label="RENTAL_INCOME_LABELS.monthlyRent.label"
      :tooltip="RENTAL_INCOME_LABELS.monthlyRent.tooltip"
    />
    <CurrencyInput
      v-model="inputs.rentalIncome.otherMonthlyIncome"
      :label="RENTAL_INCOME_LABELS.otherMonthlyIncome.label"
      :tooltip="RENTAL_INCOME_LABELS.otherMonthlyIncome.tooltip"
    />
    <PercentInput
      v-model="inputs.rentalIncome.vacancyRatePercent"
      :label="RENTAL_INCOME_LABELS.vacancyRatePercent.label"
      :tooltip="RENTAL_INCOME_LABELS.vacancyRatePercent.tooltip"
    />
  </div>
</template>
