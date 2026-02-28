<script setup lang="ts">
import type { CalculatorOutput } from '../../types/outputs'
import type { MonteCarloSummary } from '../../types/monteCarlo'
import SummaryCards from './SummaryCards.vue'
import YearByYearTable from './YearByYearTable.vue'
import CsvExportButton from './CsvExportButton.vue'
import EquityGrowthChart from '../charts/EquityGrowthChart.vue'
import BreakEvenChart from '../charts/BreakEvenChart.vue'
import CashFlowWaterfall from '../charts/CashFlowWaterfall.vue'
import CashOnCashReturn from '../charts/CashOnCashReturn.vue'
import AnnualROIComparison from '../charts/AnnualROIComparison.vue'
import PropertyMetricsChart from '../charts/PropertyMetricsChart.vue'
import WealthBreakdown from '../charts/WealthBreakdown.vue'
import CashInVsWealthChart from '../charts/CashInVsWealthChart.vue'
import LeverageImpactChart from '../charts/LeverageImpactChart.vue'
import TaxDragChart from '../charts/TaxDragChart.vue'
import MonthlyBreakdownDonut from '../charts/MonthlyBreakdownDonut.vue'
import CashFlowSankey from '../charts/CashFlowSankey.vue'
import DealHealthGauges from '../charts/DealHealthGauges.vue'
import CostTreemap from '../charts/CostTreemap.vue'
import RentFunnel from '../charts/RentFunnel.vue'
import SensitivityHeatmap from '../charts/SensitivityHeatmap.vue'
import MonteCarloChart from '../charts/MonteCarloChart.vue'
import ChartContainer from '../charts/ChartContainer.vue'
import type { AllInputs } from '../../types/inputs'

defineProps<{
  output: CalculatorOutput
  inputs: AllInputs
  monteCarloResult: MonteCarloSummary | null
  monteCarloLoading: boolean
}>()
</script>

<template>
  <div class="space-y-3">
    <SummaryCards :summary="output.summary" />

    <!-- Deal health gauges -->
    <DealHealthGauges :year-results="output.yearResults" :summary="output.summary" />

    <!-- Primary comparison -->
    <EquityGrowthChart
      :year-results="output.yearResults"
      :appreciation-std-dev="inputs.monteCarlo.appreciationStdDev"
      :index-return-std-dev="inputs.monteCarlo.indexReturnStdDev"
    />

    <BreakEvenChart :year-results="output.yearResults" />

    <!-- Return analysis -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <AnnualROIComparison :year-results="output.yearResults" :total-invested="output.summary.totalInvested" />
      <CashOnCashReturn :year-results="output.yearResults" />
    </div>

    <!-- Property deep-dive -->
    <PropertyMetricsChart :year-results="output.yearResults" :total-invested="output.summary.totalInvested" />
    <WealthBreakdown :year-results="output.yearResults" :total-invested="output.summary.totalInvested" />

    <!-- Cash flow deep-dive -->
    <CashFlowSankey :year-results="output.yearResults" />

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <RentFunnel :year-results="output.yearResults" />
      <MonthlyBreakdownDonut :year-results="output.yearResults" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <CashFlowWaterfall :year-results="output.yearResults" />
      <CostTreemap :year-results="output.yearResults" />
    </div>

    <CashInVsWealthChart :year-results="output.yearResults" :total-invested="output.summary.totalInvested" />

    <!-- Strategic insights -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <LeverageImpactChart :inputs="inputs" />
      <TaxDragChart :year-results="output.yearResults" :inputs="inputs" />
    </div>

    <!-- Sensitivity analysis - full width -->
    <SensitivityHeatmap :inputs="inputs" />

    <!-- Monte Carlo -->
    <template v-if="inputs.monteCarlo.enabled">
      <ChartContainer title="Monte Carlo Simulation">
        <div v-if="monteCarloLoading" class="flex items-center justify-center h-72">
          <div class="flex items-center gap-2 text-text-muted text-[12px]">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Running {{ inputs.monteCarlo.simulationCount.toLocaleString() }} simulations
          </div>
        </div>
        <MonteCarloChart v-else-if="monteCarloResult" :result="monteCarloResult" />
      </ChartContainer>
    </template>

    <YearByYearTable :year-results="output.yearResults">
      <template #header-actions>
        <CsvExportButton :year-results="output.yearResults" />
      </template>
    </YearByYearTable>
  </div>
</template>
