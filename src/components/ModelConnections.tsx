'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ModelId,
  modelMetadata,
  getRelatedModels,
  getModelConcepts,
  getLearningPath,
  conceptDefinitions,
  getModelsWithConcept,
  ConceptId,
} from '@/lib/knowledge-graph'

interface ModelConnectionsProps {
  modelId: ModelId
  showLearningPath?: boolean
  showConcepts?: boolean
  showEquations?: boolean
}

const relationTypeLabels: Record<string, { label: string; color: string }> = {
  'builds-on': { label: 'Se basa en', color: 'blue' },
  'extends': { label: 'Extiende', color: 'purple' },
  'derives': { label: 'Deriva de', color: 'green' },
  'aggregates': { label: 'Agrega', color: 'orange' },
  'applies': { label: 'Aplica', color: 'indigo' },
  'contrasts': { label: 'Contrasta con', color: 'red' },
  'prerequisite': { label: 'Prerrequisito', color: 'yellow' },
}

export function ModelConnections({
  modelId,
  showLearningPath = true,
  showConcepts = true,
  showEquations = true,
}: ModelConnectionsProps) {
  const metadata = modelMetadata[modelId]
  const relatedModels = getRelatedModels(modelId)
  const concepts = getModelConcepts(modelId)
  const learningPath = getLearningPath(modelId)

  return (
    <div className="space-y-8">
      {/* Pregunta Central */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
          Pregunta Central
        </h3>
        <p className="text-xl text-gray-800 font-medium">
          {metadata.keyQuestion}
        </p>
      </div>

      {/* Ruta de Aprendizaje */}
      {showLearningPath && learningPath.length > 1 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📚</span> Ruta de Aprendizaje
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {learningPath.map((model, index) => (
              <div key={model.id} className="flex items-center gap-2">
                {index > 0 && (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <Link
                  href={`/models/${model.id}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    model.id === modelId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {model.shortTitle}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Sugerimos estudiar estos modelos en orden para una comprensión completa.
          </p>
        </div>
      )}

      {/* Modelos Relacionados */}
      {relatedModels.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🔗</span> Modelos Relacionados
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedModels.map(({ model, relation }) => {
              const relType = relationTypeLabels[relation.type] || { label: relation.type, color: 'gray' }
              const isFrom = relation.from === modelId

              return (
                <motion.div
                  key={`${relation.from}-${relation.to}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Link href={`/models/${model.id}`}>
                    <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {model.title}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-${relType.color}-100 text-${relType.color}-700`}>
                          {isFrom ? relType.label : '← ' + relType.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{relation.description}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Conceptos Clave */}
      {showConcepts && concepts.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>💡</span> Conceptos Clave
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {concepts.map(({ concept, id }) => (
              <ConceptCard key={id} conceptId={id} concept={concept} currentModelId={modelId} />
            ))}
          </div>
        </div>
      )}

      {/* Ecuaciones Fundamentales */}
      {showEquations && metadata.equations.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📐</span> Ecuaciones Fundamentales
          </h3>
          <div className="space-y-4">
            {metadata.equations.map((eq, index) => (
              <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{eq.name}</div>
                  <div className="text-sm text-gray-500">{eq.description}</div>
                </div>
                <div className="font-mono text-lg bg-white px-3 py-1 rounded border">
                  {eq.latex}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aplicaciones y Limitaciones */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-xl border border-green-100 p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>✅</span> Aplicaciones
          </h3>
          <ul className="space-y-2">
            {metadata.realWorldApplications.map((app, index) => (
              <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                {app}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <span>⚠️</span> Limitaciones
          </h3>
          <ul className="space-y-2">
            {metadata.limitations.map((lim, index) => (
              <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                {lim}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar un concepto con popover de modelos relacionados
function ConceptCard({
  conceptId,
  concept,
  currentModelId,
}: {
  conceptId: ConceptId
  concept: typeof conceptDefinitions[ConceptId]
  currentModelId: ModelId
}) {
  const relatedModels = getModelsWithConcept(conceptId).filter(m => m.id !== currentModelId)

  return (
    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group relative">
      <div className="flex items-center gap-2 mb-1">
        <span>{concept.icon}</span>
        <span className="font-medium text-gray-900">{concept.name}</span>
      </div>
      <p className="text-xs text-gray-600">{concept.definition}</p>

      {relatedModels.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">También en:</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {relatedModels.slice(0, 3).map(model => (
              <Link
                key={model.id}
                href={`/models/${model.id}`}
                className="text-xs px-2 py-0.5 bg-white rounded border hover:border-blue-300 hover:text-blue-600"
              >
                {model.shortTitle}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Componente simplificado para sidebar o cards pequeñas
export function RelatedModelsCompact({ modelId }: { modelId: ModelId }) {
  const relatedModels = getRelatedModels(modelId)

  if (relatedModels.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {relatedModels.map(({ model }) => (
        <Link
          key={model.id}
          href={`/models/${model.id}`}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-colors"
        >
          {model.shortTitle}
        </Link>
      ))}
    </div>
  )
}

export default ModelConnections
