export function propertyValue(afterRepairValue: number, annualRatePercent: number, year: number): number {
  return afterRepairValue * Math.pow(1 + annualRatePercent / 100, year)
}
