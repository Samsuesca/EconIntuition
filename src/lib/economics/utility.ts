// Modelo de Preferencias y Utilidad - Curvas de Indiferencia

import { Point2D, generateCurvePoints } from './shared'

export type UtilityFunctionType = 'cobb-douglas' | 'perfect-substitutes' | 'perfect-complements' | 'quasilinear'

export interface UtilityParams {
  // Función de utilidad
  type: UtilityFunctionType

  // Parámetros Cobb-Douglas: U = x^α * y^(1-α)
  alpha: number

  // Parámetros sustitutos perfectos: U = ax + by
  a: number
  b_util: number

  // Restricción presupuestaria
  income: number    // Ingreso (M)
  px: number        // Precio del bien X
  py: number        // Precio del bien Y

  // Nivel de utilidad para curva de indiferencia
  utilityLevel: number
}

export interface UtilityResults {
  // Elección óptima
  x_optimal: number
  y_optimal: number
  utility_max: number

  // Demandas Marshallianas
  demand_x: (px: number, py: number, M: number) => number
  demand_y: (px: number, py: number, M: number) => number

  // Utilidad marginal
  MUx: number
  MUy: number
  MRS: number       // Tasa Marginal de Sustitución

  // Elasticidades
  income_elasticity_x: number
  price_elasticity_x: number
}

export const defaultUtilityParams: UtilityParams = {
  type: 'cobb-douglas',
  alpha: 0.5,
  a: 1,
  b_util: 1,
  income: 100,
  px: 10,
  py: 10,
  utilityLevel: 25,
}

// Función de utilidad
export function utilityFunction(params: UtilityParams): (x: number, y: number) => number {
  const { type, alpha, a, b_util } = params

  switch (type) {
    case 'cobb-douglas':
      return (x, y) => Math.pow(x, alpha) * Math.pow(y, 1 - alpha)

    case 'perfect-substitutes':
      return (x, y) => a * x + b_util * y

    case 'perfect-complements':
      return (x, y) => Math.min(a * x, b_util * y)

    case 'quasilinear':
      return (x, y) => Math.log(x + 1) + y

    default:
      return (x, y) => Math.pow(x, alpha) * Math.pow(y, 1 - alpha)
  }
}

// Curva de indiferencia: dado U, encontrar y como función de x
export function indifferenceCurve(params: UtilityParams, U: number): (x: number) => number {
  const { type, alpha, a, b_util } = params

  switch (type) {
    case 'cobb-douglas':
      // U = x^α * y^(1-α)  =>  y = (U / x^α)^(1/(1-α))
      return (x) => {
        if (x <= 0) return Infinity
        return Math.pow(U / Math.pow(x, alpha), 1 / (1 - alpha))
      }

    case 'perfect-substitutes':
      // U = ax + by  =>  y = (U - ax) / b
      return (x) => (U - a * x) / b_util

    case 'perfect-complements':
      // U = min(ax, by)  =>  forma de L
      return (x) => {
        if (a * x < U) return Infinity
        return U / b_util
      }

    case 'quasilinear':
      // U = ln(x+1) + y  =>  y = U - ln(x+1)
      return (x) => U - Math.log(x + 1)

    default:
      return (x) => Math.pow(U / Math.pow(x, alpha), 1 / (1 - alpha))
  }
}

// Restricción presupuestaria: M = px*x + py*y  =>  y = (M - px*x) / py
export function budgetConstraint(params: UtilityParams): (x: number) => number {
  const { income, px, py } = params
  return (x) => (income - px * x) / py
}

