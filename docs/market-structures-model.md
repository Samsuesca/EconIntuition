# Modelo de Estructuras de Mercado

## Resumen

Este modelo interactivo compara tres estructuras de mercado fundamentales en microeconomía:
- **Competencia Perfecta**: P = CMg, beneficio = 0 en largo plazo
- **Monopolio**: IMg = CMg, poder de mercado, pérdida de eficiencia
- **Oligopolio de Cournot**: Equilibrio de Nash, competencia estratégica

## Archivos Creados

### 1. Lógica del Modelo
**Archivo**: `/home/user/EconIntuition/src/lib/economics/market-structures.ts`

Implementa:
- `solvePerfectCompetition()`: Equilibrio competitivo
- `solveMonopoly()`: Maximización de beneficios del monopolista
- `solveCournot()`: Equilibrio de Nash-Cournot con n firmas
- `solveMarketStructures()`: Resuelve y compara todas las estructuras
- Funciones de graficación para demanda, ingreso marginal, costo marginal
- Funciones de reacción de Cournot para duopolio
- Validación de parámetros
- 8 escenarios predefinidos

### 2. Componente Interactivo
**Archivo**: `/home/user/EconIntuition/src/components/models/MarketStructuresModel.tsx`

Características:
- Controles deslizantes para todos los parámetros
- 4 vistas: Comparación, Comp. Perfecta, Monopolio, Cournot
- Gráfico principal con curvas de demanda, IMg, CMg y equilibrios
- Tablas de resultados para cada estructura
- Tabla comparativa con todas las métricas
- Gráfico de funciones de reacción (solo duopolio)
- Animaciones suaves entre vistas
- Mensajes de validación y advertencias

### 3. Página Next.js
**Archivo**: `/home/user/EconIntuition/src/app/models/estructuras-mercado/page.tsx`

Incluye:
- Navegación y layout
- Carga diferida del componente
- Documentación educativa completa:
  - Explicación de cada estructura
  - Conceptos clave (poder de mercado, DWL, equilibrio de Nash)
  - Aplicaciones del mundo real
  - Política económica
  - Extensiones posibles del modelo

## Ecuaciones Implementadas

### Demanda Inversa
```
P = a - bQ
```

### Costos
```
C(q) = c·q + F
CMg = c
```

### Competencia Perfecta
```
P = CMg = c
Q = (a - c) / b
Beneficio = 0 (largo plazo)
```

### Monopolio
```
IMg = a - 2bQ
IMg = CMg → Q = (a - c) / (2b)
P = a - bQ
Índice de Lerner: L = (P - CMg) / P
Markup: P / CMg
```

### Cournot (n firmas simétricas)
```
Función de reacción: qi = (a - c - b·Q-i) / (2b)
Equilibrio: q = (a - c) / [b(n+1)]
Q = n·q = n(a - c) / [b(n+1)]
P = a - bQ
```

## Parámetros del Modelo

| Parámetro | Símbolo | Descripción | Rango | Default |
|-----------|---------|-------------|-------|---------|
| Intercepto demanda | a | Precio máximo | 50-200 | 100 |
| Pendiente demanda | b | Sensibilidad al precio | 0.1-3 | 1 |
| Costo marginal | c | Costo variable por unidad | 0-50 | 20 |
| Costo fijo | F | Costos fijos | 0-500 | 100 |
| Número de firmas | n | Firmas en oligopolio | 2-10 | 2 |

## Resultados Calculados

### Para cada estructura:
- Precio de equilibrio (P)
- Cantidad de equilibrio (Q)
- Beneficios totales
- Excedente del consumidor
- Excedente del productor
- Bienestar total

### Adicionales:
- **Monopolio y Cournot**: Pérdida de eficiencia (Deadweight Loss)
- **Monopolio y Cournot**: Índice de Lerner
- **Monopolio**: Markup sobre costo marginal
- **Cournot**: Producción por firma, beneficio por firma

