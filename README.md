# Rental Property vs Stock Portfolio Calculator

A comprehensive financial comparison tool that helps investors decide between rental real estate and stock market investing. Built with Vue 3, TypeScript, ECharts, and Tailwind CSS.

## Features

### Calculation Engine
- Full mortgage amortization (monthly principal/interest split)
- Property appreciation with configurable growth rates
- Straight-line depreciation (27.5-year residential schedule)
- Tax benefit modeling (depreciation deductions, mortgage interest write-offs)
- Capital gains tax and depreciation recapture on sale
- Index fund compound growth with expense ratios and dividend taxation
- Monte Carlo simulation (5,000+ randomized scenarios)
- Sensitivity analysis across multiple variable pairs

### Charts (15+)
- **Total Wealth Over Time** -- Rental vs stock with confidence interval bands
- **Where Rental Wealth Comes From** -- Stacked bars decomposing equity sources
- **Break-Even Analysis** -- When rental overtakes stocks
- **Annual Return Breakdown** -- Appreciation, cash flow, and principal vs stock return
- **Property Equity Buildup** -- Property value vs loan balance with equity fill
- **Cash-on-Cash Return** -- Annual yield on invested capital
- **Capital Efficiency** -- Cash invested vs profit with wealth multipliers
- **Money Flow (Sankey)** -- Where every dollar of rental income goes
- **Income Funnel** -- Gross rent narrowing to net cash flow
- **Deal Health Gauges** -- Cap rate, DSCR, cash-on-cash, GRM with ratings
- **Total Cost Breakdown (Treemap)** -- All costs sized by magnitude
- **Annual Cash Flow** -- Income and expense bars by category
- **Expense Breakdown (Donut)** -- Where rental costs go
- **Leverage Impact** -- How down payment affects CAGR with crossover analysis
- **Tax Impact Comparison** -- Rental deductions vs stock dividend taxes
- **Sensitivity Heatmaps** -- Three configurable parameter sweeps
- **Monte Carlo Fan Chart** -- Percentile confidence bands over time

### Input Controls
- Configurable property, financing, income, and expense parameters
- Presets: Conservative, Moderate, Aggressive
- Separate stock portfolio configuration (return, expense ratio, dividends)
- Monte Carlo simulation settings with standard deviation controls
- Tax and selling cost parameters

## Tech Stack

- **Vue 3** with Composition API and `<script setup>`
- **TypeScript** for type safety across the entire codebase
- **Tailwind CSS v4** with custom dark theme
- **ECharts** via `vue-echarts` (line, bar, pie, heatmap, gauge, sankey, treemap, funnel)
- **Vite** for dev server and builds

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npx vue-tsc --noEmit

# Production build
npm run build
```

## Project Structure

```
src/
  engine/           # Calculation modules (amortization, cash flow, tax, etc.)
  composables/      # Vue composables (useCalculator, useMonteCarlo, etc.)
  components/
    charts/         # 15+ ECharts visualization components
    inputs/         # Input panel with collapsible sections and field components
    results/        # Summary cards, year-by-year table, CSV export
    layout/         # App header and page layout
  types/            # TypeScript interfaces for inputs, outputs, charts
  constants/        # Defaults, labels, chart color palette
  utils/            # Formatting and validation helpers
```

## License

Apache-2.0
