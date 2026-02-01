---
name: generate-lesson
description: Generate a complete educational lesson for an economic topic. Includes theory, equations, visualizations, and exercises.
allowed-tools: Read, Write, Edit, Glob, Task
argument-hint: [topic] [difficulty: intro|intermediate|advanced]
---

# Generate Economic Lesson

Create a complete educational lesson about: **$ARGUMENTS**

## Lesson Generation Process

### Step 1: Research Context
First, read existing content to understand:
- What topics come before this one (prerequisites)
- What topics come after (where this leads)
- The existing style and format

### Step 2: Create Lesson Structure

Generate the lesson file at `content/[area]/[topic]/index.mdx` with this structure:

```mdx
---
title: "[Topic Title]"
description: "[One-line description]"
area: "[micro|macro|econometria]"
order: [sequence number]
prerequisites:
  - "[prerequisite-1]"
  - "[prerequisite-2]"
learning_objectives:
  - "[What student will understand]"
  - "[What student will be able to do]"
  - "[What student will be able to analyze]"
difficulty: "[intro|intermediate|advanced]"
estimated_time: "[X minutes]"
---

import { Equation, EquationDerivation } from '@/components/math/Equation'
import { AnimatedGraph } from '@/components/animations/AnimatedGraph'
import { ParameterSlider } from '@/components/interactive/ParameterSlider'
import { InteractiveModel } from '@/components/models/[ModelName]'

## Introduccion

[Start with a compelling question or real-world scenario that motivates this topic]

<Callout type="motivation">
[Why should the student care about this topic?]
</Callout>

## La Intuicion

[Explain the core concept without math first. Use analogies, stories, examples.]

### Ejemplo del Mundo Real

[Concrete example that illustrates the concept]

## El Marco Formal

### Definiciones

<Definition term="[Term]">
[Formal definition in precise language]
</Definition>

### Supuestos

<Assumptions>
1. [Assumption 1 and why we make it]
2. [Assumption 2 and why we make it]
</Assumptions>

### Notacion

| Simbolo | Significado | Unidades/Rango |
|---------|-------------|----------------|
| $X$ | [meaning] | [units] |

## Desarrollo Matematico

<Equation
  math="[main equation]"
  label="[Equation Name]"
  description="[What this equation represents]"
/>

### Derivacion

<EquationDerivation
  steps={[
    { math: "[step 1]", explanation: "[why this step]" },
    { math: "[step 2]", explanation: "[why this step]" },
  ]}
/>

## Interpretacion Economica

[What does the math tell us about economic behavior?]

### Estatica Comparativa

- Cuando $X$ aumenta, $Y$ [aumenta/disminuye] porque...
- La elasticidad de $Y$ respecto a $X$ es...

## Visualizacion Interactiva

<InteractiveModel
  model="[model-name]"
  defaultParams={{...}}
  highlights={["param1", "param2"]}
/>

### Que Observar

1. [What to notice when changing param1]
2. [What to notice when changing param2]

## Aplicaciones

### Caso de Estudio: [Real Example]

[Apply the theory to a real situation]

### Implicaciones de Politica

[What does this theory suggest for economic policy?]

## Resumen

<Summary>
- [Key takeaway 1]
- [Key takeaway 2]
- [Key takeaway 3]
</Summary>

## Ejercicios

### Conceptuales

1. [Question testing understanding of concepts]
2. [Question requiring explanation]

### Matematicos

1. [Derivation exercise]
2. [Calculation exercise]

### Aplicados

1. [Real-world application problem]
2. [Policy analysis question]

## Para Profundizar

- [Reference 1]
- [Reference 2]
- [Link to next topic]
```

### Step 3: Create Supporting Components

If the lesson requires a new interactive model, create it at:
`src/components/models/[ModelName]Model.tsx`

### Step 4: Update Navigation

Add the lesson to the course navigation in:
`src/lib/curriculum.ts`

## Quality Checklist

Before completing, verify:

- [ ] All equations render correctly (test LaTeX)
- [ ] All interactive components have default values
- [ ] Prerequisites are correctly linked
- [ ] Learning objectives are measurable
- [ ] At least 3 exercises of varying difficulty
- [ ] Spanish language is correct and consistent
- [ ] Economic content is accurate
