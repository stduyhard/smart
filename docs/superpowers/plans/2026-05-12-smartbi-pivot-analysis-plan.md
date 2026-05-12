# Smartbi Pivot Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based Smartbi-like pivot analysis demo that supports login, data-source selection, drag-and-drop field layout, pivot querying, filtering, subtotal/expand-collapse, and Excel export.

**Architecture:** This is a greenfield frontend project. We will use a Vite + React + TypeScript app with route-based pages, a small Zustand store for pivot state, `@dnd-kit` for drag/drop, a local pivot engine for demo data processing, and `xlsx` for export. We will keep the workflow real in the browser while mocking backend behavior with local fixture data and small service adapters.

**Tech Stack:** Vite, React, TypeScript, React Router, Zustand, Vitest, Testing Library, `@dnd-kit`, `xlsx`

---

## File Structure

### Create

- `package.json` — project dependencies and scripts
- `tsconfig.json` — TypeScript configuration
- `vite.config.ts` — Vite configuration
- `index.html` — app mount point
- `src/main.tsx` — React bootstrap
- `src/App.tsx` — route container
- `src/styles/global.css` — app-wide Smartbi-like visual system
- `src/router.tsx` — route definitions
- `src/types/pivot.ts` — shared pivot domain types
- `src/data/orderModel.ts` — demo data-source metadata and rows
- `src/services/auth.ts` — fake login API
- `src/services/dataSources.ts` — data-source list API
- `src/services/pivot.ts` — pivot query adapter
- `src/store/pivotStore.ts` — pivot layout and UI state
- `src/utils/pivotEngine.ts` — pivot computation, subtotal, expand/collapse helpers
- `src/utils/exportExcel.ts` — Excel export utility
- `src/pages/LoginPage.tsx` — login page
- `src/pages/DataSourcePage.tsx` — data-source selection page
- `src/pages/PivotPage.tsx` — main pivot analysis page
- `src/components/layout/AppShell.tsx` — reusable shell layout
- `src/components/pivot/Toolbar.tsx` — query/reset/export buttons
- `src/components/pivot/FieldPanel.tsx` — dimension/measure field list
- `src/components/pivot/LayoutZone.tsx` — row/column/measure/filter drop areas
- `src/components/pivot/FilterPanel.tsx` — filter editor
- `src/components/pivot/SettingsPanel.tsx` — right-side Smartbi-like config area
- `src/components/pivot/ResultTable.tsx` — pivot result table
- `src/components/pivot/EmptyState.tsx` — pre-query empty state
- `src/components/pivot/LoadingState.tsx` — query loading state
- `src/components/pivot/FieldChip.tsx` — field pill UI
- `src/components/pivot/DragProvider.tsx` — shared DnD context wrapper
- `src/tests/login-page.test.tsx` — login behavior tests
- `src/tests/data-source-page.test.tsx` — data-source selection tests
- `src/tests/pivot-layout.test.tsx` — layout/store tests
- `src/tests/pivot-engine.test.ts` — pivot engine tests
- `src/tests/pivot-page.test.tsx` — query/filter/export UI tests

### Modify

- `docs/superpowers/specs/2026-05-12-smartbi-pivot-analysis-design.md` — no code changes planned; use as source of truth while implementing

## Task 1: Bootstrap The Frontend Workspace

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write the failing bootstrap smoke test**

```tsx
// src/tests/login-page.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('app bootstrap', () => {
  it('renders login page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '透视分析' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand src/tests/login-page.test.tsx`
Expected: FAIL with module resolution errors because the project files do not exist yet.

- [ ] **Step 3: Write the minimal project scaffolding**

```json
{
  "name": "smartbi-pivot-demo",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.0",
    "zustand": "^5.0.5"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "vite": "^6.0.1",
    "vitest": "^2.1.8"
  }
}
```

