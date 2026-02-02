"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const models = [
  {
    id: "is-lm",
    title: "Modelo IS-LM",
    description: "Equilibrio simultáneo del mercado de bienes y dinero",
    category: "Macroeconomía",
    difficulty: "Intermedio",
    icon: "📊",
    color: "blue",
    ready: true,
  },
  {
    id: "oferta-demanda",
    title: "Oferta y Demanda",
    description: "Equilibrio de mercado y elasticidades",
    category: "Microeconomía",
    difficulty: "Básico",
    icon: "📈",
    color: "green",
    ready: true,
  },
  {
    id: "solow",
    title: "Modelo de Solow",
    description: "Crecimiento económico de largo plazo",
    category: "Macroeconomía",
    difficulty: "Avanzado",
    icon: "🚀",
    color: "orange",
    ready: true,
  },
  {
    id: "utilidad",
    title: "Preferencias y Utilidad",
    description: "Curvas de indiferencia y elección del consumidor",
    category: "Microeconomía",
    difficulty: "Intermedio",
    icon: "🎯",
    color: "indigo",
    ready: true,
  },
  {
    id: "as-ad",
    title: "AS-AD",
    description: "Oferta y demanda agregada",
    category: "Macroeconomía",
    difficulty: "Intermedio",
    icon: "📉",
    color: "purple",
    ready: true,
  },
  {
    id: "mundell-fleming",
    title: "Mundell-Fleming",
    description: "IS-LM en economía abierta",
    category: "Macroeconomía",
    difficulty: "Avanzado",
    icon: "🌍",
    color: "purple",
    ready: true,
  },
  {
    id: "teoria-firma",
    title: "Teoría de la Firma",
    description: "Producción, costos e isocuantas",
    category: "Microeconomía",
    difficulty: "Intermedio",
    icon: "🏭",
    color: "amber",
    ready: true,
  },
  {
    id: "estructuras-mercado",
    title: "Estructuras de Mercado",
    description: "Competencia, monopolio y oligopolio",
    category: "Microeconomía",
    difficulty: "Intermedio",
    icon: "🏢",
    color: "red",
    ready: true,
  },
  {
    id: "elasticidades",
    title: "Elasticidades",
    description: "Precio, ingreso e incidencia impositiva",
    category: "Microeconomía",
    difficulty: "Básico",
    icon: "📏",
    color: "teal",
    ready: true,
  },
  {
    id: "curva-phillips",
    title: "Curva de Phillips",
    description: "Trade-off inflación y desempleo",
    category: "Macroeconomía",
    difficulty: "Intermedio",
    icon: "📉",
    color: "rose",
    ready: true,
  },
];

export default function ModelsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              href="/"
              className="text-xl font-serif font-bold text-gray-900"
            >
              Econ<span className="text-blue-600">Intuition</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Modelos Interactivos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explora modelos económicos de forma interactiva. Ajusta parámetros,
            observa cómo cambian los equilibrios y desarrolla intuición sobre la
            teoría económica.
          </p>
        </div>
      </div>

      {/* Models Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {model.ready ? (
                <Link href={`/models/${model.id}`}>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 h-full hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{model.icon}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Disponible
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {model.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{model.description}</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {model.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {model.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 h-full opacity-60">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{model.icon}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded">
                      Próximamente
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {model.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{model.description}</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {model.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {model.difficulty}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl font-serif text-white mb-1">EconIntuition</p>
          <p className="text-sm">Economía formal hecha intuitiva</p>
        </div>
      </footer>
    </main>
  );
}
