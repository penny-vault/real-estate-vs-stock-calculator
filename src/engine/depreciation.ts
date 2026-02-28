export function annualDepreciation(afterRepairValue: number, landValuePercent: number): number {
  const depreciableBasis = afterRepairValue * (1 - landValuePercent / 100)
  return depreciableBasis / 27.5
}

/** Depreciation for a specific year (1-indexed). Returns 0 after year 27, half in year 28. */
export function depreciationForYear(afterRepairValue: number, landValuePercent: number, year: number): number {
  if (year > 28) return 0
  const full = annualDepreciation(afterRepairValue, landValuePercent)
  // 27.5-year schedule: full deduction years 1-27, half-year in year 28
  if (year <= 27) return full
  return full * 0.5
}

export function cumulativeDepreciation(afterRepairValue: number, landValuePercent: number, years: number): number {
  const full = annualDepreciation(afterRepairValue, landValuePercent)
  if (years <= 27) return full * years
  if (years === 28) return full * 27 + full * 0.5
  // years > 28: fully depreciated
  return full * 27.5
}
