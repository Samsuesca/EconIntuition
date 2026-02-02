"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  FirmParams,
  defaultFirmParams,
  validateFirmParams,
  solveFirmModel,
  generateIsoquantMap,
  generateIsocost,
  generateCostCurves,
  firmScenarios,
} from "@/lib/economics/firm-theory";

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
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
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
  unit,
}: {
  label: string;
  value: number;
  symbol: string;
  unit?: string;
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
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>
    </motion.div>
  );
}

export function FirmTheoryModel() {
  const [params, setParams] = useState<FirmParams>(defaultFirmParams);
  const [viewMode, setViewMode] = useState<"isoquants" | "costs">("isoquants");

  // Validación
  const validation = useMemo(() => validateFirmParams(params), [params]);

  // Calcular resultados
  const results = useMemo(() => solveFirmModel(params), [params]);

  // Generar datos para visualización
  const isoquantMap = useMemo(() => generateIsoquantMap(params, 5), [params]);
  const costCurves = useMemo(
    () => generateCostCurves(params, 30, 100),
    [params],
  );

  // Isocosto óptimo (minimización de costos)
  const optimalIsocost = useMemo(() => {
    return generateIsocost(results.CT_min, params.w, params.r, [0, 50]);
  }, [results.CT_min, params.w, params.r]);

  // Actualizar parámetro
  const updateParam = (key: keyof FirmParams) => (value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  // Cargar escenario
  const loadScenario = (scenarioKey: keyof typeof firmScenarios) => {
    setParams(firmScenarios[scenarioKey].params);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Teoría de la Firma
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Función de producción Cobb-Douglas, productos marginales, costos y
          minimización de costos. Explora cómo las firmas optimizan su
          producción.
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
              Función de Producción
            </h4>
            <BlockMath math="Q = A \cdot L^{\alpha} \cdot K^{\beta}" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-2">
              Productos Marginales
            </h4>
            <BlockMath math="MPL = \alpha \frac{Q}{L}, \quad MPK = \beta \frac{Q}{K}" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">
              Minimización de Costos
            </h4>
            <BlockMath math="\frac{MPL}{w} = \frac{MPK}{r}" />
          </div>
        </div>
      </div>

      {/* Warnings */}
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
        {Object.entries(firmScenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => loadScenario(key as keyof typeof firmScenarios)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title={scenario.description}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      {/* Vista selector */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setViewMode("isoquants")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "isoquants"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Isocuantas e Isocostos
        </button>
        <button
          onClick={() => setViewMode("costs")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "costs"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Curvas de Costos
        </button>
      </div>

      {/* Layout principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Panel de parámetros */}
        <div className="space-y-6">
          {/* Función de Producción */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Función de Producción
            </h3>
            <ParameterSlider
              label="Productividad"
              symbol="A"
              value={params.A}
              min={0.5}
              max={3}
              step={0.1}
              onChange={updateParam("A")}
              description="Productividad total de factores"
            />
            <ParameterSlider
              label="Elasticidad Trabajo"
              symbol="\alpha"
              value={params.alpha}
              min={0.1}
              max={0.9}
              step={0.05}
              onChange={updateParam("alpha")}
              description="Participación del trabajo"
            />
            <ParameterSlider
              label="Elasticidad Capital"
              symbol="\beta"
              value={params.beta}
              min={0.1}
              max={0.9}
              step={0.05}
              onChange={updateParam("beta")}
              description="Participación del capital"
            />
          </div>

          {/* Precios de Factores */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Precios de Factores
            </h3>
            <ParameterSlider
              label="Salario"
              symbol="w"
              value={params.w}
              min={1}
              max={30}
              step={1}
              onChange={updateParam("w")}
              description="Precio del trabajo"
            />
            <ParameterSlider
              label="Renta del Capital"
              symbol="r"
              value={params.r}
              min={1}
              max={20}
              step={1}
              onChange={updateParam("r")}
              description="Precio del capital"
            />
          </div>

          {/* Costos y Restricciones */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Costos y Restricciones
            </h3>
            <ParameterSlider
              label="Costo Fijo"
              symbol="CF"
              value={params.CF}
              min={0}
              max={500}
              step={10}
              onChange={updateParam("CF")}
            />
            <ParameterSlider
              label="Capital Fijo (CP)"
              symbol="K_{fijo}"
              value={params.K_fixed}
              min={1}
              max={30}
              step={1}
              onChange={updateParam("K_fixed")}
              description="Capital en el corto plazo"
            />
            <ParameterSlider
              label="Producción Objetivo"
              symbol="Q"
              value={params.Q_target}
              min={1}
              max={30}
              step={1}
              onChange={updateParam("Q_target")}
            />
          </div>
        </div>

        {/* Gráficos y Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico principal */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {viewMode === "isoquants" ? (
              <Plot
                data={[
                  // Isocuantas
                  ...isoquantMap.map((iso, idx) => ({
                    x: iso.points.map((p) => p.x),
                    y: iso.points.map((p) => p.y),
                    type: "scatter" as const,
                    mode: "lines" as const,
                    name: `Q = ${iso.Q.toFixed(1)}`,
                    line: {
                      color: `rgba(147, 51, 234, ${0.3 + idx * 0.15})`,
                      width: 2,
                    },
                  })),
                  // Isocosto óptimo
                  {
                    x: optimalIsocost.map((p) => p.x),
                    y: optimalIsocost.map((p) => p.y),
                    type: "scatter" as const,
                    mode: "lines" as const,
                    name: "Isocosto óptimo",
                    line: { color: "#22c55e", width: 3, dash: "dash" as const },
                  },
                  // Punto óptimo (minimización de costos)
                  {
                    x: [results.L_optimal],
                    y: [results.K_optimal],
                    type: "scatter" as const,
                    mode: "markers+text" as const,
                    name: "Óptimo LP",
                    marker: { color: "#22c55e", size: 15, symbol: "circle" },
                    text: [`E*`],
                    textposition: "top center" as const,
                    textfont: { color: "#22c55e", size: 12 },
                  },
                ]}
                layout={{
                  title: {
                    text: "Isocuantas e Isocostos - Minimización de Costos",
                    font: { size: 18, family: "serif" },
                  },
                  xaxis: {
                    title: "Trabajo (L)",
                    range: [0, 50],
                    gridcolor: "#f0f0f0",
                  },
                  yaxis: {
                    title: "Capital (K)",
                    range: [0, 50],
                    gridcolor: "#f0f0f0",
                  },
                  showlegend: true,
                  legend: { x: 0.7, y: 0.98 },
                  margin: { t: 50, r: 20, b: 50, l: 60 },
                  plot_bgcolor: "white",
                  paper_bgcolor: "white",
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", height: "500px" }}
              />
            ) : (
              <Plot
                data={[
                  {
                    x: costCurves.Q,
                    y: costCurves.CT,
                    type: "scatter" as const,
                    mode: "lines" as const,
                    name: "Costo Total (CT)",
                    line: { color: "#3b82f6", width: 3 },
                  },
                  {
                    x: costCurves.Q,
                    y: costCurves.CV,
                    type: "scatter" as const,
                    mode: "lines" as const,
                    name: "Costo Variable (CV)",
                    line: { color: "#8b5cf6", width: 3 },
                  },
                  {
                    x: costCurves.Q,
                    y: costCurves.CMg,
                    type: "scatter" as const,
                    mode: "lines" as const,
                    name: "Costo Marginal (CMg)",
                    line: { color: "#ef4444", width: 3 },
                  },
                  {
                    x: costCurves.Q,
                    y: costCurves.CMe,
                    type: "scatter" as const,
                    mode: "lines" as const,
                    name: "Costo Medio (CMe)",
                    line: { color: "#f59e0b", width: 3 },
                  },
                  {
                    x: costCurves.Q,
                    y: costCurves.CVMe,
                    type: "scatter" as const,
                    mode: "lines" as const,
                    name: "Costo Variable Medio (CVMe)",
                    line: { color: "#10b981", width: 3 },
                  },
                ]}
                layout={{
                  title: {
                    text: "Curvas de Costos (Corto Plazo)",
                    font: { size: 18, family: "serif" },
                  },
                  xaxis: {
                    title: "Producción (Q)",
                    gridcolor: "#f0f0f0",
                  },
                  yaxis: {
                    title: "Costos ($)",
                    gridcolor: "#f0f0f0",
                  },
                  showlegend: true,
                  legend: { x: 0.02, y: 0.98 },
                  margin: { t: 50, r: 20, b: 50, l: 60 },
                  plot_bgcolor: "white",
                  paper_bgcolor: "white",
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", height: "500px" }}
              />
            )}
          </div>

          {/* Resultados */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resultados
            </h3>

            {/* Producción y Productos Marginales */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Producción y Productividad
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ResultCard label="Producción" value={results.Q} symbol="Q" />
                <ResultCard
                  label="Prod. Marginal L"
                  value={results.MPL}
                  symbol="MPL"
                />
                <ResultCard
                  label="Prod. Marginal K"
                  value={results.MPK}
                  symbol="MPK"
                />
                <ResultCard label="TMST" value={results.TMST} symbol="TMST" />
              </div>
            </div>

            {/* Costos */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Costos (Corto Plazo)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ResultCard
                  label="Costo Total"
                  value={results.CT}
                  symbol="CT"
                  unit="$"
                />
                <ResultCard
                  label="Costo Variable"
                  value={results.CV}
                  symbol="CV"
                  unit="$"
                />
                <ResultCard
                  label="Costo Marginal"
                  value={results.CMg}
                  symbol="CMg"
                  unit="$"
                />
                <ResultCard
                  label="Costo Medio"
                  value={results.CMe}
                  symbol="CMe"
                  unit="$"
                />
                <ResultCard
                  label="CV Medio"
                  value={results.CVMe}
                  symbol="CVMe"
                  unit="$"
                />
              </div>
            </div>

            {/* Minimización de Costos (Largo Plazo) */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Óptimo de Largo Plazo
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ResultCard
                  label="Trabajo Óptimo"
                  value={results.L_optimal}
                  symbol="L^*"
                />
                <ResultCard
                  label="Capital Óptimo"
                  value={results.K_optimal}
                  symbol="K^*"
                />
                <ResultCard
                  label="Costo Total Mínimo"
                  value={results.CT_min}
                  symbol="CT_{min}"
                  unit="$"
                />
              </div>
            </div>
          </div>

          {/* Información sobre retornos a escala */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">
              Retornos a Escala
            </h4>
            <p className="text-xl font-bold text-purple-700">
              {results.returnsType.charAt(0).toUpperCase() +
                results.returnsType.slice(1)}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              <InlineMath
                math={`\\alpha + \\beta = ${results.returnsToScale.toFixed(2)}`}
              />
            </p>
            <p className="text-xs text-purple-600 mt-2">
              {results.returnsType === "crecientes" &&
                "Duplicar los insumos más que duplica la producción (economías de escala)"}
              {results.returnsType === "constantes" &&
                "Duplicar los insumos duplica la producción (escala óptima)"}
              {results.returnsType === "decrecientes" &&
                "Duplicar los insumos menos que duplica la producción (deseconomías de escala)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirmTheoryModel;
