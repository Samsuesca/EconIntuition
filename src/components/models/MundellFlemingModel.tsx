"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  MundellFlemingParams,
  MundellFlemingResults,
  defaultParams,
  validateParams,
  solveMundellFleming,
  generateISCurve,
  generateLMCurve,
  generateBPCurve,
  presetScenarios,
} from "@/lib/economics/mundell-fleming";

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
  disabled?: boolean;
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
  disabled = false,
}: ParameterSliderProps) {
  return (
    <div
      className={`mb-4 p-3 bg-white rounded-lg border border-gray-200 ${disabled ? "opacity-50" : ""}`}
    >
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
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:cursor-not-allowed"
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
  color = "gray",
}: {
  label: string;
  value: number;
  symbol: string;
  color?: string;
}) {
  const colorClasses = {
    gray: "bg-white border-gray-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    blue: "bg-blue-50 border-blue-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border shadow-sm ${colorClasses[color as keyof typeof colorClasses] || colorClasses.gray}`}
    >
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {Math.abs(value) > 1000 ? value.toFixed(0) : value.toFixed(2)}
        </span>
        <span className="text-sm text-gray-400">
          <InlineMath math={symbol} />
        </span>
      </div>
    </motion.div>
  );
}

export function MundellFlemingModel() {
  const [params, setParams] = useState<MundellFlemingParams>(defaultParams);

  // Validación
  const validation = useMemo(() => validateParams(params), [params]);

  // Calcular equilibrio
  const results = useMemo(() => solveMundellFleming(params), [params]);

  // Generar curvas
  const curves = useMemo(() => {
    const maxY = results.Y_star * 2;
    const maxI = Math.max(results.i_star * 2.5, params.i_f * 2, 10);

    return {
      IS: generateISCurve(params, [0, maxI], 100),
      LM: generateLMCurve(params, [0, maxY], 100),
      BP: generateBPCurve(params, [0, maxY], 100),
    };
  }, [params, results]);

  // Actualizar parámetro
  const updateParam =
    (key: keyof MundellFlemingParams) => (value: number | string) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    };

  // Cargar escenario
  const loadScenario = (scenarioKey: keyof typeof presetScenarios) => {
    setParams(presetScenarios[scenarioKey].params);
  };

  // Determinar el color de la curva BP según movilidad
  const getBPColor = () => {
    if (params.mobility === "perfect") return "#10b981"; // green
    if (params.mobility === "imperfect") return "#f59e0b"; // amber
    return "#8b5cf6"; // violet
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Modelo Mundell-Fleming
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Extensión del IS-LM para economía abierta con tipo de cambio y
          movilidad de capital. Explora cómo la política económica depende del
          régimen cambiario.
        </p>
      </div>

      {/* Ecuaciones principales */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ecuaciones del Modelo
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-2">
              IS (Economía Abierta)
            </h4>
            <BlockMath math="Y = C(Y) + I(i) + G + NX(e,Y)" />
            <p className="text-sm text-gray-500 mt-2">
              NX depende del tipo de cambio e ingreso
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2">
              LM (Mercado de Dinero)
            </h4>
            <BlockMath math="\frac{M}{P} = L(Y, i)" />
            <p className="text-sm text-gray-500 mt-2">
              Igual que en economía cerrada
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">
              BP (Balanza de Pagos)
            </h4>
            <BlockMath math="BP = NX(e,Y) + CF(i - i^*)" />
            <p className="text-sm text-gray-500 mt-2">
              Cuenta corriente + Cuenta de capital
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

      {/* Controles de Régimen */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Régimen Cambiario
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => updateParam("regime")("flexible")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                params.regime === "flexible"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              TC Flexible
            </button>
            <button
              onClick={() => updateParam("regime")("fixed")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                params.regime === "fixed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              TC Fijo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Movilidad de Capital
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => updateParam("mobility")("perfect")}
              className={`flex-1 py-2 px-3 text-sm rounded-lg font-medium transition-colors ${
                params.mobility === "perfect"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Perfecta
            </button>
            <button
              onClick={() => updateParam("mobility")("imperfect")}
              className={`flex-1 py-2 px-3 text-sm rounded-lg font-medium transition-colors ${
                params.mobility === "imperfect"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Imperfecta
            </button>
            <button
              onClick={() => updateParam("mobility")("none")}
              className={`flex-1 py-2 px-3 text-sm rounded-lg font-medium transition-colors ${
                params.mobility === "none"
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Nula
            </button>
          </div>
        </div>
      </div>

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
          {/* Sector Externo */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Sector Externo
            </h3>
            <ParameterSlider
              label="Tipo de Cambio"
              symbol="e"
              value={params.e}
              min={0.5}
              max={3}
              step={0.1}
              onChange={updateParam("e")}
              disabled={params.regime === "flexible"}
              description={
                params.regime === "flexible"
                  ? "Endógeno (se ajusta)"
                  : "Fijo por BC"
              }
            />
            <ParameterSlider
              label="Tasa Internacional"
              symbol="i^*"
              value={params.i_f}
              min={0}
              max={15}
              step={0.5}
              onChange={updateParam("i_f")}
            />
            <ParameterSlider
              label="Producto Extranjero"
              symbol="Y^*"
              value={params.Y_f}
              min={1000}
              max={4000}
              step={100}
              onChange={updateParam("Y_f")}
            />
            <ParameterSlider
              label="Sensibilidad Export."
              symbol="x"
              value={params.x}
              min={10}
              max={200}
              step={10}
              onChange={updateParam("x")}
              description="Respuesta de X a e"
            />
            <ParameterSlider
              label="Prop. a Importar"
              symbol="m"
              value={params.m}
              min={0.05}
              max={0.5}
              step={0.05}
              onChange={updateParam("m")}
            />
          </div>

          {/* Política Monetaria */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Política Monetaria (LM)
            </h3>
            <ParameterSlider
              label="Oferta Monetaria"
              symbol="M"
              value={params.M}
              min={500}
              max={2500}
              step={100}
              onChange={updateParam("M")}
              disabled={
                params.regime === "fixed" && params.mobility === "perfect"
              }
              description={
                params.regime === "fixed" && params.mobility === "perfect"
                  ? "Endógena"
                  : undefined
              }
            />
            <ParameterSlider
              label="Nivel de Precios"
              symbol="P"
              value={params.P}
              min={0.5}
              max={3}
              step={0.1}
              onChange={updateParam("P")}
            />
          </div>

          {/* Política Fiscal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Política Fiscal (IS)
            </h3>
            <ParameterSlider
              label="Gasto Público"
              symbol="G"
              value={params.G}
              min={100}
              max={800}
              step={50}
              onChange={updateParam("G")}
            />
            <ParameterSlider
              label="Prop. Marginal Consumo"
              symbol="c"
              value={params.c}
              min={0.5}
              max={0.95}
              step={0.05}
              onChange={updateParam("c")}
            />
            <ParameterSlider
              label="Tasa Impositiva"
              symbol="t"
              value={params.t}
              min={0}
              max={0.5}
              step={0.05}
              onChange={updateParam("t")}
            />
          </div>
        </div>

        {/* Gráfico y Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico IS-LM-BP */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Plot
              data={[
                // Curva IS
                {
                  x: curves.IS.map((p) => p.Y),
                  y: curves.IS.map((p) => p.i),
                  type: "scatter",
                  mode: "lines",
                  name: "IS",
                  line: { color: "#ef4444", width: 3 },
                },
                // Curva LM
                {
                  x: curves.LM.map((p) => p.Y),
                  y: curves.LM.map((p) => p.i),
                  type: "scatter",
                  mode: "lines",
                  name: "LM",
                  line: { color: "#3b82f6", width: 3 },
                },
                // Curva BP
                {
                  x: curves.BP.map((p) => p.Y),
                  y: curves.BP.map((p) => p.i),
                  type: "scatter",
                  mode: "lines",
                  name: `BP (${params.mobility})`,
                  line: { color: getBPColor(), width: 3, dash: "dash" },
                },
                // Punto de equilibrio
                {
                  x: [results.Y_star],
                  y: [results.i_star],
                  type: "scatter",
                  mode: "markers+text",
                  name: "Equilibrio",
                  marker: { color: "#22c55e", size: 15, symbol: "circle" },
                  text: [
                    `E (${results.Y_star.toFixed(0)}, ${results.i_star.toFixed(2)})`,
                  ],
                  textposition: "top right",
                  textfont: { color: "#22c55e", size: 12 },
                },
                // Línea i = i* (referencia)
                {
                  x: [0, results.Y_star * 2],
                  y: [params.i_f, params.i_f],
                  type: "scatter",
                  mode: "lines",
                  name: "i = i*",
                  line: { color: "#9ca3af", width: 1, dash: "dot" },
                  showlegend: true,
                },
              ]}
              layout={{
                title: {
                  text: "Equilibrio IS-LM-BP",
                  font: { size: 18, family: "serif" },
                },
                xaxis: {
                  title: "Producto (Y)",
                  range: [0, results.Y_star * 2],
                  gridcolor: "#f0f0f0",
                },
                yaxis: {
                  title: "Tasa de Interés (i)",
                  range: [
                    0,
                    Math.max(results.i_star * 2, params.i_f * 1.5, 10),
                  ],
                  gridcolor: "#f0f0f0",
                },
                showlegend: true,
                legend: { x: 0.02, y: 0.98 },
                margin: { t: 50, r: 20, b: 50, l: 60 },
                plot_bgcolor: "white",
                paper_bgcolor: "white",
                shapes: [
                  // Línea horizontal al equilibrio
                  {
                    type: "line",
                    x0: 0,
                    x1: results.Y_star,
                    y0: results.i_star,
                    y1: results.i_star,
                    line: { color: "gray", width: 1, dash: "dot" },
                  },
                  // Línea vertical al equilibrio
                  {
                    type: "line",
                    x0: results.Y_star,
                    x1: results.Y_star,
                    y0: 0,
                    y1: results.i_star,
                    line: { color: "gray", width: 1, dash: "dot" },
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                label="Tipo de Cambio"
                value={results.e_star}
                symbol="e^*"
              />
              <ResultCard
                label="Export. Netas"
                value={results.NX}
                symbol="NX"
                color={results.NX >= 0 ? "green" : "red"}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResultCard label="Consumo" value={results.C} symbol="C" />
              <ResultCard label="Inversión" value={results.I} symbol="I" />
              <ResultCard label="Exportaciones" value={results.X} symbol="X" />
              <ResultCard
                label="Importaciones"
                value={results.IM}
                symbol="IM"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">
                Balanza de Pagos
              </h4>
              <p className="text-2xl font-bold text-purple-700">
                {results.BP.toFixed(2)}
              </p>
              <p className="text-sm text-purple-600 mt-1">
                <InlineMath math="BP = NX + CF" />
              </p>
              <p className="text-xs text-purple-500 mt-1">
                {Math.abs(results.BP) < 1
                  ? "En equilibrio ✓"
                  : "Fuera de equilibrio"}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">
                Multiplicador
              </h4>
              <p className="text-2xl font-bold text-green-700">
                {results.multiplier.toFixed(2)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <InlineMath math="\alpha = \frac{1}{1 - c(1-t) + m}" />
              </p>
            </div>
          </div>

          {/* Interpretación según régimen */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Interpretación</h4>
            <p className="text-sm text-blue-700">
              {params.regime === "flexible" &&
                params.mobility === "perfect" && (
                  <>
                    <strong>TC Flexible + Movilidad Perfecta:</strong> La tasa
                    de interés se fija en i* por paridad de tasas. La política
                    monetaria es efectiva (desplaza LM, Y cambia). La política
                    fiscal es inefectiva (crowding out vía depreciación del tipo
                    de cambio).
                  </>
                )}
              {params.regime === "fixed" && params.mobility === "perfect" && (
                <>
                  <strong>TC Fijo + Movilidad Perfecta:</strong> El tipo de
                  cambio está fijo y la tasa de interés debe igualar i*. La
                  oferta monetaria M es endógena (el BC interviene para mantener
                  e). La política fiscal es muy efectiva. La política monetaria
                  es inefectiva.
                </>
              )}
              {params.mobility === "imperfect" && (
                <>
                  <strong>Movilidad Imperfecta:</strong> La curva BP tiene
                  pendiente positiva. Los flujos de capital responden al
                  diferencial de tasas pero no son infinitos. Ambas políticas
                  tienen efectos intermedios.
                </>
              )}
              {params.mobility === "none" && (
                <>
                  <strong>Sin Movilidad de Capital:</strong> La curva BP es
                  vertical (solo cuenta corriente importa). El equilibrio se
                  alcanza cuando NX = 0. Similar a un modelo de economía cerrada
                  pero con sector externo.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MundellFlemingModel;
