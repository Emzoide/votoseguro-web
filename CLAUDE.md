# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Voto Seguro 2026** is an educational ballot simulator for Peru's April 13, 2026 general elections. Users practice marking a 5-column ballot (cédula de sufragio) with real JNE candidate data (8,217+ candidates across 38 political organizations). All UI text is in Spanish (es-PE).

Live: https://votoseguro-web.vercel.app

## Commands

```bash
npm run dev          # Local dev server (Next.js)
npm run build        # Production build
npm run type-check   # TypeScript strict check (tsc --noEmit)
```

CI runs `type-check` then `build` on push to main/develop and on PRs to main. No test framework is configured yet.

## Tech Stack

- **Next.js 16** (App Router, Server Components by default) + **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS 3.4** with custom colors defined in `tailwind.config.ts` (e.g. `voto-rojo`, `voto-verde`)
- **Deployment**: Vercel (auto-deploy from main)
- **Node 22** (CI)
- **Path alias**: `@/*` → `./src/*`

## Architecture

### Pages (App Router)

| Route | Purpose |
|-------|---------|
| `/` | Landing page with hero, 5-column explainer, FAQ |
| `/simulador` | Interactive ballot simulator (main feature) |
| `/candidatos` | Candidate directory filtered by position & department |
| `/guia` | Election day voting guide |

Query params: `/simulador?dep=LIMA`, `/candidatos?cargo=DIPUTADO&dep=Cusco`

### Data Structure

Candidate data is partitioned by cargo and region (no monolithic JSON):

```
src/data/
├── partidos.ts                    # 38 partidos: id, nombre, siglas, color, idOrg
├── regiones.ts                    # 27 regiones electorales con id slug y nombre
├── presidenciales/candidatos.json # Fórmulas presidenciales (presidente + VP1 + VP2)
├── senadores-nacional/candidatos.json
├── senadores-regional/            # 27 JSONs: amazonas.json, lima.json, etc.
│   └── index.ts                   # Barrel: exporta SENADORES_REGIONAL Record
├── diputados/                     # 27 JSONs por región
│   └── index.ts                   # Barrel: exporta DIPUTADOS Record
└── parlamento-andino/candidatos.json
```

Each JSON has format `{ data: JNECandidatoRaw[] }` from the JNE API.

### Core Data Flow

1. **Static candidate data** is imported at build time from partitioned JSONs in `src/data/` — no runtime API calls
2. `src/lib/candidatos-service.ts` uses `PARTIDOS_POR_IDORG` (from `src/data/partidos.ts`) to map party info and `REGIONES`/`REGION_POR_NOMBRE_JNE` (from `src/data/regiones.ts`) to resolve departments
3. `getDatosSimulador(dep?)` assembles `DatosSimulador` from the partitioned JSONs
4. `src/hooks/useCedula.ts` manages ballot state (`VotoCedula`) and exposes actions: `seleccionarFormula`, `seleccionarLista`, `togglePreferencial`, `setPreferencial`, `validar`, `resetear`
5. `src/lib/cedula-logic.ts` validates the ballot against ONPE rules (pure functions, no side effects)

### The 5 Electoral Columns

Each column maps to a `TipoCargo` and has different preferential vote limits:

| Column | TipoCargo | Max Preferentials |
|--------|-----------|-------------------|
| 1. Presidential Formula | `FORMULA_PRESIDENCIAL` | 0 |
| 2. National Senators | `SENADOR_NACIONAL` | 2 |
| 3. Regional Senators | `SENADOR_REGIONAL` | 1 |
| 4. Deputies | `DIPUTADO` | 2 |
| 5. Andean Parliament | `PARLAMENTO_ANDINO` | 2 |

Columns 3 and 4 are department-specific. National vs regional senators are distinguished by `strUbigeo === "000000"`.

### Key Types (`src/lib/types.ts`)

- `VotoCedula` — full ballot selection state (one entry per column)
- `SeleccionColumna` — party selection + preferential candidate numbers for a column
- `ResultadoCedula` — validation result: `valido | nulo | blanco`
- `DatosSimulador` — all electoral lists organized by column
- `ListaElectoral` — one party's candidate list for a specific position
- `PartidoPolitico` — party registry entry (id, nombre, siglas, color, idOrg)
- `RegionElectoral` — region with id slug and display name

### Component Structure

- `src/components/cedula/` — Ballot simulator UI: `CedulaSimulador` (container) → `ColumnaElectoral` → `FilaPartido` → `MarcaVoto`
- `src/components/candidatos/` — Candidate directory: `PartidoAccordion` → `FilaCandidato`
- `src/components/layout/` — `Header` (with countdown timer) and `Footer`
- `ResumenVotoLateral` — Sticky desktop sidebar showing real-time vote summary
- `TutorialOnboarding` — Interactive first-use tutorial overlay

### Data Generation (ETL Scripts)

`scripts/` contains ETL scripts to regenerate the static JSONs from the JNE API:

- **`fetch-candidatos-raw.cjs`** — Downloads all candidates from the JNE list API and saves them partitioned by cargo/region. Run this to refresh raw candidate data.
  ```bash
  node scripts/fetch-candidatos-raw.cjs
  ```
- **`fetch-candidatos-enriched.cjs`** — Enriches raw JSONs with hoja de vida data (education, career, sentences). Resumable. For Phase 2.
  ```bash
  node scripts/fetch-candidatos-enriched.cjs [tipo] [region]
  ```

### External Services

- **JNE photos**: `https://mpesije.jne.gob.pe/apidocs/{guidFoto}.jpeg`
- **JNE party logos**: `https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo/{idOrg}`
- **JNE HV portal**: `https://votoinformado.jne.gob.pe/hoja-vida/22/{dni}`
- CSP and image remote patterns configured in `next.config.ts`

## Electoral Domain Rules

Vote validation follows ONPE/JNE legislation (Ley N° 26859):
- Valid marks: aspa (X) or cruz (+) only
- Preferential votes are optional — 0 is always valid
- Duplicate preferential numbers → column is null
- Exceeding max preferentials → column is null
- A null column does NOT invalidate other columns
- Cross-party voting (voto cruzado) is allowed
- Blank ballot = no selections at all

These rules are codified in `cedula-logic.ts` and displayed to users via `REGLAS_VOTO`.

## Environment Variables

See `.env.example`. Key vars: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`.
