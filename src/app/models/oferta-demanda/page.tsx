'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ModelConnections } from '@/components/ModelConnections'

const SupplyDemandModel = dynamic(
  () => import('@/components/models/SupplyDemandModel'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div> }
)

export default function SupplyDemandPage() {
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
        <SupplyDemandModel />

        {/* Conexiones con otros modelos */}
        <section className="mt-16">
          <ModelConnections modelId="oferta-demanda" />
        </section>

        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre el Modelo de Oferta y Demanda</h2>
          <p>
            El modelo de oferta y demanda es la piedra angular de la microeconomía.
            Explica cómo los precios se determinan en mercados competitivos a través
            de la interacción entre compradores y vendedores.
          </p>

          <h3>Conceptos Clave</h3>
          <ul>
            <li><strong>Excedente del consumidor:</strong> Diferencia entre lo que los consumidores están dispuestos a pagar y lo que realmente pagan.</li>
            <li><strong>Excedente del productor:</strong> Diferencia entre el precio recibido y el costo mínimo de producción.</li>
            <li><strong>Elasticidad:</strong> Sensibilidad de la cantidad demandada/ofrecida ante cambios en el precio.</li>
            <li><strong>Pérdida de eficiencia:</strong> Reducción del bienestar total debido a intervenciones de mercado.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
