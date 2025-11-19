import { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User } from '../types';

export const Profile: React.FC = () => {
  const { user: contextUser, logout } = useAuth();
  const [user, setUser] = useState<User | null>(contextUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setError(err.response?.data?.message || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading && !user) {
    return (
      <Layout>
        <div className="text-center text-gray-600 dark:text-gray-400">Cargando perfil...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Card>
          <div className="text-center text-red-600 dark:text-red-400">
            {error || 'Error al cargar el perfil'}
          </div>
        </Card>
      </Layout>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Actualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Información Personal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Nombre
                </label>
                <div className="text-lg text-gray-900 dark:text-white font-medium">
                  {user.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </label>
                <div className="text-lg text-gray-900 dark:text-white">{user.email}</div>
              </div>

              {user.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Miembro desde
                  </label>
                  <div className="text-lg text-gray-900 dark:text-white">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  ID de Usuario
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {user.id}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Acciones de Cuenta</h2>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Información de la Cuenta
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Para actualizar tu información personal, contacta con el administrador del sistema.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Seguridad</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Tus credenciales están protegidas y encriptadas. Si olvidaste tu contraseña,
                  contacta con el administrador.
                </p>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                      logout();
                    }
                  }}
                  className="w-full"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Estadísticas de Actividad</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Estado de la Sesión
              </div>
              <div className="text-2xl font-bold text-green-600">Activa</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Última Actualización
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date().toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Plataforma</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">TechFlow</div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

