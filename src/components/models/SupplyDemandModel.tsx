'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

import {
  SupplyDemandParams,
  defaultSupplyDemandParams,
  solveEquilibrium,
  generateDemandCurve,
  generateSupplyCurve,
  supplyDemandScenarios,
} from '@/lib/economics/supply-demand'

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

function Slider({ label, symbol, value, min, max, step = 1, onChange }: SliderProps) {
  return (
    <div className="mb-3 p-3 bg-white rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label} <InlineMath math={symbol} /></span>
        <span className="font-mono font-semibold">{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  )
}

function ResultCard({ label, value, color = 'gray' }: { label: string; value: string; color?: string }) {
  const colors = {
    gray: 'bg-gray-50',
    green: 'bg-green-50 text-green-800',
    red: 'bg-red-50 text-red-800',
    blue: 'bg-blue-50 text-blue-800',
  }
  return (
    <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  )
}

export function SupplyDemandModel() {
  const [params, setParams] = useState<SupplyDemandParams>(defaultSupplyDemandParams)

  const results = useMemo(() => solveEquilibrium(params), [params])

  const demandCurve = useMemo(() => generateDemandCurve(params), [params])
  const supplyCurve = useMemo(() => generateSupplyCurve(params), [params])

  const updateParam = (key: keyof SupplyDemandParams) => (value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const loadScenario = (key: keyof typeof supplyDemandScenarios) => {
    setParams(supplyDemandScenarios[key].params)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Oferta y Demanda
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          El modelo fundamental de microeconomía. Observa cómo interactúan
          oferta y demanda para determinar precios y cantidades de equilibrio.
        </p>
      </div>

      {/* Ecuaciones */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2">Demanda</h4>
            <BlockMath math={`Q_d = ${params.a + params.demandShift} - ${params.b}P`} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">Oferta</h4>
            <BlockMath math={`Q_s = ${params.c + params.supplyShift} + ${params.d}P`} />
          </div>
        </div>
      </div>

      {/* Escenarios */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 py-2">Escenarios:</span>
        {Object.entries(supplyDemandScenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => loadScenario(key as keyof typeof supplyDemandScenarios)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {scenario.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Parámetros */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Demanda</h3>
            <Slider label="Intercepto" symbol="a" value={params.a} min={50} max={200} onChange={updateParam('a')} />
            <Slider label="Pendiente" symbol="b" value={params.b} min={0.5} max={5} step={0.5} onChange={updateParam('b')} />
            <Slider label="Desplazamiento" symbol="\Delta D" value={params.demandShift} min={-50} max={50} onChange={updateParam('demandShift')} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Oferta</h3>
            <Slider label="Intercepto" symbol="c" value={params.c} min={-20} max={50} onChange={updateParam('c')} />
            <Slider label="Pendiente" symbol="d" value={params.d} min={0.5} max={5} step={0.5} onChange={updateParam('d')} />
            <Slider label="Desplazamiento" symbol="\Delta S" value={params.supplyShift} min={-50} max={50} onChange={updateParam('supplyShift')} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Intervenciones</h3>
            <Slider label="Impuesto" symbol="\tau" value={params.tax} min={0} max={20} onChange={updateParam('tax')} />
          </div>
        </div>

        {/* Gráfico y Resultados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-4">
            <Plot
              data={[
                {
                  x: demandCurve.map((p) => p.x),
                  y: demandCurve.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Demanda',
                  line: { color: '#ef4444', width: 3 },
                },
                {
                  x: supplyCurve.map((p) => p.x),
                  y: supplyCurve.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Oferta',
                  line: { color: '#22c55e', width: 3 },
                },
                {
                  x: [results.Q_eq],
                  y: [results.P_eq],
                  type: 'scatter',
                  mode: 'markers+text',
                  name: 'Equilibrio',
                  marker: { color: '#3b82f6', size: 15 },
                  text: [`E (${results.Q_eq.toFixed(1)}, ${results.P_eq.toFixed(1)})`],
                  textposition: 'top right',
                },
              ]}
              layout={{
                title: 'Equilibrio de Mercado',
                xaxis: { title: 'Cantidad (Q)', range: [0, Math.max(results.Q_eq * 1.5, 100)] },
                yaxis: { title: 'Precio (P)', range: [0, Math.max(results.P_eq * 2, 50)] },
                showlegend: true,
                margin: { t: 50, r: 20, b: 50, l: 60 },
                shapes: [
                  { type: 'line', x0: 0, x1: results.Q_eq, y0: results.P_eq, y1: results.P_eq, line: { dash: 'dot', color: 'gray' } },
                  { type: 'line', x0: results.Q_eq, x1: results.Q_eq, y0: 0, y1: results.P_eq, line: { dash: 'dot', color: 'gray' } },
                ],
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '400px' }}
            />
          </div>

          {/* Resultados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultCard label="Precio Equilibrio" value={`$${results.P_eq.toFixed(2)}`} color="blue" />
            <ResultCard label="Cantidad Equilibrio" value={results.Q_eq.toFixed(1)} color="blue" />
            <ResultCard label="Exc. Consumidor" value={`$${results.consumerSurplus.toFixed(0)}`} color="green" />
            <ResultCard label="Exc. Productor" value={`$${results.producerSurplus.toFixed(0)}`} color="green" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-1">Elasticidad Demanda</h4>
              <p className="text-2xl font-bold text-red-700">{results.demandElasticity.toFixed(2)}</p>
              <p className="text-sm text-red-600 mt-1">
                {Math.abs(results.demandElasticity) > 1 ? 'Elástica' : Math.abs(results.demandElasticity) < 1 ? 'Inelástica' : 'Unitaria'}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-1">Elasticidad Oferta</h4>
              <p className="text-2xl font-bold text-green-700">{results.supplyElasticity.toFixed(2)}</p>
            </div>
          </div>

          {results.deadweightLoss !== undefined && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900">Pérdida de Eficiencia</h4>
              <p className="text-xl font-bold text-yellow-700">${results.deadweightLoss.toFixed(0)}</p>
              {results.shortage && <p className="text-sm text-yellow-600">Escasez: {results.shortage.toFixed(1)} unidades</p>}
              {results.surplus && <p className="text-sm text-yellow-600">Excedente: {results.surplus.toFixed(1)} unidades</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupplyDemandModel
