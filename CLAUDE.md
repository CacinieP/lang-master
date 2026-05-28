# Lang Master — Project Conventions

## Tech Stack
- React 19 + TypeScript + Vite
- Zustand for state management
- No runtime dependencies beyond React + Zustand
- Custom lightweight syntax highlighter (no external lib)

## Architecture
- `src/types/` — All TypeScript types, derived from `docs/DATA-MODEL.md`
- `src/data/concepts/` — Static concept data (one file per layer), aggregated by `index.ts`
- `src/store/` — Zustand stores (conceptStore, userStore, progressStore, uiStore)
- `src/services/` — Business logic (conceptEngine, trapAdvisor, masteryTracker, semanticValidator, storage)
- `src/components/` — React UI components organized by feature
- `src/utils/` — Pure utility functions (highlight, shuffle, i18n)

## C1-C7 Design Constraints (MUST follow)
- C1: Concepts organized by paradigm, NOT by language
- C2: c+1 principle — one new concept at a time
- C3: Negative transfer traps must be explicitly labeled
- C4: Minimum 3 languages shown per concept
- C5: Five layers always visible in UI
- C6: No pure pattern-matching pass — semantic verification required
- C7: No privileged language — random display order

## Data Model
- Alpha: 4 languages (python, c, java, rust), 24 concepts (P1-P3)
- Trap keys format: `{source}_to_{target}` (e.g., `python_to_rust`)
- Expression paradigm tags must match one of: procedural, oop, functional, concurrent
- Each concept needs at least 3 language expressions and 1 semantic test

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run test` — Run tests (Vitest)

## Current Phase
Alpha: Explore mode only, localStorage persistence, no sandbox execution
