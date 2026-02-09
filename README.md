# List Lab

An interactive React demo that compares three list rendering strategies side-by-side with real-time performance metrics. Built as a portfolio piece to demonstrate frontend performance optimization techniques.

## What It Does

List Lab lets you switch between **Pagination**, **Infinite Scroll**, and **Virtualization** strategies while monitoring live metrics like DOM node count, items loaded, render time, and overall health status. A built-in recommendation engine suggests the best strategy based on your current dataset size and network conditions.

### Strategies

- **Pagination** — Renders a fixed page of items at a time. DOM stays small and predictable.
- **Infinite Scroll** — Progressively loads items as you scroll. DOM grows over time.
- **Virtualization** — Only renders visible items using `@tanstack/react-virtual`. DOM stays constant even with 100k+ items.

### Features

- Adjustable dataset size (100 to 100,000 items)
- Three content themes (E-commerce, Social, Logs)
- Network simulation (Fast, Slow, Offline)
- Real-time DOM node counting and health indicators
- Performance comparison chart and metrics table
- Strategy recommendation engine
- Responsive layout with sticky controls

## Tech Stack

| Category | Library |
|---|---|
| Framework | React 19, TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Virtualization | @tanstack/react-virtual |
| Infinite Scroll | react-intersection-observer |
| Charts | Recharts |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
pnpm build
pnpm preview
```

### Lint

```bash
pnpm lint
```

## Project Structure

```
src/
├── App.tsx                          # Main layout (sticky controls + single-strategy view)
├── main.tsx                         # Entry point
├── index.css                        # Tailwind CSS 4 config (@theme tokens, animations)
├── types/index.ts                   # TypeScript types
├── constants/index.ts               # Thresholds, presets, strategy info
├── store/app-store.ts               # Zustand store (controls, metrics, actions)
├── lib/
│   ├── seeded-random.ts             # Mulberry32 PRNG (deterministic data)
│   ├── data-generator.ts            # On-demand item generation per theme
│   ├── themes.ts                    # Word pools per theme
│   ├── recommend.ts                 # Strategy recommendation engine
│   └── cn.ts                        # clsx + tailwind-merge utility
├── hooks/
│   ├── use-dom-count.ts             # Polls DOM node count every 500ms
│   └── use-render-timer.ts          # Measures render duration
└── components/
    ├── layout/                      # Header, Footer
    ├── controls/                    # ControlsPanel, DatasetSizeSlider, ThemeSelector, NetworkSpeedSelector, ResetButton
    ├── strategies/                  # StrategySwitcher, StrategyPanel, PaginationStrategy, InfiniteScrollStrategy, VirtualizationStrategy
    ├── items/                       # ListItem (theme-aware), ListItemSkeleton, EmptyState
    ├── metrics/                     # MetricsBar, MetricBadge, HealthIndicator
    ├── comparison/                  # ComparisonSection, ComparisonChart, ComparisonTable, RecommendationCard
    └── ui/                          # Button, Slider, ToggleGroup, Tooltip, Badge, ScrollToBottom
```

## How It Works

**Data generation** uses a seeded PRNG (Mulberry32) so the same index always produces the same item — no large arrays in memory. Items are generated on-demand, which is critical for virtualization at 100k+ scale.

**DOM counting** polls `querySelectorAll('*').length` inside each strategy's container every 500ms. Health thresholds: green (<200 nodes), yellow (<500), red (500+).

**Network simulation** adds artificial delays to data fetching: fast (50ms), slow (1500ms), offline (immediate error).

**Recommendation engine** evaluates dataset size and network speed to suggest the optimal strategy — it uses configuration-based logic, not measured metrics, so the recommendation is available before interacting with any strategy.
