"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  ElasticityParams,
  ElasticityResults,
  defaultParams,
  validateParams,
  solveElasticity,
  generateDemandCurve,
  generateSupplyCurve,
  generateTotalRevenueCurve,
  presetScenarios,
} from "@/lib/economics/elasticity";

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
  );
}

function ResultCard({
  label,
  value,
  symbol,
  highlight,
}: {
  label: string;
  value: number | string;
  symbol?: string;
  highlight?: boolean;
}) {
  const bgColor = highlight ? "bg-blue-50 border-blue-300" : "bg-white";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border shadow-sm ${bgColor}`}
    >
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? value.toFixed(2) : value}
        </span>
        {symbol && (
          <span className="text-sm text-gray-400">
            <InlineMath math={symbol} />
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ElasticityBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    "Perfectamente Inelástica": "bg-red-100 text-red-700 border-red-300",
    Inelástica: "bg-orange-100 text-orange-700 border-orange-300",
    Unitaria: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Elástica: "bg-green-100 text-green-700 border-green-300",
    "Perfectamente Elástica": "bg-blue-100 text-blue-700 border-blue-300",
  };

  const colorClass =
    colors[type] || "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}
    >
      {type}
    </span>
  );
}

export function ElasticityModel() {
  const [params, setParams] = useState<ElasticityParams>(defaultParams);
  const [activeView, setActiveView] = useState<"market" | "revenue" | "tax">(
    "market",
  );

  // Validación
  const validation = useMemo(() => validateParams(params), [params]);

  // Calcular equilibrio y elasticidades
  const results = useMemo(() => solveElasticity(params), [params]);

  // Generar curvas
  const demandCurve = useMemo(() => generateDemandCurve(params), [params]);
  const supplyCurve = useMemo(
    () => generateSupplyCurve(params, results.P_eq * 2),
    [params, results],
  );
  const revenueCurve = useMemo(
    () => generateTotalRevenueCurve(params),
    [params],
  );

  // Actualizar parámetro
  const updateParam = (key: keyof ElasticityParams) => (value: number) => {
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
          Modelo de Elasticidades
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explora cómo la sensibilidad de la demanda y oferta al precio afecta
          el equilibrio de mercado, los ingresos totales y la incidencia de
          impuestos.
        </p>
      </div>

      {/* Ecuaciones principales */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fórmulas de Elasticidad
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-2">
              Elasticidad Precio de la Demanda
            </h4>
            <BlockMath math="\varepsilon_d = \frac{\partial Q_d}{\partial P} \cdot \frac{P}{Q_d} = -b \cdot \frac{P}{Q}" />
            <p className="text-sm text-gray-500 mt-2">
              Mide la sensibilidad de la cantidad demandada ante cambios en el
              precio
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">
              Elasticidad Precio de la Oferta
            </h4>
            <BlockMath math="\varepsilon_s = \frac{\partial Q_s}{\partial P} \cdot \frac{P}{Q_s} = d \cdot \frac{P}{Q}" />
            <p className="text-sm text-gray-500 mt-2">
              Mide la sensibilidad de la cantidad ofrecida ante cambios en el
              precio
            </p>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-purple-600 mb-2">
              Ingreso Total e Ingreso Marginal
            </h4>
            <BlockMath math="IT = P \cdot Q \quad \text{y} \quad IMg = P\left(1 - \frac{1}{|\varepsilon_d|}\right)" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-600 mb-2">
              Incidencia del Impuesto
            </h4>
            <BlockMath math="\frac{\Delta P_c}{\Delta P_p} = \frac{\varepsilon_s}{\varepsilon_d}" />
            <p className="text-sm text-gray-500 mt-2">
              El lado menos elástico carga con mayor parte del impuesto
            </p>
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
          {/* Parámetros de Demanda */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Demanda: Q<sub>d</sub> = a - bP
            </h3>
            <ParameterSlider
              label="Intercepto"
              symbol="a"
              value={params.a}
              min={50}
              max={200}
              step={10}
              description="Demanda cuando P = 0"
              onChange={updateParam("a")}
            />
            <ParameterSlider
              label="Pendiente"
              symbol="b"
              value={params.b}
              min={0.1}
              max={10}
              step={0.1}
              description="Sensibilidad al precio"
              onChange={updateParam("b")}
            />
          </div>

          {/* Parámetros de Oferta */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Oferta: Q<sub>s</sub> = c + dP
            </h3>
            <ParameterSlider
              label="Intercepto"
              symbol="c"
              value={params.c}
              min={-20}
              max={60}
              step={5}
              description="Oferta cuando P = 0"
              onChange={updateParam("c")}
            />
            <ParameterSlider
              label="Pendiente"
              symbol="d"
              value={params.d}
              min={0.01}
              max={10}
              step={0.1}
              description="Sensibilidad al precio"
              onChange={updateParam("d")}
            />
          </div>

          {/* Impuesto */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Política Fiscal
            </h3>
            <ParameterSlider
              label="Impuesto Unitario"
              symbol="t"
              value={params.tax}
              min={0}
              max={30}
              step={1}
              description="Impuesto por unidad vendida"
              onChange={updateParam("tax")}
            />
          </div>

          {/* Otros parámetros */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Parámetros Adicionales
            </h3>
            <ParameterSlider
              label="Ingreso"
              symbol="I"
              value={params.I}
              min={10}
              max={100}
              step={5}
              description="Para elasticidad ingreso"
              onChange={updateParam("I")}
            />
            <ParameterSlider
              label="Sensibilidad Ingreso"
              symbol="\alpha"
              value={params.alpha}
              min={0}
              max={2}
              step={0.1}
              onChange={updateParam("alpha")}
            />
          </div>
        </div>

        {/* Gráficos y Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pestañas */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveView("market")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeView === "market"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mercado
            </button>
            <button
              onClick={() => setActiveView("revenue")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeView === "revenue"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Ingreso Total
            </button>
            <button
              onClick={() => setActiveView("tax")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeView === "tax"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Incidencia Impositiva
            </button>
          </div>

          {/* Gráfico de Mercado */}
          {activeView === "market" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <Plot
                data={[
                  // Curva de Demanda
                  {
                    x: demandCurve.map((p) => p.Q),
                    y: demandCurve.map((p) => p.P),
                    type: "scatter",
                    mode: "lines",
                    name: "Demanda",
                    line: { color: "#3b82f6", width: 3 },
                  },
                  // Curva de Oferta
                  {
                    x: supplyCurve.map((p) => p.Q),
                    y: supplyCurve.map((p) => p.P),
                    type: "scatter",
                    mode: "lines",
                    name: "Oferta",
                    line: { color: "#ef4444", width: 3 },
                  },
                  // Punto de equilibrio
                  {
                    x: [results.Q_eq],
                    y: [results.P_eq],
                    type: "scatter",
                    mode: "markers+text",
                    name: "Equilibrio",
                    marker: { color: "#22c55e", size: 15, symbol: "circle" },
                    text: [
                      `E* (${results.Q_eq.toFixed(1)}, ${results.P_eq.toFixed(2)})`,
                    ],
                    textposition: "top right",
                    textfont: { color: "#22c55e", size: 12 },
                  },
                ]}
                layout={{
                  title: {
                    text: "Equilibrio de Mercado",
                    font: { size: 18, family: "serif" },
                  },
                  xaxis: {
                    title: "Cantidad (Q)",
                    range: [0, Math.max(results.Q_eq * 1.5, 50)],
                    gridcolor: "#f0f0f0",
                  },
                  yaxis: {
                    title: "Precio (P)",
                    range: [0, Math.max(results.P_eq * 1.5, 50)],
                    gridcolor: "#f0f0f0",
                  },
                  showlegend: true,
                  legend: { x: 0.02, y: 0.98 },
                  margin: { t: 50, r: 20, b: 50, l: 60 },
                  plot_bgcolor: "white",
                  paper_bgcolor: "white",
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", height: "450px" }}
              />
            </div>
          )}

          {/* Gráfico de Ingreso Total */}
          {activeView === "revenue" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <Plot
                data={[
                  {
                    x: revenueCurve.map((p) => p.P),
                    y: revenueCurve.map((p) => p.TR),
                    type: "scatter",
                    mode: "lines",
                    name: "Ingreso Total",
                    line: { color: "#8b5cf6", width: 3 },
                    fill: "tozeroy",
                    fillcolor: "rgba(139, 92, 246, 0.1)",
                  },
                  // Punto de máximo IT (donde ε = -1)
                  {
                    x: [results.P_eq],
                    y: [results.total_revenue],
                    type: "scatter",
                    mode: "markers+text",
                    name: "IT en Equilibrio",
                    marker: { color: "#22c55e", size: 12 },
                    text: [`IT = ${results.total_revenue.toFixed(0)}`],
                    textposition: "top center",
                  },
                ]}
                layout={{
                  title: {
                    text: "Ingreso Total vs Precio",
                    font: { size: 18, family: "serif" },
                  },
                  xaxis: {
                    title: "Precio (P)",
                    gridcolor: "#f0f0f0",
                  },
                  yaxis: {
                    title: "Ingreso Total (IT = P × Q)",
                    gridcolor: "#f0f0f0",
                  },
                  showlegend: true,
                  legend: { x: 0.02, y: 0.98 },
                  margin: { t: 50, r: 20, b: 50, l: 60 },
                  plot_bgcolor: "white",
                  paper_bgcolor: "white",
                  annotations: [
                    {
                      x: params.a / (2 * params.b),
                      y: 0,
                      text: "|ε| = 1 (máximo IT)",
                      showarrow: true,
                      arrowhead: 2,
                      ax: 0,
                      ay: -40,
                      font: { size: 11, color: "#6b7280" },
                    },
                  ],
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", height: "450px" }}
              />
            </div>
          )}

          {/* Gráfico de Incidencia Impositiva */}
          {activeView === "tax" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <Plot
                data={[
                  // Curva de Demanda
                  {
                    x: demandCurve.map((p) => p.Q),
                    y: demandCurve.map((p) => p.P),
                    type: "scatter",
                    mode: "lines",
                    name: "Demanda",
                    line: { color: "#3b82f6", width: 3 },
                  },
                  // Curva de Oferta original
                  {
                    x: supplyCurve.map((p) => p.Q),
                    y: supplyCurve.map((p) => p.P),
                    type: "scatter",
                    mode: "lines",
                    name: "Oferta (sin impuesto)",
                    line: { color: "#ef4444", width: 2, dash: "dot" },
                  },
                  // Curva de Oferta con impuesto (desplazada)
                  {
                    x: supplyCurve.map((p) => p.Q),
                    y: supplyCurve.map((p) => p.P + params.tax),
                    type: "scatter",
                    mode: "lines",
                    name: "Oferta (con impuesto)",
                    line: { color: "#ef4444", width: 3 },
                  },
                  // Equilibrio sin impuesto
                  {
                    x: [results.Q_eq],
                    y: [results.P_eq],
                    type: "scatter",
                    mode: "markers",
                    name: "Equilibrio original",
                    marker: { color: "#22c55e", size: 12, symbol: "circle" },
                  },
                  // Nuevo equilibrio (con impuesto)
                  {
                    x: [results.Q_tax],
                    y: [results.P_consumer],
                    type: "scatter",
                    mode: "markers+text",
                    name: "Nuevo equilibrio",
                    marker: { color: "#f59e0b", size: 12 },
                    text: [`Pc = ${results.P_consumer.toFixed(2)}`],
                    textposition: "top right",
                  },
                  {
                    x: [results.Q_tax],
                    y: [results.P_producer],
                    type: "scatter",
                    mode: "markers+text",
                    name: "Precio productor",
                    marker: { color: "#dc2626", size: 12 },
                    text: [`Pp = ${results.P_producer.toFixed(2)}`],
                    textposition: "bottom right",
                  },
                ]}
                layout={{
                  title: {
                    text: "Incidencia del Impuesto",
                    font: { size: 18, family: "serif" },
                  },
                  xaxis: {
                    title: "Cantidad (Q)",
                    range: [0, Math.max(results.Q_eq * 1.5, 50)],
                    gridcolor: "#f0f0f0",
                  },
                  yaxis: {
                    title: "Precio (P)",
                    range: [0, Math.max(results.P_consumer * 1.3, 50)],
                    gridcolor: "#f0f0f0",
                  },
                  showlegend: true,
                  legend: { x: 0.02, y: 0.98 },
                  margin: { t: 50, r: 20, b: 50, l: 60 },
                  plot_bgcolor: "white",
                  paper_bgcolor: "white",
                  shapes:
                    params.tax > 0
                      ? [
                          // Área de pérdida de eficiencia
                          {
                            type: "rect",
                            x0: results.Q_tax,
                            x1: results.Q_eq,
                            y0: results.P_producer,
                            y1: results.P_consumer,
                            fillcolor: "rgba(239, 68, 68, 0.1)",
                            line: { width: 0 },
                          },
                        ]
                      : [],
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", height: "450px" }}
              />
            </div>
          )}

          {/* Resultados de Equilibrio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Valores de Equilibrio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ResultCard
                label="Precio"
                value={results.P_eq}
                symbol="P^*"
                highlight
              />
              <ResultCard
                label="Cantidad"
                value={results.Q_eq}
                symbol="Q^*"
                highlight
              />
              <ResultCard
                label="Ingreso Total"
                value={results.total_revenue}
                symbol="IT"
              />
              <ResultCard
                label="Elasticidad Demanda"
                value={results.epsilon_d}
                symbol="\varepsilon_d"
              />
              <ResultCard
                label="Elasticidad Oferta"
                value={results.epsilon_s}
                symbol="\varepsilon_s"
              />
              <ResultCard
                label="Ingreso Marginal"
                value={results.marginal_revenue}
                symbol="IMg"
              />
            </div>
          </div>

          {/* Clasificación de elasticidades */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Tipo de Demanda
              </h4>
              <ElasticityBadge type={results.demand_type} />
              <p className="text-sm text-blue-700 mt-3">
                {Math.abs(results.epsilon_d) > 1
                  ? "↓ Precio → ↑ Ingreso Total"
                  : Math.abs(results.epsilon_d) < 1
                    ? "↓ Precio → ↓ Ingreso Total"
                    : "IT máximo en este punto"}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">
                Tipo de Oferta
              </h4>
              <ElasticityBadge type={results.supply_type} />
              <p className="text-sm text-green-700 mt-3">
                εs = {results.epsilon_s.toFixed(2)}:{" "}
                {results.epsilon_s > 1 ? "Alta" : "Baja"} respuesta al precio
              </p>
            </div>
          </div>

          {/* Incidencia del impuesto */}
          {params.tax > 0 && (
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-4">
                Incidencia del Impuesto
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-orange-800 mb-3">
                    Carga sobre Consumidores
                  </h4>
                  <div className="text-3xl font-bold text-orange-600">
                    ${results.consumer_burden.toFixed(2)}
                  </div>
                  <div className="text-sm text-orange-700 mt-1">
                    {results.consumer_burden_pct.toFixed(1)}% del impuesto
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-3">
                    Carga sobre Productores
                  </h4>
                  <div className="text-3xl font-bold text-orange-600">
                    ${results.producer_burden.toFixed(2)}
                  </div>
                  <div className="text-sm text-orange-700 mt-1">
                    {results.producer_burden_pct.toFixed(1)}% del impuesto
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-orange-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-orange-800">
                    Pérdida de Eficiencia:
                  </span>
                  <span className="text-lg font-bold text-orange-900">
                    ${results.deadweight_loss.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  Reducción de cantidad:{" "}
                  {(results.Q_eq - results.Q_tax).toFixed(2)} unidades
                </p>
              </div>
            </div>
          )}

          {/* Elasticidades adicionales */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">
                Elasticidad Ingreso
              </h4>
              <div className="text-2xl font-bold text-purple-700">
                {results.epsilon_income.toFixed(3)}
              </div>
              <p className="text-sm text-purple-600 mt-2">
                <InlineMath math="\varepsilon_I = \frac{\partial Q}{\partial I} \cdot \frac{I}{Q}" />
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {results.epsilon_income > 1
                  ? "Bien de lujo (εI > 1)"
                  : results.epsilon_income > 0
                    ? "Bien normal (0 < εI < 1)"
                    : "Bien inferior (εI < 0)"}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">
                Elasticidad Cruzada
              </h4>
              <div className="text-2xl font-bold text-indigo-700">
                {results.epsilon_cross.toFixed(3)}
              </div>
              <p className="text-sm text-indigo-600 mt-2">
                <InlineMath math="\varepsilon_{xy} = \frac{\partial Q_x}{\partial P_y} \cdot \frac{P_y}{Q_x}" />
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                {results.epsilon_cross > 0
                  ? "Bienes sustitutos (εxy > 0)"
                  : results.epsilon_cross < 0
                    ? "Bienes complementarios (εxy < 0)"
                    : "Bienes independientes (εxy = 0)"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElasticityModel;
