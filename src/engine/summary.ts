import type { AllInputs } from '../types/inputs'
import type { YearResult, Summary, CalculatorOutput } from '../types/outputs'
import { generateAmortization, getYearEndBalance, getAnnualMortgage } from './amortization'
import { propertyValue } from './appreciation'
import { annualDepreciation, cumulativeDepreciation } from './depreciation'
import { calcAnnualCashFlow } from './cashFlow'
import { calcTaxBenefit } from './taxBenefit'
import { calcIndexFundGrowth } from './indexFund'
import { calcSaleProceeds } from './selling'

export function runFullCalculation(inputs: AllInputs): CalculatorOutput {
  const {
    property,
    rentalIncome,
    tax,
    selling,
    indexFund,
    holdingPeriodYears,
  } = inputs

  // Initial investment
  const downPayment = property.purchasePrice * (property.downPaymentPercent / 100)
  const closingCosts = property.purchasePrice * (property.closingCostsPercent / 100)
  const totalInvested = downPayment + closingCosts + property.repairCosts

  // Loan
  const loanAmount = property.purchasePrice - downPayment
  const amortization = generateAmortization(loanAmount, property.interestRate, property.loanTermYears)

  // Depreciation
  const yearlyDepreciation = annualDepreciation(property.afterRepairValue, tax.landValuePercent)

  // Year-by-year
  const yearResults: YearResult[] = []
  let cumulativeCashFlow = 0
  let cumulativeTaxSavings = 0
  const indexContributions: number[] = []

  for (let year = 1; year <= holdingPeriodYears; year++) {
    const propVal = propertyValue(property.afterRepairValue, property.annualAppreciationPercent, year)
    const loanBalance = getYearEndBalance(amortization, year)
    const equity = propVal - loanBalance
    const mortgage = getAnnualMortgage(amortization, year)
    const cf = calcAnnualCashFlow(inputs, year, propVal)

    const preTaxCashFlow = cf.noi - mortgage.totalPayment
    const taxResult = calcTaxBenefit(cf.noi, mortgage.totalInterest, yearlyDepreciation, tax.marginalTaxRate)
    const afterTaxCashFlow = preTaxCashFlow + taxResult.taxBenefit

    cumulativeCashFlow += afterTaxCashFlow
    if (taxResult.taxBenefit > 0) {
      cumulativeTaxSavings += taxResult.taxBenefit
    }

    // If negative cash flow, that money goes into index fund contributions as opportunity cost
    indexContributions.push(afterTaxCashFlow < 0 ? Math.abs(afterTaxCashFlow) : 0)

    const principalPaydown = mortgage.totalPrincipal
    const appreciationGain = propVal - property.afterRepairValue

    yearResults.push({
      year,
      propertyValue: propVal,
      loanBalance,
      equity,
      grossRent: cf.grossRent,
      otherIncome: cf.otherIncome,
      vacancy: cf.vacancy,
      effectiveIncome: cf.effectiveIncome,
      propertyTax: cf.propertyTax,
      insurance: cf.insurance,
      maintenance: cf.maintenance,
      propertyManagement: cf.propertyManagement,
      hoa: cf.hoa,
      otherExpenses: cf.otherExpenses,
      totalExpenses: cf.totalExpenses,
      noi: cf.noi,
      mortgagePayment: mortgage.totalPayment,
      preTaxCashFlow,
      depreciation: yearlyDepreciation,
      taxableIncome: taxResult.taxableIncome,
      taxBenefit: taxResult.taxBenefit,
      afterTaxCashFlow,
      cashOnCashReturn: (afterTaxCashFlow / totalInvested) * 100,
      cumulativeCashFlow,
      totalRentalWealth: 0, // filled below after sale
      indexFundValue: 0, // filled below
      indexFundContributions: 0,
      principalPaydown,
      appreciationGain,
      cumulativeTaxSavings,
    })
  }

  // Index fund calculation
  const indexValues = calcIndexFundGrowth(
    totalInvested,
    indexFund.annualReturnPercent,
    indexFund.expenseRatioPercent,
    indexFund.dividendYieldPercent,
    indexFund.dividendTaxRate,
    holdingPeriodYears,
    indexContributions,
  )

  // Sale proceeds
  const lastYear = yearResults[yearResults.length - 1]!
  const sale = calcSaleProceeds(
    lastYear.propertyValue,
    lastYear.loanBalance,
    property.purchasePrice,
    property.repairCosts,
    selling.sellingCostsPercent,
    cumulativeDepreciation(property.afterRepairValue, tax.landValuePercent, holdingPeriodYears),
    tax.capitalGainsTaxRate,
    tax.depreciationRecaptureRate,
  )

  // Fill in index fund values and total rental wealth
  // Use consistent "paper wealth" (equity + cumulative cash flow) for all years
  // so the chart line doesn't have a discontinuity. Sale costs are applied
  // only in the summary comparison.
  let runningContributions = 0
  let runningCashFlow = 0
  for (let i = 0; i < yearResults.length; i++) {
    const yr = yearResults[i]!
    yr.indexFundValue = indexValues[i] ?? 0
    runningContributions += indexContributions[i] ?? 0
    yr.indexFundContributions = runningContributions
    runningCashFlow += yr.afterTaxCashFlow
    yr.totalRentalWealth = yr.equity + runningCashFlow
  }

  // Compute total rental wealth correctly
  const rentalFinalWealth = sale.netSaleProceeds + cumulativeCashFlow
  const indexFundFinalWealth = indexValues[indexValues.length - 1] ?? totalInvested

  const rentalCAGR = Math.pow(rentalFinalWealth / totalInvested, 1 / holdingPeriodYears) - 1
  const indexFundCAGR = Math.pow(indexFundFinalWealth / totalInvested, 1 / holdingPeriodYears) - 1

  const summary: Summary = {
    totalInvested,
    rentalFinalWealth,
    indexFundFinalWealth,
    rentalCAGR: rentalCAGR * 100,
    indexFundCAGR: indexFundCAGR * 100,
    rentalTotalROI: ((rentalFinalWealth - totalInvested) / totalInvested) * 100,
    indexFundTotalROI: ((indexFundFinalWealth - totalInvested) / totalInvested) * 100,
    outperformance: rentalFinalWealth - indexFundFinalWealth,
    rentalWins: rentalFinalWealth > indexFundFinalWealth,
    totalCashFlow: cumulativeCashFlow,
    averageCashOnCash:
      yearResults.reduce((s, r) => s + r.cashOnCashReturn, 0) / holdingPeriodYears,
    sale,
  }

  return { yearResults, summary }
}
