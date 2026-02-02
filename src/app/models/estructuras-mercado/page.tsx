"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ModelConnections } from "@/components/ModelConnections";

const MarketStructuresModel = dynamic(
  () => import("@/components/models/MarketStructuresModel"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    ),
  },
);

export default function MarketStructuresPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-serif font-bold">
            Econ<span className="text-blue-600">Intuition</span>
          </Link>
          <Link href="/models" className="text-gray-600 hover:text-gray-900">
            ← Modelos
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <MarketStructuresModel />

        {/* Conexiones con otros modelos */}
        <section className="mt-16">
          <ModelConnections modelId="estructuras-mercado" />
        </section>

        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre las Estructuras de Mercado</h2>
          <p>
            Las estructuras de mercado describen cómo se organizan los mercados
            según el número de firmas, las barreras de entrada y el grado de
            competencia. Esta comparación muestra cómo cada estructura afecta
            los precios, cantidades y el bienestar social.
          </p>

          <h3>Competencia Perfecta</h3>
          <p>
            En competencia perfecta, muchas firmas pequeñas producen un bien
            homogéneo. Ninguna firma tiene poder de mercado, y todas son
            precio-aceptantes. La condición de equilibrio es{" "}
            <strong>P = CMg</strong>, y en el largo plazo los beneficios
            económicos son cero debido a la libre entrada y salida.
          </p>
          <ul>
            <li>Precio más bajo</li>
            <li>Cantidad más alta</li>
            <li>Máximo bienestar social</li>
            <li>Eficiencia productiva y asignativa</li>
          </ul>

          <h3>Monopolio</h3>
          <p>
            Un monopolio es el único vendedor en el mercado. Tiene total poder
            de mercado y puede fijar precios. Maximiza beneficios donde{" "}
            <strong>IMg = CMg</strong>, lo que resulta en precios más altos y
            cantidades menores que en competencia perfecta.
          </p>
          <ul>
            <li>
              <strong>Pérdida de eficiencia (Deadweight Loss):</strong>{" "}
              Reducción del bienestar total debido a la producción subóptima
            </li>
            <li>
              <strong>Índice de Lerner:</strong> L = (P - CMg)/P mide el poder
              de mercado. Con demanda lineal, L = 1/|ε| donde ε es la
              elasticidad precio
            </li>
            <li>
              <strong>Markup:</strong> El precio como múltiplo del costo
              marginal (P/CMg)
            </li>
          </ul>

          <h3>Oligopolio de Cournot</h3>
          <p>
            El modelo de Cournot describe la competencia entre unas pocas firmas
            que eligen cantidades simultáneamente. Cada firma maximiza
            beneficios tomando como dada la producción de sus rivales.
          </p>
          <ul>
            <li>
              <strong>Funciones de Reacción:</strong> Cada firma tiene una
              función que indica su cantidad óptima dado lo que producen las
              demás: R₁(q₂) = (a - c - bq₂)/(2b)
            </li>
            <li>
              <strong>Equilibrio de Nash:</strong> Ninguna firma quiere cambiar
              su cantidad dado lo que hacen las demás
            </li>
            <li>
              <strong>Convergencia:</strong> A medida que aumenta el número de
              firmas (n), el equilibrio converge hacia competencia perfecta
            </li>
          </ul>

          <h3>Conceptos Clave</h3>
          <dl>
            <dt className="font-semibold">Poder de Mercado</dt>
            <dd>
              La capacidad de una firma para fijar precios por encima del costo
              marginal. Se mide con el Índice de Lerner.
            </dd>

            <dt className="font-semibold mt-4">
              Pérdida de Eficiencia (Deadweight Loss)
            </dt>
            <dd>
              La reducción del bienestar total cuando el mercado no opera en
              competencia perfecta. Representa transacciones mutuamente
              beneficiosas que no ocurren.
            </dd>

            <dt className="font-semibold mt-4">Equilibrio de Nash</dt>
            <dd>
              Situación donde ningún jugador quiere cambiar su estrategia dado
              lo que hacen los demás. En Cournot, ninguna firma quiere cambiar
              su cantidad.
            </dd>

            <dt className="font-semibold mt-4">Barreras de Entrada</dt>
            <dd>
              Factores que dificultan la entrada de nuevas firmas al mercado.
              Los costos fijos altos son una barrera natural que puede sostener
              beneficios positivos.
            </dd>
          </dl>

          <h3>Aplicaciones en el Mundo Real</h3>
          <ul>
            <li>
              <strong>Agricultura:</strong> Muchos productores pequeños →
              Cercano a competencia perfecta
            </li>
            <li>
              <strong>Utilities (agua, electricidad):</strong> Monopolios
              naturales debido a altos costos fijos
            </li>
            <li>
              <strong>Telecomunicaciones:</strong> Oligopolio (pocas empresas
              grandes)
            </li>
            <li>
              <strong>Tecnología:</strong> Monopolios temporales por innovación
              y efectos de red
            </li>
            <li>
              <strong>Aviación:</strong> Oligopolio con competencia en rutas
              específicas
            </li>
          </ul>

          <h3>Política Económica</h3>
          <p>
            Comprender las estructuras de mercado es fundamental para diseñar
            políticas de competencia:
          </p>
          <ul>
            <li>
              <strong>Leyes antimonopolio:</strong> Prevenir fusiones que
              reduzcan excesivamente la competencia
            </li>
            <li>
              <strong>Regulación de monopolios:</strong> Fijar precios en
              monopolios naturales para evitar pérdidas de eficiencia
            </li>
            <li>
              <strong>Promoción de competencia:</strong> Reducir barreras de
              entrada para aumentar el bienestar
            </li>
          </ul>

          <h3>Extensiones del Modelo</h3>
          <p>Este modelo se puede extender para considerar:</p>
          <ul>
            <li>Diferenciación de productos (Competencia monopolística)</li>
            <li>Competencia en precios (Bertrand)</li>
            <li>Liderazgo de precios (Stackelberg)</li>
            <li>Colusión y carteles</li>
            <li>Entrada y salida dinámica</li>
            <li>Discriminación de precios</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
