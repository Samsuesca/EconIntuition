// Lógica matemática del modelo Mundell-Fleming
// Extensión del IS-LM para economía abierta con tipo de cambio

export interface MundellFlemingParams {
  // Mercado de Dinero (LM)
  M: number; // Oferta monetaria
  P: number; // Nivel de precios
  k: number; // Sensibilidad de demanda de dinero a la renta
  h: number; // Sensibilidad de demanda de dinero al interés

  // Mercado de Bienes (IS)
  c: number; // Propensión marginal al consumo (0-1)
  t: number; // Tasa impositiva (0-1)
  b: number; // Sensibilidad de inversión al interés

  // Componentes autónomos
  Ca: number; // Consumo autónomo
  Ia: number; // Inversión autónoma
  G: number; // Gasto público

  // Sector Externo
  e: number; // Tipo de cambio nominal (e ↑ = depreciación)
  Y_f: number; // Producto extranjero
  i_f: number; // Tasa de interés internacional
  x: number; // Sensibilidad de exportaciones al tipo de cambio
  m: number; // Propensión marginal a importar (0-1)
  X0: number; // Exportaciones autónomas
  M0: number; // Importaciones autónomas

  // Movilidad de Capital
  mobility: "perfect" | "imperfect" | "none"; // Grado de movilidad de capital
  phi: number; // Sensibilidad de flujos de capital a diferencial de tasas (si imperfecta)

  // Régimen Cambiario
  regime: "flexible" | "fixed"; // Tipo de cambio flexible o fijo
}

export interface MundellFlemingResults {
  Y_star: number; // Producto de equilibrio
  i_star: number; // Tasa de interés de equilibrio
  e_star: number; // Tipo de cambio de equilibrio
  NX: number; // Exportaciones netas
  C: number; // Consumo total
  I: number; // Inversión total
  X: number; // Exportaciones
  IM: number; // Importaciones
  BP: number; // Saldo de balanza de pagos
  CF: number; // Flujos de capital
  multiplier: number; // Multiplicador fiscal en economía abierta
}

export interface MFCurvePoint {
  Y: number;
  i: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Valores por defecto del modelo
export const defaultParams: MundellFlemingParams = {
  // LM
  M: 1000,
  P: 1,
  k: 0.5,
  h: 100,

  // IS
  c: 0.8,
  t: 0.2,
  b: 50,
  Ca: 100,
  Ia: 200,
  G: 300,

  // Sector Externo
  e: 1, // Tipo de cambio inicial
  Y_f: 2000, // Producto extranjero
  i_f: 5, // Tasa internacional
  x: 50, // Sensibilidad exportaciones
  m: 0.15, // Propensión a importar
  X0: 100, // Exportaciones autónomas
  M0: 50, // Importaciones autónomas

  // Movilidad y Régimen
  mobility: "perfect",
  phi: 200,
  regime: "flexible",
};

// Validar parámetros del modelo
export function validateParams(params: MundellFlemingParams): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validaciones críticas
  if (params.P === 0) {
    errors.push("El nivel de precios (P) no puede ser cero");
  }
  if (params.k === 0) {
    errors.push("La sensibilidad a la renta (k) no puede ser cero");
  }
  if (params.h === 0) {
    warnings.push("h = 0: Curva LM vertical (caso clásico)");
  }
  if (params.e <= 0) {
    errors.push("El tipo de cambio (e) debe ser positivo");
  }

  // Validaciones de rango
  if (params.c < 0 || params.c >= 1) {
    errors.push(`Propensión al consumo (c=${params.c}) debe estar entre 0 y 1`);
  }
  if (params.t < 0 || params.t >= 1) {
    errors.push(`Tasa impositiva (t=${params.t}) debe estar entre 0 y 1`);
  }
  if (params.m < 0 || params.m >= 1) {
    errors.push(`Propensión a importar (m=${params.m}) debe estar entre 0 y 1`);
  }

  // Estabilidad del multiplicador
  const denominator = 1 - params.c * (1 - params.t) + params.m;
  if (Math.abs(denominator) < 0.01) {
    warnings.push("Multiplicador muy alto (modelo inestable)");
  }

