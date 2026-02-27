import type { AllInputs } from '../types/inputs'

export interface AnnualCashFlowResult {
  grossRent: number
  otherIncome: number
  vacancy: number
  effectiveIncome: number
  propertyTax: number
  insurance: number
  maintenance: number
  propertyManagement: number
  hoa: number
  otherExpenses: number
  totalExpenses: number
  noi: number
}

export function calcAnnualCashFlow(inputs: AllInputs, year: number, currentPropertyValue: number): AnnualCashFlowResult {
  const rentGrowthFactor = Math.pow(1 + inputs.rentalIncome.annualRentGrowthPercent / 100, year - 1)
  const expenseGrowthFactor = Math.pow(1 + inputs.operatingExpenses.annualExpenseGrowthPercent / 100, year - 1)

  const grossRent = inputs.rentalIncome.monthlyRent * 12 * rentGrowthFactor
  const otherIncome = inputs.rentalIncome.otherMonthlyIncome * 12 * rentGrowthFactor
  const vacancy = (grossRent + otherIncome) * (inputs.rentalIncome.vacancyRatePercent / 100)
  const effectiveIncome = grossRent + otherIncome - vacancy

  // Property tax and maintenance scale with current property value, not original price.
  // This captures how assessed values and repair costs rise with appreciation.
  const propertyTax = currentPropertyValue * (inputs.operatingExpenses.propertyTaxPercent / 100)
  const insurance = inputs.operatingExpenses.insuranceAnnual * expenseGrowthFactor
  const maintenance = currentPropertyValue * (inputs.operatingExpenses.maintenancePercent / 100)
  const propertyManagement = effectiveIncome * (inputs.operatingExpenses.propertyManagementPercent / 100)
  const hoa = inputs.operatingExpenses.hoaMonthly * 12 * expenseGrowthFactor
  const otherExpenses = inputs.operatingExpenses.otherExpensesMonthly * 12 * expenseGrowthFactor

  const totalExpenses = propertyTax + insurance + maintenance + propertyManagement + hoa + otherExpenses
  const noi = effectiveIncome - totalExpenses

  return {
    grossRent,
    otherIncome,
    vacancy,
    effectiveIncome,
    propertyTax,
    insurance,
    maintenance,
    propertyManagement,
    hoa,
    otherExpenses,
    totalExpenses,
    noi,
  }
}
