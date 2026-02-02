"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  MarketStructureParams,
  defaultMarketStructureParams,
  solveMarketStructures,
  generateDemandCurve,
  generateMarginalRevenueCurve,
  generateMarginalCostCurve,
  generateReactionFunction,
  marketStructureScenarios,
  validateMarketStructureParams,
} from "@/lib/economics/market-structures";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface SliderProps {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

function Slider({
  label,
  symbol,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderProps) {
  return (
    <div className="mb-3 p-3 bg-white rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {label} <InlineMath math={symbol} />
        </span>
        <span className="font-mono font-semibold">
          {value.toFixed(step < 1 ? 2 : 0)}
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
    </div>
  );
}

function ResultCard({
  label,
  value,
  color = "gray",
  subtitle,
}: {
  label: string;
  value: string;
  color?: string;
  subtitle?: string;
}) {
  const colors = {
    gray: "bg-gray-50",
    green: "bg-green-50 text-green-900",
    red: "bg-red-50 text-red-900",
    blue: "bg-blue-50 text-blue-900",
    purple: "bg-purple-50 text-purple-900",
    yellow: "bg-yellow-50 text-yellow-900",
  };
  return (
    <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-lg font-bold">{value}</div>
      {subtitle && <div className="text-xs mt-1 text-gray-500">{subtitle}</div>}
    </div>
  );
}

type MarketStructure =
  | "perfectCompetition"
  | "monopoly"
  | "cournot"
  | "comparison";

export function MarketStructuresModel() {
  const [params, setParams] = useState<MarketStructureParams>(
    defaultMarketStructureParams,
  );
  const [activeView, setActiveView] = useState<MarketStructure>("comparison");

  const results = useMemo(() => solveMarketStructures(params), [params]);
  const validation = useMemo(
    () => validateMarketStructureParams(params),
    [params],
  );

  const demandCurve = useMemo(() => generateDemandCurve(params), [params]);
  const marginalRevenueCurve = useMemo(
    () => generateMarginalRevenueCurve(params),
    [params],
  );

  const updateParam = (key: keyof MarketStructureParams) => (value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const loadScenario = (key: keyof typeof marketStructureScenarios) => {
    setParams(marketStructureScenarios[key].params);
  };

  // Generate plot data based on active view
  const plotData = useMemo(() => {
    const Q_max =
      Math.max(
        results.perfectCompetition.Q,
        results.monopoly.Q,
        results.cournot.Q,
      ) * 1.5;

    const mcCurve = generateMarginalCostCurve(params, Q_max);

    const baseTraces: any[] = [
      {
        x: demandCurve.map((p) => p.x),
        y: demandCurve.map((p) => p.y),
        type: "scatter",
        mode: "lines",
        name: "Demanda",
        line: { color: "#3b82f6", width: 3 },
      },
      {
        x: mcCurve.map((p) => p.x),
        y: mcCurve.map((p) => p.y),
        type: "scatter",
        mode: "lines",
        name: "CMg",
        line: { color: "#f59e0b", width: 2, dash: "dot" },
      },
    ];

    if (activeView === "monopoly" || activeView === "comparison") {
      baseTraces.push({
        x: marginalRevenueCurve.map((p) => p.x),
        y: marginalRevenueCurve.map((p) => p.y),
        type: "scatter",
        mode: "lines",
        name: "IMg",
        line: { color: "#8b5cf6", width: 2, dash: "dash" },
      });
    }

    // Add equilibrium points based on view
    if (activeView === "perfectCompetition" || activeView === "comparison") {
      baseTraces.push({
        x: [results.perfectCompetition.Q],
        y: [results.perfectCompetition.P],
        type: "scatter",
        mode: "markers+text",
        name: "Comp. Perfecta",
        marker: { color: "#22c55e", size: 12 },
        text: ["CP"],
        textposition: "top center",
      });
    }

    if (activeView === "monopoly" || activeView === "comparison") {
      baseTraces.push({
        x: [results.monopoly.Q],
        y: [results.monopoly.P],
        type: "scatter",
        mode: "markers+text",
        name: "Monopolio",
        marker: { color: "#ef4444", size: 12 },
        text: ["M"],
        textposition: "top center",
      });
    }

    if (activeView === "cournot" || activeView === "comparison") {
      baseTraces.push({
        x: [results.cournot.Q],
        y: [results.cournot.P],
        type: "scatter",
        mode: "markers+text",
        name: `Cournot (n=${params.n})`,
        marker: { color: "#8b5cf6", size: 12 },
        text: ["C"],
        textposition: "top center",
      });
    }

    return baseTraces;
  }, [activeView, params, results, demandCurve, marginalRevenueCurve]);

  // Cournot reaction functions plot
  const reactionFunctionsPlot = useMemo(() => {
    if (params.n !== 2) return null;

    const q_max = (params.a - params.c) / params.b;
    const rf1 = generateReactionFunction(params, q_max);
    const rf2 = rf1.map((p) => ({ x: p.y, y: p.x })); // Symmetry

    return (
      <Plot
        data={[
          {
            x: rf1.map((p) => p.x),
            y: rf1.map((p) => p.y),
            type: "scatter",
            mode: "lines",
            name: "R₁(q₂)",
            line: { color: "#3b82f6", width: 3 },
          },
          {
            x: rf2.map((p) => p.x),
            y: rf2.map((p) => p.y),
            type: "scatter",
            mode: "lines",
            name: "R₂(q₁)",
            line: { color: "#ef4444", width: 3 },
          },
          {
            x: [results.cournot.q],
            y: [results.cournot.q],
            type: "scatter",
            mode: "markers+text",
            name: "Equilibrio Nash",
            marker: { color: "#22c55e", size: 15 },
            text: ["E"],
            textposition: "top right",
          },
        ]}
        layout={{
          title: "Funciones de Reacción de Cournot",
          xaxis: { title: "q₁ (Firma 1)", range: [0, q_max * 0.6] },
          yaxis: { title: "q₂ (Firma 2)", range: [0, q_max * 0.6] },
          showlegend: true,
          margin: { t: 50, r: 20, b: 50, l: 60 },
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "400px" }}
      />
    );
  }, [params, results]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Estructuras de Mercado
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compara cómo diferentes estructuras de mercado (competencia perfecta,
          monopolio, oligopolio) afectan precios, cantidades y bienestar social.
        </p>
      </div>

      {/* Validation Messages */}
      {!validation.valid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2">
            Errores de Validación
          </h4>
          <ul className="list-disc list-inside text-sm text-red-700">
            {validation.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Advertencias</h4>
          <ul className="list-disc list-inside text-sm text-yellow-700">
            {validation.warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Ecuaciones */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-2">
              Demanda Inversa
            </h4>
            <BlockMath math={`P = ${params.a} - ${params.b}Q`} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-purple-600 mb-2">
              Ingreso Marginal
            </h4>
            <BlockMath math={`IMg = ${params.a} - ${2 * params.b}Q`} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-600 mb-2">Costos</h4>
            <BlockMath math={`C(q) = ${params.c}q + ${params.F}`} />
            <BlockMath math={`CMg = ${params.c}`} />
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { key: "comparison", label: "Comparación" },
          { key: "perfectCompetition", label: "Comp. Perfecta" },
          { key: "monopoly", label: "Monopolio" },
          { key: "cournot", label: `Cournot (n=${params.n})` },
        ].map((view) => (
          <button
            key={view.key}
            onClick={() => setActiveView(view.key as MarketStructure)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === view.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Escenarios */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 py-2">Escenarios:</span>
        {Object.entries(marketStructureScenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() =>
              loadScenario(key as keyof typeof marketStructureScenarios)
            }
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title={scenario.description}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Parámetros */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Demanda
            </h3>
            <Slider
              label="Intercepto"
              symbol="a"
              value={params.a}
              min={50}
              max={200}
              step={10}
              onChange={updateParam("a")}
            />
            <Slider
              label="Pendiente"
              symbol="b"
              value={params.b}
              min={0.1}
              max={3}
              step={0.1}
              onChange={updateParam("b")}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Costos
            </h3>
            <Slider
              label="Costo Marginal"
              symbol="c"
              value={params.c}
              min={0}
              max={50}
              step={5}
              onChange={updateParam("c")}
            />
            <Slider
              label="Costo Fijo"
              symbol="F"
              value={params.F}
              min={0}
              max={500}
              step={50}
              onChange={updateParam("F")}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Oligopolio
            </h3>
            <Slider
              label="Número de Firmas"
              symbol="n"
              value={params.n}
              min={2}
              max={10}
              step={1}
              onChange={updateParam("n")}
            />
          </div>
        </div>

        {/* Gráfico y Resultados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-4">
            <Plot
              data={plotData}
              layout={{
                title: "Equilibrios de Mercado",
                xaxis: {
                  title: "Cantidad (Q)",
                  range: [
                    0,
                    Math.max(
                      results.perfectCompetition.Q,
                      results.monopoly.Q,
                      results.cournot.Q,
                    ) * 1.2,
                  ],
                },
                yaxis: {
                  title: "Precio (P)",
                  range: [
                    0,
                    Math.max(
                      results.perfectCompetition.P,
                      results.monopoly.P,
                      results.cournot.P,
                      params.c,
                    ) * 1.2,
                  ],
                },
                showlegend: true,
                margin: { t: 50, r: 20, b: 50, l: 60 },
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "500px" }}
            />
          </div>

          {/* Results Tables */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Perfect Competition */}
              {(activeView === "perfectCompetition" ||
                activeView === "comparison") && (
                <div className="border-l-4 border-green-500 bg-white rounded-lg p-4">
                  <h3 className="text-lg font-bold text-green-900 mb-3">
                    Competencia Perfecta
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ResultCard
                      label="Precio"
                      value={`$${results.perfectCompetition.P.toFixed(2)}`}
                      color="green"
                    />
                    <ResultCard
                      label="Cantidad"
                      value={results.perfectCompetition.Q.toFixed(1)}
                      color="green"
                    />
                    <ResultCard
                      label="Beneficio/Firma"
                      value={`$${results.perfectCompetition.profit.toFixed(0)}`}
                      color="green"
                      subtitle="(= 0 largo plazo)"
                    />
                    <ResultCard
                      label="Exc. Total"
                      value={`$${results.perfectCompetition.totalSurplus.toFixed(0)}`}
                      color="green"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    P = CMg. Eficiencia máxima. Beneficio económico = 0 en largo
                    plazo.
                  </p>
                </div>
              )}

              {/* Monopoly */}
              {(activeView === "monopoly" || activeView === "comparison") && (
                <div className="border-l-4 border-red-500 bg-white rounded-lg p-4">
                  <h3 className="text-lg font-bold text-red-900 mb-3">
                    Monopolio
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ResultCard
                      label="Precio"
                      value={`$${results.monopoly.P.toFixed(2)}`}
                      color="red"
                    />
                    <ResultCard
                      label="Cantidad"
                      value={results.monopoly.Q.toFixed(1)}
                      color="red"
                    />
                    <ResultCard
                      label="Beneficio"
                      value={`$${results.monopoly.profit.toFixed(0)}`}
                      color="red"
                    />
                    <ResultCard
                      label="DWL"
                      value={`$${results.monopoly.deadweightLoss.toFixed(0)}`}
                      color="yellow"
                      subtitle="Pérdida eficiencia"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <ResultCard
                      label="Índice de Lerner"
                      value={results.monopoly.lernerIndex.toFixed(3)}
                      color="red"
                      subtitle="(P - CMg)/P"
                    />
                    <ResultCard
                      label="Markup"
                      value={`${results.monopoly.markup.toFixed(2)}x`}
                      color="red"
                      subtitle="P/CMg"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    IMg = CMg. Poder de mercado. Restricción de producción para
                    aumentar precios.
                  </p>
                </div>
              )}

              {/* Cournot */}
              {(activeView === "cournot" || activeView === "comparison") && (
                <div className="border-l-4 border-purple-500 bg-white rounded-lg p-4">
                  <h3 className="text-lg font-bold text-purple-900 mb-3">
                    Oligopolio de Cournot (n={params.n})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ResultCard
                      label="Precio"
                      value={`$${results.cournot.P.toFixed(2)}`}
                      color="purple"
                    />
                    <ResultCard
                      label="Cantidad Total"
                      value={results.cournot.Q.toFixed(1)}
                      color="purple"
                    />
                    <ResultCard
                      label="q por Firma"
                      value={results.cournot.q.toFixed(1)}
                      color="purple"
                    />
                    <ResultCard
                      label="Beneficio/Firma"
                      value={`$${results.cournot.profit.toFixed(0)}`}
                      color="purple"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <ResultCard
                      label="Beneficio Total"
                      value={`$${results.cournot.totalProfit.toFixed(0)}`}
                      color="purple"
                    />
                    <ResultCard
                      label="Índice de Lerner"
                      value={results.cournot.lernerIndex.toFixed(3)}
                      color="purple"
                      subtitle="(P - CMg)/P"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Equilibrio de Nash-Cournot. Cada firma mejor responde a las
                    demás. Entre monopolio y competencia.
                  </p>
                </div>
              )}

              {/* Comparison */}
              {activeView === "comparison" && (
                <div className="border-l-4 border-blue-500 bg-white rounded-lg p-4">
                  <h3 className="text-lg font-bold text-blue-900 mb-3">
                    Comparación
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Variable</th>
                          <th className="text-right py-2">Comp. Perfecta</th>
                          <th className="text-right py-2">
                            Cournot (n={params.n})
                          </th>
                          <th className="text-right py-2">Monopolio</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Precio</td>
                          <td className="text-right">
                            ${results.perfectCompetition.P.toFixed(2)}
                          </td>
                          <td className="text-right">
                            ${results.cournot.P.toFixed(2)}
                          </td>
                          <td className="text-right">
                            ${results.monopoly.P.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Cantidad</td>
                          <td className="text-right">
                            {results.perfectCompetition.Q.toFixed(1)}
                          </td>
                          <td className="text-right">
                            {results.cournot.Q.toFixed(1)}
                          </td>
                          <td className="text-right">
                            {results.monopoly.Q.toFixed(1)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Exc. Consumidor</td>
                          <td className="text-right">
                            $
                            {results.perfectCompetition.consumerSurplus.toFixed(
                              0,
                            )}
                          </td>
                          <td className="text-right">
                            ${results.cournot.consumerSurplus.toFixed(0)}
                          </td>
                          <td className="text-right">
                            ${results.monopoly.consumerSurplus.toFixed(0)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Beneficios</td>
                          <td className="text-right">
                            $
                            {(
                              results.perfectCompetition.profit *
                              results.perfectCompetition.numFirms
                            ).toFixed(0)}
                          </td>
                          <td className="text-right">
                            ${results.cournot.totalProfit.toFixed(0)}
                          </td>
                          <td className="text-right">
                            ${results.monopoly.profit.toFixed(0)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Bienestar Total</td>
                          <td className="text-right">
                            $
                            {results.perfectCompetition.totalSurplus.toFixed(0)}
                          </td>
                          <td className="text-right">
                            ${results.cournot.totalSurplus.toFixed(0)}
                          </td>
                          <td className="text-right">
                            ${results.monopoly.totalSurplus.toFixed(0)}
                          </td>
                        </tr>
                        <tr className="border-b bg-yellow-50">
                          <td className="py-2 font-semibold">
                            Pérdida Eficiencia
                          </td>
                          <td className="text-right">$0</td>
                          <td className="text-right">
                            ${results.cournot.deadweightLoss.toFixed(0)}
                          </td>
                          <td className="text-right">
                            ${results.monopoly.deadweightLoss.toFixed(0)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Índice de Lerner</td>
                          <td className="text-right">0.000</td>
                          <td className="text-right">
                            {results.cournot.lernerIndex.toFixed(3)}
                          </td>
                          <td className="text-right">
                            {results.monopoly.lernerIndex.toFixed(3)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-sm text-gray-700">
                    <p>
                      <strong>Insight:</strong> A medida que aumenta el número
                      de firmas en Cournot, el equilibrio converge hacia
                      competencia perfecta. Con n={params.n} firmas, el precio
                      es{" "}
                      {(
                        (results.cournot.P / results.perfectCompetition.P - 1) *
                        100
                      ).toFixed(1)}
                      % más alto que en competencia perfecta.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Cournot Reaction Functions (only for duopoly) */}
          {activeView === "cournot" &&
            params.n === 2 &&
            reactionFunctionsPlot && (
              <div className="bg-white rounded-xl border p-4">
                {reactionFunctionsPlot}
                <div className="mt-4 text-sm text-gray-700">
                  <p>
                    <strong>Funciones de Reacción:</strong> Cada firma elige su
                    cantidad óptima dado lo que produce la otra. El equilibrio
                    de Nash ocurre donde ambas funciones se intersectan.
                  </p>
                  <div className="mt-2">
                    <BlockMath
                      math={`R_1(q_2) = \\frac{${params.a} - ${params.c} - ${params.b}q_2}{${2 * params.b}}`}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default MarketStructuresModel;
