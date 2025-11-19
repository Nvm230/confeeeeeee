import { useEffect, useCallback } from 'react';
import { Task } from '../types';

export function useNotifications(tasks: Task[], enabled: boolean = true) {
  const checkDueDates = useCallback(() => {
    if (!enabled) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach((task) => {
      if (!task.dueDate || task.status === 'COMPLETED') return;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Notificar si está vencida o vence en los próximos 3 días
      if (daysUntilDue < 0) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`⚠️ Tarea Vencida: ${task.title}`, {
            body: `La tarea "${task.title}" estaba programada para ${new Date(task.dueDate).toLocaleDateString('es-ES')}`,
            icon: '/favicon.ico',
          });
        }
      } else if (daysUntilDue <= 3 && daysUntilDue >= 0) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`📅 Tarea Próxima: ${task.title}`, {
            body: `La tarea "${task.title}" vence en ${daysUntilDue === 0 ? 'hoy' : `${daysUntilDue} día(s)`}`,
            icon: '/favicon.ico',
          });
        }
      }
    });
  }, [tasks, enabled]);

  useEffect(() => {
    // Solicitar permiso para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    checkDueDates();
    const interval = setInterval(checkDueDates, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [checkDueDates, enabled]);
}

