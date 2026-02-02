// Grafo de Conocimiento Económico - Conexiones entre modelos y conceptos

export type ModelId =
  | 'is-lm'
  | 'oferta-demanda'
  | 'solow'
  | 'utilidad'
  | 'as-ad'
  | 'mundell-fleming'

export type ConceptId =
  | 'equilibrio'
  | 'multiplicador'
  | 'elasticidad'
  | 'optimizacion'
  | 'estado-estacionario'
  | 'expectativas'
  | 'politica-fiscal'
  | 'politica-monetaria'
  | 'mercado-bienes'
  | 'mercado-dinero'
  | 'mercado-trabajo'
  | 'largo-plazo'
  | 'corto-plazo'
  | 'economia-abierta'
  | 'tipo-cambio'

export type RelationType =
  | 'builds-on'      // Este modelo se basa en...
  | 'extends'        // Este modelo extiende...
  | 'derives'        // Este modelo deriva de...
  | 'aggregates'     // Este modelo agrega...
  | 'applies'        // Este modelo aplica el concepto de...
  | 'contrasts'      // Este modelo contrasta con...
  | 'prerequisite'   // Prerrequisito para entender

export interface ModelRelation {
  from: ModelId
  to: ModelId
  type: RelationType
  description: string
  bidirectional?: boolean
}

export interface ModelConcept {
  modelId: ModelId
  conceptId: ConceptId
  role: 'introduces' | 'uses' | 'extends' | 'central'
}

export interface ModelMetadata {
  id: ModelId
  title: string
  shortTitle: string
  description: string
  keyQuestion: string  // La pregunta central que responde el modelo
  prerequisites: ModelId[]
  leadsTo: ModelId[]
  concepts: ConceptId[]
  equations: {
    name: string
    latex: string
    description: string
  }[]
  realWorldApplications: string[]
  limitations: string[]
}

