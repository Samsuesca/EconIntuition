// Modelo AS-AD - Oferta y Demanda Agregada

import { Point2D, generateCurvePoints, solveLinearSystem2x2 } from './shared'

export interface ASADParams {
  // Demanda Agregada (DA)
  // Y = C + I + G + NX
  C0: number      // Consumo autónomo
  c: number       // Propensión marginal al consumo
  I0: number      // Inversión autónoma
  b: number       // Sensibilidad inversión a tasa de interés
  G: number       // Gasto público
  T: number       // Impuestos
  NX0: number     // Exportaciones netas autónomas

  // Política monetaria
  M: number       // Oferta monetaria
  k: number       // Sensibilidad demanda de dinero a Y
  h: number       // Sensibilidad demanda de dinero a i

  // Oferta Agregada
  Yn: number      // Producto natural (potencial)
  P_e: number     // Expectativas de precios
  theta: number   // Sensibilidad de precios a brecha de producto

  // Tipo de curva AS
  asType: 'short-run' | 'long-run' | 'keynesian'

  // Nivel de precios actual (para análisis)
  P: number
}

export interface ASADResults {
  // Equilibrio
  Y_eq: number        // Producto de equilibrio
  P_eq: number        // Nivel de precios de equilibrio
  i_eq: number        // Tasa de interés de equilibrio

  // Componentes
  C: number           // Consumo
  I: number           // Inversión
  outputGap: number   // Brecha de producto (Y - Yn)

  // Análisis
  isInflationary: boolean   // ¿Brecha inflacionaria?
  isRecessionary: boolean   // ¿Brecha recesionaria?
}

export const defaultASADParams: ASADParams = {
  C0: 100,
  c: 0.8,
  I0: 200,
  b: 50,
  G: 300,
  T: 200,
  NX0: 0,
  M: 1000,
  k: 0.5,
  h: 100,
  Yn: 2500,
  P_e: 1,
  theta: 0.5,
  asType: 'short-run',
  P: 1,
}

// Curva de Demanda Agregada
// Derivada del modelo IS-LM: Y = f(P)
// A medida que P sube, M/P baja, LM se desplaza izquierda, Y baja
export function aggregateDemand(params: ASADParams): (P: number) => number {
  const { C0, c, I0, b, G, T, NX0, M, k, h } = params

  // Gasto autónomo
  const A = C0 + I0 + G + NX0 - c * T

  // Multiplicador del IS-LM
  // Y = [α*A + (b*α/h)*(M/P)] / [1 + (b*α*k/h)]
  // donde α = 1/(1-c)
  const alpha = 1 / (1 - c)
  const denominator = 1 + (b * alpha * k) / h

  return (P: number) => {
    const M_P = M / P
    return (alpha * A + (b * alpha / h) * M_P) / denominator
  }
}

// Curva de Oferta Agregada de Corto Plazo (SRAS)
// P = P_e + θ(Y - Yn)
// Despejando Y: Y = Yn + (P - P_e)/θ
export function shortRunAggregateSupply(params: ASADParams): (P: number) => number {
  const { Yn, P_e, theta } = params
  return (P: number) => Yn + (P - P_e) / theta
}

// Curva de Oferta Agregada de Largo Plazo (LRAS)
// Y = Yn (vertical)
export function longRunAggregateSupply(params: ASADParams): (P: number) => number {
  const { Yn } = params
  return (_P: number) => Yn
}

// Curva de Oferta Agregada Keynesiana (horizontal hasta Yn)
export function keynesianAggregateSupply(params: ASADParams): (P: number) => number {
  const { Yn, P_e } = params
  return (P: number) => P <= P_e ? Infinity : Yn
}

