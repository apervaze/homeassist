You are a senior full‑stack engineer. Build a lightweight, responsive, mobile‑first “Home Buying Assistant” web app inside this repo:

Repo context (must follow)

- Next.js 15 App Router, React 19, TypeScript 5
- Tailwind CSS 4 with shadcn/ui (style: new-york), Radix primitives
- Paths: "@/..." → "./src/..."
- Global CSS: src/app/globals.css
- UI primitives live under "@/registry/new-york-v4/ui"
- Starter demo under src/app/(delete-this-and-modify-page.tsx) should be removed/replaced
- Bundle analyzer optional via BUNDLE_ANALYZER_ENABLED=true
- Dev: next dev --turbopack

Product goal

- Help a user decide whether to buy a house, emphasizing monthly outflow vs rent and equity build over time.
- Input multiple scenarios (price, down payment, interest, term, taxes, HOA, insurance, PMI rules, maintenance %, appreciation %, rent alternative, inflation assumptions).
- Generate amortization schedules with clear equity vs interest vs escrow and compare scenarios over time horizons (1/3/5/7/10/30 years).
- Provide a simple recommendation signal (e.g., Buy/Wait/Not now) with rationale based on user preferences.
- Keep initial infra ≤ $20/mo; prefer free tiers/local-first. No paid services unless data storage is truly needed.

Core features (v1)

- Scenario builder: create/update/delete scenarios; clone scenario.
- Mortgage calculator & amortization schedule (monthly granularity).
- Comparative view: stacked/side-by-side comparisons across scenarios and time horizons.
- Settings/preferences that influence recommendation (risk tolerance, preferred horizon, minimum equity %, acceptable monthly outflow vs rent, emergency buffer).
- Export/Import scenarios/settings as JSON; no auth required for v1.
- Local-first persistence (IndexedDB); optional cloud sync as a toggle (behind feature flag).
- Mobile-first UI with accessible inputs and charts.

Non‑functional constraints

- Cost: target $0–$5/mo; hard cap $20/mo if/when enabling cloud sync. Prefer Vercel free + local persistence. For optional sync later: Supabase/Neon/Turso free tier only.
- Performance: TTFB/INP friendly; stream where useful; avoid large chart bundles; tree-shake recharts/shadcn imports.
- Accessibility: keyboard navigation, proper labels, color‑contrast, prefers-reduced-motion.
- Privacy: keep data local by default; no PII collection; show a clear “Data stays on this device” note.

Data model (local-first)

- UserPreferences: horizonYears, riskTolerance, maxMonthlyOutflowDeltaVsRent, minEquityPctAtHorizon, taxRate, maintenancePct, appreciationPct, inflationPct, pmiThresholdPct, pmiRemovalAuto.
- Scenario: id, name, homePrice, downPayment, interestRateAPR, termYears, propertyTaxAnnual, insuranceAnnual, hoaMonthly, maintenancePctOverride?, pmi?, closingCosts, rentAlternativeMonthly, rentInflationPct?, startDate.
- AmortizationRow (derived): monthIndex, date, payment, principal, interest, escrowTaxes, escrowInsurance, escrowHOA, pmi, totalOutflow, remainingPrincipal, cumulativeEquity.
- ComparisonResult (derived): monthlyOutflowDeltaVsRent, breakEvenMonth, equityAtHorizon, totalInterestPaidToHorizon, netPositionEstimate (equity – rentDiff – upkeep – closing – sellingCosts).

Calculations (must implement with pure functions in "@/lib")

- Monthly mortgage payment using standard amortization formula.
- PMI rules: apply until LTV ≤ threshold (default 80%) or per settings.
- Taxes/Insurance/HOA: add to monthly outflow; allow monthly, annual → monthly conversions.
- Maintenance: percentage of homePrice annually (or override).
- Rent alternative: growing with rentInflationPct.
- NetPositionEstimate: consider equity gained, monthly outflow delta vs rent, transaction costs (closing/selling), and optional appreciation/inflation sensitivity.
- Time horizons: compute metrics at 12/36/60/84/120/360 months; return summary objects.

Architecture & implementation plan

