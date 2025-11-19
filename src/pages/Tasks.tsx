import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Pagination } from '../components/common/Pagination';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { teamService } from '../services/teamService';
import { usePolling } from '../hooks/usePolling';
import { Task, TaskFormData, TaskStatus, Project, UpdateTaskData, TeamMember } from '../types';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    projectId: '',
    status: '',
    priority: '',
    assignedTo: '',
  });

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
      }
    };

    loadData();
  }, []);

  const loadTasks = async (page: number = 1) => {
    setLoading(true);
    try {
      const taskFilters: any = {
        page,
        limit: itemsPerPage,
      };

      if (filters.projectId) taskFilters.projectId = filters.projectId;
      if (filters.status) taskFilters.status = filters.status;
      if (filters.priority) taskFilters.priority = filters.priority;
      if (filters.assignedTo) taskFilters.assignedTo = filters.assignedTo;

      const response = await taskService.getTasks(taskFilters);
      setTasks(response.tasks);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(1);
  }, [filters]);

  // Polling cada 5 segundos para actualizaciones en tiempo real
  usePolling(() => loadTasks(currentPage), 5000);

  const handleCreate = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return;
    }

    try {
      await taskService.deleteTask(id);
      loadTasks(currentPage);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(id, status);
      loadTasks(currentPage);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error al actualizar el estado de la tarea');
    }
  };

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        // Para actualizar, solo enviar los campos que están permitidos en UpdateTaskData
        const updateData: UpdateTaskData = {
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate,
          assignedTo: data.assignedTo,
        };
        await taskService.updateTask(editingTask.id, updateData);
      } else {
        await taskService.createTask(data);
      }
      setIsModalOpen(false);
      setEditingTask(undefined);
      loadTasks(currentPage);
    } catch (error: any) {
      console.error('Error saving task:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      // Mostrar el mensaje de error específico del servidor si está disponible
      let errorMessage = 'Error al guardar la tarea. Verifica que todos los campos requeridos estén completos.';
      
      if (error.response?.data) {
        // Intentar extraer el mensaje de error de diferentes formatos posibles
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (Array.isArray(errorData)) {
          errorMessage = errorData.map((err: any) => err.message || JSON.stringify(err)).join('\n');
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}\n\nRevisa la consola para más detalles.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters({
      ...filters,
      [name]: value,
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      projectId: '',
      status: '',
      priority: '',
      assignedTo: '',
    });
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Mapeo de columnas a estados
    const statusMap: Record<string, TaskStatus> = {
      todo: 'TODO',
      'in-progress': 'IN_PROGRESS',
      completed: 'COMPLETED',
    };

    const newStatus = statusMap[destination.droppableId];
    if (!newStatus) return;

    const taskId = draggableId;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      // Actualización optimista
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      await taskService.updateTaskStatus(taskId, newStatus);
      await loadTasks(currentPage);
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revertir en caso de error
      loadTasks(currentPage);
      alert('Error al actualizar el estado de la tarea');
    }
  };

  // Organizar tareas por estado para drag & drop
  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    COMPLETED: tasks.filter((t) => t.status === 'COMPLETED'),
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tareas</h1>
          <Button onClick={handleCreate}>Crear Tarea</Button>
        </div>

        <Card>
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proyecto</label>
              <select
                value={filters.projectId}
                onChange={(e) => handleFilterChange('projectId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos</option>
                {TASK_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas</option>
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asignado a
              </label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={String(member.id)}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400">Cargando tareas...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">No hay tareas disponibles</div>
        ) : (
          <>
            <div className="mb-4">
              <Button variant="outline" onClick={() => {
                const viewMode = localStorage.getItem('taskViewMode') || 'grid';
                localStorage.setItem('taskViewMode', viewMode === 'grid' ? 'kanban' : 'grid');
                window.location.reload();
              }}>
                {localStorage.getItem('taskViewMode') === 'kanban' ? '📋 Vista Grid' : '📊 Vista Kanban'}
              </Button>
            </div>

            {localStorage.getItem('taskViewMode') === 'kanban' ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['TODO', 'IN_PROGRESS', 'COMPLETED'] as TaskStatus[]).map((status) => (
                    <Droppable key={status} droppableId={status.toLowerCase().replace('_', '-')}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 rounded-lg min-h-[200px] ${
                            snapshot.isDraggingOver
                              ? 'bg-blue-100 dark:bg-blue-900'
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                        >
                          <h3 className="font-semibold mb-4 dark:text-white">
                            {TASK_STATUSES.find((s) => s.value === status)?.label || status} (
                            {tasksByStatus[status].length})
                          </h3>
                          <div className="space-y-3">
                            {tasksByStatus[status].map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`${
                                      snapshot.isDragging ? 'opacity-50' : ''
                                    } bg-white dark:bg-gray-700 rounded-lg shadow p-3`}
                                  >
                                    <div className="font-medium dark:text-white">{task.title}</div>
                                    {task.priority && (
                                      <span
                                        className={`inline-block mt-2 px-2 py-1 text-xs rounded text-white ${
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
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                loadTasks(page);
              }}
              totalItems={totalPages * itemsPerPage}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        title={editingTask ? 'Editar Tarea' : 'Crear Tarea'}
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(undefined);
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </Layout>
  );
};

