import { computed } from 'vue'
import type { AllInputs } from '../types/inputs'
import type { CalculatorOutput } from '../types/outputs'
import { runFullCalculation } from '../engine/summary'

export function useCalculator(inputs: AllInputs) {
  const output = computed<CalculatorOutput>(() => {
    return runFullCalculation(inputs)
  })

  const yearResults = computed(() => output.value.yearResults)
  const summary = computed(() => output.value.summary)

  return {
    output,
    yearResults,
    summary,
  }
}
