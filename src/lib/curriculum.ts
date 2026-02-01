// Curriculum structure for EconIntuition

export interface Topic {
  id: string
  title: string
  description: string
  prerequisites: string[]
  order: number
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  topics: Topic[]
}

export const curriculum: Course[] = [
  {
    id: 'microeconomia',
    title: 'Microeconomia',
    description: 'Desde preferencias hasta equilibrio general',
    icon: '📊',
    topics: [
      {
        id: 'preferencias',
        title: 'Preferencias y Utilidad',
        description: 'Como los consumidores ordenan sus preferencias',
        prerequisites: [],
        order: 1,
      },
      {
        id: 'restriccion-presupuestaria',
        title: 'Restriccion Presupuestaria',
        description: 'Los limites del consumo',
        prerequisites: ['preferencias'],
        order: 2,
      },
      {
        id: 'eleccion-consumidor',
        title: 'Eleccion del Consumidor',
        description: 'Maximizacion de utilidad sujeta a restricciones',
        prerequisites: ['preferencias', 'restriccion-presupuestaria'],
        order: 3,
      },
      {
        id: 'demanda',
        title: 'Funcion de Demanda',
        description: 'Derivacion de la curva de demanda',
        prerequisites: ['eleccion-consumidor'],
        order: 4,
      },
      {
        id: 'oferta',
        title: 'Oferta y Equilibrio',
        description: 'El lado de la produccion y el equilibrio de mercado',
        prerequisites: ['demanda'],
        order: 5,
      },
      {
        id: 'elasticidades',
        title: 'Elasticidades',
        description: 'Sensibilidad de oferta y demanda',
        prerequisites: ['oferta'],
        order: 6,
      },
    ],
  },
  {
    id: 'macroeconomia',
    title: 'Macroeconomia',
    description: 'Modelos agregados de la economia',
    icon: '🌐',
    topics: [
      {
        id: 'cuentas-nacionales',
        title: 'Cuentas Nacionales',
        description: 'PIB, consumo, inversion y gasto',
        prerequisites: [],
        order: 1,
      },
      {
        id: 'mercado-bienes',
        title: 'Mercado de Bienes (IS)',
        description: 'Equilibrio en el mercado de bienes',
        prerequisites: ['cuentas-nacionales'],
        order: 2,
      },
      {
        id: 'mercado-dinero',
        title: 'Mercado de Dinero (LM)',
        description: 'Equilibrio en el mercado monetario',
        prerequisites: ['cuentas-nacionales'],
        order: 3,
      },
      {
        id: 'is-lm',
        title: 'Modelo IS-LM',
        description: 'Equilibrio simultaneo de mercados',
        prerequisites: ['mercado-bienes', 'mercado-dinero'],
        order: 4,
      },
      {
        id: 'mundell-fleming',
        title: 'Mundell-Fleming',
        description: 'IS-LM en economia abierta',
        prerequisites: ['is-lm'],
        order: 5,
      },
      {
        id: 'solow',
        title: 'Modelo de Solow',
        description: 'Crecimiento economico de largo plazo',
        prerequisites: ['cuentas-nacionales'],
        order: 6,
      },
    ],
  },
  {
    id: 'econometria',
    title: 'Econometria',
    description: 'Metodos cuantitativos y estadisticos',
    icon: '📈',
    topics: [
      {
        id: 'estadistica-descriptiva',
        title: 'Estadistica Descriptiva',
        description: 'Medidas de tendencia central y dispersion',
        prerequisites: [],
        order: 1,
      },
      {
        id: 'regresion-simple',
        title: 'Regresion Lineal Simple',
        description: 'El modelo de dos variables',
        prerequisites: ['estadistica-descriptiva'],
        order: 2,
      },
      {
        id: 'regresion-multiple',
        title: 'Regresion Multiple',
        description: 'Modelos con multiples variables explicativas',
        prerequisites: ['regresion-simple'],
        order: 3,
      },
    ],
  },
]

// Helper functions
export function getTopic(courseId: string, topicId: string): Topic | undefined {
  const course = curriculum.find(c => c.id === courseId)
  return course?.topics.find(t => t.id === topicId)
}

export function getCourse(courseId: string): Course | undefined {
  return curriculum.find(c => c.id === courseId)
}

export function getPrerequisites(courseId: string, topicId: string): Topic[] {
  const course = curriculum.find(c => c.id === courseId)
  const topic = course?.topics.find(t => t.id === topicId)

  if (!topic || !course) return []

  return topic.prerequisites
    .map(prereqId => course.topics.find(t => t.id === prereqId))
    .filter((t): t is Topic => t !== undefined)
}
