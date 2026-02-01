# EconIntuition - Economia Formal Hecha Intuitiva

## Descripcion del Proyecto

EconIntuition es una plataforma educativa interactiva para aprender teoria economica. Transforma el formalismo matematico academico en experiencias visuales, animadas e interactivas, al estilo de 3Blue1Brown pero para economia.

## Vision

- **Intuicion primero**: Cada concepto comienza con una historia o pregunta del mundo real
- **Rigor matematico**: Derivaciones completas con notacion formal LaTeX
- **Interactividad total**: Modelos donde puedes ajustar parametros y ver resultados en tiempo real
- **Animaciones narrativas**: Ecuaciones que se construyen paso a paso con explicaciones

## Stack Tecnologico

- **Framework**: Next.js 14 (App Router)
- **Contenido**: MDX (Markdown + React components)
- **Animaciones**: Framer Motion + D3.js
- **Graficos**: Recharts, Plotly
- **Math**: KaTeX para renderizado LaTeX
- **Styling**: Tailwind CSS
- **Estado**: Zustand (para modelos complejos)

## Estructura del Proyecto

```
EconIntuition/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── courses/           # Cursos por area
│   │   └── models/            # Modelos interactivos standalone
│   ├── components/
│   │   ├── math/              # Componentes de ecuaciones
│   │   ├── animations/        # Componentes de animacion
│   │   ├── interactive/       # Sliders, controles
│   │   └── models/            # Modelos economicos completos
│   └── lib/
│       ├── economics/         # Logica de modelos (pura)
│       └── curriculum.ts      # Estructura del curriculum
├── content/                    # Contenido MDX
│   ├── micro/                 # Microeconomia
│   ├── macro/                 # Macroeconomia
│   └── econometria/           # Econometria
└── .claude/                    # Configuracion de agentes
    ├── agents/                # Definiciones de subagentes
    ├── skills/                # Skills reutilizables
    └── hooks/                 # Hooks de validacion
```

## Agentes Disponibles

### 1. econ-content-writer
**Uso**: Generar contenido educativo con formalismo matematico
```
Ejemplo: "Genera una leccion sobre la funcion de demanda"
```

### 2. econ-animator
**Uso**: Crear animaciones y visualizaciones
```
Ejemplo: "Crea una animacion que muestre como se desplaza la curva de demanda"
```

### 3. econ-model-builder
**Uso**: Construir modelos interactivos completos
```
Ejemplo: "Construye un modelo IS-LM interactivo"
```

## Skills Disponibles

### /generate-lesson [topic] [difficulty]
Genera una leccion educativa completa con teoria, ecuaciones, visualizaciones y ejercicios.

### /create-model [model-name] [description]
Crea un nuevo componente de modelo interactivo con controles de parametros.

## Convenciones de Codigo

### Nomenclatura de Archivos
- Componentes: `PascalCase.tsx`
- Utilidades: `camelCase.ts`
- Contenido MDX: `kebab-case.mdx`

### Estructura de Componentes
```tsx
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Pure functions
// 5. Component
// 6. Helper components
```

### Notacion Matematica
- Inline: `$symbol$`
- Display: Usar componente `<Equation>`
- Siempre definir variables antes de usarlas

### Idioma
- Todo el contenido educativo en **espanol**
- Comentarios de codigo en **ingles** (convencion)
- Nombres de variables en **ingles**

## Curriculum de Economia

### Microeconomia (micro/)
1. Preferencias y utilidad
2. Restriccion presupuestaria
3. Eleccion del consumidor
4. Demanda individual y de mercado
5. Oferta y equilibrio
6. Elasticidades
7. Excedentes y bienestar
8. Teoria de la firma
9. Estructuras de mercado
10. Equilibrio general

### Macroeconomia (macro/)
1. Cuentas nacionales
2. Mercado de bienes (IS)
3. Mercado de dinero (LM)
4. Modelo IS-LM completo
5. Mundell-Fleming
6. Curva de Phillips
7. Modelo de Solow
8. Expectativas y politica

### Econometria (econometria/)
1. Estadistica descriptiva
2. Regresion lineal simple
3. Regresion multiple
4. Inferencia
5. Series de tiempo
6. Datos de panel
7. Causalidad

## Flujo de Trabajo con Agentes

### Para crear nuevo contenido:
1. Usar `econ-content-writer` para generar el MDX
2. Usar `econ-animator` para crear visualizaciones
3. Usar `econ-model-builder` si se necesita interactividad

### Para modificar contenido existente:
1. Leer el archivo existente primero
2. Mantener la estructura y estilo
3. Verificar que los links a otros temas sigan funcionando

## Comandos Utiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Notas Importantes

- Los modelos deben ser matematicamente correctos - verificar siempre las ecuaciones
- Toda interactividad debe tener valores por defecto sensatos
- Las animaciones deben funcionar en mobile
- El contenido debe ser accesible (alt text, contraste, etc.)
