import type { AllInputs, PresetName } from '../types/inputs'

export const DEFAULT_INPUTS: AllInputs = {
  property: {
    purchasePrice: 400000,
    afterRepairValue: 400000,
    downPaymentPercent: 20,
    closingCostsPercent: 3,
    repairCosts: 0,
    interestRate: 7,
    loanTermYears: 30,
    annualAppreciationPercent: 3,
  },
  rentalIncome: {
    monthlyRent: 2000,
    otherMonthlyIncome: 0,
    vacancyRatePercent: 5,
    annualRentGrowthPercent: 3,
  },
  operatingExpenses: {
    propertyTaxPercent: 1.2,
    insuranceAnnual: 1500,
    maintenancePercent: 1,
    propertyManagementPercent: 8,
    hoaMonthly: 0,
    otherExpensesMonthly: 0,
    annualExpenseGrowthPercent: 2.5,
  },
  tax: {
    marginalTaxRate: 24,
    capitalGainsTaxRate: 15,
    depreciationRecaptureRate: 25,
    landValuePercent: 20,
  },
  selling: {
    sellingCostsPercent: 6,
  },
  indexFund: {
    annualReturnPercent: 10,
    expenseRatioPercent: 0.03,
    dividendYieldPercent: 1.5,
    dividendTaxRate: 15,
  },
  holdingPeriodYears: 10,
  monteCarlo: {
    simulationCount: 5000,
    rentGrowthStdDev: 2,
    appreciationStdDev: 3,
    vacancyStdDev: 3,
    expenseGrowthStdDev: 1.5,
    indexReturnStdDev: 15,
  },
}

export const PRESETS: Record<PresetName, Partial<AllInputs>> = {
  conservative: {
    rentalIncome: {
      monthlyRent: 1800,
      otherMonthlyIncome: 0,
      vacancyRatePercent: 8,
      annualRentGrowthPercent: 2,
    },
    property: {
      purchasePrice: 400000,
      afterRepairValue: 400000,
      downPaymentPercent: 25,
      closingCostsPercent: 3,
      repairCosts: 0,
      interestRate: 7.5,
      loanTermYears: 30,
      annualAppreciationPercent: 2,
    },
    operatingExpenses: {
      propertyTaxPercent: 1.5,
      insuranceAnnual: 1800,
      maintenancePercent: 1.5,
      propertyManagementPercent: 10,
      hoaMonthly: 0,
      otherExpensesMonthly: 100,
      annualExpenseGrowthPercent: 3,
    },
    indexFund: {
      annualReturnPercent: 8,
      expenseRatioPercent: 0.03,
      dividendYieldPercent: 2,
      dividendTaxRate: 15,
    },
  },
  moderate: {
    // same as defaults essentially
  },
  aggressive: {
    rentalIncome: {
      monthlyRent: 2400,
      otherMonthlyIncome: 100,
      vacancyRatePercent: 3,
      annualRentGrowthPercent: 4,
    },
    property: {
      purchasePrice: 400000,
      afterRepairValue: 430000,
      downPaymentPercent: 15,
      closingCostsPercent: 2.5,
      repairCosts: 15000,
      interestRate: 6.5,
      loanTermYears: 30,
      annualAppreciationPercent: 5,
    },
    operatingExpenses: {
      propertyTaxPercent: 1,
      insuranceAnnual: 1200,
      maintenancePercent: 0.8,
      propertyManagementPercent: 0,
      hoaMonthly: 0,
      otherExpensesMonthly: 0,
      annualExpenseGrowthPercent: 2,
    },
    indexFund: {
      annualReturnPercent: 10,
      expenseRatioPercent: 0.03,
      dividendYieldPercent: 1.5,
      dividendTaxRate: 15,
    },
  },
}
