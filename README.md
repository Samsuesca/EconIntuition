# EconIntuition

**Economia formal hecha intuitiva**

Una plataforma educativa interactiva para aprender teoria economica con visualizaciones, animaciones y modelos interactivos.

## Caracteristicas

- **Animaciones narrativas** - Ecuaciones que se construyen paso a paso, al estilo 3Blue1Brown
- **Modelos interactivos** - Ajusta parametros y observa cambios en tiempo real
- **Rigor matematico** - Derivaciones completas con notacion LaTeX profesional
- **Contenido en espanol** - Todo el material educativo en espanol

## Stack Tecnologico

- [Next.js 14](https://nextjs.org/) - Framework React con App Router
- [MDX](https://mdxjs.com/) - Markdown con componentes React
- [Framer Motion](https://www.framer.com/motion/) - Animaciones declarativas
- [D3.js](https://d3js.org/) - Visualizaciones de datos
- [KaTeX](https://katex.org/) - Renderizado de ecuaciones LaTeX
- [Tailwind CSS](https://tailwindcss.com/) - Estilos utilitarios

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/[usuario]/EconIntuition.git
cd EconIntuition

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Estructura del Proyecto

```
EconIntuition/
├── src/
│   ├── app/                # Paginas Next.js
│   ├── components/         # Componentes React
│   │   ├── math/          # Ecuaciones LaTeX
│   │   ├── animations/    # Graficos animados
│   │   ├── interactive/   # Controles de parametros
│   │   └── models/        # Modelos economicos
│   └── lib/               # Utilidades
├── content/               # Contenido MDX
│   ├── micro/            # Microeconomia
│   ├── macro/            # Macroeconomia
│   └── econometria/      # Econometria
└── .claude/              # Configuracion de agentes IA
```

## Curriculum

### Microeconomia
- Preferencias y utilidad
- Restriccion presupuestaria
- Eleccion del consumidor
- Demanda y oferta
- Equilibrio de mercado

### Macroeconomia
- Cuentas nacionales
- Modelo IS-LM
- Mundell-Fleming
- Modelo de Solow

### Econometria
- Regresion lineal
- Series de tiempo
- Datos de panel

## Desarrollo con Agentes IA

Este proyecto incluye configuracion para agentes de Claude Code que ayudan a generar contenido:

- `econ-content-writer` - Genera contenido educativo
- `econ-animator` - Crea visualizaciones y animaciones
- `econ-model-builder` - Construye modelos interactivos

Ver `CLAUDE.md` para documentacion completa.

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de produccion
npm run start    # Servidor de produccion
npm run lint     # Verificar codigo
```

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-leccion`)
3. Commit tus cambios (`git commit -m 'Agregar leccion de elasticidades'`)
4. Push a la rama (`git push origin feature/nueva-leccion`)
5. Abre un Pull Request

## Licencia

MIT