```tsx
// src/App.tsx
import { Outlet } from 'react-router-dom'

export default function App() {
  return <Outlet />
}
```

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
```

- [ ] **Step 4: Add the first-pass visual baseline**

```css
/* src/styles/global.css */
:root {
  --bg: #eef3f8;
  --panel: #ffffff;
  --line: #d9e2ef;
  --text: #243042;
  --muted: #6c7b91;
  --brand: #2f80ed;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  background: linear-gradient(180deg, #f7faff 0%, #edf3fb 100%);
  color: var(--text);
}
#root { min-height: 100vh; }
```

- [ ] **Step 5: Run test to verify the project boots**

Run: `npm test -- --runInBand src/tests/login-page.test.tsx`
Expected: FAIL with missing router/login page, but package install and Vitest boot should work.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src/main.tsx src/App.tsx src/styles/global.css src/tests/login-page.test.tsx
git commit -m "chore: bootstrap smartbi pivot frontend"
```

## Task 2: Add Routing, Login, And Data Source Entry Flow

**Files:**
- Create: `src/router.tsx`
- Create: `src/services/auth.ts`
- Create: `src/services/dataSources.ts`
- Create: `src/pages/LoginPage.tsx`
- Create: `src/pages/DataSourcePage.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Test: `src/tests/login-page.test.tsx`
- Test: `src/tests/data-source-page.test.tsx`

- [ ] **Step 1: Write the failing flow tests**

```tsx
// src/tests/data-source-page.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routerConfig } from '../router'

it('logs in and lands on the data-source page', async () => {
  const user = userEvent.setup()
  const router = createMemoryRouter(routerConfig, { initialEntries: ['/'] })
  render(<RouterProvider router={router} />)

  await user.type(screen.getByLabelText('账号'), 'demo')
  await user.type(screen.getByLabelText('密码'), '123456')
  await user.click(screen.getByRole('button', { name: '登录' }))

  expect(await screen.findByRole('heading', { name: '选择数据源' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --runInBand src/tests/login-page.test.tsx src/tests/data-source-page.test.tsx`
Expected: FAIL because router, pages, and services are missing.

- [ ] **Step 3: Implement router and mock services**

```ts
// src/services/auth.ts
export async function login(username: string, password: string) {
  if (username === 'demo' && password === '123456') {
    return { token: 'demo-token', name: '演示用户' }
  }

  throw new Error('账号或密码错误')
}
```

```ts
// src/services/dataSources.ts
export async function listDataSources() {
  return [
    { id: 'orders', name: '订单模型', description: '透视分析演示数据源' },
    { id: 'shipments', name: '发货主题', description: '仅展示，不进入主流程' },
  ]
}
```

```tsx
// src/router.tsx
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/LoginPage'
import DataSourcePage from './pages/DataSourcePage'
import PivotPage from './pages/PivotPage'

export const routerConfig = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'sources', element: <DataSourcePage /> },
      { path: 'pivot/:sourceId', element: <PivotPage /> },
    ],
  },
]

export const router = createBrowserRouter(routerConfig)
```

- [ ] **Step 4: Implement login and data-source pages**

```tsx
// src/pages/LoginPage.tsx
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    try {
      await login(String(form.get('username')), String(form.get('password')))
      navigate('/sources')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    }
  }

  return (
    <main>
      <h1>透视分析</h1>
      <form onSubmit={handleSubmit}>
        <label>账号<input name="username" aria-label="账号" /></label>
        <label>密码<input name="password" aria-label="密码" type="password" /></label>
        {error ? <p>{error}</p> : null}
        <button type="submit">登录</button>
      </form>
    </main>
  )
}
```

```tsx
// src/pages/DataSourcePage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listDataSources } from '../services/dataSources'

