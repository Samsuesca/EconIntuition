'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ModelConnections } from '@/components/ModelConnections'

const UtilityModel = dynamic(
  () => import('@/components/models/UtilityModel'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div> }
)

export default function UtilityPage() {
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
        <UtilityModel />

        {/* Conexiones con otros modelos */}
        <section className="mt-16">
          <ModelConnections modelId="utilidad" />
        </section>

        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre la Teoría del Consumidor</h2>
          <p>
            La teoría del consumidor estudia cómo los individuos toman decisiones de consumo
            dado un presupuesto limitado y preferencias definidas. Es la base microeconómica
            para entender la demanda de mercado.
          </p>

          <h3>Conceptos Clave</h3>
          <ul>
            <li><strong>Curva de Indiferencia:</strong> Combinaciones de bienes que proporcionan el mismo nivel de utilidad.</li>
            <li><strong>Tasa Marginal de Sustitución (TMS):</strong> Cantidad de Y que el consumidor está dispuesto a sacrificar por una unidad adicional de X.</li>
            <li><strong>Restricción Presupuestaria:</strong> El conjunto de canastas asequibles dado el ingreso y los precios.</li>
            <li><strong>Elección Óptima:</strong> El punto donde la TMS iguala la razón de precios.</li>
          </ul>

          <h3>Tipos de Preferencias</h3>
          <ul>
            <li><strong>Cobb-Douglas:</strong> Preferencias regulares con sustitución imperfecta. Gasto proporcional al parámetro α.</li>
            <li><strong>Sustitutos Perfectos:</strong> Bienes completamente intercambiables. Solución de esquina.</li>
            <li><strong>Complementos Perfectos:</strong> Bienes consumidos en proporciones fijas. Curvas de indiferencia en forma de L.</li>
            <li><strong>Cuasilineales:</strong> Efecto ingreso nulo para un bien. Demanda independiente del ingreso.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
