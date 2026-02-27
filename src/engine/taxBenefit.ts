export function calcTaxBenefit(
  noi: number,
  mortgageInterest: number,
  depreciation: number,
  marginalTaxRate: number,
): { taxableIncome: number; taxBenefit: number } {
  const taxableIncome = noi - mortgageInterest - depreciation
  const taxBenefit = taxableIncome < 0 ? Math.abs(taxableIncome) * (marginalTaxRate / 100) : -(taxableIncome * (marginalTaxRate / 100))
  return { taxableIncome, taxBenefit }
}
