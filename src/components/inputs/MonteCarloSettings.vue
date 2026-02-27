<script setup lang="ts">
import type { AllInputs } from '../../types/inputs'
import { MONTE_CARLO_LABELS } from '../../constants/labels'
import ToggleSwitch from './fields/ToggleSwitch.vue'
import NumberInput from './fields/NumberInput.vue'
import PercentInput from './fields/PercentInput.vue'

defineProps<{ inputs: AllInputs }>()
</script>

<template>
  <div class="space-y-3">
    <ToggleSwitch v-model="inputs.monteCarlo.enabled" label="Enable Monte Carlo" />
    <template v-if="inputs.monteCarlo.enabled">
      <div class="grid grid-cols-2 gap-3">
        <NumberInput v-model="inputs.monteCarlo.simulationCount" :label="MONTE_CARLO_LABELS.simulationCount.label" :tooltip="MONTE_CARLO_LABELS.simulationCount.tooltip" />
        <PercentInput v-model="inputs.monteCarlo.rentGrowthStdDev" :label="MONTE_CARLO_LABELS.rentGrowthStdDev.label" :tooltip="MONTE_CARLO_LABELS.rentGrowthStdDev.tooltip" />
        <PercentInput v-model="inputs.monteCarlo.appreciationStdDev" :label="MONTE_CARLO_LABELS.appreciationStdDev.label" :tooltip="MONTE_CARLO_LABELS.appreciationStdDev.tooltip" />
        <PercentInput v-model="inputs.monteCarlo.vacancyStdDev" :label="MONTE_CARLO_LABELS.vacancyStdDev.label" :tooltip="MONTE_CARLO_LABELS.vacancyStdDev.tooltip" />
        <PercentInput v-model="inputs.monteCarlo.expenseGrowthStdDev" :label="MONTE_CARLO_LABELS.expenseGrowthStdDev.label" :tooltip="MONTE_CARLO_LABELS.expenseGrowthStdDev.tooltip" />
        <PercentInput v-model="inputs.monteCarlo.indexReturnStdDev" :label="MONTE_CARLO_LABELS.indexReturnStdDev.label" :tooltip="MONTE_CARLO_LABELS.indexReturnStdDev.tooltip" />
      </div>
    </template>
  </div>
</template>