// Resolver optimización del consumidor
export function solveConsumerChoice(params: UtilityParams): UtilityResults {
  const { type, alpha, a, b_util, income, px, py } = params

  let x_optimal: number
  let y_optimal: number

  switch (type) {
    case 'cobb-douglas':
      // Demanda Marshalliana: x* = αM/px, y* = (1-α)M/py
      x_optimal = (alpha * income) / px
      y_optimal = ((1 - alpha) * income) / py
      break

    case 'perfect-substitutes':
      // Solución de esquina: todo al bien más barato por unidad de utilidad
      if (a / px > b_util / py) {
        x_optimal = income / px
        y_optimal = 0
      } else if (a / px < b_util / py) {
        x_optimal = 0
        y_optimal = income / py
      } else {
        // Indiferente - cualquier combinación en la recta presupuestaria
        x_optimal = income / (2 * px)
        y_optimal = income / (2 * py)
      }
      break

    case 'perfect-complements':
      // Consumir donde ax = by
      // M = px*x + py*y y ax = by
      // x = bM / (a*py + b*px)
      x_optimal = (b_util * income) / (a * py + b_util * px)
      y_optimal = (a * income) / (a * py + b_util * px)
      break

    case 'quasilinear':
      // MRS = MUx/MUy = 1/(x+1) = px/py
      // x* = py/px - 1
      x_optimal = Math.max(0, py / px - 1)
      y_optimal = (income - px * x_optimal) / py
      break

    default:
      x_optimal = (alpha * income) / px
      y_optimal = ((1 - alpha) * income) / py
  }

  const U = utilityFunction(params)
  const utility_max = U(x_optimal, y_optimal)

  // Utilidades marginales (aproximación numérica)
  const h = 0.001
  const MUx = (U(x_optimal + h, y_optimal) - U(x_optimal, y_optimal)) / h
  const MUy = (U(x_optimal, y_optimal + h) - U(x_optimal, y_optimal)) / h
  const MRS = MUx / MUy

  // Demandas Marshallianas como funciones
  const demand_x = (px_: number, py_: number, M: number) => {
    if (type === 'cobb-douglas') return (alpha * M) / px_
    return x_optimal // Simplificación
  }

  const demand_y = (px_: number, py_: number, M: number) => {
    if (type === 'cobb-douglas') return ((1 - alpha) * M) / py_
    return y_optimal
  }

  // Elasticidades para Cobb-Douglas
  const income_elasticity_x = type === 'cobb-douglas' ? 1 : 0
  const price_elasticity_x = type === 'cobb-douglas' ? -1 : 0

  return {
    x_optimal,
    y_optimal,
    utility_max,
    demand_x,
    demand_y,
    MUx,
    MUy,
    MRS,
    income_elasticity_x,
    price_elasticity_x,
  }
}

// Generar curva de indiferencia para gráfico
export function generateIndifferenceCurve(
  params: UtilityParams,
  U: number,
  xRange?: [number, number]
): Point2D[] {
  const curve = indifferenceCurve(params, U)
  const range = xRange || [0.1, params.income / params.px]

  return generateCurvePoints(
    curve,
    range,
    100,
    (p) => p.y > 0 && p.y < 1000 && isFinite(p.y)
  )
}

// Generar restricción presupuestaria
export function generateBudgetLine(params: UtilityParams): Point2D[] {
  const { income, px, py } = params
  const x_max = income / px
  const y_max = income / py

  return [
    { x: 0, y: y_max },
    { x: x_max, y: 0 },
  ]
}

// Escenarios predefinidos
export const utilityScenarios = {
  cobbDouglas: {
    name: 'Cobb-Douglas',
    description: 'Preferencias estándar con sustitución imperfecta',
    params: defaultUtilityParams,
  },
  perfectSubstitutes: {
    name: 'Sustitutos Perfectos',
    description: 'Bienes completamente intercambiables',
    params: { ...defaultUtilityParams, type: 'perfect-substitutes' as UtilityFunctionType },
  },
  perfectComplements: {
    name: 'Complementos Perfectos',
    description: 'Bienes que se consumen en proporciones fijas',
    params: { ...defaultUtilityParams, type: 'perfect-complements' as UtilityFunctionType },
  },
  incomeIncrease: {
    name: 'Aumento de Ingreso',
    description: 'Duplicar el ingreso disponible',
    params: { ...defaultUtilityParams, income: 200 },
  },
  priceChange: {
    name: 'Cambio de Precio',
    description: 'Aumento del precio del bien X',
    params: { ...defaultUtilityParams, px: 20 },
  },
}
