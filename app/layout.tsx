import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard APS - Sistema de Saúde Populacional',
  description: 'Dashboard completo para monitoramento de indicadores de Atenção Primária à Saúde',
  keywords: ['APS', 'saúde', 'dashboard', 'população', 'indicadores'],
  authors: [{ name: 'Dashboard APS Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}