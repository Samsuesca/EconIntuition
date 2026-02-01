'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const ASADModel = dynamic(
  () => import('@/components/models/ASADModel'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div> }
)

export default function ASADPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-serif font-bold">
            Econ<span className="text-blue-600">Intuition</span>
          </Link>
          <Link href="/models" className="text-gray-600 hover:text-gray-900">← Modelos</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ASADModel />

        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre el Modelo AS-AD</h2>
          <p>
            El modelo de Oferta y Demanda Agregada es el marco central para analizar
            fluctuaciones macroeconómicas. Integra el mercado de bienes, el mercado
            de dinero y el mercado laboral en un solo diagrama.
          </p>

          <h3>Curvas Principales</h3>
          <ul>
            <li><strong>Demanda Agregada (AD):</strong> Derivada del modelo IS-LM, muestra combinaciones de Y y P que equilibran los mercados de bienes y dinero.</li>
            <li><strong>Oferta Agregada de Corto Plazo (SRAS):</strong> Muestra cómo las empresas ajustan producción cuando los precios difieren de sus expectativas.</li>
            <li><strong>Oferta Agregada de Largo Plazo (LRAS):</strong> Vertical en el producto potencial, donde todos los precios y salarios se han ajustado.</li>
          </ul>

          <h3>Shocks y Políticas</h3>
          <ul>
            <li><strong>Shock de Demanda (+):</strong> Expansión fiscal/monetaria desplaza AD a la derecha, aumentando Y y P.</li>
            <li><strong>Shock de Oferta (-):</strong> Aumento de costos desplaza SRAS hacia arriba, generando estanflación.</li>
            <li><strong>Ajuste de Largo Plazo:</strong> Las expectativas de precios se ajustan hasta que Y vuelve a Yn.</li>
          </ul>

          <h3>Implicaciones de Política</h3>
          <ul>
            <li>La política monetaria afecta Y solo en el corto plazo</li>
            <li>La política fiscal tiene multiplicadores que dependen de parámetros estructurales</li>
            <li>Las expectativas de inflación son cruciales para la efectividad de la política</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
