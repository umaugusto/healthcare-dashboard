'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DonutSegment {
  label: string
  value: number
  percentage: number
  color: string
  absoluteValue?: number
}

interface DonutChartProps {
  title: string
  data: DonutSegment[]
  centerValue?: {
    label: string
    value: string | number
  }
  size?: 'sm' | 'md' | 'lg'
  showLegend?: boolean
  showTooltip?: boolean
  onSegmentClick?: (segment: DonutSegment) => void
  isLoading?: boolean
  className?: string
}

const sizeVariants = {
  sm: { width: 200, height: 200, innerRadius: 60, outerRadius: 90 },
  md: { width: 280, height: 280, innerRadius: 80, outerRadius: 120 },
  lg: { width: 350, height: 350, innerRadius: 100, outerRadius: 150 }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    
    // Validar se os dados existem
    if (!data || data.label === undefined) {
      return null
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 rounded-lg shadow-lg p-3"
      >
        <p className="font-medium text-gray-900">{data.label}</p>
        <p className="text-sm text-gray-600">
          Valor: {(data.value || 0).toLocaleString('pt-BR')}
        </p>
        <p className="text-sm text-gray-600">
          Percentual: {data.percentage || 0}%
        </p>
      </motion.div>
    )
  }
  return null
}

const CustomLegend = ({ payload, onLegendClick }: any) => {
  // Validar se payload existe e é um array
  if (!payload || !Array.isArray(payload)) {
    return null
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <motion.div
          key={index}
          className="flex items-center space-x-2 px-3 py-1 rounded-full border cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onLegendClick?.(entry)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-gray-700">
            {entry.label}
          </span>
          <span className="text-xs text-gray-500">
            {entry.percentage}%
          </span>
        </motion.div>
      ))}
    </div>
  )
}

const CenterLabel = ({ centerValue, size }: { centerValue: any, size: keyof typeof sizeVariants }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5, duration: 0.4 }}
    className="absolute inset-0 flex items-center justify-center"
    style={{
      width: sizeVariants[size].width,
      height: sizeVariants[size].height
    }}
  >
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900">
        {typeof centerValue.value === 'number' 
          ? centerValue.value.toLocaleString('pt-BR') 
          : centerValue.value
        }
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {centerValue.label}
      </div>
    </div>
  </motion.div>
)

export const DonutChart: React.FC<DonutChartProps> = ({
  title,
  data,
  centerValue,
  size = 'md',
  showLegend = true,
  showTooltip = true,
  onSegmentClick,
  isLoading = false,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const dimensions = sizeVariants[size]

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(undefined)
  }

  const handleClick = (entry: DonutSegment) => {
    onSegmentClick?.(entry)
  }

  // Validar se os dados existem e são válidos
  if (!data || !Array.isArray(data) || data.length === 0) {
    if (isLoading) {
      // Mostrar loading se estiver carregando
    } else {
      return (
        <Card className={cn('', className)}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-gray-500">
              Nenhum dado disponível
            </div>
          </CardContent>
        </Card>
      )
    }
  }

  if (isLoading) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200" style={{
              width: dimensions.width,
              height: dimensions.height
            }} />
            {showLegend && (
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative">
            <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={dimensions.innerRadius}
                  outerRadius={dimensions.outerRadius}
                  dataKey="value"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(entry) => handleClick(entry)}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={activeIndex === index ? '#ffffff' : 'transparent'}
                      strokeWidth={activeIndex === index ? 3 : 0}
                      style={{
                        filter: activeIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                        cursor: onSegmentClick ? 'pointer' : 'default'
                      }}
                    />
                  ))}
                </Pie>
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
              </PieChart>
            </ResponsiveContainer>

            {centerValue && (
              <CenterLabel centerValue={centerValue} size={size} />
            )}
          </div>

          {showLegend && (
            <CustomLegend 
              payload={data} 
              onLegendClick={onSegmentClick}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente específico para dados demográficos
interface DemographicData {
  composicaoFamiliar: Array<{ label: string; count: number; percentage: number }>
  distribuicaoSexo: Array<{ label: string; count: number; percentage: number }>
  distribuicaoEtaria: Array<{ label: string; count: number; percentage: number }>
  tempoPrograma?: Array<{ label: string; count: number; percentage: number }>
}

export const DemographicCharts: React.FC<{
  data: DemographicData
  totalPacientes: number
  isLoading?: boolean
}> = ({ data, totalPacientes, isLoading = false }) => {
  // Cores EXATAS do protótipo original (baseadas em chartsData.ts)
  const familyColors = ['#9333ea', '#c4b5fd'] // roxo escuro, roxo claro
  const genderColors = ['#db2777', '#2563eb'] // rosa, azul
  const ageColors = ['#f59e0b', '#3b82f6', '#1e40af', '#1e3a8a'] // laranja, azul, azul escuro, azul muito escuro

  const familyData = data.composicaoFamiliar.map((item, index) => ({
    label: item.label,
    value: item.count,
    percentage: item.percentage,
    color: familyColors[index] || '#6b7280'
  }))

  const genderData = data.distribuicaoSexo.map((item, index) => ({
    label: item.label,
    value: item.count,
    percentage: item.percentage,
    color: genderColors[index] || '#6b7280'
  }))

  const ageData = data.distribuicaoEtaria.map((item, index) => ({
    label: item.label,
    value: item.count,
    percentage: item.percentage,
    color: ageColors[index] || '#6b7280'
  }))

  // Cores para tempo no programa (do protótipo original)
  const tempoColors = ['#f59e0b', '#10b981', '#059669', '#047857'] // laranja, verde, verde escuro, verde muito escuro

  const tempoData = (data.tempoPrograma || []).map((item, index) => ({
    label: item.label,
    value: item.count,
    percentage: item.percentage,
    color: tempoColors[index] || '#6b7280'
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DonutChart
        title="Composição Familiar"
        data={familyData}
        centerValue={{
          label: 'Total',
          value: totalPacientes
        }}
        size="md"
        isLoading={isLoading}
      />

      <DonutChart
        title="Distribuição por Sexo"
        data={genderData}
        centerValue={{
          label: 'Total',
          value: totalPacientes
        }}
        size="md"
        isLoading={isLoading}
      />

      <DonutChart
        title="Distribuição Etária"
        data={ageData}
        centerValue={{
          label: 'Total',
          value: totalPacientes
        }}
        size="md"
        isLoading={isLoading}
      />

      <DonutChart
        title="Tempo no Programa"
        data={tempoData}
        centerValue={{
          label: 'Total',
          value: totalPacientes
        }}
        size="md"
        isLoading={isLoading}
      />
    </div>
  )
}