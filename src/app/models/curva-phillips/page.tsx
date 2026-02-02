"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ModelConnections } from "@/components/ModelConnections";

// Importar el modelo dinámicamente para evitar SSR issues con Plotly
const PhillipsCurveModel = dynamic(
  () => import("@/components/models/PhillipsCurveModel"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    ),
  },
);

export default function PhillipsCurvePage() {
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
            <span className="text-gray-900">Curva de Phillips</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhillipsCurveModel />

        {/* Conexiones con otros modelos */}
        <section className="mt-16">
          <ModelConnections modelId="curva-phillips" />
        </section>

        {/* Explicación teórica */}
        <section className="mt-16 prose prose-lg max-w-none">
          <h2>Sobre la Curva de Phillips</h2>

          <p>
            La Curva de Phillips, descubierta por el economista neozelandés A.W.
            Phillips en 1958, originalmente mostraba una relación empírica
            negativa entre inflación salarial y desempleo en el Reino Unido. Con
            el tiempo, evolucionó para convertirse en uno de los conceptos
            fundamentales de la macroeconomía moderna.
          </p>

          <div className="grid md:grid-cols-2 gap-8 not-prose my-8">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-3">
                Corto Plazo
              </h3>
              <p className="text-purple-800 mb-4">
                En el corto plazo existe un trade-off entre inflación y
                desempleo. Los policy-makers pueden reducir el desempleo
                aceptando más inflación, o viceversa.
              </p>
              <ul className="text-purple-700 space-y-2 text-sm">
                <li>• Curva con pendiente negativa</li>
                <li>• Expectativas importan (π^e)</li>
                <li>• Shocks de oferta desplazan la curva</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Largo Plazo
              </h3>
              <p className="text-gray-800 mb-4">
                En el largo plazo, la curva es vertical en el NAIRU. No hay
                trade-off permanente entre inflación y desempleo.
              </p>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Curva vertical en u = u_n</li>
                <li>• Expectativas se ajustan completamente</li>
                <li>• Solo política que cambia u_n afecta desempleo</li>
              </ul>
            </div>
          </div>

          <h3>La Revolución de las Expectativas</h3>

          <p>
            En los años 1960s, Milton Friedman y Edmund Phelps argumentaron que
            el trade-off de Phillips solo existe cuando la inflación difiere de
            las expectativas. Esto llevó a la "Curva de Phillips Aumentada por
            Expectativas":
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
            <p className="font-mono text-center text-lg">
              π = π^e - α(u - u_n) + ε
            </p>
          </div>

          <p>Donde:</p>
          <ul>
            <li>
              <strong>π</strong>: inflación actual
            </li>
            <li>
              <strong>π^e</strong>: inflación esperada por los agentes
            </li>
            <li>
              <strong>u - u_n</strong>: brecha de desempleo (actual menos
              natural)
            </li>
            <li>
              <strong>α</strong>: sensibilidad de la inflación al desempleo
            </li>
            <li>
              <strong>ε</strong>: shocks de oferta
            </li>
          </ul>

          <h3>Tipos de Expectativas</h3>

          <div className="grid gap-4 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                1. Expectativas Adaptativas
              </h4>
              <p className="text-sm text-gray-700">
                Los agentes forman expectativas basándose en la inflación
                pasada: π^e = π_(-1). Esto significa que las expectativas se
                ajustan lentamente, haciendo que la desinflación sea costosa en
                términos de desempleo.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                2. Expectativas Racionales
              </h4>
              <p className="text-sm text-gray-700">
                Los agentes usan toda la información disponible eficientemente:
                π^e = E[π | info]. Si el Banco Central es creíble, π^e =
                π^target. Esto permite desinflaciones menos costosas.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                3. Expectativas Ancladas
              </h4>
              <p className="text-sm text-gray-700">
                Un caso intermedio donde las expectativas son una mezcla de la
                meta del BC y la inflación pasada, ponderada por la credibilidad
                del banco central. Mayor credibilidad facilita el control
                inflacionario.
              </p>
            </div>
          </div>

          <h3>El NAIRU: Non-Accelerating Inflation Rate of Unemployment</h3>

          <p>
            El NAIRU (u_n) es la tasa de desempleo consistente con inflación
            estable. Cuando el desempleo está en u_n y las expectativas son
            correctas (π = π^e), no hay presiones inflacionarias ni
            desinflacionarias.
          </p>

          <p>El NAIRU no es constante. Puede cambiar debido a:</p>
          <ul>
            <li>Cambios estructurales en el mercado laboral</li>
            <li>Eficiencia de matching entre trabajadores y empleos</li>
            <li>Poder de negociación de sindicatos</li>
            <li>Generosidad del seguro de desempleo</li>
            <li>Cambios demográficos</li>
          </ul>

          <h3>Episodios Históricos Importantes</h3>

          <div className="space-y-6 my-8">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
              <h4 className="text-lg font-bold text-orange-900 mb-2">
                La Estanflación de los 1970s
              </h4>
              <p className="text-orange-800 text-sm">
                Los shocks petroleros de 1973 y 1979 causaron aumentos
                simultáneos de inflación y desempleo, desafiando la Curva de
                Phillips original. Este episodio validó la importancia de
                incorporar expectativas y shocks de oferta al modelo.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h4 className="text-lg font-bold text-red-900 mb-2">
                La Desinflación Volcker (1979-1982)
              </h4>
              <p className="text-red-800 text-sm">
                Paul Volcker, presidente de la Fed, aumentó agresivamente las
                tasas de interés para combatir la inflación. El desempleo llegó
                a 10.8%, pero la inflación bajó de ~13% a ~3%. El "ratio de
                sacrificio" fue alto debido a expectativas adaptativas
                arraigadas.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h4 className="text-lg font-bold text-blue-900 mb-2">
                La Gran Moderación (1984-2007)
              </h4>
              <p className="text-blue-800 text-sm">
                Periodo de baja inflación y desempleo relativamente estable.
                Muchos atribuyen esto a expectativas bien ancladas gracias a la
                credibilidad de los bancos centrales en mantener la inflación
                baja.
              </p>
            </div>
          </div>

          <h3>Ley de Okun</h3>

          <p>
            La Ley de Okun complementa la Curva de Phillips al relacionar
            desempleo con producto. Establece que cuando el desempleo sube por
            encima del NAIRU, el producto cae por debajo del potencial:
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6">
            <p className="font-mono text-center text-lg">
              (Y - Y*)/Y* = -β(u - u_n)
            </p>
          </div>

          <p>
            Típicamente β ≈ 2, significando que 1 punto porcentual de desempleo
            por encima del NAIRU se asocia con ~2% de producto perdido.
          </p>

          <h3>El Ratio de Sacrificio</h3>

          <p>
            El ratio de sacrificio mide el costo de la desinflación en términos
            de producto perdido. Se calcula como:
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
            <p className="font-mono text-center text-lg">
              Ratio de Sacrificio = 1 / (α × β)
            </p>
          </div>

          <p>
            Un ratio de sacrificio de 5 significa que reducir la inflación en 1
            punto porcentual cuesta 5% de un año de PIB. Este ratio es menor
            cuando:
          </p>
          <ul>
            <li>Las expectativas están ancladas (mayor credibilidad del BC)</li>
            <li>La política es creíble y anticipada</li>
            <li>Los agentes tienen expectativas racionales vs adaptativas</li>
          </ul>

          <h3>Política Económica y la Curva de Phillips</h3>

          <p>
            La Curva de Phillips tiene implicaciones profundas para la política
            monetaria:
          </p>

          <ul>
            <li>
              <strong>Corto plazo:</strong> Existe un trade-off que los
              policy-makers deben gestionar según las preferencias sociales
              entre inflación y desempleo
            </li>
            <li>
              <strong>Largo plazo:</strong> La política monetaria no puede
              afectar permanentemente el desempleo; solo políticas estructurales
              pueden cambiar u_n
            </li>
            <li>
              <strong>Credibilidad:</strong> Un BC creíble puede desinflacionar
              con menores costos de desempleo
            </li>
            <li>
              <strong>Comunicación:</strong> La gestión de expectativas es
              crucial; la "forward guidance" es una herramienta importante
            </li>
          </ul>

          <h3>Limitaciones y Críticas</h3>

          <p>
            Como todo modelo económico, la Curva de Phillips tiene limitaciones:
          </p>

          <ul>
            <li>
              La relación puede ser inestable y cambiar con el régimen de
              política
            </li>
            <li>El NAIRU es difícil de estimar en tiempo real</li>
            <li>En algunos periodos (ej. post-2008) la curva parece "plana"</li>
            <li>No captura bien efectos de segundo orden y no linealidades</li>
            <li>Asume que el desempleo es la única variable relevante</li>
          </ul>

          <h3>Referencias y Lecturas Adicionales</h3>

          <ul>
            <li>
              Phillips, A.W. (1958). "The Relation between Unemployment and the
              Rate of Change of Money Wage Rates in the United Kingdom,
              1861-1957"
            </li>
            <li>Friedman, M. (1968). "The Role of Monetary Policy"</li>
            <li>
              Phelps, E. (1967). "Phillips Curves, Expectations of Inflation and
              Optimal Unemployment over Time"
            </li>
            <li>
              Blanchard, O. (2016). "The Phillips Curve: Back to the '60s?"
            </li>
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
