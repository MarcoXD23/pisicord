import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [errores, setErrores] = useState({});

  const destino = location.state?.from?.pathname || '/productos';

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
      await login(formData);
      navigate(destino, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorGeneral(err.response.data.message || 'Credenciales inválidas.');
      } else if (err.response?.status === 422) {
        setErrores(err.response.data.errors || {});
      } else {
        setErrorGeneral('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Iniciar Sesión</h1>
        <p className="text-sm text-slate-500 mt-1">Ingresa tus credenciales para acceder al inventario</p>
      </div>

      {errorGeneral && (
        <div className="mb-5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-3.5 rounded text-sm">
          {errorGeneral}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Correo Electrónico
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
            placeholder="usuario@ejemplo.com"
          />
          {errores.email && (
            <p className="mt-1 text-xs text-rose-600">{errores.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contraseña
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
          {submitting ? 'Autenticando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes una cuenta aún?{' '}
        <Link to="/registro" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}

