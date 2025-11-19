import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { projectService } from '../services/projectService';
import { Project, ProjectFormData } from '../types';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProjects = async (page: number = 1, searchTerm: string = '') => {
    setLoading(true);
    try {
      const response = await projectService.getProjects(page, 10, searchTerm);
      setProjects(response.projects);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = () => {
    setEditingProject(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      return;
    }

    try {
      await projectService.deleteProject(id);
      loadProjects(currentPage, search);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, data);
      } else {
        await projectService.createProject(data);
      }
      setIsModalOpen(false);
      setEditingProject(undefined);
      loadProjects(currentPage, search);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects(1, search);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
          <Button onClick={handleCreate}>Crear Proyecto</Button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Buscar</Button>
        </form>

        {loading ? (
          <div className="text-center text-gray-600">Cargando proyectos...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No hay proyectos disponibles
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => loadProjects(currentPage - 1, search)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => loadProjects(currentPage + 1, search)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(undefined);
        }}
        title={editingProject ? 'Editar Proyecto' : 'Crear Proyecto'}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProject(undefined);
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </Layout>
  );
};

