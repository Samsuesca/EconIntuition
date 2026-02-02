'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ModelConnections } from '@/components/ModelConnections'

const SolowModel = dynamic(
  () => import('@/components/models/SolowModel'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div> }
)

export default function SolowPage() {
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
        <SolowModel />

        {/* Conexiones con otros modelos */}
        <section className="mt-16">
          <ModelConnections modelId="solow" />
        </section>

        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre el Modelo de Solow</h2>
          <p>
            El modelo de Solow-Swan (1956) es el modelo fundamental de crecimiento económico.
            Explica cómo la acumulación de capital, el crecimiento poblacional y el progreso
            tecnológico determinan el nivel de vida de largo plazo.
          </p>

          <h3>Implicaciones Principales</h3>
          <ul>
            <li><strong>Convergencia:</strong> Países pobres crecen más rápido que países ricos (convergencia condicional).</li>
            <li><strong>Estado estacionario:</strong> Sin progreso tecnológico, el crecimiento per cápita se detiene.</li>
            <li><strong>Regla de oro:</strong> Existe una tasa de ahorro óptima que maximiza el consumo de largo plazo.</li>
            <li><strong>Rol de la tecnología:</strong> Solo el progreso tecnológico genera crecimiento sostenido.</li>
          </ul>

          <h3>Limitaciones</h3>
          <ul>
            <li>Trata la tecnología como exógena</li>
            <li>No explica diferencias en productividad entre países</li>
            <li>Asume rendimientos decrecientes del capital</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
