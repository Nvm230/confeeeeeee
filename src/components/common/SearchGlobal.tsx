import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from './Input';
import { Project, Task } from '../../types';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';

interface SearchGlobalProps {
  onClose: () => void;
}

export const SearchGlobal: React.FC<SearchGlobalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setProjects([]);
      setTasks([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          projectService.getProjects(1, 20, query),
          taskService.getTasks({ limit: 20 }),
        ]);

        // Filtrar tareas por título o descripción que coincidan con la búsqueda
        const filteredTasks = tasksResponse.tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description?.toLowerCase().includes(query.toLowerCase())
        );

        setProjects(projectsResponse.projects);
        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold dark:text-white">Búsqueda Global</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <Input
            placeholder="Buscar proyectos y tareas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-400">Buscando...</div>
          ) : query.length < 2 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Escribe al menos 2 caracteres para buscar</div>
          ) : (
            <>
              {projects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Proyectos ({projects.length})</h3>
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        onClick={onClose}
                        className="block p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors"
                      >
                        <div className="font-medium dark:text-white">{project.name}</div>
                        {project.description && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {tasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Tareas ({tasks.length})</h3>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <Link
                        key={task.id}
                        to={`/tasks/${task.id}`}
                        onClick={onClose}
                        className="block p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors"
                      >
                        <div className="font-medium dark:text-white">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</div>
                        )}
                        {task.project && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Proyecto: {task.project.name}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {projects.length === 0 && tasks.length === 0 && query.length >= 2 && (
                <div className="text-center text-gray-500 dark:text-gray-400">No se encontraron resultados</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

