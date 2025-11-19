import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Task, TaskStatus, TaskPriority } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
}

const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'Por Hacer',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'bg-gray-500',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <Link to={`/tasks/${task.id}`} className="flex-1 hover:text-blue-600 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        </Link>
        <div className="flex gap-2 items-center">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${statusColors[task.status]}`}
          >
            {statusLabels[task.status]}
          </span>
          <span className={`px-2 py-1 text-xs rounded text-white ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex justify-between items-center mb-3">
        {task.project && (
          <Link
            to={`/projects/${task.projectId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            {task.project.name}
          </Link>
        )}
        {task.dueDate && (
          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {isOverdue ? '⚠ ' : ''}
            Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
          </span>
        )}
      </div>

      {task.assignedUser && (
        <p className="text-sm text-gray-600 mb-3">
          Asignada a: <span className="font-medium">{task.assignedUser.name}</span>
        </p>
      )}

      <div className="flex gap-2">
        {onStatusChange && task.status !== 'COMPLETED' && (
          <Button
            variant="outline"
            onClick={() => onStatusChange(task.id, 'COMPLETED')}
            className="text-sm px-3 py-1"
          >
            Completar
          </Button>
        )}
        <Button variant="outline" onClick={() => onEdit(task)} className="text-sm px-3 py-1">
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(task.id)} className="text-sm px-3 py-1">
          Eliminar
        </Button>
      </div>
    </Card>
  );
};