// Definición completa de cada modelo
export const modelMetadata: Record<ModelId, ModelMetadata> = {
  'utilidad': {
    id: 'utilidad',
    title: 'Preferencias y Utilidad',
    shortTitle: 'Utilidad',
    description: 'Teoría del consumidor: cómo los individuos toman decisiones de consumo',
    keyQuestion: '¿Cómo elige un consumidor la mejor combinación de bienes dado su presupuesto?',
    prerequisites: [],
    leadsTo: ['oferta-demanda'],
    concepts: ['optimizacion', 'equilibrio', 'elasticidad'],
    equations: [
      { name: 'Función de Utilidad', latex: 'U = U(x, y)', description: 'Representa las preferencias' },
      { name: 'Restricción Presupuestaria', latex: 'M = p_x x + p_y y', description: 'Límite de gasto' },
      { name: 'Condición de Óptimo', latex: '\\frac{MU_x}{MU_y} = \\frac{p_x}{p_y}', description: 'TMS = razón de precios' },
    ],
    realWorldApplications: [
      'Análisis de canastas de consumo',
      'Diseño de políticas de subsidios',
      'Predicción de demanda ante cambios de precio',
    ],
    limitations: [
      'Asume racionalidad perfecta',
      'No captura efectos de hábito o adicción',
      'Ignora interacciones sociales',
    ],
  },

  'oferta-demanda': {
    id: 'oferta-demanda',
    title: 'Oferta y Demanda',
    shortTitle: 'O&D',
    description: 'Equilibrio de mercado: cómo se determinan precios y cantidades',
    keyQuestion: '¿Cómo se determina el precio de equilibrio en un mercado competitivo?',
    prerequisites: ['utilidad'],
    leadsTo: ['as-ad'],
    concepts: ['equilibrio', 'elasticidad', 'mercado-bienes'],
    equations: [
      { name: 'Demanda', latex: 'Q^d = a - bP', description: 'Cantidad demandada vs precio' },
      { name: 'Oferta', latex: 'Q^s = c + dP', description: 'Cantidad ofrecida vs precio' },
      { name: 'Equilibrio', latex: 'Q^d = Q^s', description: 'Mercado se vacía' },
    ],
    realWorldApplications: [
      'Análisis de impuestos y subsidios',
      'Predicción de precios',
      'Diseño de políticas de precios mínimos/máximos',
    ],
    limitations: [
      'Asume competencia perfecta',
      'Ignora externalidades',
      'Análisis de equilibrio parcial',
    ],
  },

  'is-lm': {
    id: 'is-lm',
    title: 'Modelo IS-LM',
    shortTitle: 'IS-LM',
    description: 'Equilibrio simultáneo del mercado de bienes y dinero',
    keyQuestion: '¿Cómo interactúan la política fiscal y monetaria para determinar el producto y la tasa de interés?',
    prerequisites: ['oferta-demanda'],
    leadsTo: ['as-ad', 'mundell-fleming'],
    concepts: ['equilibrio', 'multiplicador', 'politica-fiscal', 'politica-monetaria', 'mercado-bienes', 'mercado-dinero', 'corto-plazo'],
    equations: [
      { name: 'IS', latex: 'Y = C(Y-T) + I(r) + G', description: 'Equilibrio mercado de bienes' },
      { name: 'LM', latex: '\\frac{M}{P} = L(Y, r)', description: 'Equilibrio mercado de dinero' },
      { name: 'Multiplicador', latex: '\\alpha = \\frac{1}{1-c(1-t)}', description: 'Efecto amplificador del gasto' },
    ],
    realWorldApplications: [
      'Análisis de estímulos fiscales',
      'Efectos de política monetaria',
      'Trampa de liquidez',
    ],
    limitations: [
      'Precios fijos (corto plazo)',
      'Economía cerrada',
      'Expectativas estáticas',
    ],
  },

  'as-ad': {
    id: 'as-ad',
    title: 'Modelo AS-AD',
    shortTitle: 'AS-AD',
    description: 'Oferta y demanda agregada: determinación de precio y producto',
    keyQuestion: '¿Cómo se determinan simultáneamente el nivel de precios y el producto de la economía?',
    prerequisites: ['is-lm', 'oferta-demanda'],
    leadsTo: [],
    concepts: ['equilibrio', 'mercado-bienes', 'mercado-dinero', 'mercado-trabajo', 'corto-plazo', 'largo-plazo', 'expectativas'],
    equations: [
      { name: 'DA', latex: 'Y = Y^{AD}(P, G, M, ...)', description: 'Derivada del IS-LM' },
      { name: 'SRAS', latex: 'P = P^e + \\theta(Y - Y_n)', description: 'Oferta de corto plazo' },
      { name: 'LRAS', latex: 'Y = Y_n', description: 'Producto potencial' },
    ],
    realWorldApplications: [
      'Análisis de inflación',
      'Efectos de shocks de oferta',
      'Estanflación',
    ],
    limitations: [
      'Simplificación de expectativas',
      'Un solo bien agregado',
      'Ignora heterogeneidad sectorial',
    ],
  },

  'solow': {
    id: 'solow',
    title: 'Modelo de Solow',
    shortTitle: 'Solow',
    description: 'Crecimiento económico de largo plazo',
    keyQuestion: '¿Qué determina el nivel de vida de largo plazo de una economía?',
    prerequisites: [],
    leadsTo: [],
    concepts: ['estado-estacionario', 'largo-plazo', 'optimizacion'],
    equations: [
      { name: 'Producción', latex: 'Y = AK^\\alpha L^{1-\\alpha}', description: 'Función Cobb-Douglas' },
      { name: 'Acumulación', latex: '\\dot{k} = sy - (n+\\delta)k', description: 'Dinámica del capital' },
      { name: 'Estado Estacionario', latex: 'k^* = \\left(\\frac{sA}{n+\\delta}\\right)^{\\frac{1}{1-\\alpha}}', description: 'Equilibrio de largo plazo' },
    ],
    realWorldApplications: [
      'Convergencia entre países',
      'Impacto del ahorro en el crecimiento',
      'Rol de la tecnología',
    ],
    limitations: [
      'Tecnología exógena',
      'No explica diferencias de productividad',
      'Ahorro exógeno',
    ],
  },

  'mundell-fleming': {
    id: 'mundell-fleming',
    title: 'Modelo Mundell-Fleming',
    shortTitle: 'M-F',
    description: 'IS-LM para economía abierta',
    keyQuestion: '¿Cómo afecta el régimen cambiario la efectividad de las políticas macro?',
    prerequisites: ['is-lm'],
    leadsTo: [],
    concepts: ['equilibrio', 'politica-fiscal', 'politica-monetaria', 'economia-abierta', 'tipo-cambio'],
    equations: [
      { name: 'IS abierta', latex: 'Y = C + I + G + NX(e)', description: 'Incluye exportaciones netas' },
      { name: 'Paridad de intereses', latex: 'r = r^* + E[\\Delta e]', description: 'Arbitraje internacional' },
    ],
    realWorldApplications: [
      'Trilema de política monetaria',
      'Crisis cambiarias',
      'Política monetaria en economías abiertas',
    ],
    limitations: [
      'Perfecta movilidad de capitales',
      'Ignora efectos de balance',
      'Expectativas simples',
    ],
  },
}

// Relaciones entre modelos
export const modelRelations: ModelRelation[] = [
  {
    from: 'utilidad',
    to: 'oferta-demanda',
    type: 'derives',
    description: 'La curva de demanda se deriva de la teoría del consumidor',
  },
  {
    from: 'oferta-demanda',
    to: 'as-ad',
    type: 'aggregates',
    description: 'AS-AD agrega todos los mercados individuales',
  },
  {
    from: 'is-lm',
    to: 'as-ad',
    type: 'derives',
    description: 'La curva AD se deriva del modelo IS-LM',
  },
  {
    from: 'is-lm',
    to: 'mundell-fleming',
    type: 'extends',
    description: 'Mundell-Fleming extiende IS-LM a economía abierta',
  },
  {
    from: 'oferta-demanda',
    to: 'is-lm',
    type: 'builds-on',
    description: 'IS-LM usa el concepto de equilibrio de mercados',
  },
  {
    from: 'solow',
    to: 'as-ad',
    type: 'builds-on',
    description: 'El producto natural (Yn) viene del análisis de largo plazo tipo Solow',
  },
]

