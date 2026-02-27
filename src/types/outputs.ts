export interface AmortizationRow {
  year: number
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface YearResult {
  year: number
  // Property
  propertyValue: number
  loanBalance: number
  equity: number
  // Income
  grossRent: number
  otherIncome: number
  vacancy: number
  effectiveIncome: number
  // Expenses
  propertyTax: number
  insurance: number
  maintenance: number
  propertyManagement: number
  hoa: number
  otherExpenses: number
  totalExpenses: number
  // Cash flow
  noi: number
  mortgagePayment: number
  preTaxCashFlow: number
  depreciation: number
  taxableIncome: number
  taxBenefit: number
  afterTaxCashFlow: number
  // Returns
  cashOnCashReturn: number
  cumulativeCashFlow: number
  totalRentalWealth: number
  // Index fund
  indexFundValue: number
  indexFundContributions: number
  // Breakdown
  principalPaydown: number
  appreciationGain: number
  cumulativeTaxSavings: number
}

export interface SaleSummary {
  salePrice: number
  loanPayoff: number
  sellingCosts: number
  totalDepreciation: number
  depreciationRecapture: number
  capitalGain: number
  capitalGainsTax: number
  netSaleProceeds: number
}

export interface Summary {
  totalInvested: number
  rentalFinalWealth: number
  indexFundFinalWealth: number
  rentalCAGR: number
  indexFundCAGR: number
  rentalTotalROI: number
  indexFundTotalROI: number
  outperformance: number
  rentalWins: boolean
  totalCashFlow: number
  averageCashOnCash: number
  sale: SaleSummary
}

export interface CalculatorOutput {
  yearResults: YearResult[]
  summary: Summary
}
