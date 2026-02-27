import type { MonteCarloWorkerInputs, MonteCarloSummary, PercentileBands } from '../types/monteCarlo'
import { calcMonthlyPayment } from './amortization'

function boxMullerRandom(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

function sampleNormal(mean: number, stdDev: number): number {
  return mean + stdDev * boxMullerRandom()
}

function percentile(sorted: number[], p: number): number {
  const idx = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(idx)
  const upper = Math.ceil(idx)
  if (lower === upper) return sorted[lower]!
  return sorted[lower]! + (sorted[upper]! - sorted[lower]!) * (idx - lower)
}

export function runMonteCarloSimulation(params: MonteCarloWorkerInputs): MonteCarloSummary {
  const {
    simulationCount,
    holdingPeriodYears,
    purchasePrice,
    afterRepairValue,
    downPaymentPercent,
    closingCostsPercent,
    repairCosts,
    interestRate,
    loanTermYears,
    monthlyRent,
    otherMonthlyIncome,
    vacancyRatePercent,
    annualRentGrowthPercent,
    annualAppreciationPercent,
    propertyTaxPercent,
    insuranceAnnual,
    maintenancePercent,
    propertyManagementPercent,
    hoaMonthly,
    otherExpensesMonthly,
    annualExpenseGrowthPercent,
    marginalTaxRate,
    capitalGainsTaxRate,
    depreciationRecaptureRate,
    landValuePercent,
    sellingCostsPercent,
    indexReturnPercent,
    expenseRatioPercent,
    dividendYieldPercent,
    dividendTaxRate,
    rentGrowthStdDev,
    appreciationStdDev,
    vacancyStdDev,
    expenseGrowthStdDev,
    indexReturnStdDev,
  } = params

  const downPayment = purchasePrice * (downPaymentPercent / 100)
  const closingCosts = purchasePrice * (closingCostsPercent / 100)
  const totalInvested = downPayment + closingCosts + repairCosts
  const loanAmount = purchasePrice - downPayment
  const monthlyPayment = calcMonthlyPayment(loanAmount, interestRate, loanTermYears)
  const yearlyDepreciation = afterRepairValue * (1 - landValuePercent / 100) / 27.5
  const annualMortgage = monthlyPayment * 12

  // Pre-compute amortization balances and interest splits per year
  const r = interestRate / 100 / 12
  const balances: number[] = []
  const annualInterests: number[] = []
  let bal = loanAmount
  for (let y = 1; y <= holdingPeriodYears; y++) {
    let yearInterest = 0
    for (let m = 0; m < 12; m++) {
      const interest = bal * r
      const principal = monthlyPayment - interest
      yearInterest += interest
      bal = Math.max(0, bal - principal)
    }
    balances.push(bal)
    annualInterests.push(yearInterest)
  }

  const rentalByYear: number[][] = []
  const indexByYear: number[][] = []
  const rentalTerminal: number[] = []
  const indexTerminal: number[] = []

  for (let sim = 0; sim < simulationCount; sim++) {
    const rentalYears: number[] = []
    const indexYears: number[] = []

    // Sample per-year random factors
    let cumulativeCashFlow = 0
    let propValue = afterRepairValue
    let indexValue = totalInvested

    // Track cumulative compounding for rent and expenses
    let rentLevel = monthlyRent * 12
    let otherIncLevel = otherMonthlyIncome * 12
    let insLevel = insuranceAnnual
    let hoaLevel = hoaMonthly * 12
    let otherExpLevel = otherExpensesMonthly * 12

    for (let y = 0; y < holdingPeriodYears; y++) {
      // Sample rates for this year
      const rentGrowth = sampleNormal(annualRentGrowthPercent, rentGrowthStdDev) / 100
      const appRate = sampleNormal(annualAppreciationPercent, appreciationStdDev) / 100
      const vacRate = Math.max(0, Math.min(50, sampleNormal(vacancyRatePercent, vacancyStdDev))) / 100
      const expGrowth = sampleNormal(annualExpenseGrowthPercent, expenseGrowthStdDev) / 100
      // Index fund: split return into price + dividend, tax dividends (matching main engine)
      const grossIdxReturn = sampleNormal(indexReturnPercent, indexReturnStdDev) / 100
      const divYield = dividendYieldPercent / 100
      const divTax = dividendTaxRate / 100
      const netIdxReturn = (grossIdxReturn - expenseRatioPercent / 100 - divYield) + divYield * (1 - divTax)

      // Property appreciation
      propValue = propValue * (1 + appRate)

      // Compound rent and expenses from prior year (not from base with wrong exponent)
      if (y > 0) {
        rentLevel = rentLevel * (1 + rentGrowth)
        otherIncLevel = otherIncLevel * (1 + rentGrowth)
        insLevel = insLevel * (1 + expGrowth)
        hoaLevel = hoaLevel * (1 + expGrowth)
        otherExpLevel = otherExpLevel * (1 + expGrowth)
      }

      const grossRent = rentLevel
      const otherInc = otherIncLevel
      const effectiveIncome = (grossRent + otherInc) * (1 - vacRate)

      // Property tax and maintenance scale with current property value
      const propTax = propValue * (propertyTaxPercent / 100)
      const ins = insLevel
      const maint = propValue * (maintenancePercent / 100)
      const mgmt = effectiveIncome * (propertyManagementPercent / 100)
      const hoaAnnual = hoaLevel
      const otherExp = otherExpLevel
      const totalExp = propTax + ins + maint + mgmt + hoaAnnual + otherExp

      const noi = effectiveIncome - totalExp
      const preTaxCF = noi - annualMortgage

      // Tax benefit
      const taxableIncome = noi - (annualInterests[y] ?? 0) - yearlyDepreciation
      const taxBenefit = taxableIncome < 0
        ? Math.abs(taxableIncome) * (marginalTaxRate / 100)
        : -(taxableIncome * (marginalTaxRate / 100))
      const afterTaxCF = preTaxCF + taxBenefit
      cumulativeCashFlow += afterTaxCF

      // Index fund
      indexValue = indexValue * (1 + idxReturn)
      if (afterTaxCF < 0) {
        indexValue += Math.abs(afterTaxCF)
      }

      // Year-end rental wealth (just equity + cumCF for intermediate years)
      const loanBal = balances[y] ?? 0
      const rentalWealth = propValue - loanBal + cumulativeCashFlow
      rentalYears.push(rentalWealth)
      indexYears.push(indexValue)
    }

    // Terminal wealth includes sale costs
    const finalPropValue = propValue
    const finalLoanBal = balances[holdingPeriodYears - 1] ?? 0
    const sellCosts = finalPropValue * (sellingCostsPercent / 100)
    const totalDepr = yearlyDepreciation * holdingPeriodYears
    const costBasis = purchasePrice + repairCosts - totalDepr
    const capGain = Math.max(0, finalPropValue - sellCosts - costBasis)
    const recapture = Math.min(totalDepr, capGain) * (depreciationRecaptureRate / 100)
    const regularGain = Math.max(0, capGain - Math.min(totalDepr, capGain)) * (capitalGainsTaxRate / 100)
    const netProceeds = finalPropValue - finalLoanBal - sellCosts - recapture - regularGain

    const terminalRental = netProceeds + cumulativeCashFlow
    rentalTerminal.push(terminalRental)
    indexTerminal.push(indexValue)

    rentalByYear.push(rentalYears)
    indexByYear.push(indexYears)
  }

  // Compute percentile bands
  const bands: PercentileBands = {
    years: Array.from({ length: holdingPeriodYears }, (_, i) => i + 1),
    rental: { p10: [], p25: [], p50: [], p75: [], p90: [] },
    index: { p10: [], p25: [], p50: [], p75: [], p90: [] },
  }

  for (let y = 0; y < holdingPeriodYears; y++) {
    const rentalVals = rentalByYear.map(s => s[y] ?? 0).sort((a, b) => a - b)
    const indexVals = indexByYear.map(s => s[y] ?? 0).sort((a, b) => a - b)

    bands.rental.p10.push(percentile(rentalVals, 10))
    bands.rental.p25.push(percentile(rentalVals, 25))
    bands.rental.p50.push(percentile(rentalVals, 50))
    bands.rental.p75.push(percentile(rentalVals, 75))
    bands.rental.p90.push(percentile(rentalVals, 90))

    bands.index.p10.push(percentile(indexVals, 10))
    bands.index.p25.push(percentile(indexVals, 25))
    bands.index.p50.push(percentile(indexVals, 50))
    bands.index.p75.push(percentile(indexVals, 75))
    bands.index.p90.push(percentile(indexVals, 90))
  }

  const sortedRental = [...rentalTerminal].sort((a, b) => a - b)
  const sortedIndex = [...indexTerminal].sort((a, b) => a - b)

  let rentalWinCount = 0
  for (let i = 0; i < simulationCount; i++) {
    if ((rentalTerminal[i] ?? 0) > (indexTerminal[i] ?? 0)) rentalWinCount++
  }

  return {
    rentalMean: rentalTerminal.reduce((a, b) => a + b, 0) / simulationCount,
    rentalMedian: percentile(sortedRental, 50),
    rentalBest: sortedRental[sortedRental.length - 1] ?? 0,
    rentalWorst: sortedRental[0] ?? 0,
    indexMean: indexTerminal.reduce((a, b) => a + b, 0) / simulationCount,
    indexMedian: percentile(sortedIndex, 50),
    indexBest: sortedIndex[sortedIndex.length - 1] ?? 0,
    indexWorst: sortedIndex[0] ?? 0,
    probRentalWins: (rentalWinCount / simulationCount) * 100,
    bands,
  }
}