// Conceptos y sus definiciones
export const conceptDefinitions: Record<ConceptId, { name: string; definition: string; icon: string }> = {
  'equilibrio': {
    name: 'Equilibrio',
    definition: 'Estado donde las fuerzas del mercado están balanceadas y no hay tendencia al cambio',
    icon: '⚖️',
  },
  'multiplicador': {
    name: 'Multiplicador',
    definition: 'Efecto amplificador de un cambio inicial en el gasto sobre el producto total',
    icon: '📈',
  },
  'elasticidad': {
    name: 'Elasticidad',
    definition: 'Sensibilidad porcentual de una variable ante cambios en otra',
    icon: '📊',
  },
  'optimizacion': {
    name: 'Optimización',
    definition: 'Proceso de encontrar la mejor decisión dadas las restricciones',
    icon: '🎯',
  },
  'estado-estacionario': {
    name: 'Estado Estacionario',
    definition: 'Situación de largo plazo donde las variables clave dejan de cambiar',
    icon: '🔄',
  },
  'expectativas': {
    name: 'Expectativas',
    definition: 'Creencias sobre el futuro que influyen en decisiones presentes',
    icon: '🔮',
  },
  'politica-fiscal': {
    name: 'Política Fiscal',
    definition: 'Uso del gasto público e impuestos para influir en la economía',
    icon: '🏛️',
  },
  'politica-monetaria': {
    name: 'Política Monetaria',
    definition: 'Control de la oferta de dinero y tasas de interés por el banco central',
    icon: '🏦',
  },
  'mercado-bienes': {
    name: 'Mercado de Bienes',
    definition: 'Donde se intercambian productos y servicios',
    icon: '🛒',
  },
  'mercado-dinero': {
    name: 'Mercado de Dinero',
    definition: 'Donde se determina la tasa de interés por oferta y demanda de dinero',
    icon: '💰',
  },
  'mercado-trabajo': {
    name: 'Mercado de Trabajo',
    definition: 'Donde se determinan empleo y salarios',
    icon: '👷',
  },
  'largo-plazo': {
    name: 'Largo Plazo',
    definition: 'Horizonte donde todos los precios y cantidades se ajustan completamente',
    icon: '📅',
  },
  'corto-plazo': {
    name: 'Corto Plazo',
    definition: 'Horizonte donde algunos precios o cantidades están fijos',
    icon: '⏱️',
  },
  'economia-abierta': {
    name: 'Economía Abierta',
    definition: 'Economía que comercia bienes y activos con el resto del mundo',
    icon: '🌍',
  },
  'tipo-cambio': {
    name: 'Tipo de Cambio',
    definition: 'Precio de una moneda en términos de otra',
    icon: '💱',
  },
}

// Funciones helper
export function getRelatedModels(modelId: ModelId): { model: ModelMetadata; relation: ModelRelation }[] {
  const related: { model: ModelMetadata; relation: ModelRelation }[] = []

  for (const relation of modelRelations) {
    if (relation.from === modelId) {
      related.push({ model: modelMetadata[relation.to], relation })
    }
    if (relation.to === modelId) {
      // Invertir la relación para mostrarla desde la perspectiva del modelo actual
      related.push({
        model: modelMetadata[relation.from],
        relation: { ...relation, from: relation.to, to: relation.from }
      })
    }
  }

  return related
}

export function getModelConcepts(modelId: ModelId): { concept: typeof conceptDefinitions[ConceptId]; id: ConceptId }[] {
  const metadata = modelMetadata[modelId]
  return metadata.concepts.map(conceptId => ({
    concept: conceptDefinitions[conceptId],
    id: conceptId,
  }))
}

export function getModelsWithConcept(conceptId: ConceptId): ModelMetadata[] {
  return Object.values(modelMetadata).filter(model =>
    model.concepts.includes(conceptId)
  )
}

export function getPrerequisiteChain(modelId: ModelId): ModelMetadata[] {
  const chain: ModelMetadata[] = []
  const visited = new Set<ModelId>()

  function traverse(id: ModelId) {
    if (visited.has(id)) return
    visited.add(id)

    const model = modelMetadata[id]
    for (const prereq of model.prerequisites) {
      traverse(prereq)
    }
    chain.push(model)
  }

  traverse(modelId)
  return chain.slice(0, -1) // Exclude the model itself
}

export function getLearningPath(targetModelId: ModelId): ModelMetadata[] {
  return [...getPrerequisiteChain(targetModelId), modelMetadata[targetModelId]]
}
