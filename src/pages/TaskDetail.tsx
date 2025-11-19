import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { taskService } from '../services/taskService';
import { Task, TaskStatus } from '../types';
import { TASK_STATUSES } from '../utils/constants';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      try {
        const taskData = await taskService.getTask(id);
        setTask(taskData);
      } catch (error) {
        console.error('Error loading task:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const handleStatusChange = async (status: TaskStatus) => {
    if (!task) return;
    setIsUpdating(true);
    try {
      await taskService.updateTaskStatus(task.id, status);
      const updatedTask = await taskService.getTask(task.id);
      setTask(updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error al actualizar el estado de la tarea');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-gray-600">Cargando tarea...</div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center text-gray-500">Tarea no encontrada</div>
      </Layout>
    );
  }

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Link to="/tasks" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Volver a Tareas
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${
                task.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : task.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {TASK_STATUSES.find((s) => s.value === task.status)?.label || task.status}
            </span>
            <span
              className={`px-3 py-1 rounded text-sm font-medium text-white ${
                task.priority === 'URGENT'
                  ? 'bg-red-500'
                  : task.priority === 'HIGH'
                  ? 'bg-orange-500'
                  : task.priority === 'MEDIUM'
                  ? 'bg-blue-500'
                  : 'bg-gray-500'
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              {task.description ? (
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              ) : (
                <p className="text-gray-500">Sin descripción</p>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Información</h2>
              <div className="space-y-3">
                {task.project && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Proyecto:</span>{' '}
                    <Link
                      to={`/projects/${task.projectId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {task.project.name}
                    </Link>
                  </div>
                )}
                {task.assignedUser && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Asignada a:</span>{' '}
                    <span className="text-gray-900">{task.assignedUser.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({task.assignedUser.email})
                    </span>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Fecha límite:</span>{' '}
                    <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
                      {isOverdue ? '⚠ ' : ''}
                      {new Date(task.dueDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {task.createdAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Creada:</span>{' '}
                    <span className="text-gray-900">
                      {new Date(task.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Acciones</h2>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Cambiar Estado</label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {TASK_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {task.status !== 'COMPLETED' && (
                  <Button
                    variant="primary"
                    onClick={() => handleStatusChange('COMPLETED')}
                    isLoading={isUpdating}
                    className="w-full"
                  >
                    Marcar como Completada
                  </Button>
                )}
                <Link to={`/tasks?edit=${task.id}`}>
                  <Button variant="outline" className="w-full">
                    Editar Tarea
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

