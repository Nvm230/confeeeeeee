import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { RegisterFormData } from '../../types';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error en registro:', err);
      
      // Extraer mensaje de error de diferentes formatos posibles
      let errorMessage = 'Error al registrarse';
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        // Error 400: Bad Request (email duplicado, etc.)
        if (status === 400) {
          const message = data?.message || data?.error || data?.detail || '';
          const lowerMessage = message.toLowerCase();
          
          if (lowerMessage.includes('email') && (lowerMessage.includes('already') || lowerMessage.includes('exist') || lowerMessage.includes('duplicado'))) {
            errorMessage = 'Este email ya está registrado';
          } else {
            errorMessage = message || 'Datos inválidos. Verifica la información ingresada';
          }
        }
        // Error 422: Datos inválidos
        else if (status === 422) {
          errorMessage = data?.message || data?.detail || 'Datos inválidos. Verifica la información ingresada';
        }
        // Otros errores con mensaje
        else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.detail) {
          errorMessage = data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="flex-1">{error}</span>
        </div>
      )}
      <Input
        label="Nombre"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={6}
      />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Registrarse
      </Button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
};

