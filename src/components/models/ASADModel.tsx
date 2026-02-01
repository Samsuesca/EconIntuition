'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

import {
  ASADParams,
  defaultASADParams,
  solveASAD,
  generateADCurve,
  generateSRASCurve,
  generateLRASCurve,
  asadScenarios,
} from '@/lib/economics/as-ad'

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
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
      />
    </div>
  )
}

export function ASADModel() {
  const [params, setParams] = useState<ASADParams>(defaultASADParams)

  const results = useMemo(() => solveASAD(params), [params])

  const adCurve = useMemo(() => generateADCurve(params, [0.5, 2]), [params])
  const srasCurve = useMemo(() => generateSRASCurve(params), [params])
  const lrasCurve = useMemo(() => generateLRASCurve(params, [0.5, 2]), [params])

  const updateParam = (key: keyof ASADParams) => (value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const setASType = (asType: ASADParams['asType']) => {
    setParams((prev) => ({ ...prev, asType }))
  }

  const loadScenario = (key: keyof typeof asadScenarios) => {
    setParams(asadScenarios[key].params)
  }

  const outputMin = params.Yn * 0.7
  const outputMax = params.Yn * 1.3

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Modelo AS-AD
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Oferta y demanda agregada: equilibrio macroeconómico general,
          nivel de precios y producto de la economía.
        </p>
      </div>

      {/* Ecuaciones */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Ecuaciones Fundamentales</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-2">Demanda Agregada</h4>
            <BlockMath math="Y = \frac{\alpha A + \frac{b\alpha}{h}\frac{M}{P}}{1 + \frac{b\alpha k}{h}}" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-600 mb-2">SRAS (Corto Plazo)</h4>
            <BlockMath math="P = P^e + \theta(Y - Y_n)" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">LRAS (Largo Plazo)</h4>
            <BlockMath math="Y = Y_n" />
          </div>
        </div>
      </div>

      {/* Tipo de Oferta Agregada */}
      <div className="flex flex-wrap gap-3">
        <span className="text-sm text-gray-500 py-2">Tipo de OA:</span>
        {[
          { type: 'short-run' as const, label: 'Corto Plazo (SRAS)' },
          { type: 'long-run' as const, label: 'Largo Plazo (LRAS)' },
          { type: 'keynesian' as const, label: 'Keynesiana' },
        ].map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setASType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              params.asType === type
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Escenarios */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 py-2">Escenarios:</span>
        {Object.entries(asadScenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => loadScenario(key as keyof typeof asadScenarios)}
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
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Política Fiscal</h3>
            <Slider label="Gasto Público" symbol="G" value={params.G} min={100} max={500} step={25} onChange={updateParam('G')} />
            <Slider label="Impuestos" symbol="T" value={params.T} min={100} max={400} step={25} onChange={updateParam('T')} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Política Monetaria</h3>
            <Slider label="Oferta Monetaria" symbol="M" value={params.M} min={500} max={2000} step={100} onChange={updateParam('M')} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Parámetros Estructurales</h3>
            <Slider label="Producto Natural" symbol="Y_n" value={params.Yn} min={2000} max={3000} step={100} onChange={updateParam('Yn')} />
            <Slider label="Expectativas de P" symbol="P^e" value={params.P_e} min={0.5} max={1.5} step={0.05} onChange={updateParam('P_e')} />
            <Slider label="Pendiente SRAS" symbol="\\theta" value={params.theta} min={0.1} max={1} step={0.05} onChange={updateParam('theta')} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Sector Privado</h3>
            <Slider label="Prop. Marg. Consumo" symbol="c" value={params.c} min={0.6} max={0.95} step={0.05} onChange={updateParam('c')} />
            <Slider label="Sens. Inversión" symbol="b" value={params.b} min={20} max={100} step={10} onChange={updateParam('b')} />
          </div>
        </div>

        {/* Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-4">
            <Plot
              data={[
                // Curva AD
                {
                  x: adCurve.map((p) => p.x),
                  y: adCurve.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Demanda Agregada (AD)',
                  line: { color: '#3b82f6', width: 3 },
                },
                // SRAS
                {
                  x: srasCurve.map((p) => p.x),
                  y: srasCurve.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'SRAS',
                  line: { color: '#f97316', width: 3 },
                },
                // LRAS
                {
                  x: lrasCurve.map((p) => p.x),
                  y: lrasCurve.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'LRAS (Yn)',
                  line: { color: '#22c55e', width: 2, dash: 'dash' },
                },
                // Equilibrio
                {
                  x: [results.Y_eq],
                  y: [results.P_eq],
                  type: 'scatter',
                  mode: 'markers+text',
                  name: 'Equilibrio',
                  marker: { color: '#7c3aed', size: 15 },
                  text: ['E'],
                  textposition: 'top right',
                },
              ]}
              layout={{
                title: 'Equilibrio AS-AD',
                xaxis: { title: 'Producto (Y)', range: [outputMin, outputMax] },
                yaxis: { title: 'Nivel de Precios (P)', range: [0.4, 2.2] },
                showlegend: true,
                margin: { t: 50, r: 20, b: 50, l: 60 },
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '400px' }}
            />
          </div>

          {/* Resultados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600">Producto Y</div>
              <div className="text-2xl font-bold text-blue-800">{results.Y_eq.toFixed(0)}</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-xs text-orange-600">Nivel de Precios</div>
              <div className="text-2xl font-bold text-orange-800">{results.P_eq.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-xs text-green-600">Tasa de Interés</div>
              <div className="text-2xl font-bold text-green-800">{(results.i_eq * 100).toFixed(1)}%</div>
            </div>
            <div className={`p-4 rounded-lg ${results.outputGap > 0 ? 'bg-red-50' : results.outputGap < 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
              <div className={`text-xs ${results.outputGap > 0 ? 'text-red-600' : results.outputGap < 0 ? 'text-yellow-600' : 'text-gray-600'}`}>
                Brecha de Producto
              </div>
              <div className={`text-2xl font-bold ${results.outputGap > 0 ? 'text-red-800' : results.outputGap < 0 ? 'text-yellow-800' : 'text-gray-800'}`}>
                {results.outputGap > 0 ? '+' : ''}{results.outputGap.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Componentes */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-xs text-gray-500">Consumo (C)</div>
              <div className="text-xl font-bold">{results.C.toFixed(0)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-xs text-gray-500">Inversión (I)</div>
              <div className="text-xl font-bold">{results.I.toFixed(0)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-xs text-gray-500">Gasto Público (G)</div>
              <div className="text-xl font-bold">{params.G.toFixed(0)}</div>
            </div>
          </div>

          {/* Análisis */}
          <div className={`p-4 rounded-lg border ${
            results.isInflationary ? 'bg-red-50 border-red-200' :
            results.isRecessionary ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <h4 className="font-semibold mb-2">Diagnóstico Macroeconómico</h4>
            {results.isInflationary && (
              <div>
                <p className="text-red-800">
                  ⚠️ <strong>Brecha Inflacionaria:</strong> La economía produce por encima de su potencial.
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Esto genera presión al alza sobre los precios. En el largo plazo, las expectativas
                  de precios subirán, desplazando la SRAS hacia arriba hasta que Y = Yn.
                </p>
              </div>
            )}
            {results.isRecessionary && (
              <div>
                <p className="text-yellow-800">
                  ⚠️ <strong>Brecha Recesionaria:</strong> La economía produce por debajo de su potencial.
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  Esto genera desempleo y presión a la baja sobre precios. La política fiscal o
                  monetaria expansiva podría cerrar la brecha más rápidamente.
                </p>
              </div>
            )}
            {!results.isInflationary && !results.isRecessionary && (
              <div>
                <p className="text-green-800">
                  ✓ <strong>Equilibrio de Largo Plazo:</strong> La economía está en su producto potencial.
                </p>
                <p className="text-sm text-green-600 mt-2">
                  No hay presiones inflacionarias ni deflacionarias. El desempleo está en su
                  tasa natural.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ASADModel
