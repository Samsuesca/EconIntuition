// Modelo de Estructuras de Mercado - Comparación entre Competencia, Monopolio y Oligopolio

import { Point2D, generateCurvePoints } from "./shared";

export interface MarketStructureParams {
  // Demanda inversa: P = a - bQ
  a: number; // Intercepto demanda (precio máximo)
  b: number; // Pendiente demanda (sensibilidad)

  // Costos: C(q) = c*q + F
  c: number; // Costo marginal (constante)
  F: number; // Costo fijo

  // Oligopolio
  n: number; // Número de firmas (para Cournot)
}

export interface MarketStructureResults {
  // Competencia Perfecta
  perfectCompetition: {
    P: number;
    Q: number;
    q: number; // Producción por firma
    profit: number; // Beneficio por firma
    numFirms: number; // Número de firmas
    consumerSurplus: number;
    producerSurplus: number;
    totalSurplus: number;
  };

  // Monopolio
  monopoly: {
    P: number;
    Q: number;
    profit: number;
    consumerSurplus: number;
    producerSurplus: number;
    totalSurplus: number;
    deadweightLoss: number;
    lernerIndex: number; // (P - CMg)/P
    markup: number; // P/CMg
  };

  // Oligopolio (Cournot)
  cournot: {
    P: number;
    Q: number; // Cantidad total
    q: number; // Cantidad por firma
    profit: number; // Beneficio por firma
    totalProfit: number; // Beneficio total del mercado
    consumerSurplus: number;
    producerSurplus: number;
    totalSurplus: number;
    deadweightLoss: number;
    lernerIndex: number;
  };

  // Comparación
  comparison: {
    priceRatio_M_PC: number; // P_monopolio / P_competencia
    quantityRatio_M_PC: number; // Q_monopolio / Q_competencia
    welfareRatio_M_PC: number; // Welfare_monopolio / Welfare_competencia
  };
}

export const defaultMarketStructureParams: MarketStructureParams = {
  a: 100,
  b: 1,
  c: 20,
  F: 100,
  n: 2,
};

// ============= COMPETENCIA PERFECTA =============

/**
 * En competencia perfecta:
 * - P = CMg (condición de maximización)
 * - Beneficio económico = 0 en largo plazo
 * - Cada firma es precio-aceptante
 */
export function solvePerfectCompetition(params: MarketStructureParams) {
  const { a, b, c, F } = params;

  // Equilibrio: P = CMg = c
  const P = c;
  const Q = (a - P) / b;

  // En largo plazo, beneficio = 0, entonces P*q - c*q - F = 0
  // Como P = c, necesitamos F = 0 para beneficio cero
  // Asumimos libre entrada hasta que beneficio = 0
  const profit = 0;

  // Estimamos número de firmas asumiendo cada una produce q donde AC es mínimo
  // Para costos lineales con fijo: AC = c + F/q, mínimo cuando F/q es pequeño
  // En equilibrio P = AC mínimo = c cuando F → 0 o hay muchas firmas pequeñas
  const q = Math.sqrt(F / b) || Q / 100; // Producción óptima por firma
  const numFirms = q > 0 ? Math.ceil(Q / q) : 100;

  // Excedentes
  const consumerSurplus = 0.5 * Q * (a - P);
  const producerSurplus = 0; // En equilibrio de largo plazo
  const totalSurplus = consumerSurplus + producerSurplus;

  return {
    P,
    Q,
    q,
    profit,
    numFirms,
    consumerSurplus,
    producerSurplus,
    totalSurplus,
  };
}

// ============= MONOPOLIO =============

/**
 * Monopolio maximiza beneficios donde IMg = CMg
 * Demanda: P = a - bQ
 * Ingreso Total: IT = P*Q = aQ - bQ²
 * Ingreso Marginal: IMg = a - 2bQ
 * Condición: IMg = CMg → a - 2bQ = c → Q = (a - c)/(2b)
 */
