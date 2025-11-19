import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { projectService } from '../services/projectService';
import { Project } from '../types';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      try {
        const projectData = await projectService.getProject(id);
        setProject(projectData);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-gray-600">Cargando proyecto...</div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center text-gray-500">Proyecto no encontrado</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Link to="/projects" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Volver a Proyectos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 mt-2">{project.description}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              project.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : project.status === 'COMPLETED'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {project.status}
          </span>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Tareas del Proyecto</h2>
          {project.tasks && project.tasks.length > 0 ? (
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          task.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded text-white ${
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
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay tareas en este proyecto</p>
          )}
        </Card>
      </div>
    </Layout>
  );
};

