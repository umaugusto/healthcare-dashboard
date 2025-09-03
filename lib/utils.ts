import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funções utilitárias globais para o projeto.
export const formatNumber = (num: number) => {
  return num.toLocaleString('pt-BR');
};