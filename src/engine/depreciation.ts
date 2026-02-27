export function annualDepreciation(afterRepairValue: number, landValuePercent: number): number {
  const depreciableBasis = afterRepairValue * (1 - landValuePercent / 100)
  return depreciableBasis / 27.5
}

export function cumulativeDepreciation(afterRepairValue: number, landValuePercent: number, years: number): number {
  return annualDepreciation(afterRepairValue, landValuePercent) * years
}
