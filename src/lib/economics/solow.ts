// Modelo de Solow - Crecimiento Económico

import { Point2D, generateCurvePoints } from './shared'

export interface SolowParams {
  // Parámetros del modelo
  s: number       // Tasa de ahorro (0-1)
  n: number       // Tasa de crecimiento poblacional
  delta: number   // Tasa de depreciación
  alpha: number   // Participación del capital (0-1)
  A: number       // Productividad (tecnología)

  // Estado inicial
  k0: number      // Capital per cápita inicial

  // Simulación
  periods: number // Períodos a simular
}

export interface SolowResults {
  // Estado estacionario
  k_star: number      // Capital per cápita de estado estacionario
  y_star: number      // Producto per cápita de estado estacionario
  c_star: number      // Consumo per cápita de estado estacionario
  i_star: number      // Inversión per cápita de estado estacionario

  // Regla de oro
  k_gold: number      // Capital de la regla de oro
  s_gold: number      // Tasa de ahorro de la regla de oro
  c_gold: number      // Consumo máximo (regla de oro)

  // Análisis
  convergenceSpeed: number  // Velocidad de convergencia
  halfLife: number          // Tiempo para cerrar mitad de la brecha
  isAboveGold: boolean      // ¿Estamos sobre-ahorrando?
}

export interface SolowTimePath {
  t: number
  k: number
  y: number
  c: number
  i: number
  growth_k: number
  growth_y: number
}

export const defaultSolowParams: SolowParams = {
  s: 0.20,
  n: 0.02,
  delta: 0.05,
  alpha: 0.33,
  A: 1,
  k0: 1,
  periods: 100,
}

// Función de producción per cápita: y = A * k^α
export function productionFunction(params: SolowParams): (k: number) => number {
  const { A, alpha } = params
  return (k) => A * Math.pow(k, alpha)
}

// Producto marginal del capital: MPK = α * A * k^(α-1)
export function marginalProductCapital(params: SolowParams): (k: number) => number {
  const { A, alpha } = params
  return (k) => alpha * A * Math.pow(k, alpha - 1)
}

// Inversión per cápita: i = s * y = s * A * k^α
export function investmentFunction(params: SolowParams): (k: number) => number {
  const { s, A, alpha } = params
  return (k) => s * A * Math.pow(k, alpha)
}

// Depreciación efectiva: (n + δ) * k
export function depreciationFunction(params: SolowParams): (k: number) => number {
  const { n, delta } = params
  return (k) => (n + delta) * k
}

// Cambio en capital: dk/dt = s*f(k) - (n+δ)*k
export function capitalChange(params: SolowParams): (k: number) => number {
  const investment = investmentFunction(params)
  const depreciation = depreciationFunction(params)
  return (k) => investment(k) - depreciation(k)
}

// Resolver estado estacionario
export function solveSteadyState(params: SolowParams): SolowResults {
  const { s, n, delta, alpha, A } = params

  // Estado estacionario: s*A*k^α = (n+δ)*k
  // k* = (s*A / (n+δ))^(1/(1-α))
  const k_star = Math.pow((s * A) / (n + delta), 1 / (1 - alpha))
  const y_star = A * Math.pow(k_star, alpha)
  const i_star = s * y_star
  const c_star = (1 - s) * y_star

  // Regla de oro: MPK = n + δ
  // α*A*k^(α-1) = n + δ
  // k_gold = (α*A / (n+δ))^(1/(1-α))
  const k_gold = Math.pow((alpha * A) / (n + delta), 1 / (1 - alpha))
  const y_gold = A * Math.pow(k_gold, alpha)
  const c_gold = y_gold - (n + delta) * k_gold
  const s_gold = alpha  // Tasa de ahorro de la regla de oro

  // Velocidad de convergencia: λ = (1-α)(n+δ)
  const convergenceSpeed = (1 - alpha) * (n + delta)
  const halfLife = Math.log(2) / convergenceSpeed

  return {
    k_star,
    y_star,
    c_star,
    i_star,
    k_gold,
    s_gold,
    c_gold,
    convergenceSpeed,
    halfLife,
    isAboveGold: k_star > k_gold,
  }
}

// Simular dinámica de transición
export function simulateTransition(params: SolowParams): SolowTimePath[] {
  const { k0, periods, A, alpha, s, n, delta } = params
  const production = productionFunction(params)
  const change = capitalChange(params)

  const path: SolowTimePath[] = []
  let k = k0

  for (let t = 0; t <= periods; t++) {
    const y = production(k)
    const i = s * y
    const c = (1 - s) * y
    const dk = change(k)
    const growth_k = dk / k
    const growth_y = alpha * growth_k

    path.push({ t, k, y, c, i, growth_k, growth_y })

    // Euler simple para siguiente período
    k = k + dk
    if (k < 0.01) k = 0.01  // Evitar valores negativos
  }

  return path
}

// Generar curvas para el diagrama de Solow
export function generateSolowDiagram(
  params: SolowParams,
  kRange?: [number, number]
): { investment: Point2D[]; depreciation: Point2D[]; production: Point2D[] } {
  const results = solveSteadyState(params)
  const range = kRange || [0, results.k_star * 2]

  const investment = generateCurvePoints(
    investmentFunction(params),
    range,
    100
  )

  const depreciation = generateCurvePoints(
    depreciationFunction(params),
    range,
    100
  )

  const production = generateCurvePoints(
    productionFunction(params),
    range,
    100
  )

  return { investment, depreciation, production }
}

// Escenarios predefinidos
export const solowScenarios = {
  baseline: {
    name: 'Caso Base',
    description: 'Economía típica en desarrollo',
    params: defaultSolowParams,
  },
  highSaving: {
    name: 'Alto Ahorro',
    description: 'Economía asiática (s = 35%)',
    params: { ...defaultSolowParams, s: 0.35 },
  },
  lowSaving: {
    name: 'Bajo Ahorro',
    description: 'Economía con bajo ahorro (s = 10%)',
    params: { ...defaultSolowParams, s: 0.10 },
  },
  goldenRule: {
    name: 'Regla de Oro',
    description: 'Tasa de ahorro que maximiza consumo',
    params: { ...defaultSolowParams, s: 0.33 },  // s = α
  },
  highPopGrowth: {
    name: 'Alto Crecimiento Poblacional',
    description: 'Economía con n = 3%',
    params: { ...defaultSolowParams, n: 0.03 },
  },
  technologicalProgress: {
    name: 'Progreso Tecnológico',
    description: 'Mayor productividad (A = 1.5)',
    params: { ...defaultSolowParams, A: 1.5 },
  },
  convergence: {
    name: 'Convergencia',
    description: 'Economía pobre convergiendo (k0 = 0.5)',
    params: { ...defaultSolowParams, k0: 0.5 },
  },
}
