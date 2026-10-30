import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorGeneral(null);
    setErrores({});

    try {
      await register(formData);
      navigate('/productos', { replace: true });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrores(err.response.data.errors || {});
      } else {
        setErrorGeneral(err.response?.data?.message || 'Error al registrar la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Crear Cuenta</h1>
        <p className="text-sm text-slate-500 mt-1">Regístrate para gestionar el inventario</p>
      </div>

      {errorGeneral && (
        <div className="mb-5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-3.5 rounded text-sm">
          {errorGeneral}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              errores.name
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
            }`}
            placeholder="Juan Pérez"
          />
          {errores.name && (
            <p className="mt-1 text-xs text-rose-600">{errores.name[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Correo Electrónico *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              errores.email
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
            }`}
            placeholder="juan@ejemplo.com"
          />
          {errores.email && (
            <p className="mt-1 text-xs text-rose-600">{errores.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contraseña (mínimo 8 caracteres) *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              errores.password
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
            }`}
            placeholder="••••••••"
          />
          {errores.password && (
            <p className="mt-1 text-xs text-rose-600">{errores.password[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          )}
          {submitting ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}

