import type { AmortizationRow } from '../types/outputs'

export function calcMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function generateAmortization(
  principal: number,
  annualRate: number,
  termYears: number,
): AmortizationRow[] {
  const r = annualRate / 100 / 12
  const n = termYears * 12
  const payment = calcMonthlyPayment(principal, annualRate, termYears)
  const rows: AmortizationRow[] = []
  let balance = principal

  for (let i = 1; i <= n; i++) {
    const interest = balance * r
    const principalPaid = payment - interest
    balance = Math.max(0, balance - principalPaid)

    rows.push({
      year: Math.ceil(i / 12),
      month: i,
      payment,
      principal: principalPaid,
      interest,
      balance,
    })
  }

  return rows
}

export function getYearEndBalance(amortization: AmortizationRow[], year: number): number {
  const lastMonth = year * 12
  const row = amortization.find(r => r.month === lastMonth)
  return row ? row.balance : 0
}

export function getAnnualMortgage(amortization: AmortizationRow[], year: number): {
  totalPayment: number
  totalPrincipal: number
  totalInterest: number
} {
  const rows = amortization.filter(r => r.year === year)
  return {
    totalPayment: rows.reduce((s, r) => s + r.payment, 0),
    totalPrincipal: rows.reduce((s, r) => s + r.principal, 0),
    totalInterest: rows.reduce((s, r) => s + r.interest, 0),
  }
}
