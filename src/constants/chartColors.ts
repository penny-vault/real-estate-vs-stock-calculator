/**
 * Centralized chart color palette.
 * Two hero colors (rental amber, stock blue) plus distinct hues
 * for multi-series breakdowns so nothing blends together on dark backgrounds.
 */

// ── Hero colors ────────────────────────────────────────────
export const RENTAL = '#e5953e'
export const STOCK = '#3b82f6'

// ── Status / sentiment ────────────────────────────────────
export const POSITIVE = '#22c55e'
export const NEGATIVE = '#ef4444'
export const WARNING = '#f59e0b'

// ── Wealth component palette (stacked area, breakdowns) ───
// Each component gets a DISTINCT hue so layers are readable.
export const WEALTH = {
  downPayment: '#78716c',   // stone -- initial cash, neutral
  principal:   '#06b6d4',   // cyan  -- equity building
  appreciation:'#f59e0b',   // amber -- growth
  cashFlow:    '#8b5cf6',   // violet -- income stream
} as const

// ── Expense / cost palette ────────────────────────────────
export const EXPENSE = {
  mortgage:     '#ef4444',  // red -- biggest cost
  interest:     '#ef4444',  // red -- pure cost
  principalEq:  '#3b82f6',  // blue -- builds equity
  propertyTax:  '#f59e0b',  // amber
  insurance:    '#06b6d4',  // cyan
  maintenance:  '#8b5cf6',  // violet
  management:   '#ec4899',  // pink
  vacancy:      '#f43f5e',  // rose
  hoa:          '#71717a',  // gray
  other:        '#52525b',  // dark gray
} as const

// ── Funnel / flow stages ─────────────────────────────────
export const FLOW = {
  grossIncome:    '#f59e0b',  // bright amber
  effectiveIncome:'#e5953e',  // our rental amber
  noi:            '#06b6d4',  // cyan -- operating result
  preTaxCashFlow: '#8b5cf6',  // violet
  netPositive:    '#22c55e',  // green
  netNegative:    '#ef4444',  // red
} as const

// ── Gauge thresholds ─────────────────────────────────────
export const GAUGE = {
  poor:      '#ef4444',
  fair:      '#f59e0b',
  good:      '#22c55e',
  excellent: '#15803d',
} as const

// ── Heatmap range ────────────────────────────────────────
export const HEATMAP = {
  strongLoss: '#7f1d1d',
  loss:       '#991b1b',
  neutral:    '#27272a',
  win:        '#166534',
  strongWin:  '#15803d',
} as const

// ── UI chrome (tooltips, grids, axes) ────────────────────
export const UI = {
  grid:          '#1c1c1f',
  label:         '#52525b',
  tooltipBg:     '#18181b',
  tooltipBorder: '#27272a',
  textPrimary:   '#fafafa',
  textSecondary: '#a1a1aa',
  textMuted:     '#71717a',
  border:        '#111113',
} as const

// ── Convenience: standard ECharts tooltip config ─────────
export const TOOLTIP_STYLE = {
  backgroundColor: UI.tooltipBg,
  borderColor: UI.tooltipBorder,
  textStyle: {
    color: UI.textPrimary,
    fontSize: 11,
    fontFamily: 'GeistMono, monospace',
  },
} as const
