import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
  ? 'https://signa-backend-production-795b.up.railway.app/api'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';