export function solveMonopoly(params: MarketStructureParams) {
  const { a, b, c, F } = params;

  // Equilibrio: IMg = CMg
  const Q = (a - c) / (2 * b);
  const P = a - b * Q;

  // Beneficios
  const revenue = P * Q;
  const cost = c * Q + F;
  const profit = revenue - cost;

  // Excedentes
  const consumerSurplus = 0.5 * Q * (a - P);
  const producerSurplus = profit + F; // Incluye beneficio + costos fijos recuperados
  const totalSurplus = consumerSurplus + producerSurplus;

  // Comparar con competencia perfecta para deadweight loss
  const Q_competitive = (a - c) / b;
  const P_competitive = c;
  const totalSurplus_competitive = 0.5 * Q_competitive * (a - P_competitive);
  const deadweightLoss = totalSurplus_competitive - totalSurplus;

  // Índice de Lerner: L = (P - CMg)/P = 1/|ε|
  // Con demanda lineal en equilibrio de monopolio
  const lernerIndex = (P - c) / P;
  const markup = P / c;

  return {
    P,
    Q,
    profit,
    consumerSurplus,
    producerSurplus,
    totalSurplus,
    deadweightLoss,
    lernerIndex,
    markup,
  };
}

// ============= OLIGOPOLIO DE COURNOT =============

/**
 * Modelo de Cournot con n firmas simétricas
 * Cada firma elige cantidad qi maximizando beneficio dado qj de las demás
 *
 * Función de reacción de firma i:
 * max πi = P(Q)*qi - C(qi)
 * P = a - b*Q = a - b*(qi + Q-i)
 * πi = [a - b*(qi + Q-i)]*qi - c*qi - F
 *
 * CPO: ∂πi/∂qi = a - b*Q-i - 2b*qi - c = 0
 * Función de reacción: qi = (a - c - b*Q-i)/(2b)
 *
 * En equilibrio simétrico: qi = qj para todo i,j
 * Q-i = (n-1)*q
 * q = (a - c - b*(n-1)*q)/(2b)
 * 2b*q = a - c - b*(n-1)*q
 * q*[2b + b*(n-1)] = a - c
 * q = (a - c) / [b*(n+1)]
 * Q = n*q = n*(a - c) / [b*(n+1)]
 */
export function solveCournot(params: MarketStructureParams) {
  const { a, b, c, F, n } = params;

  // Equilibrio de Nash-Cournot
  const q = (a - c) / (b * (n + 1));
  const Q = n * q;
  const P = a - b * Q;

  // Beneficios
  const revenue_per_firm = P * q;
  const cost_per_firm = c * q + F;
  const profit = revenue_per_firm - cost_per_firm;
  const totalProfit = n * profit;

  // Excedentes
  const consumerSurplus = 0.5 * Q * (a - P);
  const producerSurplus = totalProfit + n * F;
  const totalSurplus = consumerSurplus + producerSurplus;

  // Deadweight loss comparado con competencia perfecta
  const Q_competitive = (a - c) / b;
  const P_competitive = c;
  const totalSurplus_competitive = 0.5 * Q_competitive * (a - P_competitive);
  const deadweightLoss = totalSurplus_competitive - totalSurplus;

  // Índice de Lerner
  const lernerIndex = (P - c) / P;

  return {
    P,
    Q,
    q,
    profit,
    totalProfit,
    consumerSurplus,
    producerSurplus,
    totalSurplus,
    deadweightLoss,
    lernerIndex,
  };
}

// ============= RESOLVER TODAS LAS ESTRUCTURAS =============

export function solveMarketStructures(
  params: MarketStructureParams,
): MarketStructureResults {
  const perfectCompetition = solvePerfectCompetition(params);
  const monopoly = solveMonopoly(params);
  const cournot = solveCournot(params);

  // Comparaciones
  const priceRatio_M_PC = monopoly.P / perfectCompetition.P;
  const quantityRatio_M_PC = monopoly.Q / perfectCompetition.Q;
  const welfareRatio_M_PC =
    monopoly.totalSurplus / perfectCompetition.totalSurplus;

  return {
    perfectCompetition,
    monopoly,
    cournot,
    comparison: {
      priceRatio_M_PC,
      quantityRatio_M_PC,
      welfareRatio_M_PC,
    },
  };
}

// ============= FUNCIONES PARA GRÁFICOS =============

/**
 * Curva de demanda inversa: P = a - bQ
 */
