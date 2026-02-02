"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ModelConnections } from "@/components/ModelConnections";

// Importar el modelo dinámicamente para evitar SSR issues con Plotly
const ElasticityModel = dynamic(
  () => import("@/components/models/ElasticityModel"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ),
  },
);

export default function ElasticidadesPage() {
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
            <span className="text-gray-900">Elasticidades</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ElasticityModel />

        {/* Conexiones con otros modelos */}
        <section className="mt-16">
          <ModelConnections modelId="elasticidades" />
        </section>

        {/* Explicación teórica */}
        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre las Elasticidades</h2>

          <p>
            Las elasticidades son medidas fundamentales en economía que
            cuantifican la sensibilidad de una variable ante cambios en otra.
            Son esenciales para entender cómo responden consumidores y
            productores a cambios en precios, ingresos, y precios de bienes
            relacionados.
          </p>

          <div className="grid md:grid-cols-2 gap-8 not-prose my-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Elasticidad Precio de la Demanda
              </h3>
              <p className="text-blue-800 mb-4">
                Mide el cambio porcentual en la cantidad demandada ante un
                cambio porcentual de 1% en el precio.
              </p>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• |εd| &gt; 1: Demanda elástica (sensible al precio)</li>
                <li>• |εd| = 1: Elasticidad unitaria</li>
                <li>
                  • |εd| &lt; 1: Demanda inelástica (insensible al precio)
                </li>
                <li>• εd siempre es negativa (ley de la demanda)</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                Elasticidad Precio de la Oferta
              </h3>
              <p className="text-green-800 mb-4">
                Mide el cambio porcentual en la cantidad ofrecida ante un cambio
                porcentual de 1% en el precio.
              </p>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>
                  • εs &gt; 1: Oferta elástica (fácil aumentar producción)
                </li>
                <li>• εs = 1: Elasticidad unitaria</li>
                <li>
                  • εs &lt; 1: Oferta inelástica (difícil aumentar producción)
                </li>
                <li>• εs siempre es positiva (ley de la oferta)</li>
              </ul>
            </div>
          </div>

          <h3>Relación con el Ingreso Total</h3>

          <p>
            El ingreso total (IT = P × Q) tiene una relación crucial con la
            elasticidad:
          </p>

          <ul>
            <li>
              <strong>Si |εd| &gt; 1 (elástica):</strong> Una disminución del
              precio aumenta el ingreso total. El aumento porcentual en cantidad
              es mayor que la disminución porcentual en precio.
            </li>
            <li>
              <strong>Si |εd| &lt; 1 (inelástica):</strong> Una disminución del
              precio disminuye el ingreso total. El aumento porcentual en
              cantidad es menor que la disminución porcentual en precio.
            </li>
            <li>
              <strong>Si |εd| = 1 (unitaria):</strong> El ingreso total es
              máximo y no cambia ante pequeñas variaciones de precio.
            </li>
          </ul>

          <p>
            Esta relación explica por qué algunas empresas suben precios (cuando
            la demanda es inelástica) y otras los bajan (cuando es elástica)
            para maximizar ingresos.
          </p>

          <h3>Incidencia de Impuestos</h3>

          <p>
            La incidencia de un impuesto (quién realmente paga el impuesto) no
            depende de sobre quién se aplique legalmente, sino de las
            elasticidades relativas:
          </p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6 not-prose">
            <p className="text-orange-900 font-semibold mb-2">
              Principio fundamental:
            </p>
            <p className="text-orange-800">
              El lado del mercado que es menos elástico (más inelástico) carga
              con la mayor parte del impuesto.
            </p>
          </div>

          <ul>
            <li>
              <strong>Demanda perfectamente inelástica:</strong> Los
              consumidores pagan el 100% del impuesto (ejemplo: insulina,
              medicamentos vitales)
            </li>
            <li>
              <strong>Oferta perfectamente inelástica:</strong> Los productores
              pagan el 100% del impuesto (ejemplo: tierra, bienes perecederos)
            </li>
            <li>
              <strong>Elasticidades similares:</strong> La carga se distribuye
              aproximadamente igual entre consumidores y productores
            </li>
          </ul>

          <h3>Tipos de Elasticidades</h3>

          <h4>1. Elasticidad Ingreso (εI)</h4>
          <p>
            Mide cómo cambia la demanda cuando cambia el ingreso del consumidor:
          </p>
          <ul>
            <li>
              <strong>εI &gt; 1:</strong> Bien de lujo (demanda crece más que
              proporcionalmente)
            </li>
            <li>
              <strong>0 &lt; εI &lt; 1:</strong> Bien normal necesario
            </li>
            <li>
              <strong>εI &lt; 0:</strong> Bien inferior (menor ingreso, mayor
              demanda)
            </li>
          </ul>

          <h4>2. Elasticidad Cruzada (εxy)</h4>
          <p>
            Mide cómo cambia la demanda del bien X cuando cambia el precio del
            bien Y:
          </p>
          <ul>
            <li>
              <strong>εxy &gt; 0:</strong> Bienes sustitutos (ejemplo: Coca-Cola
              y Pepsi)
            </li>
            <li>
              <strong>εxy &lt; 0:</strong> Bienes complementarios (ejemplo: café
              y azúcar)
            </li>
            <li>
              <strong>εxy = 0:</strong> Bienes independientes (sin relación)
            </li>
          </ul>

          <h3>Factores que Determinan la Elasticidad</h3>

          <p>La elasticidad precio de la demanda depende de varios factores:</p>

          <ol>
            <li>
              <strong>Disponibilidad de sustitutos:</strong> Más sustitutos →
              mayor elasticidad
            </li>
            <li>
              <strong>Proporción del presupuesto:</strong> Mayor gasto → mayor
              elasticidad
            </li>
            <li>
              <strong>Necesidad vs lujo:</strong> Necesidades → menor
              elasticidad
            </li>
            <li>
              <strong>Horizonte temporal:</strong> Más tiempo → mayor
              elasticidad (más opciones)
            </li>
            <li>
              <strong>Definición del mercado:</strong> Mercados más específicos
              → mayor elasticidad
            </li>
          </ol>

          <h3>Aplicaciones Prácticas</h3>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
            <h4 className="font-bold text-gray-900 mb-3">
              Ejemplos del mundo real:
            </h4>
            <ul className="space-y-3">
              <li>
                <strong>Gasolina (corto plazo):</strong> Demanda inelástica (εd
                ≈ -0.2). La gente necesita ir al trabajo, difícil cambiar
                hábitos inmediatamente.
              </li>
              <li>
                <strong>Gasolina (largo plazo):</strong> Demanda más elástica
                (εd ≈ -0.7). La gente puede cambiar de auto, mudarse más cerca
                del trabajo.
              </li>
              <li>
                <strong>Sal de mesa:</strong> Muy inelástica. Pequeña parte del
                presupuesto, sin sustitutos cercanos, necesaria en pequeñas
                cantidades.
              </li>
              <li>
                <strong>Comida en restaurantes:</strong> Relativamente elástica.
                Puede cocinarse en casa, no es necesidad básica.
              </li>
            </ul>
          </div>

          <h3>Limitaciones del Modelo</h3>

          <p>
            Este modelo asume funciones lineales por simplicidad, pero en
            realidad:
          </p>
          <ul>
            <li>Las elasticidades varían a lo largo de la curva de demanda</li>
            <li>Las funciones reales pueden ser no lineales</li>
            <li>
              Otros factores (expectativas, gustos) también afectan la demanda
            </li>
            <li>Los mercados reales rara vez están en equilibrio perfecto</li>
          </ul>

          <p>
            Sin embargo, el análisis de elasticidades proporciona insights
            fundamentales para decisiones de política económica, estrategias de
            precios empresariales, y comprensión del comportamiento del mercado.
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
