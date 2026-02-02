"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  PhillipsParams,
  PhillipsResults,
  ExpectationsType,
  defaultParams,
  validateParams,
  solvePhillipsCurve,
  generateShortRunCurve,
  generateLongRunCurve,
  presetScenarios,
} from "@/lib/economics/phillips-curve";

// Importar Plotly dinámicamente (solo cliente)
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ParameterSliderProps {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  description?: string;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

function ParameterSlider({
  label,
  symbol,
  value,
  min,
  max,
  step = 0.01,
  description,
  onChange,
  format,
}: ParameterSliderProps) {
  const displayValue = format
    ? format(value)
    : step < 0.01
      ? value.toFixed(3)
      : step < 1
        ? value.toFixed(2)
        : value.toFixed(0);

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
          {displayValue}
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
  );
}

function ResultCard({
  label,
  value,
  symbol,
  format = "percent",
}: {
  label: string;
  value: number;
  symbol: string;
  format?: "percent" | "number" | "ratio";
}) {
  const displayValue =
    format === "percent"
      ? `${(value * 100).toFixed(2)}%`
      : format === "ratio"
        ? value.toFixed(2)
        : value.toFixed(4);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{displayValue}</span>
        <span className="text-sm text-gray-400">
          <InlineMath math={symbol} />
        </span>
      </div>
    </motion.div>
  );
}