export function generateDemandCurve(params: MarketStructureParams): Point2D[] {
  const { a, b } = params;
  const Q_max = a / b;

  return generateCurvePoints(
    (Q) => a - b * Q,
    [0, Q_max],
    100,
    (p) => p.y >= 0,
  );
}

/**
 * Curva de ingreso marginal: IMg = a - 2bQ
 */
export function generateMarginalRevenueCurve(
  params: MarketStructureParams,
): Point2D[] {
  const { a, b } = params;
  const Q_max = a / (2 * b);

  return generateCurvePoints(
    (Q) => a - 2 * b * Q,
    [0, Q_max],
    100,
    (p) => p.y >= 0,
  );
}

/**
 * Curva de costo marginal (horizontal en c)
 */
export function generateMarginalCostCurve(
  params: MarketStructureParams,
  Q_max: number,
): Point2D[] {
  const { c } = params;
  return [
    { x: 0, y: c },
    { x: Q_max, y: c },
  ];
}

/**
 * Función de reacción de Cournot para firma 1 dado q2
 * R1(q2) = (a - c - b*q2) / (2b)
 */
export function generateReactionFunction(
  params: MarketStructureParams,
  q_other_max: number,
): Point2D[] {
  const { a, b, c } = params;

  return generateCurvePoints(
    (q_other) => Math.max(0, (a - c - b * q_other) / (2 * b)),
    [0, q_other_max],
    50,
    (p) => p.y >= 0,
  ).map((p) => ({ x: p.x, y: p.y }));
}

// ============= ESCENARIOS PREDEFINIDOS =============

export const marketStructureScenarios = {
  baseline: {
    name: "Caso Base",
    description: "Mercado estándar con costos moderados",
    params: defaultMarketStructureParams,
  },
  highCosts: {
    name: "Costos Altos",
    description: "Industria con barreras de entrada (altos costos fijos)",
    params: { ...defaultMarketStructureParams, F: 500, c: 30 },
  },
  lowCosts: {
    name: "Costos Bajos",
    description: "Industria competitiva con bajos costos",
    params: { ...defaultMarketStructureParams, F: 10, c: 10 },
  },
  inelasticDemand: {
    name: "Demanda Inelástica",
    description: "Bien necesario (baja sensibilidad al precio)",
    params: { ...defaultMarketStructureParams, b: 0.5 },
  },
  elasticDemand: {
    name: "Demanda Elástica",
    description: "Bien de lujo (alta sensibilidad al precio)",
    params: { ...defaultMarketStructureParams, b: 2 },
  },
  duopoly: {
    name: "Duopolio",
    description: "Dos firmas compitiendo a la Cournot",
    params: { ...defaultMarketStructureParams, n: 2 },
  },
  triopoly: {
    name: "Triopolio",
    description: "Tres firmas compitiendo a la Cournot",
    params: { ...defaultMarketStructureParams, n: 3 },
  },
  manyFirms: {
    name: "Oligopolio (5 firmas)",
    description: "Convergencia hacia competencia perfecta",
    params: { ...defaultMarketStructureParams, n: 5 },
  },
};

// ============= VALIDACIÓN =============

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateMarketStructureParams(
  params: MarketStructureParams,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validaciones básicas
  if (params.a <= 0)
    errors.push("El intercepto de demanda (a) debe ser positivo");
  if (params.b <= 0)
    errors.push("La pendiente de demanda (b) debe ser positiva");
  if (params.c < 0) errors.push("El costo marginal (c) no puede ser negativo");
  if (params.F < 0) errors.push("El costo fijo (F) no puede ser negativo");
  if (params.n < 1) errors.push("El número de firmas debe ser al menos 1");
  if (!Number.isInteger(params.n))
    errors.push("El número de firmas debe ser entero");

  // Validar que haya demanda al costo marginal
  if (params.c >= params.a) {
    errors.push("Costo marginal muy alto: no hay demanda rentable (c >= a)");
  }

  // Advertencias
  if (params.F === 0) {
    warnings.push("Costo fijo = 0: no hay barreras de entrada");
  }

  if (params.n > 10) {
    warnings.push(
      "Con muchas firmas, el oligopolio converge a competencia perfecta",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
