// Lógica matemática del modelo de Teoría de la Firma
// Función de producción Cobb-Douglas, costos y minimización de costos

export interface FirmParams {
  // Función de producción: Q = A * L^α * K^β
  A: number; // Productividad total de factores
  alpha: number; // Elasticidad del trabajo (0-1)
  beta: number; // Elasticidad del capital (0-1)

  // Precios de factores
  w: number; // Salario (precio del trabajo)
  r: number; // Tasa de renta del capital

  // Costos
  CF: number; // Costo fijo

  // Restricciones de corto plazo
  K_fixed: number; // Capital fijo en el corto plazo

  // Nivel de producción objetivo (para isocuantas)
  Q_target: number; // Producción objetivo para análisis
}

export interface FirmResults {
  // Producción
  Q: number; // Producción total

  // Productos marginales
  MPL: number; // Producto marginal del trabajo
  MPK: number; // Producto marginal del capital

  // Productos medios
  APL: number; // Producto medio del trabajo
  APK: number; // Producto medio del capital

  // Costos
  CT: number; // Costo total
  CV: number; // Costo variable
  CMg: number; // Costo marginal
  CMe: number; // Costo medio
  CVMe: number; // Costo variable medio

  // Minimización de costos
  L_optimal: number; // Trabajo óptimo (minimización de costos)
  K_optimal: number; // Capital óptimo (minimización de costos)
  CT_min: number; // Costo total mínimo

  // Retornos a escala
  returnsToScale: number; // α + β (suma de elasticidades)
  returnsType: "crecientes" | "constantes" | "decrecientes";

  // TMST (Tasa Marginal de Sustitución Técnica)
  TMST: number; // MPL / MPK
}

export interface Point {
  x: number;
  y: number;
}

export interface IsoquantData {
  Q: number;
  points: Point[];
}

export interface CostCurveData {
  Q: number[];
  CT: number[];
  CV: number[];
  CMg: number[];
  CMe: number[];
  CVMe: number[];
}

// Valores por defecto del modelo
export const defaultFirmParams: FirmParams = {
  A: 1,
  alpha: 0.3,
  beta: 0.7,
  w: 10,
  r: 5,
  CF: 100,
  K_fixed: 10,
  Q_target: 10,
};

