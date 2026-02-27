export function calcIndexFundGrowth(
  initialInvestment: number,
  annualReturnPercent: number,
  expenseRatioPercent: number,
  dividendYieldPercent: number,
  dividendTaxRate: number,
  years: number,
  additionalContributions: number[] = [],
): number[] {
  const netReturn = (annualReturnPercent - expenseRatioPercent) / 100
  const divYield = dividendYieldPercent / 100
  const divTax = dividendTaxRate / 100

  // Net return after dividend taxes on the dividend portion
  // Price return = total return - dividend yield
  // After-tax return = price return + dividend yield * (1 - tax rate)
  const priceReturn = netReturn - divYield
  const afterTaxDivReturn = divYield * (1 - divTax)
  const effectiveReturn = priceReturn + afterTaxDivReturn

  const values: number[] = []
  let value = initialInvestment

  for (let y = 0; y < years; y++) {
    value = value * (1 + effectiveReturn)
    // Add any contributions for this year (e.g., if rental has negative cash flow)
    const contrib = additionalContributions[y]
    if (contrib) {
      value += contrib
    }
    values.push(value)
  }

  return values
}
