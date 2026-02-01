---
name: create-model
description: Create a new interactive economic model component with parameter controls and visualization.
allowed-tools: Read, Write, Edit, Bash
argument-hint: [model-name] [brief-description]
---

# Create Interactive Economic Model

Create a new interactive model: **$ARGUMENTS**

## Model Creation Process

### Step 1: Define the Mathematical Model

First, document the equations in a comment block:

```typescript
/**
 * [Model Name] Model
 *
 * Equations:
 * - [Equation 1]: description
 * - [Equation 2]: description
 *
 * Equilibrium conditions:
 * - [Condition 1]
 *
 * Parameters:
 * - param1: description [range]
 * - param2: description [range]
 *
 * Assumptions:
 * - [Assumption 1]
 * - [Assumption 2]
 */
```

### Step 2: Create the Model Component

Create file at `src/components/models/[ModelName]Model.tsx`:

```tsx
'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ParameterSlider, ParameterGroup } from '@/components/interactive/ParameterSlider'
import { AnimatedGraph } from '@/components/animations/AnimatedGraph'
import { Equation } from '@/components/math/Equation'

// ============================================
// TYPE DEFINITIONS
// ============================================

interface [ModelName]Params {
  // Group 1: [Category]
  param1: number
  param2: number
  // Group 2: [Category]
  param3: number
}

interface [ModelName]Results {
  // Equilibrium values
  equilibriumX: number
  equilibriumY: number
  // Derived quantities
  derived1: number
}

interface Point {
  x: number
  y: number
}

// ============================================
// DEFAULT VALUES
// ============================================

const DEFAULT_PARAMS: [ModelName]Params = {
  param1: 100,
  param2: 0.5,
  param3: 50,
}

const PARAM_RANGES = {
  param1: { min: 0, max: 1000, step: 10 },
  param2: { min: 0, max: 1, step: 0.01 },
  param3: { min: 0, max: 100, step: 1 },
}

// ============================================
// PURE COMPUTATION FUNCTIONS
// ============================================

function solve[ModelName](params: [ModelName]Params): [ModelName]Results {
  const { param1, param2, param3 } = params

  // Validate inputs
  if (param2 >= 1) {
    throw new Error('param2 must be less than 1 for model stability')
  }

  // Compute equilibrium
  const equilibriumX = /* formula */
  const equilibriumY = /* formula */

  // Compute derived quantities
  const derived1 = /* formula */

  return {
    equilibriumX,
    equilibriumY,
    derived1,
  }
}

function generateCurve1(params: [ModelName]Params): Point[] {
  const points: Point[] = []
  // Generate curve points
  for (let x = 0; x <= 100; x += 1) {
    const y = /* formula */
    points.push({ x, y })
  }
  return points
}

function generateCurve2(params: [ModelName]Params): Point[] {
  const points: Point[] = []
  // Generate curve points
  for (let x = 0; x <= 100; x += 1) {
    const y = /* formula */
    points.push({ x, y })
  }
  return points
}

// ============================================
// PRESET SCENARIOS
// ============================================

const PRESETS = {
  baseline: {
    name: 'Caso Base',
    description: 'Equilibrio inicial estandar',
    params: DEFAULT_PARAMS,
  },
  scenario1: {
    name: 'Escenario 1',
    description: 'Descripcion del escenario',
    params: { ...DEFAULT_PARAMS, param1: 200 },
  },
}

// ============================================
// MAIN COMPONENT
// ============================================

export function [ModelName]Model() {
  // State
  const [params, setParams] = useState<[ModelName]Params>(DEFAULT_PARAMS)
  const [error, setError] = useState<string | null>(null)

  // Computed values
  const results = useMemo(() => {
    try {
      setError(null)
      return solve[ModelName](params)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error en el modelo')
      return null
    }
  }, [params])

  const curves = useMemo(() => {
    if (!results) return []
    return [
      {
        id: 'curve1',
        points: generateCurve1(params),
        color: '#3b82f6',
        label: 'Curva 1',
      },
      {
        id: 'curve2',
        points: generateCurve2(params),
        color: '#ef4444',
        label: 'Curva 2',
      },
    ]
  }, [params, results])

  // Handlers
  const updateParam = useCallback((key: keyof [ModelName]Params) => (value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }, [])

  const applyPreset = useCallback((presetKey: keyof typeof PRESETS) => {
    setParams(PRESETS[presetKey].params)
  }, [])

  const resetToDefaults = useCallback(() => {
    setParams(DEFAULT_PARAMS)
  }, [])

  // Render
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">[Model Name]</h2>
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Restaurar Valores
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Parameters Panel */}
        <div className="space-y-6">
          {/* Presets */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-500 uppercase">
              Escenarios
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key as keyof typeof PRESETS)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Groups */}
          <ParameterGroup title="Grupo 1">
            <ParameterSlider
              label="Parametro 1"
              symbol="P_1"
              value={params.param1}
              onChange={updateParam('param1')}
              {...PARAM_RANGES.param1}
              description="Descripcion del parametro"
            />
          </ParameterGroup>

          <ParameterGroup title="Grupo 2">
            <ParameterSlider
              label="Parametro 2"
              symbol="P_2"
              value={params.param2}
              onChange={updateParam('param2')}
              {...PARAM_RANGES.param2}
            />
          </ParameterGroup>
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Graph */}
          <AnimatedGraph
            curves={curves}
            equilibrium={results ? {
              x: results.equilibriumX,
              y: results.equilibriumY
            } : undefined}
            xLabel="Variable X"
            yLabel="Variable Y"
            title="Equilibrio del Modelo"
          />

          {/* Results Display */}
          {results && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResultCard
                label="Equilibrio X"
                symbol="X^*"
                value={results.equilibriumX}
                format="number"
              />
              <ResultCard
                label="Equilibrio Y"
                symbol="Y^*"
                value={results.equilibriumY}
                format="number"
              />
            </div>
          )}

          {/* Equations */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-500 mb-3">
              Ecuaciones del Modelo
            </h4>
            <Equation
              math="Y = f(X, P_1, P_2)"
              label="Ecuacion Principal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// HELPER COMPONENTS
// ============================================

interface ResultCardProps {
  label: string
  symbol: string
  value: number
  format?: 'number' | 'percent' | 'currency'
}

function ResultCard({ label, symbol, value, format = 'number' }: ResultCardProps) {
  const formattedValue = useMemo(() => {
    switch (format) {
      case 'percent':
        return `${(value * 100).toFixed(2)}%`
      case 'currency':
        return `$${value.toLocaleString()}`
      default:
        return value.toFixed(2)
    }
  }, [value, format])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white rounded-lg border border-gray-200"
    >
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold font-mono">{formattedValue}</div>
      <div className="text-xs text-gray-400">
        <Equation math={symbol} inline />
      </div>
    </motion.div>
  )
}
```

### Step 3: Export the Model

Add export to `src/components/models/index.ts`:

```typescript
export { [ModelName]Model } from './[ModelName]Model'
```

### Step 4: Test the Model

Run the development server and test:
- All parameters adjust correctly
- Curves update in real-time
- Edge cases don't crash the app
- Equilibrium point is correct

## Validation Checklist

- [ ] Mathematical formulas are correct
- [ ] All parameters have sensible ranges
- [ ] Error states are handled gracefully
- [ ] Presets demonstrate key scenarios
- [ ] Component is responsive (mobile-friendly)
- [ ] Animations are smooth
- [ ] Spanish labels are correct
