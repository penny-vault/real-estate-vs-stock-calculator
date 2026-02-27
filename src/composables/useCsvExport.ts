import type { YearResult } from '../types/outputs'
import { formatCurrencyCents, formatPercent } from '../utils/formatters'

export function useCsvExport() {
  function exportCsv(yearResults: YearResult[], filename = 'rental-vs-stock-portfolio.csv') {
    const headers = [
      'Year',
      'Property Value',
      'Loan Balance',
      'Equity',
      'Gross Rent',
      'Vacancy',
      'Effective Income',
      'Total Expenses',
      'NOI',
      'Mortgage Payment',
      'Pre-Tax Cash Flow',
      'Tax Benefit',
      'After-Tax Cash Flow',
      'Cash-on-Cash Return',
      'Cumulative Cash Flow',
      'Total Rental Wealth',
      'Stock Portfolio Value',
    ]

    const rows = yearResults.map(r => [
      r.year,
      formatCurrencyCents(r.propertyValue),
      formatCurrencyCents(r.loanBalance),
      formatCurrencyCents(r.equity),
      formatCurrencyCents(r.grossRent),
      formatCurrencyCents(r.vacancy),
      formatCurrencyCents(r.effectiveIncome),
      formatCurrencyCents(r.totalExpenses),
      formatCurrencyCents(r.noi),
      formatCurrencyCents(r.mortgagePayment),
      formatCurrencyCents(r.preTaxCashFlow),
      formatCurrencyCents(r.taxBenefit),
      formatCurrencyCents(r.afterTaxCashFlow),
      formatPercent(r.cashOnCashReturn, 2),
      formatCurrencyCents(r.cumulativeCashFlow),
      formatCurrencyCents(r.totalRentalWealth),
      formatCurrencyCents(r.indexFundValue),
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return { exportCsv }
}
