// Lógica matemática del modelo de la Curva de Phillips
// Relación entre inflación y desempleo en el corto y largo plazo

export type ExpectationsType = "adaptive" | "anchored" | "rational";

export interface PhillipsParams {
  // Parámetros estructurales
  u_n: number; // Tasa natural de desempleo (NAIRU) [0-1]
  alpha: number; // Sensibilidad de inflación al desempleo
  beta: number; // Coeficiente de Okun (para relación desempleo-producto)

  // Variables de política y expectativas
  pi_e: number; // Inflación esperada
  expectations: ExpectationsType; // Tipo de expectativas
  epsilon: number; // Shock de oferta (% inflación)

  // Variables actuales
  u: number; // Tasa de desempleo actual [0-1]

  // Contexto histórico (para expectativas adaptativas)
  pi_prev: number; // Inflación período anterior

  // Parámetros de ancla de expectativas
  pi_target: number; // Meta de inflación del Banco Central
  credibility: number; // Credibilidad del BC [0-1]
}

export interface PhillipsResults {
  pi: number; // Inflación actual
  pi_e: number; // Inflación esperada (calculada)
  u: number; // Desempleo actual
  u_n: number; // NAIRU
  gap_u: number; // Brecha de desempleo (u - u_n)
  gap_y: number; // Brecha de producto (según Okun)
  sacrifice_ratio: number; // Ratio de sacrificio
  is_long_run: boolean; // ¿Está en equilibrio de largo plazo?
}

export interface PhillipsCurvePoint {
  u: number; // Desempleo
  pi: number; // Inflación
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Valores por defecto del modelo
export const defaultParams: PhillipsParams = {
  u_n: 0.05, // 5% tasa natural
  alpha: 0.5, // Sensibilidad moderada
  beta: 2, // Coeficiente de Okun estándar
  pi_e: 0.02, // 2% expectativas
  expectations: "adaptive",
  epsilon: 0, // Sin shocks
  u: 0.05, // En NAIRU inicialmente
  pi_prev: 0.02, // 2% inflación previa
  pi_target: 0.02, // Meta de 2%
  credibility: 0.8, // Alta credibilidad
};

// Validar parámetros del modelo
export function validateParams(params: PhillipsParams): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validaciones de rango
  if (params.u_n < 0 || params.u_n > 0.25) {
    errors.push(`NAIRU (u_n=${params.u_n}) debe estar entre 0 y 0.25`);
  }
  if (params.u < 0 || params.u > 0.3) {
    errors.push(`Desempleo actual (u=${params.u}) debe estar entre 0 y 0.3`);
  }
  if (params.alpha <= 0) {
    errors.push("Alpha debe ser positivo");
  }
  if (params.beta <= 0) {
    errors.push("Beta (coeficiente de Okun) debe ser positivo");
  }
  if (params.credibility < 0 || params.credibility > 1) {
    errors.push("Credibilidad debe estar entre 0 y 1");
  }

