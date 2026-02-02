'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

import {
  UtilityParams,
  UtilityFunctionType,
  defaultUtilityParams,
  solveConsumerChoice,
  generateIndifferenceCurve,
  generateBudgetLine,
  utilityScenarios,
} from '@/lib/economics/utility'

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
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  )
}

const utilityTypeLabels: Record<UtilityFunctionType, { name: string; formula: string }> = {
  'cobb-douglas': { name: 'Cobb-Douglas', formula: 'U = x^\\alpha y^{1-\\alpha}' },
  'perfect-substitutes': { name: 'Sustitutos Perfectos', formula: 'U = ax + by' },
  'perfect-complements': { name: 'Complementos Perfectos', formula: 'U = \\min(ax, by)' },
  'quasilinear': { name: 'Cuasilineal', formula: 'U = \\ln(x+1) + y' },
}

export function UtilityModel() {
  const [params, setParams] = useState<UtilityParams>(defaultUtilityParams)

  const results = useMemo(() => solveConsumerChoice(params), [params])
  const budgetLine = useMemo(() => generateBudgetLine(params), [params])

  // Generar múltiples curvas de indiferencia
  const indifferenceCurves = useMemo(() => {
    const levels = [
      results.utility_max * 0.5,
      results.utility_max * 0.75,
      results.utility_max,
      results.utility_max * 1.25,
    ]
    return levels.map(U => ({
      U,
      points: generateIndifferenceCurve(params, U),
    }))
  }, [params, results.utility_max])

  const updateParam = (key: keyof UtilityParams) => (value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const setUtilityType = (type: UtilityFunctionType) => {
    setParams((prev) => ({ ...prev, type }))
  }

  const loadScenario = (key: keyof typeof utilityScenarios) => {
    setParams(utilityScenarios[key].params)
  }

  const maxX = params.income / params.px * 1.2
  const maxY = params.income / params.py * 1.2

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Preferencias y Utilidad
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Teoría del consumidor: curvas de indiferencia, restricción presupuestaria
          y elección óptima del consumidor.
        </p>
      </div>

      {/* Ecuación según tipo */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Función de Utilidad</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {(Object.keys(utilityTypeLabels) as UtilityFunctionType[]).map((type) => (
            <button
              key={type}
              onClick={() => setUtilityType(type)}
              className={`p-4 rounded-lg border-2 transition-all ${
                params.type === type
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm mb-2">{utilityTypeLabels[type].name}</div>
              <div className="text-xs">
                <InlineMath math={utilityTypeLabels[type].formula} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Escenarios */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 py-2">Escenarios:</span>
        {Object.entries(utilityScenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => loadScenario(key as keyof typeof utilityScenarios)}
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
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Restricción Presupuestaria</h3>
            <Slider label="Ingreso" symbol="M" value={params.income} min={50} max={200} step={10} onChange={updateParam('income')} />
            <Slider label="Precio bien X" symbol="p_x" value={params.px} min={5} max={30} step={1} onChange={updateParam('px')} />
            <Slider label="Precio bien Y" symbol="p_y" value={params.py} min={5} max={30} step={1} onChange={updateParam('py')} />
          </div>

          {params.type === 'cobb-douglas' && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Preferencias</h3>
              <Slider label="Participación X" symbol="\\alpha" value={params.alpha} min={0.1} max={0.9} step={0.05} onChange={updateParam('alpha')} />
            </div>
          )}

          {params.type === 'perfect-substitutes' && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Preferencias</h3>
              <Slider label="Peso bien X" symbol="a" value={params.a} min={0.5} max={2} step={0.1} onChange={updateParam('a')} />
              <Slider label="Peso bien Y" symbol="b" value={params.b_util} min={0.5} max={2} step={0.1} onChange={updateParam('b_util')} />
            </div>
          )}

          {params.type === 'perfect-complements' && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Proporciones</h3>
              <Slider label="Coef. bien X" symbol="a" value={params.a} min={0.5} max={2} step={0.1} onChange={updateParam('a')} />
              <Slider label="Coef. bien Y" symbol="b" value={params.b_util} min={0.5} max={2} step={0.1} onChange={updateParam('b_util')} />
            </div>
          )}

          {/* Condición de óptimo */}
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h4 className="text-sm font-semibold text-indigo-800 mb-2">Condición de Óptimo</h4>
            <BlockMath math="\frac{MU_x}{MU_y} = \frac{p_x}{p_y}" />
            <p className="text-xs text-indigo-600 mt-2">
              La TMS iguala la relación de precios
            </p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-4">
            <Plot
              data={[
                // Curvas de indiferencia
                ...indifferenceCurves.map((ic, i) => ({
                  x: ic.points.map((p) => p.x),
                  y: ic.points.map((p) => p.y),
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  name: `U = ${ic.U.toFixed(1)}`,
                  line: {
                    color: i === 2 ? '#6366f1' : '#c7d2fe',
                    width: i === 2 ? 3 : 1.5,
                    dash: i === 2 ? 'solid' : 'dot',
                  },
                })),
                // Restricción presupuestaria
                {
                  x: budgetLine.map((p) => p.x),
                  y: budgetLine.map((p) => p.y),
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  name: 'Restricción Presupuestaria',
                  line: { color: '#ef4444', width: 3 },
                },
                // Punto óptimo
                {
                  x: [results.x_optimal],
                  y: [results.y_optimal],
                  type: 'scatter' as const,
                  mode: 'markers+text' as const,
                  name: 'Elección Óptima',
                  marker: { color: '#22c55e', size: 15, symbol: 'circle' },
                  text: ['(x*, y*)'],
                  textposition: 'top right' as const,
                },
              ]}
              layout={{
                title: 'Elección del Consumidor',
                xaxis: { title: 'Cantidad del Bien X', range: [0, maxX] },
                yaxis: { title: 'Cantidad del Bien Y', range: [0, maxY] },
                showlegend: true,
                legend: { orientation: 'h' as const, y: -0.2 },
                margin: { t: 50, r: 20, b: 80, l: 60 },
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '450px' }}
            />
          </div>

          {/* Resultados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600">Bien X óptimo</div>
              <div className="text-2xl font-bold text-blue-800">{results.x_optimal.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-xs text-green-600">Bien Y óptimo</div>
              <div className="text-2xl font-bold text-green-800">{results.y_optimal.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-xs text-indigo-600">Utilidad máxima</div>
              <div className="text-2xl font-bold text-indigo-800">{results.utility_max.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-xs text-orange-600">TMS</div>
              <div className="text-2xl font-bold text-orange-800">{results.MRS.toFixed(2)}</div>
            </div>
          </div>

          {/* Análisis de demanda */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold mb-3">Análisis del Óptimo</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Gasto en X:</span>
                <span className="ml-2 font-semibold">${(params.px * results.x_optimal).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Gasto en Y:</span>
                <span className="ml-2 font-semibold">${(params.py * results.y_optimal).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">MUx:</span>
                <span className="ml-2 font-semibold">{results.MUx.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-gray-500">MUy:</span>
                <span className="ml-2 font-semibold">{results.MUy.toFixed(3)}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {params.type === 'cobb-douglas' &&
                `Con preferencias Cobb-Douglas, el consumidor gasta ${(params.alpha * 100).toFixed(0)}% de su ingreso en X y ${((1-params.alpha) * 100).toFixed(0)}% en Y.`
              }
              {params.type === 'perfect-substitutes' &&
                `Con sustitutos perfectos, el consumidor elige solo el bien con mejor relación utilidad/precio.`
              }
              {params.type === 'perfect-complements' &&
                `Con complementos perfectos, el consumidor consume ambos bienes en proporción fija.`
              }
              {params.type === 'quasilinear' &&
                `Con preferencias cuasilineales, la demanda de X no depende del ingreso (efecto ingreso nulo).`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UtilityModel
