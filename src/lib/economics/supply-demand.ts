// Modelo de Oferta y Demanda - Equilibrio de Mercado

import { Point2D, generateCurvePoints, solveLinearSystem2x2 } from './shared'

export interface SupplyDemandParams {
  // Demanda: Qd = a - bP
  a: number       // Intercepto demanda (cantidad máxima)
  b: number       // Pendiente demanda (sensibilidad al precio)

  // Oferta: Qs = c + dP
  c: number       // Intercepto oferta (cantidad mínima)
  d: number       // Pendiente oferta (sensibilidad al precio)

  // Shocks
  demandShift: number   // Desplazamiento demanda
  supplyShift: number   // Desplazamiento oferta

  // Intervenciones
  priceFloor: number | null    // Precio mínimo
  priceCeiling: number | null  // Precio máximo
  tax: number                   // Impuesto por unidad
}

export interface SupplyDemandResults {
  P_eq: number              // Precio de equilibrio
  Q_eq: number              // Cantidad de equilibrio
  consumerSurplus: number   // Excedente del consumidor
  producerSurplus: number   // Excedente del productor
  totalSurplus: number      // Excedente total
  demandElasticity: number  // Elasticidad precio de demanda
  supplyElasticity: number  // Elasticidad precio de oferta
  // Con intervenciones
  deadweightLoss?: number   // Pérdida de eficiencia
  shortage?: number         // Escasez (si price ceiling)
  surplus?: number          // Excedente (si price floor)
}

export const defaultSupplyDemandParams: SupplyDemandParams = {
  a: 100,
  b: 2,
  c: 0,
  d: 1,
  demandShift: 0,
  supplyShift: 0,
  priceFloor: null,
  priceCeiling: null,
  tax: 0,
}

// Funciones de demanda y oferta
export function demandFunction(params: SupplyDemandParams): (P: number) => number {
  const { a, b, demandShift } = params
  return (P: number) => Math.max(0, (a + demandShift) - b * P)
}

export function supplyFunction(params: SupplyDemandParams): (P: number) => number {
  const { c, d, supplyShift, tax } = params
  return (P: number) => Math.max(0, (c + supplyShift) + d * (P - tax))
}

// Inversas (P en función de Q)
export function inverseDemand(params: SupplyDemandParams): (Q: number) => number {
  const { a, b, demandShift } = params
  return (Q: number) => ((a + demandShift) - Q) / b
}

export function inverseSupply(params: SupplyDemandParams): (Q: number) => number {
  const { c, d, supplyShift, tax } = params
  return (Q: number) => (Q - (c + supplyShift)) / d + tax
}

// Resolver equilibrio
export function solveEquilibrium(params: SupplyDemandParams): SupplyDemandResults {
  const { a, b, c, d, demandShift, supplyShift, tax, priceFloor, priceCeiling } = params

  // Equilibrio: Qd = Qs
  // a + shift_d - b*P = c + shift_s + d*(P - tax)
  // (a + shift_d - c - shift_s + d*tax) = (b + d)*P
  const numerator = (a + demandShift) - (c + supplyShift) + d * tax
  const denominator = b + d

  let P_eq = numerator / denominator
  let Q_eq = demandFunction(params)(P_eq)

  // Precio máximo que consumidores pagarían (P cuando Qd = 0)
  const P_max = (a + demandShift) / b

  // Precio mínimo que productores aceptarían (P cuando Qs = 0)
  const P_min = tax - (c + supplyShift) / d

  // Excedentes (áreas de triángulos)
  const consumerSurplus = 0.5 * Q_eq * (P_max - P_eq)
  const producerSurplus = 0.5 * Q_eq * (P_eq - tax - Math.max(0, P_min))
  const totalSurplus = consumerSurplus + producerSurplus

  // Elasticidades en el punto de equilibrio
  const demandElasticity = -b * (P_eq / Q_eq)
  const supplyElasticity = d * (P_eq / Q_eq)

  const results: SupplyDemandResults = {
    P_eq,
    Q_eq,
    consumerSurplus,
    producerSurplus,
    totalSurplus,
    demandElasticity,
    supplyElasticity,
  }

  // Analizar intervenciones
  if (priceCeiling !== null && priceCeiling < P_eq) {
    const Qd_ceiling = demandFunction(params)(priceCeiling)
    const Qs_ceiling = supplyFunction(params)(priceCeiling)
    results.shortage = Qd_ceiling - Qs_ceiling
    results.deadweightLoss = 0.5 * (P_eq - priceCeiling) * (Q_eq - Qs_ceiling)
  }

  if (priceFloor !== null && priceFloor > P_eq) {
    const Qd_floor = demandFunction(params)(priceFloor)
    const Qs_floor = supplyFunction(params)(priceFloor)
    results.surplus = Qs_floor - Qd_floor
    results.deadweightLoss = 0.5 * (priceFloor - P_eq) * (Q_eq - Qd_floor)
  }

  return results
}

// Generar curvas para gráfico
export function generateDemandCurve(
  params: SupplyDemandParams,
  priceRange?: [number, number]
): Point2D[] {
  const P_max = (params.a + params.demandShift) / params.b
  const range = priceRange || [0, P_max * 1.1]

  return generateCurvePoints(
    (P) => demandFunction(params)(P),
    range,
    100,
    (p) => p.y >= 0
  ).map(p => ({ x: p.y, y: p.x })) // Invertir para gráfico estándar (Q en x, P en y)
}

export function generateSupplyCurve(
  params: SupplyDemandParams,
  priceRange?: [number, number]
): Point2D[] {
  const results = solveEquilibrium(params)
  const range = priceRange || [0, results.P_eq * 2]

  return generateCurvePoints(
    (P) => supplyFunction(params)(P),
    range,
    100,
    (p) => p.y >= 0 && p.x >= 0
  ).map(p => ({ x: p.y, y: p.x }))
}

// Escenarios predefinidos
export const supplyDemandScenarios = {
  baseline: {
    name: 'Mercado Base',
    description: 'Equilibrio competitivo estándar',
    params: defaultSupplyDemandParams,
  },
  inelasticDemand: {
    name: 'Demanda Inelástica',
    description: 'Bien necesario (baja sensibilidad al precio)',
    params: { ...defaultSupplyDemandParams, b: 0.5 },
  },
  elasticDemand: {
    name: 'Demanda Elástica',
    description: 'Bien de lujo (alta sensibilidad al precio)',
    params: { ...defaultSupplyDemandParams, b: 5 },
  },
  demandIncrease: {
    name: 'Aumento de Demanda',
    description: 'Cambio en preferencias o ingreso',
    params: { ...defaultSupplyDemandParams, demandShift: 30 },
  },
  supplyShock: {
    name: 'Shock de Oferta',
    description: 'Aumento de costos de producción',
    params: { ...defaultSupplyDemandParams, supplyShift: -20 },
  },
  withTax: {
    name: 'Con Impuesto',
    description: 'Impuesto de $5 por unidad',
    params: { ...defaultSupplyDemandParams, tax: 5 },
  },
  priceFloor: {
    name: 'Salario Mínimo',
    description: 'Precio mínimo por encima del equilibrio',
    params: { ...defaultSupplyDemandParams, priceFloor: 40 },
  },
  priceCeiling: {
    name: 'Control de Precios',
    description: 'Precio máximo por debajo del equilibrio',
    params: { ...defaultSupplyDemandParams, priceCeiling: 25 },
  },
}
