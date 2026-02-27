<script setup lang="ts">
import type { AllInputs } from '../../types/inputs'
import { TAX_LABELS, SELLING_LABELS } from '../../constants/labels'
import PercentInput from './fields/PercentInput.vue'

defineProps<{ inputs: AllInputs }>()
</script>

<template>
  <div class="space-y-4">
    <div>
      <div class="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">Tax Rates</div>
      <div class="grid grid-cols-2 gap-3">
        <PercentInput v-model="inputs.tax.marginalTaxRate" :label="TAX_LABELS.marginalTaxRate.label" :tooltip="TAX_LABELS.marginalTaxRate.tooltip" />
        <PercentInput v-model="inputs.tax.capitalGainsTaxRate" :label="TAX_LABELS.capitalGainsTaxRate.label" :tooltip="TAX_LABELS.capitalGainsTaxRate.tooltip" />
        <PercentInput v-model="inputs.tax.depreciationRecaptureRate" :label="TAX_LABELS.depreciationRecaptureRate.label" :tooltip="TAX_LABELS.depreciationRecaptureRate.tooltip" />
        <PercentInput v-model="inputs.tax.landValuePercent" :label="TAX_LABELS.landValuePercent.label" :tooltip="TAX_LABELS.landValuePercent.tooltip" />
      </div>
    </div>
    <div>
      <div class="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">Selling</div>
      <div class="grid grid-cols-2 gap-3">
        <PercentInput v-model="inputs.selling.sellingCostsPercent" :label="SELLING_LABELS.sellingCostsPercent.label" :tooltip="SELLING_LABELS.sellingCostsPercent.tooltip" />
      </div>
    </div>
  </div>
</template>
