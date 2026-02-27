export interface SimulationResult {
  rentalWealth: number[]  // terminal wealth per sim
  indexWealth: number[]
  rentalByYear: number[][] // [sim][year] wealth
  indexByYear: number[][]
}

export interface PercentileBands {
  years: number[]
  rental: {
    p10: number[]
    p25: number[]
    p50: number[]
    p75: number[]
    p90: number[]
  }
  index: {
    p10: number[]
    p25: number[]
    p50: number[]
    p75: number[]
    p90: number[]
  }
}

export interface MonteCarloSummary {
  rentalMean: number
  rentalMedian: number
  rentalBest: number
  rentalWorst: number
  indexMean: number
  indexMedian: number
  indexBest: number
  indexWorst: number
  probRentalWins: number
  bands: PercentileBands
}

export interface MonteCarloWorkerMessage {
  type: 'run'
  inputs: MonteCarloWorkerInputs
}

export interface MonteCarloWorkerInputs {
  simulationCount: number
  holdingPeriodYears: number
  // Property params
  purchasePrice: number
  afterRepairValue: number
  downPaymentPercent: number
  closingCostsPercent: number
  repairCosts: number
  interestRate: number
  loanTermYears: number
  monthlyRent: number
  otherMonthlyIncome: number
  vacancyRatePercent: number
  annualRentGrowthPercent: number
  annualAppreciationPercent: number
  propertyTaxPercent: number
  insuranceAnnual: number
  maintenancePercent: number
  propertyManagementPercent: number
  hoaMonthly: number
  otherExpensesMonthly: number
  annualExpenseGrowthPercent: number
  marginalTaxRate: number
  capitalGainsTaxRate: number
  depreciationRecaptureRate: number
  landValuePercent: number
  sellingCostsPercent: number
  indexReturnPercent: number
  expenseRatioPercent: number
  dividendYieldPercent: number
  dividendTaxRate: number
  // Std devs
  rentGrowthStdDev: number
  appreciationStdDev: number
  vacancyStdDev: number
  expenseGrowthStdDev: number
  indexReturnStdDev: number
}

export interface MonteCarloWorkerResult {
  type: 'result'
  summary: MonteCarloSummary
}
