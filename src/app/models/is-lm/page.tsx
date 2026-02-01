'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

// Importar el modelo dinámicamente para evitar SSR issues con Plotly
const ISLMModel = dynamic(
  () => import('@/components/models/ISLMModel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
)

export default function ISLMPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-serif font-bold text-gray-900">
              Econ<span className="text-blue-600">Intuition</span>
            </Link>
            <div className="flex gap-6">
              <Link href="/courses/macroeconomia" className="text-gray-600 hover:text-gray-900">
                Macroeconomía
              </Link>
              <Link href="/models" className="text-gray-600 hover:text-gray-900">
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
            <Link href="/" className="hover:text-gray-700">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/models" className="hover:text-gray-700">Modelos</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">IS-LM</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ISLMModel />

        {/* Explicación teórica */}
        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre el Modelo IS-LM</h2>

          <p>
            El modelo IS-LM, desarrollado por John Hicks en 1937 como una interpretación
            de la Teoría General de Keynes, es uno de los pilares fundamentales de la
            macroeconomía. Representa el equilibrio simultáneo en dos mercados:
          </p>

          <div className="grid md:grid-cols-2 gap-8 not-prose my-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Curva IS</h3>
              <p className="text-blue-800 mb-4">
                Representa todas las combinaciones de producto (Y) y tasa de interés (i)
                donde el mercado de bienes está en equilibrio.
              </p>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Pendiente negativa: mayor i → menor inversión → menor Y</li>
                <li>• Se desplaza con cambios en G, T, confianza del consumidor</li>
                <li>• Política fiscal afecta la posición de IS</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-900 mb-3">Curva LM</h3>
              <p className="text-red-800 mb-4">
                Representa todas las combinaciones de Y e i donde el mercado de dinero
                está en equilibrio (oferta = demanda de dinero).
              </p>
              <ul className="text-red-700 space-y-2 text-sm">
                <li>• Pendiente positiva: mayor Y → mayor demanda de dinero → mayor i</li>
                <li>• Se desplaza con cambios en M o P</li>
                <li>• Política monetaria afecta la posición de LM</li>
              </ul>
            </div>
          </div>

          <h3>Casos Especiales</h3>

          <ul>
            <li>
              <strong>Trampa de Liquidez:</strong> Cuando h → ∞, la curva LM es horizontal.
              La política monetaria es inefectiva porque el público absorbe cualquier
              aumento de dinero sin cambiar la tasa de interés.
            </li>
            <li>
              <strong>Caso Clásico:</strong> Cuando h → 0, la curva LM es vertical.
              La política fiscal es inefectiva (crowding out completo) y solo la
              política monetaria afecta el producto.
            </li>
          </ul>

          <h3>Limitaciones del Modelo</h3>

          <p>
            Es importante recordar que el IS-LM es un modelo simplificado que asume:
          </p>
          <ul>
            <li>Precios fijos (corto plazo keynesiano)</li>
            <li>Economía cerrada (sin sector externo detallado)</li>
            <li>Expectativas estáticas</li>
            <li>No considera el mercado laboral explícitamente</li>
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
  )
}
