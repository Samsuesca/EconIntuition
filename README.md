# Modelo IS-LM Interactivo

Una aplicación web educativa e interactiva para visualizar y analizar el modelo macroeconómico IS-LM, desarrollada con Streamlit.

## Descripcion

El modelo **IS-LM** (Investment-Saving / Liquidity preference-Money supply) es uno de los modelos fundamentales en macroeconomia. Esta aplicacion permite:

- Visualizar las curvas IS y LM de forma interactiva
- Calcular el equilibrio del mercado (Y*, i*)
- Simular desplazamientos de las curvas mediante cambios en los parametros
- Exportar los resultados a CSV
- Ver el procedimiento matematico paso a paso

## Capturas de Pantalla

La aplicacion incluye:
- Grafico del mercado de bienes (construccion IS)
- Grafico del mercado de dinero (construccion LM)
- Grafico del equilibrio IS-LM con puntos de equilibrio marcados

## Instalacion

### Requisitos Previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de Instalacion

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd ISLM
```

2. Crear un entorno virtual (recomendado):
```bash
python -m venv env
source env/bin/activate  # En Linux/Mac
# o
env\Scripts\activate  # En Windows
```

3. Instalar las dependencias:
```bash
pip install -r requirements.txt
```

## Uso

Ejecutar la aplicacion:

```bash
streamlit run app.py
```

La aplicacion se abrira en tu navegador en `http://localhost:8501`.

### Parametros del Modelo

#### Mercado de Dinero (Curva LM)
| Parametro | Simbolo | Descripcion |
|-----------|---------|-------------|
| Oferta Monetaria | M | Cantidad de dinero en la economia |
| Nivel de Precios | P | Indice general de precios |
| Sensibilidad Renta | k | Sensibilidad de la demanda de dinero a la renta |
| Sensibilidad Interes | h | Sensibilidad de la demanda de dinero al tipo de interes |

#### Mercado de Bienes (Curva IS)
| Parametro | Simbolo | Descripcion |
|-----------|---------|-------------|
| Prop. Marginal Consumo | c | Proporcion del ingreso que se destina al consumo (0-1) |
| Tasa Impositiva | t | Proporcion del ingreso que se paga en impuestos (0-1) |
| Sensibilidad Inversion | b | Sensibilidad de la inversion al tipo de interes |
| Consumo Autonomo | Ca | Consumo que no depende del ingreso |
| Impuesto Autonomo | Ta | Impuestos que no dependen del ingreso |
| Inversion Autonoma | Ia | Inversion que no depende del tipo de interes |
| Transferencias | Tr | Transferencias del gobierno a los hogares |
| Gasto Publico | G | Gasto del gobierno |
| Exportaciones Netas | NX | Exportaciones menos importaciones |

## Estructura del Proyecto

```
ISLM/
├── app.py              # Aplicacion principal Streamlit
├── ISLM.py             # Clase ISLMProcess con la logica del modelo
├── is_lm.py            # Funciones auxiliares (legacy)
├── Utils/
│   ├── __init__.py
│   └── utils_sp.py     # Clase Equation para calculos simbolicos
├── equation.txt        # Ecuaciones del modelo en LaTeX
├── book.pdf            # Libro de referencia (Macroeconomia - Dornbusch)
├── islm.jpg            # Imagen explicativa del modelo
├── requirements.txt    # Dependencias del proyecto
└── README.md           # Este archivo
```

## Ecuaciones del Modelo

### Curva LM (Mercado de Dinero)
```
Demanda de dinero: L = kY - hi
Oferta real: M/P
Equilibrio: M/P = kY - hi
Curva LM: Y = (M/P)/k + (h/k)i
```

### Curva IS (Mercado de Bienes)
```
Demanda Agregada Autonoma: A = Ca + Ia + G + NX + c(Tr - Ta)
Curva IS: Y = (A - bi) / (1 - c(1-t))
```

### Equilibrio
El equilibrio se encuentra en la interseccion de las curvas IS y LM, donde:
- Y* = Producto de equilibrio
- i* = Tasa de interes de equilibrio

## Funcionalidades

- **Entrada interactiva de parametros**: Modifica los valores usando controles numericos
- **Visualizacion en tiempo real**: Los graficos se actualizan automaticamente
- **Analisis de desplazamientos**: Simula politicas fiscales y monetarias
- **Exportacion de resultados**: Descarga los resultados en formato CSV
- **Procedimiento matematico**: Ver el desarrollo algebraico paso a paso

## Tecnologias Utilizadas

- **Streamlit**: Framework para la interfaz web
- **SymPy**: Calculos matematicos simbolicos
- **NumPy**: Operaciones numericas
- **Matplotlib**: Generacion de graficos
- **Pandas**: Manejo de datos

## Referencias

- Dornbusch, R., Fischer, S., & Startz, R. (2014). *Macroeconomia* (12va edicion).
- Blanchard, O. (2017). *Macroeconomia* (7ma edicion).

## Licencia

Este proyecto es de uso educativo.

## Autor

Desarrollado como herramienta educativa para cursos de Macroeconomia.
