export interface EquityGrowthData {
  years: number[]
  rentalEquity: number[]
  indexFund: number[]
}

export interface CashFlowWaterfallData {
  categories: string[]
  values: number[]
  colors: string[]
}

export interface SensitivityCell {
  x: number
  y: number
  value: number
}

export interface SensitivityHeatmapData {
  xLabels: string[]
  yLabels: string[]
  data: SensitivityCell[]
  xName: string
  yName: string
}

export interface WealthBreakdownData {
  years: number[]
  principalPaydown: number[]
  appreciation: number[]
  cumulativeCashFlow: number[]
  taxSavings: number[]
  indexFund: number[]
}

export interface DonutSlice {
  name: string
  value: number
  color: string
}
