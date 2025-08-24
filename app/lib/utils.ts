import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = 'https://signa-backend-production-795b.up.railway.app/api';

console.log('🚀 API_BASE_URL configurada:', API_BASE_URL);