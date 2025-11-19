import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const content = (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Página no encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button>Ir al Dashboard</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                Volver Atrás
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button>Ir al Login</Button>
            </Link>
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Enlaces útiles:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Proyectos
              </Link>
              <Link
                to="/tasks"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Tareas
              </Link>
              <Link
                to="/team"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Equipo
              </Link>
              <Link
                to="/profile"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Perfil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Si está autenticado, usar Layout con navegación
  if (isAuthenticated) {
    return <Layout>{content}</Layout>;
  }

  // Si no está autenticado, mostrar sin Layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {content}
    </div>
  );
};
