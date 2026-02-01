'use client'

import { motion } from 'framer-motion'
import { InlineMath } from 'react-katex'

interface ParameterSliderProps {
  label: string
  symbol: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  description?: string
  onChange: (value: number) => void
  color?: 'blue' | 'green' | 'red'
}

export function ParameterSlider({
  label,
  symbol,
  value,
  min,
  max,
  step = 0.01,
  unit = '',
  description,
  onChange,
  color = 'blue',
}: ParameterSliderProps) {
  const colorClasses = {
    blue: 'accent-econ-blue-600',
    green: 'accent-econ-green-600',
    red: 'accent-econ-red-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-sm">
            <InlineMath math={symbol} />
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono font-semibold text-gray-900">
            {value.toFixed(step < 1 ? 2 : 0)}
          </span>
          {unit && <span className="text-gray-500 text-sm ml-1">{unit}</span>}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`param-slider ${colorClasses[color]}`}
      />

      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>

      {description && (
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      )}
    </motion.div>
  )
}

interface ParameterGroupProps {
  title: string
  children: React.ReactNode
}

export function ParameterGroup({ title, children }: ParameterGroupProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
        {title}
      </h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}
