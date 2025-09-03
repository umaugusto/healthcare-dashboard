// components/shared/ClickableCard.tsx
// Wrapper component para tornar cards clicáveis e navegar para tabela com contexto

import React from 'react';
import { Card } from '../ui/card';

interface ClickableCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ClickableCard({ children, onClick, className = '', disabled = false }: ClickableCardProps) {
  return (
    <Card 
      className={`
        ${className}
        ${!disabled && onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.01]' : ''}
        relative group
      `}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Overlay indicator on hover */}
      {!disabled && onClick && (
        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200 rounded-lg pointer-events-none" />
      )}
      
      {/* Click indicator in corner */}
      {!disabled && onClick && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver detalhes
          </div>
        </div>
      )}
      
      {children}
    </Card>
  );
}