## Escenarios Predefinidos

1. **Caso Base**: Mercado estándar con costos moderados
2. **Costos Altos**: Industria con barreras de entrada (F=500, c=30)
3. **Costos Bajos**: Industria competitiva (F=10, c=10)
4. **Demanda Inelástica**: Bien necesario (b=0.5)
5. **Demanda Elástica**: Bien de lujo (b=2)
6. **Duopolio**: Dos firmas (n=2)
7. **Triopolio**: Tres firmas (n=3)
8. **Oligopolio**: Cinco firmas (n=5), convergencia a competencia

## Validaciones Implementadas

### Errores (bloquean cálculo):
- a ≤ 0: Intercepto debe ser positivo
- b ≤ 0: Pendiente debe ser positiva
- c < 0: Costo marginal no puede ser negativo
- F < 0: Costo fijo no puede ser negativo
- n < 1: Debe haber al menos una firma
- n no entero: Número de firmas debe ser entero
- c ≥ a: No hay demanda rentable

### Advertencias (no bloquean):
- F = 0: No hay barreras de entrada
- n > 10: Converge a competencia perfecta

## Insights Educativos

1. **Poder de Mercado**: El monopolio cobra el precio más alto, seguido por Cournot, y competencia perfecta el más bajo

2. **Convergencia**: A medida que aumenta n en Cournot, el equilibrio converge hacia competencia perfecta

3. **Eficiencia**: Competencia perfecta maximiza el bienestar social. Monopolio tiene la mayor pérdida de eficiencia

4. **Índice de Lerner**: Mide el poder de mercado. L=0 en competencia perfecta, L>0 con poder de mercado

5. **Trade-off**: Más concentración → mayores beneficios para firmas, menor bienestar para consumidores

## Visualizaciones

### Gráfico Principal (P-Q)
- Curva de demanda (azul)
- Curva de IMg (púrpura, punteada)
- Curva de CMg (naranja, horizontal)
- Puntos de equilibrio para cada estructura

### Gráfico de Funciones de Reacción (Duopolio)
- R₁(q₂): Mejor respuesta de firma 1
- R₂(q₁): Mejor respuesta de firma 2
- Equilibrio de Nash en la intersección

## Cómo Usar

1. **Explorar estructuras individuales**: Selecciona una vista específica
2. **Comparar**: Usa la vista "Comparación" para ver los tres equilibrios simultáneamente
3. **Ajustar parámetros**: Modifica sliders para ver efectos en tiempo real
4. **Probar escenarios**: Carga escenarios predefinidos para casos específicos
5. **Observar convergencia**: Aumenta n en Cournot para ver convergencia hacia competencia

## Extensiones Posibles

- Competencia en precios (Bertrand)
- Liderazgo de cantidades (Stackelberg)
- Diferenciación de productos
- Colusión y carteles
- Costos no lineales
- Discriminación de precios
- Entrada y salida dinámica

## Referencias Matemáticas

- Varian, H. (2014). Intermediate Microeconomics (9th ed.)
- Mas-Colell, A., Whinston, M., & Green, J. (1995). Microeconomic Theory
- Tirole, J. (1988). The Theory of Industrial Organization

## URL de Acceso

Una vez desplegado el proyecto:
```
http://localhost:3000/models/estructuras-mercado
```

## Notas Técnicas

- Todos los cálculos son en tiempo real (no hay optimizaciones lazy)
- Los gráficos usan Plotly para interactividad
- Las animaciones usan Framer Motion
- Las ecuaciones se renderizan con KaTeX
- El estado es local (React hooks), no usa Zustand

## Pruebas Sugeridas

1. Verificar que P_monopolio > P_cournot > P_competencia
2. Verificar que Q_monopolio < Q_cournot < Q_competencia
3. Con n muy grande, Cournot → Competencia Perfecta
4. Con c → a, todos los equilibrios colapsan
5. Con F = 0, el número de firmas en competencia perfecta es alto