  // Advertencias específicas del modelo
  if (params.regime === "fixed" && params.mobility === "perfect") {
    warnings.push(
      "TC fijo + movilidad perfecta: M es endógena, política monetaria inefectiva",
    );
  }
  if (params.regime === "flexible" && params.mobility === "perfect") {
    warnings.push(
      "TC flexible + movilidad perfecta: i = i*, política fiscal inefectiva",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Calcular exportaciones netas
function calculateNX(
  params: MundellFlemingParams,
  Y: number,
  e: number,
): {
  X: number;
  IM: number;
  NX: number;
} {
  const { x, m, X0, M0, Y_f } = params;

  // Exportaciones: dependen positivamente del tipo de cambio y del ingreso extranjero
  const X = X0 + x * e + 0.1 * Y_f;

  // Importaciones: dependen del ingreso nacional y negativamente del tipo de cambio
  const IM = M0 + m * Y - 0.2 * x * e;

  const NX = X - IM;

  return { X, IM, NX };
}

// Calcular flujos de capital
function calculateCF(params: MundellFlemingParams, i: number): number {
  const { mobility, phi, i_f } = params;

  if (mobility === "perfect") {
    // Con movilidad perfecta, la tasa doméstica debe igualar la internacional
    // Los flujos de capital son infinitos si hay diferencial
    return 0; // En equilibrio, i = i_f
  } else if (mobility === "imperfect") {
    // CF depende del diferencial de tasas
    return phi * (i - i_f);
  } else {
    // Sin movilidad de capital
    return 0;
  }
}

// Resolver el modelo con tipo de cambio FLEXIBLE
function solveFlexible(params: MundellFlemingParams): MundellFlemingResults {
  const { M, P, k, h, c, t, b, Ca, Ia, G, mobility, i_f } = params;

  const M_P = M / P;

  if (mobility === "perfect") {
    // Con movilidad perfecta: i = i_f (curva BP horizontal)
    const i_star = i_f;

    // De LM: Y = (M/P)/k + (h/k)i
    const Y_star = M_P / k + (h / k) * i_star;

    // De IS, despejar e:
    // Y = [Ca + Ia + G + NX(e,Y) - bi] / [1 - c(1-t) + m]
    // NX(e,Y) = X0 + x*e + 0.1*Y_f - M0 - m*Y + 0.2*x*e
    // Resolviendo para e:
    const A =
      Ca + Ia + G - b * i_star + params.X0 - params.M0 + 0.1 * params.Y_f;
    const multiplier = 1 / (1 - c * (1 - t) + params.m);

    // Y = multiplier * (A + (x + 0.2*x)e - mY)
    // Y(1 + multiplier*m) = multiplier * (A + 1.2*x*e)
    // Y = multiplier * (A + 1.2*x*e) / (1 + multiplier*m)

    // Simplificando: e ajusta para que se cumpla IS dado Y de LM
    const e_star = (Y_star / multiplier - A) / (1.2 * params.x);

    const trade = calculateNX(params, Y_star, e_star);
    const C = Ca + c * (1 - t) * Y_star;
    const I = Ia - b * i_star;
    const CF = calculateCF(params, i_star);
    const BP = trade.NX + CF;

    return {
      Y_star,
      i_star,
      e_star,
      NX: trade.NX,
      C,
      I,
      X: trade.X,
      IM: trade.IM,
      BP,
      CF,
      multiplier,
    };
  } else {
    // Con movilidad imperfecta o nula
    // Sistema de 3 ecuaciones, 3 incógnitas (Y, i, e)
    // Aproximación iterativa

    let e_star = params.e;
    let Y_star = 1500;
    let i_star = 5;

    // Iteración Newton-Raphson simplificada
    for (let iter = 0; iter < 50; iter++) {
      const trade = calculateNX(params, Y_star, e_star);
      const A = Ca + Ia + G + trade.NX;
      const multiplier = 1 / (1 - c * (1 - t));

      // IS: Y = multiplier * (A - b*i)
      const Y_IS = multiplier * (A - b * i_star);

      // LM: i = (k*Y - M/P) / h
      const i_LM = (k * Y_star - M_P) / h;

      // BP: NX + CF = 0 => e ajusta
      const CF = calculateCF(params, i_star);
      const BP_error = trade.NX + CF;

      // Actualizar valores
      Y_star = 0.5 * Y_star + 0.5 * Y_IS;
      i_star = 0.5 * i_star + 0.5 * i_LM;
      e_star = e_star - 0.01 * BP_error; // Ajustar e para cerrar BP

      // Condición de convergencia
      if (Math.abs(Y_star - Y_IS) < 0.1 && Math.abs(i_star - i_LM) < 0.01) {
        break;
      }
    }

    const trade = calculateNX(params, Y_star, e_star);
    const C = Ca + c * (1 - t) * Y_star;
    const I = Ia - b * i_star;
    const CF = calculateCF(params, i_star);
    const multiplier = 1 / (1 - c * (1 - t) + params.m);

    return {
      Y_star,
      i_star,
      e_star,
      NX: trade_final.NX,
      C,
      I,
      X: trade_final.X,
      IM: trade_final.IM,
      BP: trade_final.NX + CF,
      CF,
      multiplier,
    };
  }
}

// Resolver el modelo con tipo de cambio FIJO
function solveFixed(params: MundellFlemingParams): MundellFlemingResults {
  const { c, t, b, Ca, Ia, G, e, M, P, k, h, mobility, i_f } = params;

  const e_star = e; // Tipo de cambio fijo

  if (mobility === "perfect") {
    // Con movilidad perfecta: i = i_f
    const i_star = i_f;

    // El producto se determina por IS (con e fijo)
    const trade = calculateNX(params, 0, e_star); // Aproximación inicial
    const A = Ca + Ia + G + trade.X - trade.M0;
    const multiplier = 1 / (1 - c * (1 - t) + params.m);

    // Iteración para encontrar Y que satisface IS
    let Y_star = 1500;
    for (let iter = 0; iter < 50; iter++) {
      const trade_iter = calculateNX(params, Y_star, e_star);
      const A_iter = Ca + Ia + G + trade_iter.NX;
      const Y_new = multiplier * (A_iter - b * i_star);

      if (Math.abs(Y_new - Y_star) < 0.1) {
        Y_star = Y_new;
        break;
      }
      Y_star = 0.5 * Y_star + 0.5 * Y_new;
    }

    // M es endógena: se ajusta para que LM pase por (Y*, i*)
    // M/P = k*Y - h*i
    const M_P_required = k * Y_star - h * i_star;

    const trade_final = calculateNX(params, Y_star, e_star);
    const C = Ca + c * (1 - t) * Y_star;
    const I = Ia - b * i_star;
    const CF = calculateCF(params, i_star);
    const multiplier_value = 1 / (1 - c * (1 - t) + params.m);

    return {
      Y_star,
      i_star,
      e_star,
      NX: trade_final.NX,
      C,
      I,
      X: trade_final.X,
      IM: trade_final.IM,
      BP: trade_final.NX + CF,
      CF,
      multiplier: multiplier_value,
    };
  } else {
    // Con movilidad imperfecta/nula y tipo de cambio fijo
    // Sistema IS-LM estándar pero con NX(e_fixed, Y)

    let Y_star = 1500;
    let i_star = 5;

    for (let iter = 0; iter < 50; iter++) {
      const trade = calculateNX(params, Y_star, e_star);
      const A = Ca + Ia + G + trade.NX;
      const multiplier = 1 / (1 - c * (1 - t));

      const Y_IS = multiplier * (A - b * i_star);
      const i_LM = (k * Y_star - M / P) / h;

      Y_star = 0.5 * Y_star + 0.5 * Y_IS;
      i_star = 0.5 * i_star + 0.5 * i_LM;

      if (Math.abs(Y_star - Y_IS) < 0.1 && Math.abs(i_star - i_LM) < 0.01) {
        break;
      }
    }

    const trade = calculateNX(params, Y_star, e_star);
    const C = Ca + c * (1 - t) * Y_star;
    const I = Ia - b * i_star;
    const CF = calculateCF(params, i_star);
    const multiplier_value = 1 / (1 - c * (1 - t) + params.m);

    return {
      Y_star,
      i_star,
      e_star,
      NX: trade_final.NX,
      C,
      I,
      X: trade_final.X,
      IM: trade_final.IM,
      BP: trade_final.NX + CF,
      CF,
      multiplier: multiplier_value,
    };
  }
}

// Resolver el modelo completo
export function solveMundellFleming(
  params: MundellFlemingParams,
): MundellFlemingResults {
  if (params.regime === "flexible") {
    return solveFlexible(params);
  } else {
    return solveFixed(params);
  }
}

// Generar puntos de la curva IS (economía abierta)
export function generateISCurve(
  params: MundellFlemingParams,
  iRange: [number, number] = [0, 15],
  points: number = 100,
): MFCurvePoint[] {
  const { c, t, b, Ca, Ia, G, e } = params;

  const curve: MFCurvePoint[] = [];
  const step = (iRange[1] - iRange[0]) / points;

  for (let i = iRange[0]; i <= iRange[1]; i += step) {
    // Para cada i, calcular Y que satisface IS
    // Aproximación: usar NX evaluado en Y promedio
    const Y_approx = 1500;
    const trade = calculateNX(params, Y_approx, e);
    const A = Ca + Ia + G + trade.NX;
    const multiplier = 1 / (1 - c * (1 - t) + params.m);

    const Y = multiplier * (A - b * i);
    if (Y > 0) {
      curve.push({ Y, i });
    }
  }

  return curve;
}

// Generar puntos de la curva LM
export function generateLMCurve(
  params: MundellFlemingParams,
  YRange: [number, number] = [0, 5000],
  points: number = 100,
): MFCurvePoint[] {
  const { M, P, k, h } = params;

  const M_P = M / P;
  const curve: MFCurvePoint[] = [];
  const step = (YRange[1] - YRange[0]) / points;

  for (let Y = YRange[0]; Y <= YRange[1]; Y += step) {
    const i = (k * Y - M_P) / h;
    if (i >= 0) {
      curve.push({ Y, i });
    }
  }

  return curve;
}

// Generar puntos de la curva BP
export function generateBPCurve(
  params: MundellFlemingParams,
  YRange: [number, number] = [0, 5000],
  points: number = 100,
): MFCurvePoint[] {
  const { mobility, i_f, phi, e, x, m, X0, M0, Y_f } = params;

  if (mobility === "perfect") {
    // BP horizontal en i = i_f
    return [
      { Y: YRange[0], i: i_f },
      { Y: YRange[1], i: i_f },
    ];
  } else if (mobility === "none") {
    // BP vertical: solo NX importa
    // NX = 0: X0 + x*e + 0.1*Y_f - M0 - m*Y + 0.2*x*e = 0
    const Y_BP = (X0 + 1.2 * x * e + 0.1 * Y_f - M0) / m;
    return [
      { Y: Y_BP, i: 0 },
      { Y: Y_BP, i: 15 },
    ];
  } else {
    // Movilidad imperfecta: BP tiene pendiente positiva
    // BP = 0: NX(e,Y) + phi*(i - i_f) = 0
    // i = i_f - NX(e,Y)/phi

    const curve: MFCurvePoint[] = [];
    const step = (YRange[1] - YRange[0]) / points;

    for (let Y = YRange[0]; Y <= YRange[1]; Y += step) {
      const trade = calculateNX(params, Y, e);
      const i = i_f - trade.NX / phi;

      if (i >= 0 && i <= 20) {
        curve.push({ Y, i });
      }
    }

    return curve;
  }
}

// Escenarios predefinidos para demostración
export const presetScenarios = {
  baseline: {
    name: "Caso Base",
    description: "TC flexible con movilidad perfecta de capital",
    params: defaultParams,
  },
  flexMonetary: {
    name: "Expansión Monetaria (TC Flex)",
    description: "ΔM = +500, TC flexible, movilidad perfecta",
    params: {
      ...defaultParams,
      M: 1500,
      regime: "flexible" as const,
      mobility: "perfect" as const,
    },
  },
  flexFiscal: {
    name: "Expansión Fiscal (TC Flex)",
    description: "ΔG = +200, TC flexible, movilidad perfecta",
    params: {
      ...defaultParams,
      G: 500,
      regime: "flexible" as const,
      mobility: "perfect" as const,
    },
  },
  fixedMonetary: {
    name: "Expansión Monetaria (TC Fijo)",
    description: "ΔM = +500, TC fijo, movilidad perfecta (inefectiva)",
    params: {
      ...defaultParams,
      M: 1500,
      regime: "fixed" as const,
      mobility: "perfect" as const,
    },
  },
  fixedFiscal: {
    name: "Expansión Fiscal (TC Fijo)",
    description: "ΔG = +200, TC fijo, movilidad perfecta",
    params: {
      ...defaultParams,
      G: 500,
      regime: "fixed" as const,
      mobility: "perfect" as const,
    },
  },
  imperfectMobility: {
    name: "Movilidad Imperfecta",
    description: "TC flexible con movilidad imperfecta de capital",
    params: { ...defaultParams, mobility: "imperfect" as const, phi: 200 },
  },
  noMobility: {
    name: "Sin Movilidad de Capital",
    description: "TC flexible sin movilidad de capital (BP vertical)",
    params: { ...defaultParams, mobility: "none" as const },
  },
};