export default function DataSourcePage() {
  const navigate = useNavigate()
  const [sources, setSources] = useState<Array<{ id: string; name: string; description: string }>>([])

  useEffect(() => {
    listDataSources().then(setSources)
  }, [])

  return (
    <main>
      <h1>选择数据源</h1>
      {sources.map((source) => (
        <button key={source.id} type="button" onClick={() => navigate(`/pivot/${source.id}`)}>
          {source.name}
        </button>
      ))}
    </main>
  )
}
```

- [ ] **Step 5: Run tests to verify the entry flow passes**

Run: `npm test -- --runInBand src/tests/login-page.test.tsx src/tests/data-source-page.test.tsx`
Expected: PASS for default login view and login-to-source navigation.

- [ ] **Step 6: Commit**

```bash
git add src/router.tsx src/services/auth.ts src/services/dataSources.ts src/pages/LoginPage.tsx src/pages/DataSourcePage.tsx src/tests/login-page.test.tsx src/tests/data-source-page.test.tsx
git commit -m "feat: add login and data source flow"
```

## Task 3: Define Pivot Domain Types, Fixture Data, And Store

**Files:**
- Create: `src/types/pivot.ts`
- Create: `src/data/orderModel.ts`
- Create: `src/store/pivotStore.ts`
- Test: `src/tests/pivot-layout.test.tsx`

- [ ] **Step 1: Write the failing store test**

```tsx
// src/tests/pivot-layout.test.tsx
import { act } from '@testing-library/react'
import { usePivotStore } from '../store/pivotStore'

