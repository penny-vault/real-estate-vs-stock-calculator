import { ref, watch } from 'vue'
import type { AllInputs } from '../types/inputs'
import type { MonteCarloSummary, MonteCarloWorkerInputs } from '../types/monteCarlo'
import { runMonteCarloSimulation } from '../engine/monteCarlo'

export function useMonteCarlo(inputs: AllInputs) {
  const result = ref<MonteCarloSummary | null>(null)
  const loading = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function run() {
    loading.value = true

    const workerInputs: MonteCarloWorkerInputs = {
      simulationCount: inputs.monteCarlo.simulationCount,
      holdingPeriodYears: inputs.holdingPeriodYears,
      purchasePrice: inputs.property.purchasePrice,
      afterRepairValue: inputs.property.afterRepairValue,
      downPaymentPercent: inputs.property.downPaymentPercent,
      closingCostsPercent: inputs.property.closingCostsPercent,
      repairCosts: inputs.property.repairCosts,
      interestRate: inputs.property.interestRate,
      loanTermYears: inputs.property.loanTermYears,
      monthlyRent: inputs.rentalIncome.monthlyRent,
      otherMonthlyIncome: inputs.rentalIncome.otherMonthlyIncome,
      vacancyRatePercent: inputs.rentalIncome.vacancyRatePercent,
      annualRentGrowthPercent: inputs.rentalIncome.annualRentGrowthPercent,
      annualAppreciationPercent: inputs.property.annualAppreciationPercent,
      propertyTaxPercent: inputs.operatingExpenses.propertyTaxPercent,
      insuranceAnnual: inputs.operatingExpenses.insuranceAnnual,
      maintenancePercent: inputs.operatingExpenses.maintenancePercent,
      propertyManagementPercent: inputs.operatingExpenses.propertyManagementPercent,
      hoaMonthly: inputs.operatingExpenses.hoaMonthly,
      otherExpensesMonthly: inputs.operatingExpenses.otherExpensesMonthly,
      annualExpenseGrowthPercent: inputs.operatingExpenses.annualExpenseGrowthPercent,
      marginalTaxRate: inputs.tax.marginalTaxRate,
      capitalGainsTaxRate: inputs.tax.capitalGainsTaxRate,
      depreciationRecaptureRate: inputs.tax.depreciationRecaptureRate,
      landValuePercent: inputs.tax.landValuePercent,
      sellingCostsPercent: inputs.selling.sellingCostsPercent,
      indexReturnPercent: inputs.indexFund.annualReturnPercent,
      expenseRatioPercent: inputs.indexFund.expenseRatioPercent,
      dividendYieldPercent: inputs.indexFund.dividendYieldPercent,
      dividendTaxRate: inputs.indexFund.dividendTaxRate,
      rentGrowthStdDev: inputs.monteCarlo.rentGrowthStdDev,
      appreciationStdDev: inputs.monteCarlo.appreciationStdDev,
      vacancyStdDev: inputs.monteCarlo.vacancyStdDev,
      expenseGrowthStdDev: inputs.monteCarlo.expenseGrowthStdDev,
      indexReturnStdDev: inputs.monteCarlo.indexReturnStdDev,
    }

    // Run synchronously but defer to next tick to allow UI update
    setTimeout(() => {
      try {
        result.value = runMonteCarloSimulation(workerInputs)
      } catch (e) {
        console.error('Monte Carlo simulation failed:', e)
        result.value = null
      }
      loading.value = false
    }, 50)
  }

  watch(
    () => JSON.stringify(inputs),
    () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(run, 500)
    },
    { deep: true, immediate: true },
  )

  return {
    result,
    loading,
    run,
  }
}
