"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ModelConnections } from "@/components/ModelConnections";

// Importar el modelo dinámicamente para evitar SSR issues con Plotly
const MundellFlemingModel = dynamic(
  () => import("@/components/models/MundellFlemingModel"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ),
  },
);

export default function MundellFlemingPage() {
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
            <div className="flex gap-6">
              <Link
                href="/courses/macroeconomia"
                className="text-gray-600 hover:text-gray-900"
              >
                Macroeconomía
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
            <span className="text-gray-900">Mundell-Fleming</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MundellFlemingModel />

        {/* Conexiones con otros modelos */}
        <section className="mt-16">
          <ModelConnections modelId="mundell-fleming" />
        </section>

        {/* Explicación teórica */}
        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre el Modelo Mundell-Fleming</h2>

          <p>
            El modelo Mundell-Fleming, desarrollado independientemente por
            Robert Mundell y Marcus Fleming a principios de los años 1960, es la
            extensión del IS-LM para economías abiertas. Es fundamental para
            entender la macroeconomía internacional y la efectividad de las
            políticas económicas bajo diferentes regímenes cambiarios.
          </p>

          <div className="grid md:grid-cols-3 gap-8 not-prose my-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Curva IS</h3>
              <p className="text-blue-800 mb-4">
                En economía abierta, incluye las exportaciones netas NX que
                dependen del tipo de cambio e y del ingreso.
              </p>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>
                  • Depreciación (e ↑) mejora NX → IS se desplaza a la derecha
                </li>
                <li>
                  • Mayor ingreso aumenta importaciones → efecto negativo en NX
                </li>
                <li>• El multiplicador es menor que en economía cerrada</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-900 mb-3">Curva LM</h3>
              <p className="text-red-800 mb-4">
                Permanece igual que en economía cerrada: equilibrio en el
                mercado de dinero.
              </p>
              <ul className="text-red-700 space-y-2 text-sm">
                <li>• M/P = L(Y, i)</li>
                <li>• Expansión monetaria desplaza LM a la derecha</li>
                <li>• En TC fijo, M puede ser endógena</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Curva BP
              </h3>
              <p className="text-green-800 mb-4">
                Nueva en el modelo: representa el equilibrio externo (BP = 0).
              </p>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• BP = NX + CF(i - i*)</li>
                <li>• Pendiente depende de movilidad de capital</li>
                <li>• Perfecta: horizontal | Nula: vertical</li>
              </ul>
            </div>
          </div>

          <h3>El Trilema de la Política Económica</h3>

          <p>
            El modelo ilustra el famoso "trilema imposible" o "trinidad
            imposible": un país no puede tener simultáneamente:
          </p>

          <ol>
            <li>Tipo de cambio fijo</li>
            <li>Libre movilidad de capital</li>
            <li>Política monetaria independiente</li>
          </ol>

          <p>
            Solo dos de estos tres objetivos son compatibles. Cada combinación
            define un régimen macroeconómico diferente con distintas
            implicaciones para la efectividad de las políticas.
          </p>

          <h3>Efectividad de Políticas según Régimen</h3>

          <div className="not-prose my-8">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Régimen
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Política Fiscal
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Política Monetaria
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      TC Flexible + Movilidad Perfecta
                    </td>
                    <td className="px-6 py-4 text-red-600">Inefectiva</td>
                    <td className="px-6 py-4 text-green-600">Muy efectiva</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      TC Fijo + Movilidad Perfecta
                    </td>
                    <td className="px-6 py-4 text-green-600">Muy efectiva</td>
                    <td className="px-6 py-4 text-red-600">Inefectiva</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      TC Flexible + Sin Movilidad
                    </td>
                    <td className="px-6 py-4 text-amber-600">
                      Moderadamente efectiva
                    </td>
                    <td className="px-6 py-4 text-amber-600">
                      Moderadamente efectiva
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      TC Flexible + Movilidad Imperfecta
                    </td>
                    <td className="px-6 py-4 text-amber-600">
                      Efectividad intermedia
                    </td>
                    <td className="px-6 py-4 text-amber-600">
                      Efectividad intermedia
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3>Casos de Estudio Históricos</h3>

          <ul>
            <li>
              <strong>Bretton Woods (1945-1971):</strong> Sistema de tipo de
              cambio fijo con controles de capital. Los países podían mantener
              política monetaria independiente limitando la movilidad de
              capital.
            </li>
            <li>
              <strong>Crisis Asiática (1997):</strong> Países con tipo de cambio
              semi-fijo y libre movilidad de capital experimentaron ataques
              especulativos cuando intentaron política monetaria independiente.
            </li>
            <li>
              <strong>Eurozona:</strong> Los países miembros renunciaron a
              política monetaria independiente (la delegan al BCE) y tipo de
              cambio propio, pero mantienen libre movilidad de capital.
            </li>
            <li>
              <strong>China:</strong> Mantiene controles de capital
              significativos para poder gestionar su tipo de cambio y mantener
              cierta independencia monetaria.
            </li>
          </ul>

          <h3>Limitaciones del Modelo</h3>

          <p>Como todo modelo, el Mundell-Fleming simplifica la realidad:</p>

          <ul>
            <li>Asume precios fijos (análisis de corto plazo)</li>
            <li>No incorpora expectativas explícitamente</li>
            <li>La movilidad de capital se modela de forma estilizada</li>
            <li>No considera efectos de riqueza ni valuación</li>
            <li>
              Supone sustitución perfecta entre bonos domésticos y extranjeros
            </li>
          </ul>

          <p>
            A pesar de estas limitaciones, el modelo sigue siendo una
            herramienta fundamental para entender los trade-offs de política
            económica en economías abiertas.
          </p>
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
