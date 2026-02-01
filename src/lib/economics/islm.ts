// Lógica matemática del modelo IS-LM
// IS: Mercado de Bienes | LM: Mercado de Dinero

export interface ISLMParams {
  // Mercado de Dinero (LM)
  M: number      // Oferta monetaria
  P: number      // Nivel de precios
  k: number      // Sensibilidad de demanda de dinero a la renta
  h: number      // Sensibilidad de demanda de dinero al interés

  // Mercado de Bienes (IS)
  c: number      // Propensión marginal al consumo (0-1)
  t: number      // Tasa impositiva (0-1)
  b: number      // Sensibilidad de inversión al interés

  // Componentes autónomos
  Ca: number     // Consumo autónomo
  Ia: number     // Inversión autónoma
  Ta: number     // Impuestos autónomos
  Tr: number     // Transferencias
  G: number      // Gasto público
  NX: number     // Exportaciones netas
}

export interface ISLMResults {
  Y_star: number        // Producto de equilibrio
  i_star: number        // Tasa de interés de equilibrio
  A: number             // Demanda agregada autónoma
  M_P: number           // Oferta monetaria real
  C: number             // Consumo total
  I: number             // Inversión total
  multiplier: number    // Multiplicador fiscal
}

export interface ISLMCurvePoint {
  Y: number
  i: number
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

// Valores por defecto del modelo
export const defaultParams: ISLMParams = {
  M: 1000,
  P: 1,
  k: 0.5,
  h: 100,
  c: 0.8,
  t: 0.2,
  b: 50,
  Ca: 100,
  Ia: 200,
  Ta: 0,
  Tr: 0,
  G: 300,
  NX: 0,
}

// Validar parámetros del modelo
export function validateParams(params: ISLMParams): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validaciones críticas
  if (params.P === 0) {
    errors.push('El nivel de precios (P) no puede ser cero')
  }
  if (params.k === 0) {
    errors.push('La sensibilidad a la renta (k) no puede ser cero')
  }
  if (params.h === 0) {
    warnings.push('h = 0: Curva LM vertical (caso clásico)')
  }

  // Validaciones de rango
  if (params.c < 0 || params.c >= 1) {
    errors.push(`Propensión al consumo (c=${params.c}) debe estar entre 0 y 1`)
  }
  if (params.t < 0 || params.t >= 1) {
    errors.push(`Tasa impositiva (t=${params.t}) debe estar entre 0 y 1`)
  }

  // Estabilidad del multiplicador
  const denominator = 1 - params.c * (1 - params.t)
  if (Math.abs(denominator) < 0.01) {
    warnings.push('Multiplicador fiscal muy alto (modelo inestable)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// Calcular equilibrio IS-LM
export function solveISLM(params: ISLMParams): ISLMResults {
  const { M, P, k, h, c, t, b, Ca, Ia, Ta, Tr, G, NX } = params

  // Oferta monetaria real
  const M_P = M / P

  // Demanda agregada autónoma: A = Ca + Ia + G + NX + c(Tr - Ta)
  const A = Ca + Ia + G + NX + c * (Tr - Ta)

  // Multiplicador fiscal: α = 1 / (1 - c(1-t))
  const multiplier = 1 / (1 - c * (1 - t))

  // Sistema de ecuaciones:
  // IS: Y = α(A - bi)
  // LM: M/P = kY - hi  =>  Y = (M/P)/k + (h/k)i

  // Resolviendo el sistema matricial:
  // [k    -h  ] [Y]   [M/P]
  // [1-c(1-t) b] [i] = [A  ]

  const det = k * b + h * (1 - c * (1 - t))

  // Producto de equilibrio
  const Y_star = (b * M_P + h * A) / det

  // Tasa de interés de equilibrio
  const i_star = (k * A - (1 - c * (1 - t)) * M_P) / det

  // Componentes en equilibrio
  const C = Ca + c * (1 - t) * Y_star + c * (Tr - Ta)
  const I = Ia - b * i_star

  return {
    Y_star,
    i_star,
    A,
    M_P,
    C,
    I,
    multiplier,
  }
}

// Generar puntos de la curva IS
export function generateISCurve(
  params: ISLMParams,
  iRange: [number, number] = [0, 15],
  points: number = 100
): ISLMCurvePoint[] {
  const { c, t, b, Ca, Ia, Ta, Tr, G, NX } = params

  const A = Ca + Ia + G + NX + c * (Tr - Ta)
  const multiplier = 1 / (1 - c * (1 - t))

  const curve: ISLMCurvePoint[] = []
  const step = (iRange[1] - iRange[0]) / points

  for (let i = iRange[0]; i <= iRange[1]; i += step) {
    const Y = multiplier * (A - b * i)
    if (Y > 0) {
      curve.push({ Y, i })
    }
  }

  return curve
}

// Generar puntos de la curva LM
export function generateLMCurve(
  params: ISLMParams,
  YRange: [number, number] = [0, 5000],
  points: number = 100
): ISLMCurvePoint[] {
  const { M, P, k, h } = params

  const M_P = M / P
  const curve: ISLMCurvePoint[] = []
  const step = (YRange[1] - YRange[0]) / points

  for (let Y = YRange[0]; Y <= YRange[1]; Y += step) {
    // LM: M/P = kY - hi  =>  i = (kY - M/P) / h
    const i = (k * Y - M_P) / h
    if (i >= 0) {
      curve.push({ Y, i })
    }
  }

  return curve
}

// Calcular nuevo equilibrio con desplazamiento
export function solveWithShift(
  baseParams: ISLMParams,
  deltas: Partial<ISLMParams>
): { base: ISLMResults; shifted: ISLMResults; deltaY: number; deltaI: number } {
  const base = solveISLM(baseParams)

  const shiftedParams: ISLMParams = {
    ...baseParams,
    ...Object.fromEntries(
      Object.entries(deltas).map(([key, value]) => [
        key,
        (baseParams[key as keyof ISLMParams] as number) + (value as number),
      ])
    ),
  } as ISLMParams

  const shifted = solveISLM(shiftedParams)

  return {
    base,
    shifted,
    deltaY: shifted.Y_star - base.Y_star,
    deltaI: shifted.i_star - base.i_star,
  }
}

// Escenarios predefinidos para demostración
export const presetScenarios = {
  baseline: {
    name: 'Caso Base',
    description: 'Economía en equilibrio estándar',
    params: defaultParams,
  },
  fiscalExpansion: {
    name: 'Expansión Fiscal',
    description: 'Aumento del gasto público (ΔG = +200)',
    params: { ...defaultParams, G: 500 },
  },
  monetaryExpansion: {
    name: 'Expansión Monetaria',
    description: 'Aumento de la oferta monetaria (ΔM = +500)',
    params: { ...defaultParams, M: 1500 },
  },
  liquidityTrap: {
    name: 'Trampa de Liquidez',
    description: 'Alta sensibilidad al interés (h muy alto)',
    params: { ...defaultParams, h: 1000 },
  },
  classicalCase: {
    name: 'Caso Clásico',
    description: 'LM vertical (h → 0)',
    params: { ...defaultParams, h: 1 },
  },
}