  // Warnings
  if (params.alpha > 2) {
    warnings.push("Alpha muy alto: inflación muy sensible al desempleo");
  }
  if (Math.abs(params.epsilon) > 0.1) {
    warnings.push("Shock de oferta significativo detectado");
  }
  if (params.u < params.u_n * 0.5) {
    warnings.push("Desempleo muy bajo: probable presión inflacionaria extrema");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Calcular inflación esperada según tipo de expectativas
export function calculateExpectedInflation(params: PhillipsParams): number {
  switch (params.expectations) {
    case "adaptive":
      // Expectativas adaptativas: π^e = π_{t-1}
      return params.pi_prev;

    case "anchored":
      // Expectativas ancladas: π^e = credibilidad * π_target + (1-credibilidad) * π_{t-1}
      return (
        params.credibility * params.pi_target +
        (1 - params.credibility) * params.pi_prev
      );

    case "rational":
      // Expectativas racionales: π^e = π_target (asumiendo que el BC es creíble)
      return params.pi_target;

    default:
      return params.pi_e;
  }
}

// Resolver el modelo de Phillips
export function solvePhillipsCurve(params: PhillipsParams): PhillipsResults {
  const { u_n, alpha, beta, u, epsilon } = params;

  // Calcular expectativas según el tipo
  const pi_e = calculateExpectedInflation(params);

  // Brecha de desempleo
  const gap_u = u - u_n;

  // Curva de Phillips aumentada por expectativas:
  // π = π^e - α(u - u_n) + ε
  const pi = pi_e - alpha * gap_u + epsilon;

  // Ley de Okun: (Y - Y*)/Y* = -β(u - u_n)
  const gap_y = -beta * gap_u;

  // Ratio de sacrificio: cuánto producto se pierde por 1pp de desinflación
  // sacrifice_ratio = 1 / (α * β)
  const sacrifice_ratio = 1 / (alpha * beta);

  // Equilibrio de largo plazo: u = u_n (con π^e = π)
  const is_long_run = Math.abs(gap_u) < 0.001;

  return {
    pi,
    pi_e,
    u,
    u_n,
    gap_u,
    gap_y,
    sacrifice_ratio,
    is_long_run,
  };
}

// Generar curva de Phillips de corto plazo (para un π^e dado)
export function generateShortRunCurve(
  params: PhillipsParams,
  pi_e: number,
  uRange: [number, number] = [0, 0.15],
  points: number = 100,
): PhillipsCurvePoint[] {
  const { alpha, epsilon } = params;
  const curve: PhillipsCurvePoint[] = [];
  const step = (uRange[1] - uRange[0]) / points;

  for (let u = uRange[0]; u <= uRange[1]; u += step) {
    // π = π^e - α(u - u_n) + ε
    const pi = pi_e - alpha * (u - params.u_n) + epsilon;
    curve.push({ u, pi });
  }

  return curve;
}

// Generar curva de Phillips de largo plazo (vertical en u_n)
export function generateLongRunCurve(
  u_n: number,
  piRange: [number, number] = [-0.05, 0.15],
): PhillipsCurvePoint[] {
  return [
    { u: u_n, pi: piRange[0] },
    { u: u_n, pi: piRange[1] },
  ];
}

// Calcular trayectoria de desinflación
export interface DisinflationPath {
  period: number;
  u: number;
  pi: number;
  pi_e: number;
  cumulative_loss: number; // Pérdida acumulada de producto
}

export function simulateDisinflation(
  initialParams: PhillipsParams,
  targetInflation: number,
  periods: number = 10,
): DisinflationPath[] {
  const path: DisinflationPath[] = [];
  let currentParams = { ...initialParams };
  let cumulativeLoss = 0;

  for (let t = 0; t <= periods; t++) {
    // Resolver modelo actual
    const results = solvePhillipsCurve(currentParams);

    // Acumular pérdida de producto
    cumulativeLoss += results.gap_y;

    path.push({
      period: t,
      u: results.u,
      pi: results.pi,
      pi_e: results.pi_e,
      cumulative_loss: cumulativeLoss,
    });

    // Si alcanzamos la meta, mantener equilibrio
    if (Math.abs(results.pi - targetInflation) < 0.001) {
      break;
    }

    // Actualizar para siguiente período
    // El BC ajusta desempleo para reducir inflación
    const desiredPiChange = targetInflation - results.pi;
    const requiredUChange = -desiredPiChange / currentParams.alpha;

    currentParams = {
      ...currentParams,
      u: Math.max(0, Math.min(0.15, currentParams.u + requiredUChange * 0.3)), // Ajuste gradual
      pi_prev: results.pi, // Actualizar expectativas
    };
  }

  return path;
}

// Escenarios predefinidos
export const presetScenarios = {
  baseline: {
    name: "Equilibrio de Corto Plazo",
    description: "Economía con desempleo por debajo del NAIRU",
    params: { ...defaultParams, u: 0.03 },
  },
  longRun: {
    name: "Equilibrio de Largo Plazo",
    description: "Economía en NAIRU (u = u_n)",
    params: { ...defaultParams, u: 0.05 },
  },
  expectationsShock: {
    name: "Shock de Expectativas",
    description: "Aumento de expectativas inflacionarias",
    params: { ...defaultParams, pi_prev: 0.06, u: 0.05 },
  },
  supplyShock: {
    name: "Shock de Oferta (Estanflación)",
    description: "Shock adverso de oferta (petróleo, etc)",
    params: { ...defaultParams, epsilon: 0.04, u: 0.08 },
  },
  disinflation: {
    name: "Desinflación Volcker",
    description: "Reducir inflación alta con costo en producto",
    params: {
      ...defaultParams,
      pi_prev: 0.1,
      u: 0.08,
      expectations: "adaptive",
    },
  },
  anchored: {
    name: "Expectativas Ancladas",
    description: "Alta credibilidad del Banco Central",
    params: {
      ...defaultParams,
      expectations: "anchored",
      credibility: 0.9,
      u: 0.04,
    },
  },
  unanchored: {
    name: "Expectativas Desancladas",
    description: "Baja credibilidad del BC",
    params: {
      ...defaultParams,
      expectations: "anchored",
      credibility: 0.2,
      pi_prev: 0.08,
      u: 0.06,
    },
  },
};
