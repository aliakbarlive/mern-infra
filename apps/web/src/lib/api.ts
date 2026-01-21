import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  withCredentials: true,
});

export interface ApiError {
  message: string;
  details?: unknown;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    if (data?.error?.message) return data.error.message;
    if (typeof data === 'string') return data;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
