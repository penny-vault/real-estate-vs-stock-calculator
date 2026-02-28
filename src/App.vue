<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import PageLayout from './components/layout/PageLayout.vue'
import InputPanel from './components/inputs/InputPanel.vue'
import ResultsPanel from './components/results/ResultsPanel.vue'
import StickySummary from './components/results/StickySummary.vue'
import { useInputs } from './composables/useInputs'
import { useCalculator } from './composables/useCalculator'
import { useMonteCarlo } from './composables/useMonteCarlo'
import type { PresetName } from './types/inputs'

const { inputs, arvOverridden, applyPreset, reset } = useInputs()
provide('arvOverridden', arvOverridden)
const { output } = useCalculator(inputs)
const { result: monteCarloResult, loading: monteCarloLoading } = useMonteCarlo(inputs)

const showSticky = ref(false)

function onScroll() {
  showSticky.value = window.scrollY > 400
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function onPreset(name: PresetName) {
  applyPreset(name)
}
</script>

<template>
  <div class="min-h-screen">
    <StickySummary :summary="output.summary" :visible="showSticky" />
    <AppHeader />
    <PageLayout>
      <template #inputs>
        <InputPanel
          :inputs="inputs"
          @preset="onPreset"
          @reset="reset"
        />
      </template>
      <template #results>
        <ResultsPanel
          :output="output"
          :inputs="inputs"
          :monte-carlo-result="monteCarloResult"
          :monte-carlo-loading="monteCarloLoading"
        />
      </template>
    </PageLayout>
  </div>
</template>
