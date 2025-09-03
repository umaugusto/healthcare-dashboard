'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'

export interface RealtimeStats {
  novos_atendimentos_hoje: number
  novos_pacientes_hoje: number
  exames_realizados_hoje: number
  last_update: string
}

export function useRealtimeData() {
  const [stats, setStats] = useState<RealtimeStats>({
    novos_atendimentos_hoje: 0,
    novos_pacientes_hoje: 0,
    exames_realizados_hoje: 0,
    last_update: new Date().toISOString()
  })
  const [isConnected, setIsConnected] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    console.log('🔄 Iniciando conexão Realtime com Supabase...')

    // Canal principal para updates do dashboard
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'atendimentos'
        },
        (payload) => {
          console.log('📊 Novo atendimento inserido:', payload.new)
          
          // Atualizar stats locais
          setStats(prev => ({
            ...prev,
            novos_atendimentos_hoje: prev.novos_atendimentos_hoje + 1,
            last_update: new Date().toISOString()
          }))

          // Invalidar queries relacionadas para refetch
          queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
          queryClient.invalidateQueries({ queryKey: ['atendimentos-data'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pacientes'
        },
        (payload) => {
          console.log('👤 Novo paciente cadastrado:', payload.new)
          
          setStats(prev => ({
            ...prev,
            novos_pacientes_hoje: prev.novos_pacientes_hoje + 1,
            last_update: new Date().toISOString()
          }))

          queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
          queryClient.invalidateQueries({ queryKey: ['pacientes'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'exames_laboratoriais'
        },
        (payload) => {
          console.log('🧪 Novo exame realizado:', payload.new)
          
          setStats(prev => ({
            ...prev,
            exames_realizados_hoje: prev.exames_realizados_hoje + 1,
            last_update: new Date().toISOString()
          }))

          queryClient.invalidateQueries({ queryKey: ['exames-data'] })
        }
      )
      .subscribe((status) => {
        console.log('🔗 Status da conexão Realtime:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Buscar stats iniciais do dia
    const fetchTodayStats = async () => {
      const hoje = new Date().toISOString().split('T')[0]
      
      try {
        // Atendimentos hoje
        const { data: atendimentos } = await supabase
          .from('atendimentos')
          .select('id')
          .gte('created_at', `${hoje}T00:00:00.000Z`)

        // Pacientes hoje  
        const { data: pacientes } = await supabase
          .from('pacientes')
          .select('id')
          .gte('created_at', `${hoje}T00:00:00.000Z`)

        // Exames hoje
        const { data: exames } = await supabase
          .from('exames_laboratoriais')
          .select('id')
          .gte('created_at', `${hoje}T00:00:00.000Z`)

        setStats({
          novos_atendimentos_hoje: atendimentos?.length || 0,
          novos_pacientes_hoje: pacientes?.length || 0,
          exames_realizados_hoje: exames?.length || 0,
          last_update: new Date().toISOString()
        })

        console.log('📊 Stats do dia carregadas:', {
          atendimentos: atendimentos?.length || 0,
          pacientes: pacientes?.length || 0,
          exames: exames?.length || 0
        })

      } catch (error) {
        console.error('❌ Erro ao buscar stats do dia:', error)
      }
    }

    fetchTodayStats()

    // Cleanup na desmontagem
    return () => {
      console.log('🔌 Desconectando Realtime...')
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return {
    stats,
    isConnected,
    refreshStats: async () => {
      const hoje = new Date().toISOString().split('T')[0]
      
      try {
        const [atendimentos, pacientes, exames] = await Promise.all([
          supabase.from('atendimentos').select('id').gte('created_at', `${hoje}T00:00:00.000Z`),
          supabase.from('pacientes').select('id').gte('created_at', `${hoje}T00:00:00.000Z`),
          supabase.from('exames_laboratoriais').select('id').gte('created_at', `${hoje}T00:00:00.000Z`)
        ])

        setStats({
          novos_atendimentos_hoje: atendimentos.data?.length || 0,
          novos_pacientes_hoje: pacientes.data?.length || 0,
          exames_realizados_hoje: exames.data?.length || 0,
          last_update: new Date().toISOString()
        })
      } catch (error) {
        console.error('❌ Erro ao atualizar stats:', error)
      }
    }
  }
}

// Hook para notificações em tempo real
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'success' | 'info' | 'warning' | 'error'
    title: string
    message: string
    timestamp: string
  }>>([])

  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public'
        },
        (payload) => {
          const { eventType, table, new: newRecord } = payload
          
          let notification = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'info' as const,
            title: 'Atualização em Tempo Real',
            message: `${eventType} em ${table}`,
            timestamp: new Date().toISOString()
          }

          if (table === 'atendimentos' && eventType === 'INSERT') {
            notification = {
              ...notification,
              type: 'success',
              title: 'Novo Atendimento',
              message: `Atendimento ${newRecord?.tipo_atendimento || ''} registrado`
            }
          }

          if (table === 'pacientes' && eventType === 'INSERT') {
            notification = {
              ...notification,
              type: 'success', 
              title: 'Novo Paciente',
              message: `Paciente ${newRecord?.nome || 'sem nome'} cadastrado`
            }
          }

          setNotifications(prev => [notification, ...prev].slice(0, 10)) // Manter últimas 10
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return {
    notifications,
    clearNotification: (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    },
    clearAll: () => setNotifications([])
  }
}