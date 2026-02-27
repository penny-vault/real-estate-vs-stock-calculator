import type { AllInputs } from '../types/inputs'
import type { SensitivityCell } from '../types/charts'
import { runFullCalculation } from './summary'

type InputPath = (inputs: AllInputs, value: number) => void

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function generateSensitivityData(
  baseInputs: AllInputs,
  xValues: number[],
  yValues: number[],
  setX: InputPath,
  setY: InputPath,
): SensitivityCell[] {
  const data: SensitivityCell[] = []

  for (let xi = 0; xi < xValues.length; xi++) {
    for (let yi = 0; yi < yValues.length; yi++) {
      const inputs = deepClone(baseInputs)
      setX(inputs, xValues[xi]!)
      setY(inputs, yValues[yi]!)
      const result = runFullCalculation(inputs)
      data.push({
        x: xi,
        y: yi,
        value: Math.round(result.summary.outperformance),
      })
    }
  }

  return data
}

export function appreciationVsInterestRate(inputs: AllInputs) {
  const xValues = [1, 2, 3, 4, 5, 6]
  const yValues = [5, 5.5, 6, 6.5, 7, 7.5, 8]
  const xLabels = xValues.map(v => `${v}%`)
  const yLabels = yValues.map(v => `${v}%`)

  const data = generateSensitivityData(
    inputs,
    xValues,
    yValues,
    (i, v) => { i.property.annualAppreciationPercent = v },
    (i, v) => { i.property.interestRate = v },
  )

  return { xLabels, yLabels, data, xName: 'Appreciation', yName: 'Interest Rate' }
}

export function rentGrowthVsVacancy(inputs: AllInputs) {
  const xValues = [1, 2, 3, 4, 5]
  const yValues = [2, 4, 6, 8, 10, 12]
  const xLabels = xValues.map(v => `${v}%`)
  const yLabels = yValues.map(v => `${v}%`)

  const data = generateSensitivityData(
    inputs,
    xValues,
    yValues,
    (i, v) => { i.rentalIncome.annualRentGrowthPercent = v },
    (i, v) => { i.rentalIncome.vacancyRatePercent = v },
  )

  return { xLabels, yLabels, data, xName: 'Rent Growth', yName: 'Vacancy Rate' }
}

export function downPaymentVsIndexReturn(inputs: AllInputs) {
  const xValues = [10, 15, 20, 25, 30]
  const yValues = [6, 8, 10, 12, 14]
  const xLabels = xValues.map(v => `${v}%`)
  const yLabels = yValues.map(v => `${v}%`)

  const data = generateSensitivityData(
    inputs,
    xValues,
    yValues,
    (i, v) => { i.property.downPaymentPercent = v },
    (i, v) => { i.indexFund.annualReturnPercent = v },
  )

  return { xLabels, yLabels, data, xName: 'Down Payment', yName: 'Stock Portfolio Return' }
}
