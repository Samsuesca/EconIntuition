'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const courses = [
  {
    id: 'microeconomia',
    title: 'Microeconomia',
    description: 'Desde preferencias hasta equilibrio general',
    topics: ['Preferencias', 'Utilidad', 'Demanda', 'Oferta', 'Equilibrio'],
    color: 'econ-blue',
    icon: '📊',
  },
  {
    id: 'macroeconomia',
    title: 'Macroeconomia',
    description: 'Modelos agregados de la economia',
    topics: ['IS-LM', 'Mundell-Fleming', 'Phillips', 'Solow'],
    color: 'econ-green',
    icon: '🌐',
  },
  {
    id: 'econometria',
    title: 'Econometria',
    description: 'Metodos cuantitativos y estadisticos',
    topics: ['Regresion', 'Series de Tiempo', 'Panel Data', 'Causalidad'],
    color: 'econ-red',
    icon: '📈',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
              Econ<span className="text-econ-blue-500">Intuition</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Economia formal hecha intuitiva. Aprende teoria economica con
              visualizaciones interactivas, animaciones y modelos que puedes explorar.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/courses/microeconomia"
                className="px-8 py-3 bg-econ-blue-600 hover:bg-econ-blue-700 rounded-lg font-semibold transition-colors"
              >
                Comenzar Ahora
              </Link>
              <Link
                href="/models"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
              >
                Ver Modelos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Explora la Teoria Economica
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desde los fundamentos de microeconomia hasta modelos macroeconomicos avanzados,
            todo presentado de manera visual e interactiva.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/courses/${course.id}`}>
                <div className="concept-card h-full cursor-pointer group">
                  <div className="text-4xl mb-4">{course.icon}</div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-econ-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-econ-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Animaciones Narrativas
              </h3>
              <p className="text-gray-600">
                Visualiza como se construyen las ecuaciones y graficos paso a paso,
                al estilo de 3Blue1Brown.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-econ-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Modelos Interactivos
              </h3>
              <p className="text-gray-600">
                Modifica parametros y observa en tiempo real como cambian
                los equilibrios y las curvas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-econ-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Rigor Matematico
              </h3>
              <p className="text-gray-600">
                Formalismo academico completo con derivaciones, demostraciones
                y notacion profesional.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl font-serif text-white mb-2">EconIntuition</p>
          <p>Economia formal hecha intuitiva</p>
        </div>
      </footer>
    </main>
  )
}
