export interface FieldMeta {
  label: string
  tooltip: string
  unit?: '$' | '%' | 'years' | 'months'
}

export const PROPERTY_LABELS = {
  purchasePrice: {
    label: 'Purchase Price',
    tooltip: 'The total price you are paying for the property, before any repairs.',
    unit: '$',
  },
  afterRepairValue: {
    label: 'After Repair Value (ARV)',
    tooltip: 'The estimated market value of the property after any repairs or renovations. If no repairs, set equal to purchase price.',
    unit: '$',
  },
  downPaymentPercent: {
    label: 'Down Payment',
    tooltip: 'Percentage of the purchase price paid upfront. Conventional loans typically require 15-25% for investment properties.',
    unit: '%',
  },
  closingCostsPercent: {
    label: 'Closing Costs',
    tooltip: 'Fees paid at closing as a percentage of the purchase price. Typically 2-5% and includes appraisal, title insurance, origination fees.',
    unit: '%',
  },
  repairCosts: {
    label: 'Repair / Rehab Costs',
    tooltip: 'Total cost of repairs or renovations before renting. Set to 0 for turnkey properties.',
    unit: '$',
  },
  interestRate: {
    label: 'Interest Rate',
    tooltip: 'Annual interest rate on the mortgage. Investment property rates are typically 0.5-1% higher than primary residence rates.',
    unit: '%',
  },
  loanTermYears: {
    label: 'Loan Term',
    tooltip: 'Length of the mortgage in years. 30-year is most common, 15-year gives faster payoff but higher payments.',
    unit: 'years',
  },
  annualAppreciationPercent: {
    label: 'Annual Appreciation',
    tooltip: 'Expected annual increase in property value. US historical average is roughly 3-4%. Varies widely by market.',
    unit: '%',
  },
}

export const RENTAL_INCOME_LABELS = {
  monthlyRent: {
    label: 'Monthly Rent',
    tooltip: 'Expected monthly rental income. Research comparable properties (comps) in the area for accurate estimates.',
    unit: '$',
  },
  otherMonthlyIncome: {
    label: 'Other Monthly Income',
    tooltip: 'Additional monthly income such as pet fees, parking, laundry, or storage fees.',
    unit: '$',
  },
  vacancyRatePercent: {
    label: 'Vacancy Rate',
    tooltip: 'Expected percentage of time the property is vacant each year. 5-10% is typical for residential rentals.',
    unit: '%',
  },
  annualRentGrowthPercent: {
    label: 'Annual Rent Growth',
    tooltip: 'Expected annual increase in rent. Historical average is around 3%, but varies significantly by market.',
    unit: '%',
  },
}

export const OPERATING_EXPENSE_LABELS = {
  propertyTaxPercent: {
    label: 'Property Tax Rate',
    tooltip: 'Annual property tax as a percentage of assessed value. Varies widely by state and municipality (0.3% - 2.5%).',
    unit: '%',
  },
  insuranceAnnual: {
    label: 'Annual Insurance',
    tooltip: 'Annual landlord insurance premium. Typically $800-$2,000 depending on location, coverage, and property value.',
    unit: '$',
  },
  maintenancePercent: {
    label: 'Maintenance Reserve',
    tooltip: 'Annual maintenance set-aside as a percentage of property value. 1% is a common rule of thumb.',
    unit: '%',
  },
  propertyManagementPercent: {
    label: 'Property Management',
    tooltip: 'Percentage of collected rent paid to a property manager. Typically 8-12%. Set to 0% if self-managing.',
    unit: '%',
  },
  hoaMonthly: {
    label: 'Monthly HOA',
    tooltip: 'Monthly homeowners association fee. Common for condos and some planned communities.',
    unit: '$',
  },
  otherExpensesMonthly: {
    label: 'Other Monthly Expenses',
    tooltip: 'Any other recurring monthly expenses such as pest control, lawn care, or utilities paid by owner.',
    unit: '$',
  },
  annualExpenseGrowthPercent: {
    label: 'Annual Expense Growth',
    tooltip: 'Expected annual increase in operating expenses. Typically tracks inflation at 2-3%.',
    unit: '%',
  },
}

export const TAX_LABELS = {
  marginalTaxRate: {
    label: 'Marginal Tax Rate',
    tooltip: 'Your highest federal income tax bracket. Used to calculate tax savings from rental deductions.',
    unit: '%',
  },
  capitalGainsTaxRate: {
    label: 'Capital Gains Tax Rate',
    tooltip: 'Long-term capital gains tax rate applied when selling the property. 0%, 15%, or 20% depending on income.',
    unit: '%',
  },
  depreciationRecaptureRate: {
    label: 'Depreciation Recapture Rate',
    tooltip: 'Tax rate on previously claimed depreciation when the property is sold. Capped at 25% federally.',
    unit: '%',
  },
  landValuePercent: {
    label: 'Land Value',
    tooltip: 'Percentage of property value attributed to land (not depreciable). Typically 15-30% depending on location.',
    unit: '%',
  },
}

export const SELLING_LABELS = {
  sellingCostsPercent: {
    label: 'Selling Costs',
    tooltip: 'Total costs to sell as a percentage of sale price. Includes agent commissions (5-6%), title, and closing costs.',
    unit: '%',
  },
}

export const INDEX_FUND_LABELS = {
  annualReturnPercent: {
    label: 'Annual Return',
    tooltip: 'Expected total annual return (price appreciation + dividends). S&P 500 historical average is ~10% nominal.',
    unit: '%',
  },
  expenseRatioPercent: {
    label: 'Expense Ratio',
    tooltip: 'Annual fund management fee as a percentage of assets. Low-cost index funds typically charge 0.03-0.10%.',
    unit: '%',
  },
  dividendYieldPercent: {
    label: 'Dividend Yield',
    tooltip: 'Annual dividend as a percentage of portfolio value. S&P 500 yields around 1.3-2%.',
    unit: '%',
  },
  dividendTaxRate: {
    label: 'Dividend Tax Rate',
    tooltip: 'Tax rate on qualified dividends. Most investors pay 15% on qualified dividends.',
    unit: '%',
  },
}

export const MONTE_CARLO_LABELS = {
  simulationCount: {
    label: 'Number of Simulations',
    tooltip: 'How many random scenarios to run. More simulations give more stable results. 5,000-10,000 recommended.',
  },
  rentGrowthStdDev: {
    label: 'Rent Growth Std Dev',
    tooltip: 'Standard deviation for rent growth rate randomization. Higher values mean more variation between simulations.',
    unit: '%',
  },
  appreciationStdDev: {
    label: 'Appreciation Std Dev',
    tooltip: 'Standard deviation for property appreciation rate. Real estate can vary significantly year to year.',
    unit: '%',
  },
  vacancyStdDev: {
    label: 'Vacancy Std Dev',
    tooltip: 'Standard deviation for vacancy rate. Captures uncertainty in tenant occupancy.',
    unit: '%',
  },
  expenseGrowthStdDev: {
    label: 'Expense Growth Std Dev',
    tooltip: 'Standard deviation for operating expense growth. Captures inflation uncertainty.',
    unit: '%',
  },
  indexReturnStdDev: {
    label: 'Index Return Std Dev',
    tooltip: 'Standard deviation for stock market returns. Historically around 15-17% for the S&P 500.',
    unit: '%',
  },
}
