import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SearchGlobal } from '../components/common/SearchGlobal';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { usePolling } from '../hooks/usePolling';
import { useNotifications } from '../hooks/useNotifications';
import { exportToCSV } from '../utils/csvExport';
import { Task } from '../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [analytics, setAnalytics] = useState({
    highPriority: 0,
    urgentTasks: 0,
    completedThisWeek: 0,
    totalProjects: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadDashboard = async () => {
    try {
      const [tasksResponse, projectsResponse] = await Promise.all([
        taskService.getTasks({ limit: 100 }),
        projectService.getProjects(1, 100),
      ]);

      const allTasks = tasksResponse.tasks;
      setTasks(allTasks);

      const total = allTasks.length;
      const completed = allTasks.filter((t) => t.status === 'COMPLETED').length;
      const pending = allTasks.filter((t) => t.status !== 'COMPLETED').length;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const overdue = allTasks.filter((t) => {
        if (!t.dueDate || t.status === 'COMPLETED') return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
      }).length;

      // Analíticas avanzadas
      const highPriority = allTasks.filter((t) => t.priority === 'HIGH' && t.status !== 'COMPLETED').length;
      const urgentTasks = allTasks.filter((t) => t.priority === 'URGENT' && t.status !== 'COMPLETED').length;
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const completedThisWeek = allTasks.filter((t) => {
        if (t.status !== 'COMPLETED' || !t.updatedAt) return false;
        const updated = new Date(t.updatedAt);
        return updated >= weekAgo;
      }).length;

      setStats({ total, completed, pending, overdue });
      setAnalytics({
        highPriority,
        urgentTasks,
        completedThisWeek,
        totalProjects: projectsResponse.projects.length,
      });
      setRecentTasks(allTasks.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Polling cada 5 segundos para actualizaciones en tiempo real
  usePolling(loadDashboard, 5000);

  // Notificaciones para fechas límite
  useNotifications(tasks, true);

  const handleExportCSV = () => {
    const csvData = tasks.map((task) => ({
      'Título': task.title,
      'Descripción': task.description || '',
      'Estado': task.status,
      'Prioridad': task.priority,
      'Proyecto': task.project?.name || '',
      'Fecha Límite': task.dueDate || '',
      'Asignado a': task.assignedUser?.name || '',
      'Creada': task.createdAt || '',
    }));
    exportToCSV(csvData, `tareas-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-gray-600 dark:text-gray-400">Cargando estadísticas...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {showSearch && <SearchGlobal onClose={() => setShowSearch(false)} />}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSearch(true)}>
              🔍 Búsqueda Global
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              📊 Exportar CSV
            </Button>
            <Link to="/tasks">
              <Button>Crear Tarea</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Tareas</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completadas</div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pendientes</div>
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vencidas</div>
            <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
          </Card>
        </div>

        {/* Analíticas Avanzadas */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">📈 Analíticas Avanzadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Alta Prioridad</div>
              <div className="text-2xl font-bold text-orange-600">{analytics.highPriority}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Urgentes</div>
              <div className="text-2xl font-bold text-red-600">{analytics.urgentTasks}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completadas esta semana</div>
              <div className="text-2xl font-bold text-green-600">{analytics.completedThisWeek}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Proyectos</div>
              <div className="text-2xl font-bold text-blue-600">{analytics.totalProjects}</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Acciones Rápidas</h2>
            <div className="space-y-3">
              <Link to="/tasks">
                <Button className="w-full" variant="outline">
                  Ver Todas las Tareas
                </Button>
              </Link>
              <Link to="/projects">
                <Button className="w-full" variant="outline">
                  Ver Proyectos
                </Button>
              </Link>
              <Link to="/projects">
                <Button className="w-full" variant="outline">
                  Crear Proyecto
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Actividades Recientes</h2>
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No hay tareas recientes</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {task.project?.name || 'Sin proyecto'}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          task.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