// Validar parámetros del modelo
export function validateFirmParams(params: FirmParams): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validaciones críticas
  if (params.A <= 0) {
    errors.push("La productividad (A) debe ser positiva");
  }
  if (params.alpha <= 0 || params.alpha >= 1) {
    errors.push("La elasticidad del trabajo (α) debe estar entre 0 y 1");
  }
  if (params.beta <= 0 || params.beta >= 1) {
    errors.push("La elasticidad del capital (β) debe estar entre 0 y 1");
  }
  if (params.w <= 0) {
    errors.push("El salario (w) debe ser positivo");
  }
  if (params.r <= 0) {
    errors.push("La renta del capital (r) debe ser positiva");
  }
  if (params.K_fixed <= 0) {
    errors.push("El capital fijo debe ser positivo");
  }

  // Advertencias sobre retornos a escala
  const rts = params.alpha + params.beta;
  if (Math.abs(rts - 1) < 0.01) {
    warnings.push("Retornos constantes a escala (α + β ≈ 1)");
  } else if (rts > 1) {
    warnings.push("Retornos crecientes a escala (α + β > 1)");
  } else {
    warnings.push("Retornos decrecientes a escala (α + β < 1)");
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Función de producción Cobb-Douglas: Q = A * L^α * K^β
export function productionFunction(
  A: number,
  L: number,
  K: number,
  alpha: number,
  beta: number,
): number {
  if (L <= 0 || K <= 0) return 0;
  return A * Math.pow(L, alpha) * Math.pow(K, beta);
}

// Producto marginal del trabajo: MPL = ∂Q/∂L = α * A * L^(α-1) * K^β
export function marginalProductLabor(
  A: number,
  L: number,
  K: number,
  alpha: number,
  beta: number,
): number {
  if (L <= 0 || K <= 0) return 0;
  return alpha * A * Math.pow(L, alpha - 1) * Math.pow(K, beta);
}

// Producto marginal del capital: MPK = ∂Q/∂K = β * A * L^α * K^(β-1)
export function marginalProductCapital(
  A: number,
  L: number,
  K: number,
  alpha: number,
  beta: number,
): number {
  if (L <= 0 || K <= 0) return 0;
  return beta * A * Math.pow(L, alpha) * Math.pow(K, beta - 1);
}

// Calcular L óptimo para producir Q dado K (usado en corto plazo)
// Q = A * L^α * K^β  =>  L = (Q / (A * K^β))^(1/α)
export function laborForOutput(
  Q: number,
  K: number,
  A: number,
  alpha: number,
  beta: number,
): number {
  if (Q <= 0 || K <= 0) return 0;
  return Math.pow(Q / (A * Math.pow(K, beta)), 1 / alpha);
}

// Minimización de costos: encontrar L* y K* que minimizan CT dado Q
// Condición: MPL/w = MPK/r  =>  (α/L) / w = (β/K) / r  =>  K/L = (β*w) / (α*r)
export function costMinimization(
  Q: number,
  w: number,
  r: number,
  A: number,
  alpha: number,
  beta: number,
): { L: number; K: number; CT: number } {
  if (Q <= 0) return { L: 0, K: 0, CT: 0 };

  // De la condición de tangencia: K = L * (β*w) / (α*r)
  // Sustituyendo en Q = A * L^α * K^β:
  // Q = A * L^α * [L * (β*w)/(α*r)]^β
  // Q = A * L^(α+β) * [(β*w)/(α*r)]^β
  // L^(α+β) = Q / [A * [(β*w)/(α*r)]^β]

  const ratio = (beta * w) / (alpha * r);
  const L_optimal = Math.pow(
    Q / (A * Math.pow(ratio, beta)),
    1 / (alpha + beta),
  );
  const K_optimal = L_optimal * ratio;
  const CT = w * L_optimal + r * K_optimal;

  return { L: L_optimal, K: K_optimal, CT };
}

// Resolver el modelo completo (corto plazo con K fijo)
export function solveFirmModel(params: FirmParams): FirmResults {
  const { A, alpha, beta, w, r, CF, K_fixed, Q_target } = params;

  // Corto plazo: K fijo, encontrar L para producir Q_target
  const L_sp = laborForOutput(Q_target, K_fixed, A, alpha, beta);
  const Q = productionFunction(A, L_sp, K_fixed, alpha, beta);

  // Productos marginales
  const MPL = marginalProductLabor(A, L_sp, K_fixed, alpha, beta);
  const MPK = marginalProductCapital(A, L_sp, K_fixed, alpha, beta);

  // Productos medios
  const APL = L_sp > 0 ? Q / L_sp : 0;
  const APK = K_fixed > 0 ? Q / K_fixed : 0;

  // Costos de corto plazo
  const CV = w * L_sp;
  const CT = CV + CF;
  const CMe = Q > 0 ? CT / Q : 0;
  const CVMe = Q > 0 ? CV / Q : 0;
  const CMg = Q > 0 ? w / MPL : 0;

  // Minimización de costos (largo plazo)
  const optimal = costMinimization(Q_target, w, r, A, alpha, beta);

  // Retornos a escala
  const returnsToScale = alpha + beta;
  let returnsType: "crecientes" | "constantes" | "decrecientes";
  if (Math.abs(returnsToScale - 1) < 0.01) {
    returnsType = "constantes";
  } else if (returnsToScale > 1) {
    returnsType = "crecientes";
  } else {
    returnsType = "decrecientes";
  }

  // TMST = MPL / MPK
  const TMST = MPK > 0 ? MPL / MPK : 0;

  return {
    Q,
    MPL,
    MPK,
    APL,
    APK,
    CT,
    CV,
    CMg,
    CMe,
    CVMe,
    L_optimal: optimal.L,
    K_optimal: optimal.K,
    CT_min: optimal.CT + CF,
    returnsToScale,
    returnsType,
    TMST,
  };
}

// Generar puntos de una isocuanta (Q constante)
// Q = A * L^α * K^β  =>  K = (Q / (A * L^α))^(1/β)
export function generateIsoquant(
  Q: number,
  A: number,
  alpha: number,
  beta: number,
  LRange: [number, number] = [0.1, 50],
  points: number = 100,
): Point[] {
  const curve: Point[] = [];
  const step = (LRange[1] - LRange[0]) / points;

  for (let L = LRange[0]; L <= LRange[1]; L += step) {
    const K = Math.pow(Q / (A * Math.pow(L, alpha)), 1 / beta);
    if (K > 0 && K < 100) {
      curve.push({ x: L, y: K });
    }
  }

  return curve;
}

// Generar puntos de una isocosto (CT = wL + rK constante)
// K = (CT - wL) / r
export function generateIsocost(
  CT: number,
  w: number,
  r: number,
  LRange: [number, number] = [0, 50],
): Point[] {
  const L_max = CT / w;
  const K_max = CT / r;

  return [
    { x: 0, y: K_max },
    { x: L_max, y: 0 },
  ];
}

// Generar múltiples isocuantas para visualización
export function generateIsoquantMap(
  params: FirmParams,
  numCurves: number = 5,
): IsoquantData[] {
  const { A, alpha, beta, Q_target } = params;
  const curves: IsoquantData[] = [];

  for (let i = 1; i <= numCurves; i++) {
    const Q = (Q_target * i) / 3;
    curves.push({
      Q,
      points: generateIsoquant(Q, A, alpha, beta),
    });
  }

  return curves;
}

// Generar curvas de costo a partir de diferentes niveles de producción
export function generateCostCurves(
  params: FirmParams,
  maxQ: number = 50,
  points: number = 100,
): CostCurveData {
  const { A, alpha, beta, w, K_fixed, CF } = params;

  const Q_values: number[] = [];
  const CT_values: number[] = [];
  const CV_values: number[] = [];
  const CMg_values: number[] = [];
  const CMe_values: number[] = [];
  const CVMe_values: number[] = [];

  const step = maxQ / points;

  for (let Q = step; Q <= maxQ; Q += step) {
    // Corto plazo: K fijo
    const L = laborForOutput(Q, K_fixed, A, alpha, beta);
    const CV = w * L;
    const CT = CV + CF;
    const CMe = CT / Q;
    const CVMe = CV / Q;

    // Costo marginal: CMg = w / MPL
    const MPL = marginalProductLabor(A, L, K_fixed, alpha, beta);
    const CMg = MPL > 0 ? w / MPL : 0;

    Q_values.push(Q);
    CT_values.push(CT);
    CV_values.push(CV);
    CMg_values.push(CMg);
    CMe_values.push(CMe);
    CVMe_values.push(CVMe);
  }

  return {
    Q: Q_values,
    CT: CT_values,
    CV: CV_values,
    CMg: CMg_values,
    CMe: CMe_values,
    CVMe: CVMe_values,
  };
}

// Escenarios predefinidos
export const firmScenarios = {
  baseline: {
    name: "Caso Base",
    description: "Retornos constantes a escala (α + β = 1)",
    params: { ...defaultFirmParams, alpha: 0.3, beta: 0.7 },
  },
  increasingReturns: {
    name: "Retornos Crecientes",
    description: "α + β > 1, economías de escala",
    params: { ...defaultFirmParams, alpha: 0.6, beta: 0.6 },
  },
  decreasingReturns: {
    name: "Retornos Decrecientes",
    description: "α + β < 1, deseconomías de escala",
    params: { ...defaultFirmParams, alpha: 0.2, beta: 0.5 },
  },
  technologicalChange: {
    name: "Cambio Tecnológico",
    description: "Aumento de la productividad (A)",
    params: { ...defaultFirmParams, A: 2 },
  },
  capitalIntensive: {
    name: "Intensivo en Capital",
    description: "β > α, producción intensiva en capital",
    params: { ...defaultFirmParams, alpha: 0.2, beta: 0.6 },
  },
  laborIntensive: {
    name: "Intensivo en Trabajo",
    description: "α > β, producción intensiva en trabajo",
    params: { ...defaultFirmParams, alpha: 0.6, beta: 0.2 },
  },
  highWage: {
    name: "Salario Alto",
    description: "Aumento del salario",
    params: { ...defaultFirmParams, w: 20 },
  },
};
