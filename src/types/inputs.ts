export interface PropertyInputs {
  purchasePrice: number
  afterRepairValue: number
  downPaymentPercent: number
  closingCostsPercent: number
  repairCosts: number
  interestRate: number
  loanTermYears: number
  annualAppreciationPercent: number
}

export interface RentalIncomeInputs {
  monthlyRent: number
  otherMonthlyIncome: number
  vacancyRatePercent: number
  annualRentGrowthPercent: number
}

export interface OperatingExpenseInputs {
  propertyTaxPercent: number
  insuranceAnnual: number
  maintenancePercent: number
  propertyManagementPercent: number
  hoaMonthly: number
  otherExpensesMonthly: number
  annualExpenseGrowthPercent: number
}

export interface TaxInputs {
  marginalTaxRate: number
  capitalGainsTaxRate: number
  depreciationRecaptureRate: number
  landValuePercent: number
}

export interface SellingInputs {
  sellingCostsPercent: number
}

export interface IndexFundInputs {
  annualReturnPercent: number
  expenseRatioPercent: number
  dividendYieldPercent: number
  dividendTaxRate: number
}

export interface MonteCarloInputs {
  enabled: boolean
  simulationCount: number
  rentGrowthStdDev: number
  appreciationStdDev: number
  vacancyStdDev: number
  expenseGrowthStdDev: number
  indexReturnStdDev: number
}

export interface AllInputs {
  property: PropertyInputs
  rentalIncome: RentalIncomeInputs
  operatingExpenses: OperatingExpenseInputs
  tax: TaxInputs
  selling: SellingInputs
  indexFund: IndexFundInputs
  holdingPeriodYears: number
  monteCarlo: MonteCarloInputs
}

export type PresetName = 'conservative' | 'moderate' | 'aggressive'
