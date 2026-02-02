'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

import {
  SolowParams,
  defaultSolowParams,
  solveSteadyState,
  simulateTransition,
  generateSolowDiagram,
  solowScenarios,
} from '@/lib/economics/solow'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface SliderProps {
  label: string
  symbol: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
}

function Slider({ label, symbol, value, min, max, step = 0.01, onChange }: SliderProps) {
  return (
    <div className="mb-3 p-3 bg-white rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label} <InlineMath math={symbol} /></span>
        <span className="font-mono font-semibold">{value.toFixed(step >= 1 ? 0 : 2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
      />
    </div>
  )
}

export function SolowModel() {
  const [params, setParams] = useState<SolowParams>(defaultSolowParams)
  const [showTransition, setShowTransition] = useState(false)

  const results = useMemo(() => solveSteadyState(params), [params])
  const diagram = useMemo(() => generateSolowDiagram(params), [params])
  const transition = useMemo(() => simulateTransition(params), [params])

  const updateParam = (key: keyof SolowParams) => (value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const loadScenario = (key: keyof typeof solowScenarios) => {
    setParams(solowScenarios[key].params)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Modelo de Solow
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Crecimiento económico de largo plazo. Explora cómo el ahorro, la población
          y la tecnología determinan el nivel de vida de una economía.
        </p>
      </div>

      {/* Ecuaciones */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Ecuaciones Fundamentales</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-orange-600 mb-2">Producción</h4>
            <BlockMath math="y = Ak^\alpha" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-2">Acumulación</h4>
            <BlockMath math="\dot{k} = sy - (n+\delta)k" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">Estado Estacionario</h4>
            <BlockMath math="k^* = \left(\frac{sA}{n+\delta}\right)^{\frac{1}{1-\alpha}}" />
          </div>
        </div>
      </div>

      {/* Escenarios */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 py-2">Escenarios:</span>
        {Object.entries(solowScenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => loadScenario(key as keyof typeof solowScenarios)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            {scenario.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Parámetros */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Parámetros</h3>
            <Slider label="Tasa de Ahorro" symbol="s" value={params.s} min={0.05} max={0.5} step={0.01} onChange={updateParam('s')} />
            <Slider label="Crec. Poblacional" symbol="n" value={params.n} min={0} max={0.05} step={0.005} onChange={updateParam('n')} />
            <Slider label="Depreciación" symbol="\delta" value={params.delta} min={0.01} max={0.15} step={0.01} onChange={updateParam('delta')} />
            <Slider label="Part. Capital" symbol="\alpha" value={params.alpha} min={0.2} max={0.5} step={0.01} onChange={updateParam('alpha')} />
            <Slider label="Productividad" symbol="A" value={params.A} min={0.5} max={2} step={0.1} onChange={updateParam('A')} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Condición Inicial</h3>
            <Slider label="Capital Inicial" symbol="k_0" value={params.k0} min={0.1} max={results.k_star * 2} step={0.1} onChange={updateParam('k0')} />
          </div>

          <button
            onClick={() => setShowTransition(!showTransition)}
            className="w-full py-2 bg-orange-100 hover:bg-orange-200 rounded-lg text-orange-800 font-medium"
          >
            {showTransition ? 'Ver Diagrama' : 'Ver Transición'}
          </button>
        </div>

        {/* Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          {!showTransition ? (
            <div className="bg-white rounded-xl border p-4">
              <Plot
                data={[
                  {
                    x: diagram.investment.map((p) => p.x),
                    y: diagram.investment.map((p) => p.y),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Inversión (sy)',
                    line: { color: '#3b82f6', width: 3 },
                  },
                  {
                    x: diagram.depreciation.map((p) => p.x),
                    y: diagram.depreciation.map((p) => p.y),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Depreciación ((n+δ)k)',
                    line: { color: '#ef4444', width: 3 },
                  },
                  {
                    x: [results.k_star],
                    y: [params.s * results.y_star],
                    type: 'scatter',
                    mode: 'markers+text',
                    name: 'Estado Estacionario',
                    marker: { color: '#22c55e', size: 15 },
                    text: ['k*'],
                    textposition: 'top right',
                  },
                  {
                    x: [results.k_gold],
                    y: [(params.n + params.delta) * results.k_gold],
                    type: 'scatter',
                    mode: 'markers',
                    name: 'Regla de Oro',
                    marker: { color: '#f59e0b', size: 12, symbol: 'diamond' },
                  },
                ]}
                layout={{
                  title: 'Diagrama de Solow',
                  xaxis: { title: 'Capital per cápita (k)', range: [0, results.k_star * 2] },
                  yaxis: { title: 'Inversión / Depreciación' },
                  showlegend: true,
                  margin: { t: 50, r: 20, b: 50, l: 60 },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '400px' }}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-4">
              <Plot
                data={[
                  {
                    x: transition.map((p) => p.t),
                    y: transition.map((p) => p.k),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Capital (k)',
                    line: { color: '#3b82f6', width: 2 },
                  },
                  {
                    x: transition.map((p) => p.t),
                    y: transition.map((p) => p.y),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Producto (y)',
                    line: { color: '#22c55e', width: 2 },
                  },
                  {
                    x: transition.map((p) => p.t),
                    y: transition.map((p) => p.c),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Consumo (c)',
                    line: { color: '#ef4444', width: 2 },
                  },
                  {
                    x: [0, params.periods],
                    y: [results.k_star, results.k_star],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'k*',
                    line: { color: '#3b82f6', width: 1, dash: 'dot' },
                  },
                ]}
                layout={{
                  title: 'Dinámica de Transición',
                  xaxis: { title: 'Tiempo (períodos)' },
                  yaxis: { title: 'Valor per cápita' },
                  showlegend: true,
                  margin: { t: 50, r: 20, b: 50, l: 60 },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '400px' }}
              />
            </div>
          )}

          {/* Resultados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600">Capital k*</div>
              <div className="text-2xl font-bold text-blue-800">{results.k_star.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-xs text-green-600">Producto y*</div>
              <div className="text-2xl font-bold text-green-800">{results.y_star.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-xs text-red-600">Consumo c*</div>
              <div className="text-2xl font-bold text-red-800">{results.c_star.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-xs text-orange-600">Vida Media</div>
              <div className="text-2xl font-bold text-orange-800">{results.halfLife.toFixed(0)} períodos</div>
            </div>
          </div>

          {/* Regla de Oro */}
          <div className={`p-4 rounded-lg ${results.isAboveGold ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border`}>
            <h4 className="font-semibold mb-2">Análisis de Regla de Oro</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">k de Regla de Oro:</span>
                <span className="ml-2 font-semibold">{results.k_gold.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">s óptima:</span>
                <span className="ml-2 font-semibold">{(results.s_gold * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-gray-500">c máximo:</span>
                <span className="ml-2 font-semibold">{results.c_gold.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-2 text-sm">
              {results.isAboveGold
                ? '⚠️ La economía está sobre-ahorrando. Podría aumentar el consumo reduciendo s.'
                : '✓ La economía está bajo la regla de oro. Aumentar s elevaría el consumo futuro.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolowModel
