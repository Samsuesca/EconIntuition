'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

import {
  ISLMParams,
  ISLMResults,
  defaultParams,
  validateParams,
  solveISLM,
  generateISCurve,
  generateLMCurve,
  presetScenarios,
} from '@/lib/economics/islm'

// Importar Plotly dinámicamente (solo cliente)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface ParameterSliderProps {
  label: string
  symbol: string
  value: number
  min: number
  max: number
  step?: number
  description?: string
  onChange: (value: number) => void
}

function ParameterSlider({
  label,
  symbol,
  value,
  min,
  max,
  step = 1,
  description,
  onChange,
}: ParameterSliderProps) {
  return (
    <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">
            <InlineMath math={symbol} />
          </span>
        </div>
        <span className="font-mono font-semibold text-gray-900">
          {step < 1 ? value.toFixed(2) : value.toFixed(0)}
        </span>
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
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}

function ResultCard({
  label,
  value,
  symbol,
  delta,
}: {
  label: string
  value: number
  symbol: string
  delta?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {value.toFixed(2)}
        </span>
        <span className="text-sm text-gray-400">
          <InlineMath math={symbol} />
        </span>
      </div>
      {delta !== undefined && delta !== 0 && (
        <div
          className={`text-sm mt-1 ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {delta > 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(2)}
        </div>
      )}
    </motion.div>
  )
}

export function ISLMModel() {
  const [params, setParams] = useState<ISLMParams>(defaultParams)
  const [showShift, setShowShift] = useState(false)
  const [shiftParams, setShiftParams] = useState<Partial<ISLMParams>>({})

  // Validación
  const validation = useMemo(() => validateParams(params), [params])

  // Calcular equilibrio
  const results = useMemo(() => solveISLM(params), [params])

  // Generar curvas
  const curves = useMemo(() => {
    const maxY = results.Y_star * 2
    const maxI = results.i_star * 3

    return {
      IS: generateISCurve(params, [0, maxI], 100),
      LM: generateLMCurve(params, [0, maxY], 100),
    }
  }, [params, results])

  // Actualizar parámetro
  const updateParam = (key: keyof ISLMParams) => (value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  // Cargar escenario
  const loadScenario = (scenarioKey: keyof typeof presetScenarios) => {
    setParams(presetScenarios[scenarioKey].params)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Modelo IS-LM
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Equilibrio simultáneo del mercado de bienes (IS) y el mercado de dinero (LM).
          Ajusta los parámetros para ver cómo cambia el equilibrio.
        </p>
      </div>

      {/* Ecuaciones principales */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ecuaciones del Modelo</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-2">Curva IS (Mercado de Bienes)</h4>
            <BlockMath math="Y = \frac{A - bi}{1 - c(1-t)}" />
            <p className="text-sm text-gray-500 mt-2">
              donde <InlineMath math="A = C_a + I_a + G + NX + c(Tr - Ta)" />
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2">Curva LM (Mercado de Dinero)</h4>
            <BlockMath math="Y = \frac{M/P}{k} + \frac{h}{k}i" />
            <p className="text-sm text-gray-500 mt-2">
              derivada de <InlineMath math="L = kY - hi = \frac{M}{P}" />
            </p>
          </div>
        </div>
      </div>

      {/* Warnings/Errors */}
      {!validation.valid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {validation.errors.map((error, idx) => (
            <p key={idx} className="text-red-700">⚠️ {error}</p>
          ))}
        </div>
      )}
      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          {validation.warnings.map((warning, idx) => (
            <p key={idx} className="text-yellow-700">💡 {warning}</p>
          ))}
        </div>
      )}

      {/* Escenarios predefinidos */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 py-2">Escenarios:</span>
        {Object.entries(presetScenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => loadScenario(key as keyof typeof presetScenarios)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {scenario.name}
          </button>
        ))}
      </div>

      {/* Layout principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Panel de parámetros */}
        <div className="space-y-6">
          {/* Mercado de Dinero */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Mercado de Dinero (LM)
            </h3>
            <ParameterSlider
              label="Oferta Monetaria"
              symbol="M"
              value={params.M}
              min={100}
              max={3000}
              step={50}
              onChange={updateParam('M')}
            />
            <ParameterSlider
              label="Nivel de Precios"
              symbol="P"
              value={params.P}
              min={0.1}
              max={5}
              step={0.1}
              onChange={updateParam('P')}
            />
            <ParameterSlider
              label="Sensibilidad Renta"
              symbol="k"
              value={params.k}
              min={0.1}
              max={2}
              step={0.1}
              description="Sensibilidad de L a Y"
              onChange={updateParam('k')}
            />
            <ParameterSlider
              label="Sensibilidad Interés"
              symbol="h"
              value={params.h}
              min={1}
              max={500}
              step={10}
              description="Sensibilidad de L a i"
              onChange={updateParam('h')}
            />
          </div>

          {/* Mercado de Bienes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Mercado de Bienes (IS)
            </h3>
            <ParameterSlider
              label="Prop. Marginal Consumo"
              symbol="c"
              value={params.c}
              min={0.1}
              max={0.95}
              step={0.05}
              onChange={updateParam('c')}
            />
            <ParameterSlider
              label="Tasa Impositiva"
              symbol="t"
              value={params.t}
              min={0}
              max={0.5}
              step={0.05}
              onChange={updateParam('t')}
            />
            <ParameterSlider
              label="Sensibilidad Inversión"
              symbol="b"
              value={params.b}
              min={1}
              max={200}
              step={5}
              onChange={updateParam('b')}
            />
            <ParameterSlider
              label="Gasto Público"
              symbol="G"
              value={params.G}
              min={0}
              max={1000}
              step={50}
              onChange={updateParam('G')}
            />
          </div>

          {/* Componentes Autónomos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Componentes Autónomos
            </h3>
            <ParameterSlider
              label="Consumo Autónomo"
              symbol="C_a"
              value={params.Ca}
              min={0}
              max={500}
              step={25}
              onChange={updateParam('Ca')}
            />
            <ParameterSlider
              label="Inversión Autónoma"
              symbol="I_a"
              value={params.Ia}
              min={0}
              max={500}
              step={25}
              onChange={updateParam('Ia')}
            />
          </div>
        </div>

        {/* Gráfico y Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico IS-LM */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Plot
              data={[
                // Curva LM
                {
                  x: curves.LM.map((p) => p.Y),
                  y: curves.LM.map((p) => p.i),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'LM',
                  line: { color: '#3b82f6', width: 3 },
                },
                // Curva IS
                {
                  x: curves.IS.map((p) => p.Y),
                  y: curves.IS.map((p) => p.i),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'IS',
                  line: { color: '#ef4444', width: 3 },
                },
                // Punto de equilibrio
                {
                  x: [results.Y_star],
                  y: [results.i_star],
                  type: 'scatter',
                  mode: 'markers+text',
                  name: 'Equilibrio',
                  marker: { color: '#22c55e', size: 15, symbol: 'circle' },
                  text: [`E (${results.Y_star.toFixed(0)}, ${results.i_star.toFixed(2)})`],
                  textposition: 'top right',
                  textfont: { color: '#22c55e', size: 12 },
                },
              ]}
              layout={{
                title: {
                  text: 'Equilibrio IS-LM',
                  font: { size: 18, family: 'serif' },
                },
                xaxis: {
                  title: 'Producto (Y)',
                  range: [0, results.Y_star * 2],
                  gridcolor: '#f0f0f0',
                },
                yaxis: {
                  title: 'Tasa de Interés (i)',
                  range: [0, Math.max(results.i_star * 2.5, 5)],
                  gridcolor: '#f0f0f0',
                },
                showlegend: true,
                legend: { x: 0.02, y: 0.98 },
                margin: { t: 50, r: 20, b: 50, l: 60 },
                plot_bgcolor: 'white',
                paper_bgcolor: 'white',
                shapes: [
                  // Línea horizontal al equilibrio
                  {
                    type: 'line',
                    x0: 0,
                    x1: results.Y_star,
                    y0: results.i_star,
                    y1: results.i_star,
                    line: { color: 'gray', width: 1, dash: 'dot' },
                  },
                  // Línea vertical al equilibrio
                  {
                    type: 'line',
                    x0: results.Y_star,
                    x1: results.Y_star,
                    y0: 0,
                    y1: results.i_star,
                    line: { color: 'gray', width: 1, dash: 'dot' },
                  },
                ],
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '450px' }}
            />
          </div>

          {/* Resultados de Equilibrio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Valores de Equilibrio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResultCard
                label="Producto"
                value={results.Y_star}
                symbol="Y^*"
              />
              <ResultCard
                label="Tasa de Interés"
                value={results.i_star}
                symbol="i^*"
              />
              <ResultCard
                label="Consumo"
                value={results.C}
                symbol="C"
              />
              <ResultCard
                label="Inversión"
                value={results.I}
                symbol="I"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Demanda Autónoma</h4>
              <p className="text-2xl font-bold text-blue-700">{results.A.toFixed(2)}</p>
              <p className="text-sm text-blue-600 mt-1">
                <InlineMath math="A = C_a + I_a + G + NX + c(Tr - Ta)" />
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Multiplicador Fiscal</h4>
              <p className="text-2xl font-bold text-green-700">{results.multiplier.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">
                <InlineMath math="\alpha = \frac{1}{1 - c(1-t)}" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ISLMModel
