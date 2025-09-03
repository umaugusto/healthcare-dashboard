'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Activity } from 'lucide-react'
import { useRealtimeData } from '@/lib/hooks/useRealtimeData'

export const RealtimeIndicator: React.FC = () => {
  const { stats, isConnected } = useRealtimeData()

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg
          ${isConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
        `}
      >
        {/* Status de Conexão */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Conectado</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700 font-medium">Desconectado</span>
            </>
          )}
        </div>

        {/* Stats em Tempo Real */}
        {isConnected && (
          <div className="flex items-center gap-4 border-l border-gray-300 pl-3">
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">
                {stats.novos_atendimentos_hoje}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">
                {stats.novos_pacientes_hoje}
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              Hoje
            </div>
          </div>
        )}

        {/* Indicador de Atividade */}
        <motion.div
          animate={{ 
            scale: isConnected ? [1, 1.2, 1] : 1,
            opacity: isConnected ? [1, 0.5, 1] : 0.5
          }}
          transition={{ 
            duration: 2, 
            repeat: isConnected ? Infinity : 0,
            ease: "easeInOut"
          }}
          className={`
            w-2 h-2 rounded-full
            ${isConnected ? 'bg-green-500' : 'bg-red-500'}
          `}
        />
      </motion.div>
    </div>
  )
}

export default RealtimeIndicator