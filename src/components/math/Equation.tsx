'use client'

import { motion } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface EquationProps {
  math: string
  inline?: boolean
  highlight?: boolean
  label?: string
  description?: string
}

export function Equation({
  math,
  inline = false,
  highlight = false,
  label,
  description
}: EquationProps) {
  if (inline) {
    return (
      <span className={highlight ? 'equation-highlight' : ''}>
        <InlineMath math={math} />
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="equation-container"
    >
      {label && (
        <div className="text-sm text-gray-500 mb-2 font-mono">
          {label}
        </div>
      )}
      <div className={`text-center ${highlight ? 'equation-highlight' : ''}`}>
        <BlockMath math={math} />
      </div>
      {description && (
        <p className="mt-4 text-sm text-gray-600 text-center italic">
          {description}
        </p>
      )}
    </motion.div>
  )
}

interface EquationStepProps {
  steps: Array<{
    math: string
    explanation: string
  }>
}

export function EquationDerivation({ steps }: EquationStepProps) {
  return (
    <div className="space-y-6 my-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          className="flex gap-4 items-start"
        >
          <div className="step-indicator pending">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="equation-container !my-0 !py-4">
              <BlockMath math={step.math} />
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              {step.explanation}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