it('adds a dimension into row layout', () => {
  act(() => {
    usePivotStore.getState().addFieldToZone('发货区域', 'rows')
  })

  expect(usePivotStore.getState().layout.rows).toEqual(['发货区域'])
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --runInBand src/tests/pivot-layout.test.tsx`
Expected: FAIL because the store and types do not exist yet.

- [ ] **Step 3: Implement the shared types and fixture data**

```ts
// src/types/pivot.ts
export type PivotZone = 'rows' | 'columns' | 'measures' | 'filters'

export interface PivotField {
  key: string
  label: string
  type: 'dimension' | 'measure'
}

export interface PivotLayout {
  rows: string[]
  columns: string[]
  measures: string[]
  filters: string[]
}
```

```ts
// src/data/orderModel.ts
export const orderFields = [
  { key: 'region', label: '发货区域', type: 'dimension' },
  { key: 'province', label: '省份', type: 'dimension' },
  { key: 'city', label: '发货城市', type: 'dimension' },
  { key: 'orderPeriod', label: '订单年份', type: 'dimension' },
  { key: 'salesAmount', label: '销售额', type: 'measure' },
  { key: 'salesCount', label: '销售量', type: 'measure' },
] as const

export const orderRows = [
  { region: '华东', province: '江苏', city: '苏州', orderPeriod: '2020年', salesAmount: 168204.1, salesCount: 7007 },
  { region: '华东', province: '浙江', city: '杭州', orderPeriod: '2021年', salesAmount: 151035.94, salesCount: 6511 },
  { region: '华南', province: '广东', city: '广州', orderPeriod: '2020年', salesAmount: 30925.37, salesCount: 1188 },
  { region: '华南', province: '广东', city: '深圳', orderPeriod: '2021年', salesAmount: 102294.38, salesCount: 3498 },
]
```

- [ ] **Step 4: Implement the pivot store**

```ts
// src/store/pivotStore.ts
import { create } from 'zustand'
import type { PivotLayout, PivotZone } from '../types/pivot'

interface PivotState {
  layout: PivotLayout
  expandedKeys: string[]
  addFieldToZone: (field: string, zone: PivotZone) => void
  resetLayout: () => void
}

const emptyLayout: PivotLayout = {
  rows: [],
  columns: [],
  measures: [],
  filters: [],
}

export const usePivotStore = create<PivotState>((set) => ({
  layout: emptyLayout,
  expandedKeys: [],
  addFieldToZone: (field, zone) =>
    set((state) => ({
      layout: {
        ...state.layout,
        [zone]: state.layout[zone].includes(field) ? state.layout[zone] : [...state.layout[zone], field],
      },
    })),
  resetLayout: () => set({ layout: emptyLayout, expandedKeys: [] }),
}))
```

- [ ] **Step 5: Run the store tests**

Run: `npm test -- --runInBand src/tests/pivot-layout.test.tsx`
Expected: PASS for zone insertion and reset behavior after extending the test file.

- [ ] **Step 6: Commit**

```bash
git add src/types/pivot.ts src/data/orderModel.ts src/store/pivotStore.ts src/tests/pivot-layout.test.tsx
git commit -m "feat: add pivot domain model and store"
```

## Task 4: Build The Smartbi-Like Pivot Shell And Layout Zones

**Files:**
- Create: `src/components/pivot/FieldChip.tsx`
- Create: `src/components/pivot/DragProvider.tsx`
- Create: `src/components/pivot/FieldPanel.tsx`
- Create: `src/components/pivot/LayoutZone.tsx`
- Create: `src/components/pivot/Toolbar.tsx`
- Create: `src/components/pivot/SettingsPanel.tsx`
- Create: `src/components/pivot/EmptyState.tsx`
- Create: `src/pages/PivotPage.tsx`
- Test: `src/tests/pivot-page.test.tsx`

- [ ] **Step 1: Write the failing pivot shell test**

```tsx
// src/tests/pivot-page.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PivotPage from '../pages/PivotPage'

it('renders smartbi-like pivot zones', () => {
  render(
    <MemoryRouter initialEntries={['/pivot/orders']}>
      <Routes>
        <Route path="/pivot/:sourceId" element={<PivotPage />} />
      </Routes>
    </MemoryRouter>,
  )

  expect(screen.getByText('行')).toBeInTheDocument()
  expect(screen.getByText('列')).toBeInTheDocument()
  expect(screen.getByText('度量')).toBeInTheDocument()
  expect(screen.getByText('过滤条件')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --runInBand src/tests/pivot-page.test.tsx`
Expected: FAIL because the pivot page and shell components are not implemented.

- [ ] **Step 3: Add the shell and layout components**

```tsx
// src/components/pivot/LayoutZone.tsx
import type { PivotZone } from '../../types/pivot'

export default function LayoutZone({ title, zone, items }: { title: string; zone: PivotZone; items: string[] }) {
  return (
    <section aria-label={title}>
      <header>{title}</header>
      <div data-zone={zone}>
        {items.length ? items.map((item) => <span key={item}>{item}</span>) : <span>拖入字段</span>}
      </div>
    </section>
  )
}
```

```tsx
// src/pages/PivotPage.tsx
import { useParams } from 'react-router-dom'
import LayoutZone from '../components/pivot/LayoutZone'
import { usePivotStore } from '../store/pivotStore'

export default function PivotPage() {
  const { sourceId } = useParams()
  const layout = usePivotStore((state) => state.layout)

  return (
    <main>
      <h1>透视分析</h1>
      <p>当前数据源：{sourceId}</p>
      <LayoutZone title="行" zone="rows" items={layout.rows} />
      <LayoutZone title="列" zone="columns" items={layout.columns} />
      <LayoutZone title="度量" zone="measures" items={layout.measures} />
      <LayoutZone title="过滤条件" zone="filters" items={layout.filters} />
    </main>
  )
}
```

- [ ] **Step 4: Apply the Smartbi-like page structure**

```tsx
// src/components/pivot/Toolbar.tsx
export default function Toolbar() {
  return (
    <div>
      <button type="button">查询</button>
      <button type="button">重置</button>
      <button type="button">导出</button>
    </div>
  )
}
```

```tsx
// src/components/pivot/FieldPanel.tsx
import { orderFields } from '../../data/orderModel'

export default function FieldPanel() {
  const dimensions = orderFields.filter((field) => field.type === 'dimension')
  const measures = orderFields.filter((field) => field.type === 'measure')

  return (
    <aside>
      <h2>数据</h2>
      <h3>维度</h3>
      {dimensions.map((field) => <button key={field.key}>{field.label}</button>)}
      <h3>度量</h3>
      {measures.map((field) => <button key={field.key}>{field.label}</button>)}
    </aside>
  )
}
```

- [ ] **Step 5: Run the shell test**

Run: `npm test -- --runInBand src/tests/pivot-page.test.tsx`
Expected: PASS for visible zones; later extend test for toolbar and field panel visibility.

- [ ] **Step 6: Commit**

```bash
git add src/components/pivot/FieldChip.tsx src/components/pivot/DragProvider.tsx src/components/pivot/FieldPanel.tsx src/components/pivot/LayoutZone.tsx src/components/pivot/Toolbar.tsx src/components/pivot/SettingsPanel.tsx src/components/pivot/EmptyState.tsx src/pages/PivotPage.tsx src/tests/pivot-page.test.tsx
git commit -m "feat: add pivot page shell and layout zones"
```

## Task 5: Add Interactive Field Placement And Query Execution

**Files:**
- Modify: `src/components/pivot/FieldPanel.tsx`
- Modify: `src/components/pivot/LayoutZone.tsx`
- Modify: `src/pages/PivotPage.tsx`
- Create: `src/services/pivot.ts`
- Create: `src/components/pivot/LoadingState.tsx`
- Test: `src/tests/pivot-layout.test.tsx`
- Test: `src/tests/pivot-page.test.tsx`

- [ ] **Step 1: Write the failing interaction test**

```tsx
it('adds fields into layout zones and enables query', async () => {
  const user = userEvent.setup()
  renderPivotPage()

  await user.click(screen.getByRole('button', { name: '发货区域' }))
  await user.click(screen.getByRole('button', { name: '订单年份' }))
  await user.click(screen.getByRole('button', { name: '销售额' }))

  expect(screen.getByLabelText('行')).toHaveTextContent('发货区域')
  expect(screen.getByLabelText('列')).toHaveTextContent('订单年份')
  expect(screen.getByLabelText('度量')).toHaveTextContent('销售额')
  expect(screen.getByRole('button', { name: '查询' })).toBeEnabled()
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --runInBand src/tests/pivot-layout.test.tsx src/tests/pivot-page.test.tsx`
Expected: FAIL because field click placement and query state are missing.

- [ ] **Step 3: Implement a pragmatic first-pass placement model**

```ts
// src/services/pivot.ts
import { orderRows } from '../data/orderModel'
import { buildPivotResult } from '../utils/pivotEngine'
import type { PivotLayout } from '../types/pivot'

export async function queryPivot(layout: PivotLayout, filters: Record<string, string[]>) {
  return buildPivotResult(orderRows, layout, filters)
}
```

```ts
// src/store/pivotStore.ts
interface PivotState {
  activePlacement: 'rows' | 'columns' | 'measures' | 'filters'
  setActivePlacement: (zone: PivotZone) => void
}
```

```tsx
// src/components/pivot/FieldPanel.tsx
const activePlacement = usePivotStore((state) => state.activePlacement)
const addFieldToZone = usePivotStore((state) => state.addFieldToZone)

function handleAdd(label: string) {
  addFieldToZone(label, activePlacement)
}
```

- [ ] **Step 4: Wire query/loading state into the pivot page**

```tsx
// src/pages/PivotPage.tsx
const [loading, setLoading] = useState(false)
const [result, setResult] = useState<PivotResult | null>(null)

async function handleQuery() {
  setLoading(true)
  const nextResult = await queryPivot(layout, {})
  setResult(nextResult)
  setLoading(false)
}
```

- [ ] **Step 5: Run the interaction tests**

Run: `npm test -- --runInBand src/tests/pivot-layout.test.tsx src/tests/pivot-page.test.tsx`
Expected: PASS for field placement and query button behavior; remaining result-table assertions can still fail until Task 6.

- [ ] **Step 6: Commit**

```bash
git add src/components/pivot/FieldPanel.tsx src/components/pivot/LayoutZone.tsx src/pages/PivotPage.tsx src/services/pivot.ts src/components/pivot/LoadingState.tsx src/store/pivotStore.ts src/tests/pivot-layout.test.tsx src/tests/pivot-page.test.tsx
git commit -m "feat: add field placement and query workflow"
```

## Task 6: Implement The Pivot Engine And Result Table

**Files:**
- Create: `src/utils/pivotEngine.ts`
- Create: `src/components/pivot/ResultTable.tsx`
- Test: `src/tests/pivot-engine.test.ts`
- Test: `src/tests/pivot-page.test.tsx`

- [ ] **Step 1: Write the failing pivot engine test**

```ts
// src/tests/pivot-engine.test.ts
import { orderRows } from '../data/orderModel'
import { buildPivotResult } from '../utils/pivotEngine'

it('builds a cross table for region by year with sales amount', () => {
  const result = buildPivotResult(
    orderRows,
    { rows: ['发货区域'], columns: ['订单年份'], measures: ['销售额'], filters: [] },
    {},
  )

  expect(result.rowHeaders).toEqual(['华东', '华南'])
  expect(result.columnHeaders).toEqual(['2020年', '2021年'])
  expect(result.cells['华东|2020年|销售额']).toBe(168204.1)
})
```

- [ ] **Step 2: Run the engine test to verify it fails**

Run: `npm test -- --runInBand src/tests/pivot-engine.test.ts`
Expected: FAIL because `buildPivotResult` is not implemented.

- [ ] **Step 3: Implement the minimal pivot engine**

```ts
// src/utils/pivotEngine.ts
const labelToKey: Record<string, string> = {
  发货区域: 'region',
  省份: 'province',
  发货城市: 'city',
  订单年份: 'orderPeriod',
  销售额: 'salesAmount',
  销售量: 'salesCount',
}

export function buildPivotResult(rows, layout, filters) {
  const filteredRows = rows.filter((row) =>
    Object.entries(filters).every(([field, values]) => values.length === 0 || values.includes(String(row[labelToKey[field]]))),
  )

  const rowField = labelToKey[layout.rows[0]]
  const columnField = labelToKey[layout.columns[0]]
  const measureField = labelToKey[layout.measures[0]]

  const rowHeaders = [...new Set(filteredRows.map((row) => row[rowField]))]
  const columnHeaders = [...new Set(filteredRows.map((row) => row[columnField]))]
  const cells: Record<string, number> = {}

  for (const rowHeader of rowHeaders) {
    for (const columnHeader of columnHeaders) {
      const total = filteredRows
        .filter((row) => row[rowField] === rowHeader && row[columnField] === columnHeader)
        .reduce((sum, row) => sum + Number(row[measureField] ?? 0), 0)
      cells[`${rowHeader}|${columnHeader}|${layout.measures[0]}`] = Number(total.toFixed(2))
    }
  }

  return { rowHeaders, columnHeaders, cells }
}
```

- [ ] **Step 4: Render the result table**

```tsx
// src/components/pivot/ResultTable.tsx
export default function ResultTable({ result, measure }: { result: PivotResult; measure: string }) {
  return (
    <table>
      <thead>
        <tr>
          <th>行标签</th>
          {result.columnHeaders.map((header) => <th key={header}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {result.rowHeaders.map((rowHeader) => (
          <tr key={rowHeader}>
            <th>{rowHeader}</th>
            {result.columnHeaders.map((columnHeader) => (
              <td key={`${rowHeader}-${columnHeader}`}>
                {result.cells[`${rowHeader}|${columnHeader}|${measure}`] ?? 0}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 5: Run the engine and page tests**

Run: `npm test -- --runInBand src/tests/pivot-engine.test.ts src/tests/pivot-page.test.tsx`
Expected: PASS for a real cross-table query and visible result rendering.

- [ ] **Step 6: Commit**

```bash
git add src/utils/pivotEngine.ts src/components/pivot/ResultTable.tsx src/tests/pivot-engine.test.ts src/tests/pivot-page.test.tsx
git commit -m "feat: add pivot engine and result table"
```

## Task 7: Add Filters, Subtotals, And Expand/Collapse

**Files:**
- Create: `src/components/pivot/FilterPanel.tsx`
- Modify: `src/utils/pivotEngine.ts`
- Modify: `src/store/pivotStore.ts`
- Modify: `src/components/pivot/ResultTable.tsx`
- Modify: `src/pages/PivotPage.tsx`
- Test: `src/tests/pivot-engine.test.ts`
- Test: `src/tests/pivot-page.test.tsx`

- [ ] **Step 1: Write the failing feature tests**

```ts
it('filters to east and south regions only', () => {
  const result = buildPivotResult(
    orderRows,
    { rows: ['发货区域'], columns: ['订单年份'], measures: ['销售额'], filters: ['发货区域'] },
    { 发货区域: ['华东', '华南'] },
  )

  expect(result.rowHeaders).toEqual(['华东', '华南'])
})
```

```tsx
it('toggles child rows when expanding a region', async () => {
  const user = userEvent.setup()
  renderPivotPageWithTwoRowLevels()
  await user.click(screen.getByRole('button', { name: '展开 华东' }))
  expect(screen.getByText('江苏')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --runInBand src/tests/pivot-engine.test.ts src/tests/pivot-page.test.tsx`
Expected: FAIL because filter state, subtotal rows, and expand behavior are not implemented.

- [ ] **Step 3: Extend the store with filters and expansion state**

```ts
// src/store/pivotStore.ts
interface PivotState {
  filterValues: Record<string, string[]>
  toggleExpanded: (key: string) => void
  setFilterValues: (field: string, values: string[]) => void
}
```

```ts
setFilterValues: (field, values) =>
  set((state) => ({ filterValues: { ...state.filterValues, [field]: values } })),
toggleExpanded: (key) =>
  set((state) => ({
    expandedKeys: state.expandedKeys.includes(key)
      ? state.expandedKeys.filter((item) => item !== key)
      : [...state.expandedKeys, key],
  })),
```

- [ ] **Step 4: Extend the engine to include subtotal rows**

```ts
// src/utils/pivotEngine.ts
const subtotalKey = `${rowHeader}|合计|${layout.measures[0]}`
cells[subtotalKey] = columnHeaders.reduce(
  (sum, columnHeader) => sum + (cells[`${rowHeader}|${columnHeader}|${layout.measures[0]}`] ?? 0),
  0,
)
```

```tsx
// src/components/pivot/FilterPanel.tsx
export default function FilterPanel({ field, options, value, onChange }) {
  return (
    <label>
      {field}
      <select multiple value={value} onChange={(event) => onChange(Array.from(event.target.selectedOptions, (item) => item.value))}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}
```

- [ ] **Step 5: Run the tests to verify filters and expand/collapse pass**

Run: `npm test -- --runInBand src/tests/pivot-engine.test.ts src/tests/pivot-page.test.tsx`
Expected: PASS for filtering, subtotal visibility, and one-level expand/collapse.

- [ ] **Step 6: Commit**

```bash
git add src/components/pivot/FilterPanel.tsx src/utils/pivotEngine.ts src/store/pivotStore.ts src/components/pivot/ResultTable.tsx src/pages/PivotPage.tsx src/tests/pivot-engine.test.ts src/tests/pivot-page.test.tsx
git commit -m "feat: add filters subtotals and expand collapse"
```

## Task 8: Add Excel Export, Empty/Loading Polish, And Final Validation

**Files:**
- Create: `src/utils/exportExcel.ts`
- Modify: `src/components/pivot/Toolbar.tsx`
- Modify: `src/components/pivot/EmptyState.tsx`
- Modify: `src/components/pivot/LoadingState.tsx`
- Modify: `src/pages/PivotPage.tsx`
- Test: `src/tests/pivot-page.test.tsx`

- [ ] **Step 1: Write the failing export test**

```tsx
it('exports the current pivot result', async () => {
  const user = userEvent.setup()
  const spy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:demo')
  renderPivotPageWithResult()

  await user.click(screen.getByRole('button', { name: '导出' }))

  expect(spy).toHaveBeenCalled()
})
```

- [ ] **Step 2: Run the export test to verify it fails**

Run: `npm test -- --runInBand src/tests/pivot-page.test.tsx`
Expected: FAIL because export wiring does not exist.

- [ ] **Step 3: Implement Excel export and toolbar wiring**

```ts
// src/utils/exportExcel.ts
import * as XLSX from 'xlsx'

export function exportPivotToExcel(result, measure: string) {
  const rows = result.rowHeaders.map((rowHeader) => {
    const row: Record<string, string | number> = { 行标签: rowHeader }
    for (const columnHeader of result.columnHeaders) {
      row[columnHeader] = result.cells[`${rowHeader}|${columnHeader}|${measure}`] ?? 0
    }
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '透视结果')
  XLSX.writeFile(workbook, 'smartbi-pivot-result.xlsx')
}
```

```tsx
// src/components/pivot/Toolbar.tsx
export default function Toolbar({ onQuery, onReset, onExport, disabled }: ToolbarProps) {
  return (
    <div>
      <button type="button" onClick={onQuery} disabled={disabled}>查询</button>
      <button type="button" onClick={onReset}>重置</button>
      <button type="button" onClick={onExport} disabled={disabled}>导出</button>
    </div>
  )
}
```

- [ ] **Step 4: Run the full validation set**

Run: `npm test -- --runInBand`
Expected: PASS for all unit and UI tests.

Run: `npm run build`
Expected: PASS with a production bundle in `dist/`.

- [ ] **Step 5: Smoke-test the manual demo flow**

Run: `npm run dev`
Expected:
- `/` shows the login page
- Login with `demo / 123456`
- Select `订单模型`
- Add `发货区域` to rows, `订单年份` to columns, `销售额` to measures
- Click `查询`
- Apply a filter and verify the result changes
- Trigger `导出` and confirm the `.xlsx` file downloads

- [ ] **Step 6: Commit**

```bash
git add src/utils/exportExcel.ts src/components/pivot/Toolbar.tsx src/components/pivot/EmptyState.tsx src/components/pivot/LoadingState.tsx src/pages/PivotPage.tsx src/tests/pivot-page.test.tsx
git commit -m "feat: finalize export and demo polish"
```

## Self-Review

### Spec Coverage

The spec requires:

1. Login flow — covered in Task 2.
2. Data-source selection — covered in Task 2.
3. Smartbi-like pivot page structure — covered in Task 4.
4. Field layout into rows/columns/measures/filters — covered in Tasks 3 to 5.
5. Query-generated cross table — covered in Tasks 5 and 6.
6. Query filtering — covered in Task 7.
7. Category summary/subtotal — covered in Task 7.
8. Expand/collapse — covered in Task 7.
9. Excel export — covered in Task 8.
10. Demo-ready polish — covered in Task 8.

No spec gaps remain for the first version.

### Placeholder Scan

The plan avoids `TODO`, `TBD`, and “implement later” placeholders. Each task lists exact files, concrete commands, and code snippets for the first implementation pass.

### Type Consistency

The plan consistently uses:

1. `PivotLayout` for zone state.
2. `PivotZone` values `rows | columns | measures | filters`.
3. `buildPivotResult()` for local pivot computation.
4. `exportPivotToExcel()` for export.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-12-smartbi-pivot-analysis-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
