import React, { useEffect, useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { TaskFormData, Task, TaskPriority, Project, TeamMember } from '../../types';
import { TASK_PRIORITIES } from '../../utils/constants';
import { projectService } from '../../services/projectService';
import { teamService } from '../../services/teamService';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    projectId: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: '',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsResponse, membersResponse] = await Promise.all([
          projectService.getProjects(1, 100),
          teamService.getMembers(),
        ]);
        setProjects(projectsResponse.projects);
        setTeamMembers(membersResponse);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingProjects(false);
        setLoadingMembers(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        projectId: task.projectId,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedTo: task.assignedTo ? String(task.assignedTo) : '',
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica antes de enviar
    if (!formData.title || !formData.title.trim()) {
      alert('El título es requerido');
      return;
    }
    
    if (!formData.projectId || !formData.projectId.trim()) {
      alert('Debes seleccionar un proyecto');
      return;
    }
    
    if (!formData.priority) {
      alert('Debes seleccionar una prioridad');
      return;
    }
    
    // Limpiar los datos: remover campos opcionales vacíos
    const data: TaskFormData = {
      title: formData.title.trim(),
      projectId: formData.projectId.trim(),
      priority: formData.priority.trim() as any,
    };
    
    // Solo agregar campos opcionales si tienen valor
    if (formData.description && formData.description.trim()) {
      data.description = formData.description.trim();
    }
    if (formData.dueDate && formData.dueDate.trim()) {
      data.dueDate = formData.dueDate.trim();
    }
    if (formData.assignedTo && formData.assignedTo.trim()) {
      data.assignedTo = formData.assignedTo.trim();
    }
    
    console.log('TaskForm - Datos enviados:', JSON.stringify(data, null, 2));
    
    onSubmit(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título de la Tarea"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
        {loadingProjects ? (
          <div className="text-sm text-gray-500">Cargando proyectos...</div>
        ) : (
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Fecha Límite"
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Asignar a
        </label>
        {loadingMembers ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Cargando usuarios...</div>
        ) : (
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Sin asignar</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {task ? 'Actualizar' : 'Crear'} Tarea
        </Button>
      </div>
    </form>
  );
};