// Resolver equilibrio AS-AD
export function solveASAD(params: ASADParams): ASADResults {
  const { asType, Yn, P_e, theta, c, T, b } = params

  const AD = aggregateDemand(params)

  let Y_eq: number
  let P_eq: number

  switch (asType) {
    case 'long-run':
      // En largo plazo, Y = Yn, encontrar P que equilibra AD
      Y_eq = Yn
      // Resolver AD(P) = Yn numéricamente
      P_eq = findPriceForOutput(params, Yn)
      break

    case 'keynesian':
      // Precios fijos en P_e, Y determinado por AD
      P_eq = P_e
      Y_eq = AD(P_eq)
      break

    case 'short-run':
    default:
      // Intersección de AD y SRAS
      // AD: Y = f(P)
      // SRAS: P = P_e + θ(Y - Yn)
      // Resolver numéricamente
      const solution = findASADEquilibrium(params)
      Y_eq = solution.Y
      P_eq = solution.P
  }

  // Calcular tasa de interés de equilibrio (del LM)
  const { M, k, h } = params
  const M_P = M / P_eq
  const i_eq = (k * Y_eq - M_P) / h

  // Componentes
  const { C0, I0 } = params
  const C = C0 + c * (Y_eq - T)
  const I = I0 - b * i_eq

  const outputGap = Y_eq - Yn

  return {
    Y_eq,
    P_eq,
    i_eq,
    C,
    I,
    outputGap,
    isInflationary: outputGap > 0,
    isRecessionary: outputGap < 0,
  }
}

// Encontrar P dado Y en la curva AD
function findPriceForOutput(params: ASADParams, Y_target: number): number {
  const AD = aggregateDemand(params)
  let P_low = 0.1
  let P_high = 10

  // Bisección
  for (let i = 0; i < 50; i++) {
    const P_mid = (P_low + P_high) / 2
    const Y_mid = AD(P_mid)

    if (Math.abs(Y_mid - Y_target) < 0.01) {
      return P_mid
    }

    if (Y_mid > Y_target) {
      P_low = P_mid
    } else {
      P_high = P_mid
    }
  }

  return (P_low + P_high) / 2
}

// Encontrar equilibrio AS-AD
function findASADEquilibrium(params: ASADParams): { Y: number; P: number } {
  const AD = aggregateDemand(params)
  const SRAS = shortRunAggregateSupply(params)

  // Iterar para encontrar donde AD(P) = SRAS(P)
  let P = params.P_e
  for (let i = 0; i < 100; i++) {
    const Y_ad = AD(P)
    const Y_sras = SRAS(P)

    if (Math.abs(Y_ad - Y_sras) < 0.1) {
      return { Y: Y_ad, P }
    }

    // Ajustar P basado en exceso de demanda
    const excess = Y_ad - Y_sras
    P = P + 0.01 * excess / params.Yn
  }

  return { Y: AD(P), P }
}

// Generar curvas para gráfico
export function generateADCurve(
  params: ASADParams,
  priceRange?: [number, number]
): Point2D[] {
  const range = priceRange || [0.5, 2]
  const AD = aggregateDemand(params)

  return generateCurvePoints(AD, range, 100)
    .map(p => ({ x: p.y, y: p.x })) // x=Y, y=P
}

export function generateSRASCurve(
  params: ASADParams,
  outputRange?: [number, number]
): Point2D[] {
  const { Yn, P_e, theta } = params
  const range = outputRange || [Yn * 0.8, Yn * 1.2]

  // SRAS: P = P_e + θ(Y - Yn)
  return generateCurvePoints(
    (Y) => P_e + theta * (Y - Yn),
    range,
    100
  ).map(p => ({ x: p.x, y: p.y }))
}

export function generateLRASCurve(
  params: ASADParams,
  priceRange?: [number, number]
): Point2D[] {
  const { Yn } = params
  const range = priceRange || [0.5, 2]

  return [
    { x: Yn, y: range[0] },
    { x: Yn, y: range[1] },
  ]
}

// Escenarios
export const asadScenarios = {
  baseline: {
    name: 'Equilibrio Base',
    description: 'Economía en equilibrio de corto plazo',
    params: defaultASADParams,
  },
  demandShock: {
    name: 'Shock de Demanda (+)',
    description: 'Expansión fiscal (ΔG = +100)',
    params: { ...defaultASADParams, G: 400 },
  },
  supplyShock: {
    name: 'Shock de Oferta (-)',
    description: 'Aumento de costos (θ mayor)',
    params: { ...defaultASADParams, theta: 1.0 },
  },
  monetaryExpansion: {
    name: 'Expansión Monetaria',
    description: 'Aumento de M (ΔM = +500)',
    params: { ...defaultASADParams, M: 1500 },
  },
  stagflation: {
    name: 'Estanflación',
    description: 'Shock de oferta negativo',
    params: { ...defaultASADParams, P_e: 1.2, Yn: 2200 },
  },
  longRun: {
    name: 'Largo Plazo',
    description: 'Equilibrio de largo plazo',
    params: { ...defaultASADParams, asType: 'long-run' as const },
  },
}
