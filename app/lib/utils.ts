import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://signa-backend-production-795b.up.railway.app/api'
  : 'http://localhost:5000/api';