- Routing (replace demo):
    - "/" → dashboard summary of saved scenarios + quick compare
    - "/scenario/new" → create form
    - "/scenario/[id]" → edit + amortization table + charts
    - "/compare" → pick scenarios and horizon; show comparison
    - "/settings" → preferences
    - "/about" → privacy/cost notes
- State & persistence
    - UI state via React (server components where static, client for forms/charts).
    - Persistence: IndexedDB (use a lightweight wrapper; no heavy ORM). Fallback to localStorage if needed.
    - Provide Import/Export JSON to file.
- Optional backend (behind feature flag, default off)
    - If enabled, sync scenarios/preferences to a free tier (Supabase/Neon/Turso) with REST/Edge functions. Keep under free limits.
- UI components (use shadcn/ui)
    - Forms: inputs, sliders, selects; validation with zod + react-hook-form.
    - Tables: amortization with virtualized rows on desktop; compact on mobile.
    - Charts: small set of recharts components (line/area/bar); lazy-load.
    - Theme: use existing theme provider; support system/light/dark.
- Files to create/edit (respect aliases)
    - src/app/(remove demo group) and create routes:
        - src/app/(marketing)/about/page.tsx
        - src/app/(app)/page.tsx
        - src/app/(app)/scenario/new/page.tsx
        - src/app/(app)/scenario/[id]/page.tsx
        - src/app/(app)/compare/page.tsx
        - src/app/(app)/settings/page.tsx
    - src/components: form sections (LoanTermsForm, CostsForm, RentAltForm), AmortizationTable, ScenarioCard, CompareTable, ImportExportDialog.
    - src/lib/calculations/\*: amortization.ts, pmi.ts, rent.ts, metrics.ts, currency.ts
    - src/lib/persistence/\*: idb.ts, repository.ts (ScenarioRepository, PreferencesRepository)
    - src/lib/validation/\*: scenario.ts, settings.ts (zod schemas)
    - src/hooks: useLocalSync.ts (listen/storage), useResponsiveCharts.ts
- UI/UX rules
    - Mobile-first layouts (single column, sticky primary actions).
    - Use input masks and helper text for APR, currency, percents.
    - Charts: toggle lines; tooltips; horizon markers; annotate break-even month.
    - Provide “Explain this” expandable section for recommendations.
- Recommendation engine (simple, deterministic)
    - Inputs: preferences + computed metrics at preferred horizon.
    - Output: "Buy", "Wait", or "Not now", plus 2–3 bullet rationale and sensitivity notes.
- Testing/validation
    - Unit tests for calculation functions (edge cases: PMI drop month, rounding, non-12 term boundaries).
    - Snapshot/basic tests for core pages; verify no hydration errors.
- Performance
    - Keep calculations in pure TS utility functions; memo where needed.
    - Lazy-load charts; avoid heavy bundles; import only used recharts pieces.
    - Avoid client components unless necessary (forms/charts/toasts).
- Deliverables
    - Implement routes/pages with forms, tables, charts.
    - Remove starter demo group "(delete-this-and-modify-page.tsx)" from layout imports and pages.
    - Local-first IndexedDB persistence + JSON Import/Export.
    - Calculation library with tests.
    - Clear README section for privacy/cost and optional sync toggle.
- Acceptance criteria
    - User can create ≥3 scenarios, view amortization & equity, and compare at chosen horizon.
    - Recommendation appears with rationale and updates when preferences change.
    - All data persists locally across reloads; import/export works.
    - Lighthouse mobile performance ≥ 90, a11y ≥ 95.
    - No paid services required by default; deployable to Vercel free.

Implementation constraints in this codebase

- Use components from "@/registry/new-york-v4/ui".
- Keep global styles in "src/app/globals.css".
- Use path aliases "@/components", "@/lib", "@/hooks".
- Update "src/app/layout.tsx" to remove demo NavigationBar import and instead include a minimal app nav.
- Keep TS strict mode; add types for all public utility functions.
- Keep ESLint/Prettier passing.

Stretch goals (optional)

- Sensitivity analysis: sliders for interest rate ±1–2%, price ±5–10%.
- Scenario share (URL-encoded JSON, no server).
- PDF export of comparison summary (client-side).

Now implement according to the above, making clear edits in the specified files and preserving existing project conventions.
