import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Project, ProjectStatus } from '../../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<ProjectStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  ON_HOLD: 'bg-yellow-100 text-yellow-800',
};

const statusLabels: Record<ProjectStatus, string> = {
  ACTIVE: 'Activo',
  COMPLETED: 'Completado',
  ON_HOLD: 'En Pausa',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <Link
          to={`/projects/${project.id}`}
          className="flex-1 hover:text-blue-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        </Link>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${statusColors[project.status]}`}
        >
          {statusLabels[project.status]}
        </span>
      </div>

      {project.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
      )}

      {project.tasks && (
        <p className="text-sm text-gray-500 mb-3">
          {project.tasks.length} {project.tasks.length === 1 ? 'tarea' : 'tareas'}
        </p>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onEdit(project)} className="text-sm px-3 py-1">
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(project.id)} className="text-sm px-3 py-1">
          Eliminar
        </Button>
      </div>
    </Card>
  );
};

