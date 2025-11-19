export const API_BASE_URL = 'https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1';

export const TOKEN_KEY = 'techflow_token';

export const PROJECT_STATUSES: { value: string; label: string }[] = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'ON_HOLD', label: 'En Pausa' },
];

export const TASK_STATUSES: { value: string; label: string }[] = [
  { value: 'TODO', label: 'Por Hacer' },
  { value: 'IN_PROGRESS', label: 'En Progreso' },
  { value: 'COMPLETED', label: 'Completada' },
];

export const TASK_PRIORITIES: { value: string; label: string; color: string }[] = [
  { value: 'LOW', label: 'Baja', color: 'bg-gray-500' },
  { value: 'MEDIUM', label: 'Media', color: 'bg-blue-500' },
  { value: 'HIGH', label: 'Alta', color: 'bg-orange-500' },
  { value: 'URGENT', label: 'Urgente', color: 'bg-red-500' },
];

