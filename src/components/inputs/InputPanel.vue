<script setup lang="ts">
import type { AllInputs, PresetName } from '../../types/inputs'
import CollapsibleSection from './CollapsibleSection.vue'
import PropertyBasics from './PropertyBasics.vue'
import OperatingExpenses from './OperatingExpenses.vue'
import TaxFinancial from './TaxFinancial.vue'
import IndexFundInputs from './IndexFundInputs.vue'
import GrowthProjections from './GrowthProjections.vue'
import MonteCarloSettings from './MonteCarloSettings.vue'

defineProps<{ inputs: AllInputs }>()
const emit = defineEmits<{
  preset: [name: PresetName]
  reset: []
}>()
</script>

<template>
  <div class="space-y-3">
    <div class="card px-4 py-3">
      <div class="flex items-center justify-between mb-2.5">
        <span class="text-[12px] font-medium text-text-secondary">Presets</span>
        <button class="text-[11px] text-text-muted hover:text-text-secondary transition-colors" @click="emit('reset')">
          Reset
        </button>
      </div>
      <div class="flex gap-2">
        <button
          v-for="preset in (['conservative', 'moderate', 'aggressive'] as PresetName[])"
          :key="preset"
          class="btn-ghost flex-1 capitalize"
          @click="emit('preset', preset)"
        >
          {{ preset }}
        </button>
      </div>
    </div>

    <CollapsibleSection title="Property & Income">
      <PropertyBasics :inputs="inputs" />
    </CollapsibleSection>

    <CollapsibleSection title="Operating Expenses" :default-open="false">
      <OperatingExpenses :inputs="inputs" />
    </CollapsibleSection>

    <CollapsibleSection title="Tax & Selling" :default-open="false">
      <TaxFinancial :inputs="inputs" />
    </CollapsibleSection>

    <CollapsibleSection title="Stock Portfolio" :default-open="false">
      <IndexFundInputs :inputs="inputs" />
    </CollapsibleSection>

    <CollapsibleSection title="Growth & Horizon" :default-open="false">
      <GrowthProjections :inputs="inputs" />
    </CollapsibleSection>

    <CollapsibleSection title="Monte Carlo" :default-open="false">
      <MonteCarloSettings :inputs="inputs" />
    </CollapsibleSection>
  </div>
</template>
