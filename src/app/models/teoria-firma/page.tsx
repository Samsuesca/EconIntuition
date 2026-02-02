"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ModelConnections } from "@/components/ModelConnections";

// Importar el modelo dinámicamente para evitar SSR issues con Plotly
const FirmTheoryModel = dynamic(
  () => import("@/components/models/FirmTheoryModel"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    ),
  },
);

export default function FirmTheoryPage() {
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
              Econ<span className="text-purple-600">Intuition</span>
            </Link>
            <div className="flex gap-6">
              <Link
                href="/courses/microeconomia"
                className="text-gray-600 hover:text-gray-900"
              >
                Microeconomía
              </Link>
              <Link
                href="/models"
                className="text-gray-600 hover:text-gray-900"
              >
                Modelos
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <Link href="/models" className="hover:text-gray-700">
              Modelos
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Teoría de la Firma</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FirmTheoryModel />

        {/* Conexiones con otros modelos */}
        <section className="mt-16">
          <ModelConnections modelId="teoria-firma" />
        </section>

        {/* Explicación teórica */}
        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre la Teoría de la Firma</h2>

          <p>
            La teoría de la firma estudia cómo las empresas toman decisiones de
            producción para maximizar beneficios. El modelo fundamental utiliza
            la función de producción Cobb-Douglas, que relaciona insumos
            (trabajo y capital) con producción.
          </p>

          <div className="grid md:grid-cols-2 gap-8 not-prose my-8">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-3">
                Función de Producción
              </h3>
              <p className="text-purple-800 mb-4">
                La función Cobb-Douglas Q = A·L<sup>α</sup>·K<sup>β</sup>{" "}
                captura cómo los factores productivos se combinan para generar
                output.
              </p>
              <ul className="text-purple-700 space-y-2 text-sm">
                <li>• A: Productividad total de factores (tecnología)</li>
                <li>• α: Elasticidad del producto respecto al trabajo</li>
                <li>• β: Elasticidad del producto respecto al capital</li>
                <li>• α + β: Determina los retornos a escala</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Minimización de Costos
              </h3>
              <p className="text-green-800 mb-4">
                La firma minimiza costos eligiendo la combinación óptima de
                insumos donde las productividades marginales por peso gastado se
                igualan.
              </p>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• Condición: MPL/w = MPK/r</li>
                <li>
                  • La isocuanta muestra combinaciones con igual producción
                </li>
                <li>• El isocosto muestra combinaciones con igual gasto</li>
                <li>• El óptimo es la tangencia isocuanta-isocosto</li>
              </ul>
            </div>
          </div>

          <h3>Corto Plazo vs Largo Plazo</h3>

          <p>
            Una distinción fundamental en la teoría de la firma es el horizonte
            temporal:
          </p>

          <ul>
            <li>
              <strong>Corto Plazo:</strong> Al menos un factor es fijo
              (típicamente el capital K). La firma solo puede ajustar el trabajo
              L. Esto genera las curvas de costo estándar (CT, CV, CMg, CMe,
              CVMe).
            </li>
            <li>
              <strong>Largo Plazo:</strong> Todos los factores son variables. La
              firma puede elegir cualquier combinación de L y K. Aquí aplica la
              minimización de costos y la firma opera sobre su "senda de
              expansión".
            </li>
          </ul>

          <h3>Retornos a Escala</h3>

          <p>
            La suma de las elasticidades (α + β) determina cómo responde la
            producción cuando escalamos todos los insumos proporcionalmente:
          </p>

          <ul>
            <li>
              <strong>α + β &gt; 1:</strong> Retornos crecientes a escala.
              Duplicar insumos más que duplica la producción. Típico de
              industrias con altos costos fijos (economías de escala).
            </li>
            <li>
              <strong>α + β = 1:</strong> Retornos constantes a escala. Duplicar
              insumos duplica exactamente la producción. La firma puede
              replicarse.
            </li>
            <li>
              <strong>α + β &lt; 1:</strong> Retornos decrecientes a escala.
              Duplicar insumos menos que duplica la producción. Puede deberse a
              límites gerenciales o recursos escasos.
            </li>
          </ul>

          <h3>Productos Marginales</h3>

          <p>Los productos marginales miden la productividad de cada factor:</p>

          <ul>
            <li>
              <strong>MPL = α·Q/L:</strong> Producción adicional por unidad
              extra de trabajo, manteniendo K constante.
            </li>
            <li>
              <strong>MPK = β·Q/K:</strong> Producción adicional por unidad
              extra de capital, manteniendo L constante.
            </li>
          </ul>

          <p>
            Una propiedad importante: en Cobb-Douglas, los productos marginales
            son decrecientes. A medida que aumenta un factor (manteniendo el
            otro fijo), su producto marginal disminuye (ley de rendimientos
            marginales decrecientes).
          </p>

          <h3>Costos</h3>

          <p>
            Las curvas de costos se derivan de la función de producción y los
            precios de los factores:
          </p>

          <ul>
            <li>
              <strong>Costo Total (CT):</strong> CT = wL + rK + CF
            </li>
            <li>
              <strong>Costo Variable (CV):</strong> CV = wL (en corto plazo con
              K fijo)
            </li>
            <li>
              <strong>Costo Marginal (CMg):</strong> CMg = w/MPL (costo de una
              unidad adicional)
            </li>
            <li>
              <strong>Costo Medio (CMe):</strong> CMe = CT/Q
            </li>
            <li>
              <strong>Costo Variable Medio (CVMe):</strong> CVMe = CV/Q
            </li>
          </ul>

          <p>
            La relación CMg = w/MPL muestra que el costo marginal es
            inversamente proporcional al producto marginal del trabajo. Cuando
            el MPL es alto, producir cuesta poco; cuando cae, producir se
            encarece.
          </p>

          <h3>Aplicaciones</h3>

          <p>Este modelo tiene múltiples aplicaciones prácticas:</p>

          <ul>
            <li>Decisiones de contratación y capital en empresas</li>
            <li>Análisis de competitividad y estructura de costos</li>
            <li>Evaluación de impacto de cambios tecnológicos (↑A)</li>
            <li>
              Estudio de cambios en precios de factores (salarios, interés)
            </li>
            <li>Fundamento para curvas de oferta de mercado</li>
          </ul>

          <h3>Limitaciones del Modelo</h3>

          <p>
            Como todo modelo, la Cobb-Douglas tiene supuestos simplificadores:
          </p>

          <ul>
            <li>Solo dos factores (trabajo y capital)</li>
            <li>Elasticidad de sustitución constante e igual a 1</li>
            <li>Retornos a escala constantes (si α + β = 1)</li>
            <li>
              No considera factores cualitativos (calidad del trabajo, gestión)
            </li>
            <li>Supone mercados competitivos de factores</li>
          </ul>
        </section>
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
