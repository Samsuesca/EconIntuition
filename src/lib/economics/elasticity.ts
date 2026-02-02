// Lógica matemática del modelo de Elasticidades
// Elasticidad precio, ingreso, cruzada e incidencia impositiva

export interface ElasticityParams {
  // Parámetros de demanda: Qd = a - bP
  a: number; // Intercepto de demanda
  b: number; // Pendiente de demanda (positiva)

  // Parámetros de oferta: Qs = c + dP
  c: number; // Intercepto de oferta
  d: number; // Pendiente de oferta (positiva)

  // Precio actual de evaluación
  P: number; // Precio para calcular elasticidad

  // Impuesto unitario
  tax: number; // Impuesto por unidad (t)

  // Para elasticidad ingreso
  I: number; // Ingreso del consumidor
  alpha: number; // Sensibilidad de demanda al ingreso

  // Para elasticidad cruzada
  Py: number; // Precio del bien relacionado
  beta: number; // Sensibilidad cruzada
}

export interface ElasticityResults {
  // Equilibrio sin impuesto
  P_eq: number; // Precio de equilibrio
  Q_eq: number; // Cantidad de equilibrio

  // Elasticidades en equilibrio
  epsilon_d: number; // Elasticidad precio de la demanda
  epsilon_s: number; // Elasticidad precio de la oferta

  // Clasificación
  demand_type: string; // Tipo de demanda (elástica, inelástica, etc)
  supply_type: string; // Tipo de oferta

  // Ingreso total
  total_revenue: number; // IT = P × Q
  marginal_revenue: number; // IMg = P(1 - 1/|ε|)

  // Equilibrio con impuesto
  P_consumer: number; // Precio pagado por consumidor
  P_producer: number; // Precio recibido por productor
  Q_tax: number; // Cantidad con impuesto

  // Incidencia del impuesto
  consumer_burden: number; // Carga sobre consumidor
  producer_burden: number; // Carga sobre productor
  consumer_burden_pct: number; // % de carga sobre consumidor
  producer_burden_pct: number; // % de carga sobre productor

  // Pérdida de eficiencia
  deadweight_loss: number; // Pérdida irrecuperable de eficiencia

  // Elasticidades adicionales
  epsilon_income: number; // Elasticidad ingreso
  epsilon_cross: number; // Elasticidad cruzada
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Valores por defecto
export const defaultParams: ElasticityParams = {
  a: 100,
  b: 2,
  c: 20,
  d: 1,
  P: 30,
  tax: 0,
  I: 50,
  alpha: 0.5,
  Py: 20,
  beta: 0.3,
};

// Validar parámetros
export function validateParams(params: ElasticityParams): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Parámetros deben ser positivos
  if (params.a <= 0)
    errors.push("El intercepto de demanda (a) debe ser positivo");
  if (params.b <= 0)
    errors.push("La pendiente de demanda (b) debe ser positiva");
  if (params.d <= 0)
    errors.push("La pendiente de oferta (d) debe ser positiva");
  if (params.P < 0) errors.push("El precio no puede ser negativo");
  if (params.tax < 0) errors.push("El impuesto no puede ser negativo");

  // Oferta puede tener intercepto negativo (pero no muy negativo)
  if (params.c < -100) warnings.push("Intercepto de oferta muy negativo");

  // Verificar que exista equilibrio
  const P_eq = (params.a - params.c) / (params.b + params.d);
  if (P_eq <= 0) {
    errors.push("No existe equilibrio con precio positivo");
  }

  const Q_eq = params.a - params.b * P_eq;
  if (Q_eq <= 0) {
    errors.push("No existe equilibrio con cantidad positiva");
  }

