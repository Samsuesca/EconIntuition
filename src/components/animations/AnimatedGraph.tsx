'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import * as d3 from 'd3'

interface Point {
  x: number
  y: number
}

interface Curve {
  id: string
  points: Point[]
  color: string
  label: string
  dashed?: boolean
}

interface AnimatedGraphProps {
  width?: number
  height?: number
  curves: Curve[]
  xLabel?: string
  yLabel?: string
  title?: string
  equilibrium?: Point
  animationDuration?: number
  showGrid?: boolean
}

export function AnimatedGraph({
  width = 600,
  height = 400,
  curves,
  xLabel = 'X',
  yLabel = 'Y',
  title,
  equilibrium,
  animationDuration = 2,
  showGrid = true,
}: AnimatedGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()

  const margin = { top: 40, right: 40, bottom: 60, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  useEffect(() => {
    if (!svgRef.current || curves.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Calcular dominios
    const allPoints = curves.flatMap(c => c.points)
    const xExtent = d3.extent(allPoints, d => d.x) as [number, number]
    const yExtent = d3.extent(allPoints, d => d.y) as [number, number]

    const xScale = d3.scaleLinear()
      .domain([0, xExtent[1] * 1.1])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, yExtent[1] * 1.1])
      .range([innerHeight, 0])

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Grid
    if (showGrid) {
      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(d3.axisBottom(xScale).tickSize(innerHeight).tickFormat(() => ''))

      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''))
    }

    // Ejes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 45)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .text(xLabel)

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .text(yLabel)

    // Titulo
    if (title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .attr('font-weight', 'bold')
        .text(title)
    }

    // Linea generadora
    const line = d3.line<Point>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX)

    // Dibujar curvas con animacion
    curves.forEach((curve, i) => {
      const path = g.append('path')
        .datum(curve.points)
        .attr('fill', 'none')
        .attr('stroke', curve.color)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', curve.dashed ? '8,4' : 'none')
        .attr('d', line)

      // Animacion de dibujo
      const totalLength = path.node()?.getTotalLength() || 0
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .delay(i * 500)
        .duration(animationDuration * 1000)
        .ease(d3.easeQuadOut)
        .attr('stroke-dashoffset', 0)
        .attr('stroke-dasharray', curve.dashed ? '8,4' : 'none')

      // Label de la curva
      const lastPoint = curve.points[curve.points.length - 1]
      g.append('text')
        .attr('x', xScale(lastPoint.x) + 10)
        .attr('y', yScale(lastPoint.y))
        .attr('fill', curve.color)
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .attr('opacity', 0)
        .text(curve.label)
        .transition()
        .delay(i * 500 + animationDuration * 1000)
        .duration(500)
        .attr('opacity', 1)
    })

    // Punto de equilibrio
    if (equilibrium) {
      const eqGroup = g.append('g')
        .attr('opacity', 0)

      // Lineas punteadas al equilibrio
      eqGroup.append('line')
        .attr('x1', xScale(equilibrium.x))
        .attr('y1', innerHeight)
        .attr('x2', xScale(equilibrium.x))
        .attr('y2', yScale(equilibrium.y))
        .attr('stroke', '#666')
        .attr('stroke-dasharray', '4,4')

      eqGroup.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(equilibrium.y))
        .attr('x2', xScale(equilibrium.x))
        .attr('y2', yScale(equilibrium.y))
        .attr('stroke', '#666')
        .attr('stroke-dasharray', '4,4')

      // Punto
      eqGroup.append('circle')
        .attr('cx', xScale(equilibrium.x))
        .attr('cy', yScale(equilibrium.y))
        .attr('r', 8)
        .attr('fill', '#22c55e')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)

      // Label
      eqGroup.append('text')
        .attr('x', xScale(equilibrium.x) + 15)
        .attr('y', yScale(equilibrium.y) - 10)
        .attr('fill', '#22c55e')
        .attr('font-weight', 'bold')
        .text('E')

      eqGroup
        .transition()
        .delay(curves.length * 500 + animationDuration * 1000)
        .duration(500)
        .attr('opacity', 1)
    }

  }, [curves, equilibrium, width, height, xLabel, yLabel, title, animationDuration, showGrid])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onViewportEnter={() => setIsVisible(true)}
      className="graph-container flex items-center justify-center"
    >
      <svg ref={svgRef} width={width} height={height} />
    </motion.div>
  )
}