function ExpectationsSelector({
  value,
  onChange,
}: {
  value: ExpectationsType;
  onChange: (value: ExpectationsType) => void;
}) {
  const options: {
    value: ExpectationsType;
    label: string;
    description: string;
  }[] = [
    {
      value: "adaptive",
      label: "Adaptativas",
      description: "π^e = π_{t-1}",
    },
    {
      value: "anchored",
      label: "Ancladas",
      description: "Mezcla de meta BC y pasado",
    },
    {
      value: "rational",
      label: "Racionales",
      description: "π^e = π^{target}",
    },
  ];

  return (
    <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Tipo de Expectativas
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name="expectations"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 accent-blue-600"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {option.label}
              </div>
              <div className="text-xs text-gray-500">
                <InlineMath math={option.description} />
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export function PhillipsCurveModel() {
  const [params, setParams] = useState<PhillipsParams>(defaultParams);
  const [showMultipleCurves, setShowMultipleCurves] = useState(true);

  // Validación
  const validation = useMemo(() => validateParams(params), [params]);

  // Calcular equilibrio
  const results = useMemo(() => solvePhillipsCurve(params), [params]);

  // Generar curvas
  const curves = useMemo(() => {
    const uRange: [number, number] = [0, 0.15];
    const piRange: [number, number] = [-0.05, 0.15];

    // Curva de corto plazo actual
    const currentSRPC = generateShortRunCurve(
      params,
      results.pi_e,
      uRange,
      100,
    );

    // Curvas adicionales con diferentes expectativas
    const lowExpectationsSRPC = generateShortRunCurve(
      params,
      0.02,
      uRange,
      100,
    );
    const highExpectationsSRPC = generateShortRunCurve(
      params,
      0.06,
      uRange,
      100,
    );

    // Curva de largo plazo
    const lrpc = generateLongRunCurve(params.u_n, piRange);

    return {
      currentSRPC,
      lowExpectationsSRPC,
      highExpectationsSRPC,
      lrpc,
    };
  }, [params, results]);

  // Actualizar parámetro
  const updateParam =
    (key: keyof PhillipsParams) => (value: number | ExpectationsType) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    };

  // Cargar escenario
  const loadScenario = (scenarioKey: keyof typeof presetScenarios) => {
    setParams(presetScenarios[scenarioKey].params);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Curva de Phillips
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Relación entre inflación y desempleo en el corto y largo plazo.
          Explora el trade-off entre inflación y desempleo y el rol de las
          expectativas.
        </p>
      </div>

      {/* Ecuaciones principales */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ecuaciones del Modelo
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-purple-600 mb-2">
              Curva de Phillips Aumentada
            </h4>
            <BlockMath math="\pi = \pi^e - \alpha(u - u_n) + \varepsilon" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-2">
              Largo Plazo (NAIRU)
            </h4>
            <BlockMath math="u = u_n \text{ cuando } \pi = \pi^e" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">
              Ley de Okun
            </h4>
            <BlockMath math="\frac{Y - Y^*}{Y^*} = -\beta(u - u_n)" />
          </div>
        </div>
      </div>

      {/* Warnings/Errors */}
      {!validation.valid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {validation.errors.map((error, idx) => (
            <p key={idx} className="text-red-700">
              ⚠️ {error}
            </p>
          ))}
        </div>
      )}
      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          {validation.warnings.map((warning, idx) => (
            <p key={idx} className="text-yellow-700">
              💡 {warning}
            </p>
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
            title={scenario.description}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      {/* Layout principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Panel de parámetros */}
        <div className="space-y-6">
          {/* Parámetros estructurales */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Parámetros Estructurales
            </h3>
            <ParameterSlider
              label="NAIRU"
              symbol="u_n"
              value={params.u_n}
              min={0.02}
              max={0.12}
              step={0.005}
              description="Tasa natural de desempleo"
              onChange={updateParam("u_n")}
              format={(v) => `${(v * 100).toFixed(1)}%`}
            />
            <ParameterSlider
              label="Sensibilidad α"
              symbol="\alpha"
              value={params.alpha}
              min={0.1}
              max={2}
              step={0.1}
              description="Sensibilidad de π a brecha de desempleo"
              onChange={updateParam("alpha")}
            />
            <ParameterSlider
              label="Coeficiente de Okun β"
              symbol="\beta"
              value={params.beta}
              min={0.5}
              max={4}
              step={0.1}
              description="Relación desempleo-producto"
              onChange={updateParam("beta")}
            />
          </div>

          {/* Variables actuales */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Variables Actuales
            </h3>
            <ParameterSlider
              label="Desempleo Actual"
              symbol="u"
              value={params.u}
              min={0.01}
              max={0.15}
              step={0.005}
              onChange={updateParam("u")}
              format={(v) => `${(v * 100).toFixed(1)}%`}
            />
            <ParameterSlider
              label="Shock de Oferta"
              symbol="\varepsilon"
              value={params.epsilon}
              min={-0.05}
              max={0.1}
              step={0.005}
              description="Shock de costos (petróleo, etc)"
              onChange={updateParam("epsilon")}
              format={(v) => `${(v * 100).toFixed(1)}%`}
            />
          </div>

          {/* Expectativas */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Expectativas y Política
            </h3>
            <ExpectationsSelector
              value={params.expectations}
              onChange={
                updateParam("expectations") as (value: ExpectationsType) => void
              }
            />
            <ParameterSlider
              label="Inflación Pasada"
              symbol="\pi_{t-1}"
              value={params.pi_prev}
              min={-0.02}
              max={0.15}
              step={0.005}
              onChange={updateParam("pi_prev")}
              format={(v) => `${(v * 100).toFixed(1)}%`}
            />
            <ParameterSlider
              label="Meta de Inflación"
              symbol="\pi^{target}"
              value={params.pi_target}
              min={0}
              max={0.05}
              step={0.005}
              onChange={updateParam("pi_target")}
              format={(v) => `${(v * 100).toFixed(1)}%`}
            />
            {params.expectations === "anchored" && (
              <ParameterSlider
                label="Credibilidad del BC"
                symbol="c"
                value={params.credibility}
                min={0}
                max={1}
                step={0.05}
                description="0 = no creíble, 1 = totalmente creíble"
                onChange={updateParam("credibility")}
                format={(v) => `${(v * 100).toFixed(0)}%`}
              />
            )}
          </div>

          {/* Opciones de visualización */}
          <div className="pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showMultipleCurves}
                onChange={(e) => setShowMultipleCurves(e.target.checked)}
                className="accent-blue-600"
              />
              Mostrar múltiples curvas de corto plazo
            </label>
          </div>
        </div>

        {/* Gráfico y Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico de Phillips */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Plot
              data={[
                // Curva de largo plazo (LRPC)
                {
                  x: curves.lrpc.map((p) => p.u * 100),
                  y: curves.lrpc.map((p) => p.pi * 100),
                  type: "scatter",
                  mode: "lines",
                  name: "LRPC",
                  line: { color: "#6b7280", width: 3, dash: "dash" },
                },
                // Curva de corto plazo actual
                {
                  x: curves.currentSRPC.map((p) => p.u * 100),
                  y: curves.currentSRPC.map((p) => p.pi * 100),
                  type: "scatter",
                  mode: "lines",
                  name: `SRPC (π^e = ${(results.pi_e * 100).toFixed(1)}%)`,
                  line: { color: "#8b5cf6", width: 3 },
                },
                // Curvas adicionales (si activado)
                ...(showMultipleCurves
                  ? [
                      {
                        x: curves.lowExpectationsSRPC.map((p) => p.u * 100),
                        y: curves.lowExpectationsSRPC.map((p) => p.pi * 100),
                        type: "scatter" as const,
                        mode: "lines" as const,
                        name: "SRPC (π^e = 2%)",
                        line: { color: "#3b82f6", width: 2, dash: "dot" },
                        opacity: 0.5,
                      },
                      {
                        x: curves.highExpectationsSRPC.map((p) => p.u * 100),
                        y: curves.highExpectationsSRPC.map((p) => p.pi * 100),
                        type: "scatter" as const,
                        mode: "lines" as const,
                        name: "SRPC (π^e = 6%)",
                        line: { color: "#ef4444", width: 2, dash: "dot" },
                        opacity: 0.5,
                      },
                    ]
                  : []),
                // Punto de equilibrio actual
                {
                  x: [results.u * 100],
                  y: [results.pi * 100],
                  type: "scatter",
                  mode: "markers+text",
                  name: "Equilibrio Actual",
                  marker: { color: "#22c55e", size: 15, symbol: "circle" },
                  text: [
                    `E (u=${(results.u * 100).toFixed(1)}%, π=${(results.pi * 100).toFixed(1)}%)`,
                  ],
                  textposition: "top right",
                  textfont: { color: "#22c55e", size: 11 },
                },
                // Punto NAIRU
                {
                  x: [params.u_n * 100],
                  y: [results.pi_e * 100],
                  type: "scatter",
                  mode: "markers+text",
                  name: "NAIRU",
                  marker: { color: "#f59e0b", size: 12, symbol: "diamond" },
                  text: [`NAIRU (${(params.u_n * 100).toFixed(1)}%)`],
                  textposition: "bottom center",
                  textfont: { color: "#f59e0b", size: 10 },
                },
              ]}
              layout={{
                title: {
                  text: "Curva de Phillips: Inflación vs Desempleo",
                  font: { size: 18, family: "serif" },
                },
                xaxis: {
                  title: "Tasa de Desempleo (%)",
                  range: [0, 15],
                  gridcolor: "#f0f0f0",
                },
                yaxis: {
                  title: "Inflación (%)",
                  range: [-5, 15],
                  gridcolor: "#f0f0f0",
                  zeroline: true,
                  zerolinecolor: "#d1d5db",
                  zerolinewidth: 2,
                },
                showlegend: true,
                legend: { x: 0.65, y: 0.98, bgcolor: "rgba(255,255,255,0.8)" },
                margin: { t: 50, r: 20, b: 50, l: 60 },
                plot_bgcolor: "white",
                paper_bgcolor: "white",
                shapes: [
                  // Línea horizontal en inflación esperada
                  {
                    type: "line",
                    x0: 0,
                    x1: 15,
                    y0: results.pi_e * 100,
                    y1: results.pi_e * 100,
                    line: { color: "#d1d5db", width: 1, dash: "dot" },
                  },
                ],
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "500px" }}
            />
          </div>

          {/* Resultados de Equilibrio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Valores de Equilibrio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResultCard
                label="Inflación"
                value={results.pi}
                symbol="\pi"
                format="percent"
              />
              <ResultCard
                label="Desempleo"
                value={results.u}
                symbol="u"
                format="percent"
              />
              <ResultCard
                label="Inflación Esperada"
                value={results.pi_e}
                symbol="\pi^e"
                format="percent"
              />
              <ResultCard
                label="NAIRU"
                value={results.u_n}
                symbol="u_n"
                format="percent"
              />
            </div>
          </div>

          {/* Brechas y análisis */}
          <div className="grid md:grid-cols-3 gap-4">
            <div
              className={`rounded-lg p-4 ${
                Math.abs(results.gap_u) < 0.001 ? "bg-green-50" : "bg-blue-50"
              }`}
            >
              <h4
                className={`font-semibold mb-2 ${
                  Math.abs(results.gap_u) < 0.001
                    ? "text-green-900"
                    : "text-blue-900"
                }`}
              >
                Brecha de Desempleo
              </h4>
              <p
                className={`text-2xl font-bold ${
                  Math.abs(results.gap_u) < 0.001
                    ? "text-green-700"
                    : "text-blue-700"
                }`}
              >
                {(results.gap_u * 100).toFixed(2)}pp
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <InlineMath math="u - u_n" />
              </p>
              {results.is_long_run && (
                <p className="text-xs text-green-600 mt-2 font-medium">
                  ✓ Equilibrio de largo plazo
                </p>
              )}
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">
                Brecha de Producto
              </h4>
              <p className="text-2xl font-bold text-purple-700">
                {(results.gap_y * 100).toFixed(2)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <InlineMath math="(Y - Y^*) / Y^*" />
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">
                Ratio de Sacrificio
              </h4>
              <p className="text-2xl font-bold text-orange-700">
                {results.sacrifice_ratio.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                % producto perdido por 1pp de desinflación
              </p>
            </div>
          </div>

          {/* Interpretación contextual */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Interpretación</h4>
            <div className="space-y-2 text-sm text-gray-700">
              {results.gap_u < -0.01 && (
                <p className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">↑</span>
                  <span>
                    El desempleo está <strong>por debajo del NAIRU</strong>. La
                    economía está "sobrecalentada", generando presiones
                    inflacionarias.
                  </span>
                </p>
              )}
              {results.gap_u > 0.01 && (
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">↓</span>
                  <span>
                    El desempleo está <strong>por encima del NAIRU</strong>. Hay
                    recursos desempleados y presión desinflacionaria.
                  </span>
                </p>
              )}
              {results.is_long_run && (
                <p className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>
                    La economía está en{" "}
                    <strong>equilibrio de largo plazo</strong> (u = u_n). No hay
                    presiones inflacionarias ni desinflacionarias.
                  </span>
                </p>
              )}
              {params.expectations === "adaptive" && (
                <p className="flex items-start gap-2">
                  <span>📊</span>
                  <span>
                    Con <strong>expectativas adaptativas</strong>, los agentes
                    basan sus expectativas en la inflación pasada. Esto hace que
                    la desinflación sea costosa.
                  </span>
                </p>
              )}
              {params.expectations === "anchored" && (
                <p className="flex items-start gap-2">
                  <span>⚓</span>
                  <span>
                    Con <strong>expectativas ancladas</strong> (credibilidad ={" "}
                    {(params.credibility * 100).toFixed(0)}%), el Banco Central
                    tiene {params.credibility > 0.7 ? "alta" : "baja"}{" "}
                    credibilidad.
                  </span>
                </p>
              )}
              {Math.abs(params.epsilon) > 0.01 && (
                <p className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">⚡</span>
                  <span>
                    Hay un <strong>shock de oferta</strong> de{" "}
                    {(params.epsilon * 100).toFixed(1)}%.
                    {params.epsilon > 0
                      ? "Esto desplaza la curva hacia arriba (estanflación potencial)."
                      : "Esto desplaza la curva hacia abajo."}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhillipsCurveModel;