  // Advertencias sobre elasticidades extremas
  if (params.b > 10 * params.d) {
    warnings.push("Demanda muy elástica comparada con oferta");
  }
  if (params.d > 10 * params.b) {
    warnings.push("Oferta muy elástica comparada con demanda");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Calcular tipo de elasticidad
function classifyElasticity(epsilon: number): string {
  const absEpsilon = Math.abs(epsilon);

  if (absEpsilon === 0) return "Perfectamente Inelástica";
  if (absEpsilon < 1) return "Inelástica";
  if (absEpsilon === 1) return "Unitaria";
  if (absEpsilon > 1 && absEpsilon < 100) return "Elástica";
  return "Perfectamente Elástica";
}

// Resolver modelo de elasticidades
export function solveElasticity(params: ElasticityParams): ElasticityResults {
  const { a, b, c, d, P, tax, I, alpha, Py, beta } = params;

  // Equilibrio sin impuesto
  // Qd = a - bP
  // Qs = c + dP
  // a - bP = c + dP
  const P_eq = (a - c) / (b + d);
  const Q_eq = a - b * P_eq;

  // Elasticidades en equilibrio
  // εd = (dQ/dP)(P/Q) = -b(P/Q)
  // εs = (dQ/dP)(P/Q) = d(P/Q)
  const epsilon_d = -b * (P_eq / Q_eq);
  const epsilon_s = d * (P_eq / Q_eq);

  // Clasificación
  const demand_type = classifyElasticity(epsilon_d);
  const supply_type = classifyElasticity(epsilon_s);

  // Ingreso total
  const total_revenue = P_eq * Q_eq;

  // Ingreso marginal: IMg = P(1 - 1/|εd|)
  const marginal_revenue =
    Math.abs(epsilon_d) > 0.01 ? P_eq * (1 - 1 / Math.abs(epsilon_d)) : P_eq;

  // Equilibrio con impuesto
  // Qd = a - b*Pc
  // Qs = c + d*Pp
  // Pc = Pp + tax
  // En equilibrio: Qd = Qs
  // a - b*Pc = c + d*(Pc - tax)
  // a - b*Pc = c + d*Pc - d*tax
  // a - c + d*tax = (b + d)*Pc
  const P_consumer = (a - c + d * tax) / (b + d);
  const P_producer = P_consumer - tax;
  const Q_tax = a - b * P_consumer;

  // Incidencia del impuesto
  const consumer_burden = P_consumer - P_eq;
  const producer_burden = P_eq - P_producer;

  const consumer_burden_pct = tax > 0 ? (consumer_burden / tax) * 100 : 0;
  const producer_burden_pct = tax > 0 ? (producer_burden / tax) * 100 : 0;

  // Pérdida de eficiencia (deadweight loss)
  // DWL = 0.5 * tax * (Q_eq - Q_tax)
  const deadweight_loss = 0.5 * tax * Math.abs(Q_eq - Q_tax);

  // Elasticidad ingreso: εI = (dQ/dI)(I/Q)
  // Si Qd = a + alpha*I - bP
  const Q_with_income = a + alpha * I - b * P_eq;
  const epsilon_income = Q_with_income > 0 ? alpha * (I / Q_with_income) : 0;

  // Elasticidad cruzada: εxy = (dQx/dPy)(Py/Qx)
  // Si Qd = a + beta*Py - bP
  const Q_with_cross = a + beta * Py - b * P_eq;
  const epsilon_cross = Q_with_cross > 0 ? beta * (Py / Q_with_cross) : 0;

  return {
    P_eq,
    Q_eq,
    epsilon_d,
    epsilon_s,
    demand_type,
    supply_type,
    total_revenue,
    marginal_revenue,
    P_consumer,
    P_producer,
    Q_tax,
    consumer_burden,
    producer_burden,
    consumer_burden_pct,
    producer_burden_pct,
    deadweight_loss,
    epsilon_income,
    epsilon_cross,
  };
}

// Calcular elasticidad en un punto específico
export function elasticityAtPoint(
  params: ElasticityParams,
  P: number,
): { epsilon_d: number; epsilon_s: number; Q_d: number; Q_s: number } {
  const { a, b, c, d } = params;

  const Q_d = a - b * P;
  const Q_s = c + d * P;

  const epsilon_d = Q_d > 0 ? -b * (P / Q_d) : 0;
  const epsilon_s = Q_s > 0 ? d * (P / Q_s) : 0;

  return { epsilon_d, epsilon_s, Q_d, Q_s };
}

// Generar curva de demanda
export function generateDemandCurve(
  params: ElasticityParams,
  points: number = 100,
): Array<{ P: number; Q: number; epsilon: number }> {
  const { a, b } = params;

  // Rango de precios: desde 0 hasta precio donde Q = 0
  const P_max = a / b;
  const step = P_max / points;

  const curve: Array<{ P: number; Q: number; epsilon: number }> = [];

  for (let i = 0; i <= points; i++) {
    const P = i * step;
    const Q = a - b * P;
    const epsilon = Q > 0 ? -b * (P / Q) : 0;

    if (Q >= 0) {
      curve.push({ P, Q, epsilon });
    }
  }

  return curve;
}

// Generar curva de oferta
export function generateSupplyCurve(
  params: ElasticityParams,
  P_max: number,
  points: number = 100,
): Array<{ P: number; Q: number; epsilon: number }> {
  const { c, d } = params;

  // Precio mínimo donde Q = 0
  const P_min = Math.max(0, -c / d);
  const step = (P_max - P_min) / points;

  const curve: Array<{ P: number; Q: number; epsilon: number }> = [];

  for (let i = 0; i <= points; i++) {
    const P = P_min + i * step;
    const Q = c + d * P;
    const epsilon = Q > 0 ? d * (P / Q) : 0;

    if (Q >= 0) {
      curve.push({ P, Q, epsilon });
    }
  }

  return curve;
}

// Generar curva de ingreso total
export function generateTotalRevenueCurve(
  params: ElasticityParams,
  points: number = 100,
): Array<{ P: number; TR: number; epsilon: number }> {
  const { a, b } = params;

  const P_max = a / b;
  const step = P_max / points;

  const curve: Array<{ P: number; TR: number; epsilon: number }> = [];

  for (let i = 0; i <= points; i++) {
    const P = i * step;
    const Q = a - b * P;
    const TR = P * Q;
    const epsilon = Q > 0 ? -b * (P / Q) : 0;

    if (Q >= 0) {
      curve.push({ P, TR, epsilon });
    }
  }

  return curve;
}

// Escenarios predefinidos
export const presetScenarios = {
  baseline: {
    name: "Caso Base",
    description: "Mercado en equilibrio normal",
    params: defaultParams,
  },
  elasticDemand: {
    name: "Demanda Elástica",
    description: "Demanda muy sensible al precio (b alto)",
    params: { ...defaultParams, b: 4, a: 120 },
  },
  inelasticDemand: {
    name: "Demanda Inelástica",
    description: "Demanda poco sensible al precio (b bajo)",
    params: { ...defaultParams, b: 0.5, a: 80 },
  },
  unitaryDemand: {
    name: "Demanda Unitaria",
    description: "Elasticidad cercana a -1",
    params: { ...defaultParams, a: 80, b: 1.5, c: 10, d: 1 },
  },
  perfectlyElasticSupply: {
    name: "Oferta Perfectamente Elástica",
    description: "Oferta horizontal (d muy alto)",
    params: { ...defaultParams, d: 100, c: 0 },
  },
  perfectlyInelasticSupply: {
    name: "Oferta Perfectamente Inelástica",
    description: "Oferta vertical (d muy bajo)",
    params: { ...defaultParams, d: 0.01, c: 40 },
  },
  taxIncidence: {
    name: "Incidencia Impositiva",
    description: "Impuesto de $10 por unidad",
    params: { ...defaultParams, tax: 10 },
  },
  highTax: {
    name: "Impuesto Alto",
    description: "Impuesto de $20 con demanda inelástica",
    params: { ...defaultParams, tax: 20, b: 0.8 },
  },
};
