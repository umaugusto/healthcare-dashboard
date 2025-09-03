'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ComponentType<any>
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  isLoading?: boolean
  className?: string
  onClick?: () => void
}

const colorVariants = {
  primary: {
    card: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50',
    icon: 'text-blue-600 bg-blue-100',
    value: 'text-blue-900',
    trend: {
      positive: 'text-green-600 bg-green-100',
      negative: 'text-red-600 bg-red-100',
      neutral: 'text-gray-600 bg-gray-100'
    }
  },
  success: {
    card: 'border-green-200 bg-green-50/50 hover:bg-green-50',
    icon: 'text-green-600 bg-green-100',
    value: 'text-green-900',
    trend: {
      positive: 'text-green-600 bg-green-100',
      negative: 'text-red-600 bg-red-100',
      neutral: 'text-gray-600 bg-gray-100'
    }
  },
  warning: {
    card: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50',
    icon: 'text-amber-600 bg-amber-100',
    value: 'text-amber-900',
    trend: {
      positive: 'text-green-600 bg-green-100',
      negative: 'text-red-600 bg-red-100',
      neutral: 'text-gray-600 bg-gray-100'
    }
  },
  danger: {
    card: 'border-red-200 bg-red-50/50 hover:bg-red-50',
    icon: 'text-red-600 bg-red-100',
    value: 'text-red-900',
    trend: {
      positive: 'text-green-600 bg-green-100',
      negative: 'text-red-600 bg-red-100',
      neutral: 'text-gray-600 bg-gray-100'
    }
  },
  info: {
    card: 'border-cyan-200 bg-cyan-50/50 hover:bg-cyan-50',
    icon: 'text-cyan-600 bg-cyan-100',
    value: 'text-cyan-900',
    trend: {
      positive: 'text-green-600 bg-green-100',
      negative: 'text-red-600 bg-red-100',
      neutral: 'text-gray-600 bg-gray-100'
    }
  }
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  trend,
  isLoading = false,
  className,
  onClick
}) => {
  const colors = colorVariants[color]
  
  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.value > 0 && trend.isPositive) return TrendingUp
    if (trend.value < 0 && !trend.isPositive) return TrendingDown
    if (trend.value > 0 && !trend.isPositive) return TrendingDown
    if (trend.value < 0 && trend.isPositive) return TrendingUp
    return Minus
  }
  
  const getTrendColor = () => {
    if (!trend) return colors.trend.neutral
    if (trend.value === 0) return colors.trend.neutral
    if ((trend.value > 0 && trend.isPositive) || (trend.value < 0 && !trend.isPositive)) {
      return colors.trend.positive
    }
    return colors.trend.negative
  }
  
  const TrendIcon = getTrendIcon()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
    >
      <Card 
        className={cn(
          'transition-all duration-200 cursor-pointer',
          colors.card,
          onClick && 'hover:shadow-lg',
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          {Icon && (
            <div className={cn('p-2 rounded-full', colors.icon)}>
              <Icon size={16} />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ) : (
              <>
                <motion.div 
                  className={cn('text-2xl font-bold', colors.value)}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                >
                  {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                </motion.div>
                
                {subtitle && (
                  <p className="text-xs text-gray-500 mt-1">
                    {subtitle}
                  </p>
                )}
                
                {trend && (
                  <div className="flex items-center space-x-1 mt-2">
                    <div className={cn(
                      'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
                      getTrendColor()
                    )}>
                      {TrendIcon && <TrendIcon size={12} />}
                      <span>
                        {Math.abs(trend.value)}% {trend.label || 'vs mês anterior'}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Variações pré-definidas
export const KPICardPrimary: React.FC<Omit<KPICardProps, 'color'>> = (props) => (
  <KPICard {...props} color="primary" />
)

export const KPICardSuccess: React.FC<Omit<KPICardProps, 'color'>> = (props) => (
  <KPICard {...props} color="success" />
)

export const KPICardWarning: React.FC<Omit<KPICardProps, 'color'>> = (props) => (
  <KPICard {...props} color="warning" />
)

export const KPICardDanger: React.FC<Omit<KPICardProps, 'color'>> = (props) => (
  <KPICard {...props} color="danger" />
)