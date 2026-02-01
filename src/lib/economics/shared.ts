// Tipos y utilidades compartidas para todos los modelos económicos

// ============= TIPOS BASE =============

export interface Point2D {
  x: number
  y: number
}

export interface Curve {
  id: string
  points: Point2D[]
  color: string
  label: string
  dashed?: boolean
  width?: number
}

export interface Equilibrium {
  x: number
  y: number
  label?: string
}

export interface ModelParameter {
  key: string
  label: string
  symbol: string        // LaTeX symbol
  value: number
  min: number
  max: number
  step: number
  unit?: string
  description?: string
  category: string
}

export interface ModelResult {
  key: string
  label: string
  symbol: string
  value: number
  unit?: string
}

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info'
  message: string
}

// ============= UTILIDADES MATEMÁTICAS =============

/**
 * Genera puntos para una función dada
 */
export function generateCurvePoints(
  fn: (x: number) => number,
  xRange: [number, number],
  numPoints: number = 100,
  filterFn?: (point: Point2D) => boolean
): Point2D[] {
  const [xMin, xMax] = xRange
  const step = (xMax - xMin) / numPoints
  const points: Point2D[] = []

  for (let x = xMin; x <= xMax; x += step) {
    const y = fn(x)
    const point = { x, y }

    if (!filterFn || filterFn(point)) {
      if (isFinite(y) && !isNaN(y)) {
        points.push(point)
      }
    }
  }

  return points
}

/**
 * Encuentra intersección de dos curvas (aproximación numérica)
 */
export function findIntersection(
  curve1: Point2D[],
  curve2: Point2D[],
  tolerance: number = 0.1
): Point2D | null {
  for (const p1 of curve1) {
    for (const p2 of curve2) {
      if (Math.abs(p1.x - p2.x) < tolerance && Math.abs(p1.y - p2.y) < tolerance) {
        return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
      }
    }
  }
  return null
}

/**
 * Resuelve sistema 2x2: ax + by = e, cx + dy = f
 */
export function solveLinearSystem2x2(
  a: number, b: number, e: number,
  c: number, d: number, f: number
): { x: number; y: number } | null {
  const det = a * d - b * c
  if (Math.abs(det) < 1e-10) return null

  return {
    x: (e * d - b * f) / det,
    y: (a * f - e * c) / det,
  }
}

/**
 * Calcula derivada numérica
 */
export function numericalDerivative(
  fn: (x: number) => number,
  x: number,
  h: number = 0.0001
): number {
  return (fn(x + h) - fn(x - h)) / (2 * h)
}

/**
 * Calcula elasticidad punto
 */
export function pointElasticity(
  fn: (x: number) => number,
  x: number
): number {
  const y = fn(x)
  const derivative = numericalDerivative(fn, x)
  return (derivative * x) / y
}

// ============= COLORES ESTÁNDAR =============

export const modelColors = {
  // Curvas principales
  demand: '#ef4444',      // Rojo
  supply: '#22c55e',      // Verde
  is: '#ef4444',          // Rojo
  lm: '#3b82f6',          // Azul

  // Equilibrios
  equilibrium: '#22c55e', // Verde
  newEquilibrium: '#a855f7', // Púrpura

  // Curvas secundarias
  indifference: '#6366f1', // Indigo
  budget: '#f59e0b',       // Amber

  // Utilidades
  grid: '#e5e7eb',
  axis: '#374151',
  annotation: '#6b7280',
}

// ============= FORMATOS =============

export function formatNumber(value: number, decimals: number = 2): string {
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString('es-ES', { maximumFractionDigits: decimals })
  }
  return value.toFixed(decimals)
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatCurrency(value: number, currency: string = '$'): string {
  return `${currency}${formatNumber(value)}`
}
