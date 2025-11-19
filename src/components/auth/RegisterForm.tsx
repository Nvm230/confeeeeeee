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
      setError(err.response?.data?.message || 'Error al registrarse');
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
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
      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
};

