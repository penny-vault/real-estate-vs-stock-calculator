import type { SaleSummary } from '../types/outputs'

export function calcSaleProceeds(
  salePrice: number,
  loanBalance: number,
  purchasePrice: number,
  repairCosts: number,
  sellingCostsPercent: number,
  totalDepreciation: number,
  capitalGainsTaxRate: number,
  depreciationRecaptureRate: number,
): SaleSummary {
  const sellingCosts = salePrice * (sellingCostsPercent / 100)
  const costBasis = purchasePrice + repairCosts - totalDepreciation
  const capitalGain = Math.max(0, salePrice - sellingCosts - costBasis)

  // Depreciation recapture is taxed at recapture rate, remaining gain at cap gains rate
  const recaptureAmount = Math.min(totalDepreciation, capitalGain)
  const regularGain = Math.max(0, capitalGain - recaptureAmount)

  const depreciationRecapture = recaptureAmount * (depreciationRecaptureRate / 100)
  const capitalGainsTax = regularGain * (capitalGainsTaxRate / 100)
  const totalTax = depreciationRecapture + capitalGainsTax

  const netSaleProceeds = salePrice - loanBalance - sellingCosts - totalTax

  return {
    salePrice,
    loanPayoff: loanBalance,
    sellingCosts,
    totalDepreciation,
    depreciationRecapture,
    capitalGain,
    capitalGainsTax,
    netSaleProceeds,
  }
}
