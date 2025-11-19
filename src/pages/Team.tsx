import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { teamService } from '../services/teamService';
import { TeamMember, Task } from '../types';
import { Link } from 'react-router-dom';

export const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberTasks, setMemberTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const membersData = await teamService.getMembers();
        setMembers(membersData);
      } catch (error) {
        console.error('Error loading team members:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const loadMemberTasks = async (memberId: number) => {
    setLoadingTasks(true);
    try {
      const response = await teamService.getMemberTasks(memberId);
      setMemberTasks(response.tasks);
    } catch (error) {
      console.error('Error loading member tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    loadMemberTasks(member.id);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-gray-600">Cargando miembros del equipo...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Equipo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Miembros del Equipo</h2>
            {members.length === 0 ? (
              <p className="text-gray-500">No hay miembros en el equipo</p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleMemberClick(member)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMember?.id === member.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">
              {selectedMember
                ? `Tareas de ${selectedMember.name}`
                : 'Selecciona un miembro para ver sus tareas'}
            </h2>
            {selectedMember && (
              <>
                {loadingTasks ? (
                  <div className="text-center text-gray-600">Cargando tareas...</div>
                ) : memberTasks.length === 0 ? (
                  <p className="text-gray-500">Este miembro no tiene tareas asignadas</p>
                ) : (
                  <div className="space-y-3">
                    {memberTasks.map((task) => (
                      <Link
                        key={task.id}
                        to={`/tasks/${task.id}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            {task.project && (
                              <p className="text-sm text-gray-600 mt-1">
                                {task.project.name}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
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
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

