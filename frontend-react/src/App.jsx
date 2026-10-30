import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import ProductosList from './components/ProductosList';
import ProductoForm from './components/ProductoForm';

function NavigationBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/productos" className="text-xl font-bold tracking-tight hover:text-indigo-100">
            Inventario App
          </Link>
          {isAuthenticated && (
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                to="/productos"
                className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Catálogo
              </Link>
              <Link
                to="/productos/nuevo"
                className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-50 shadow-sm transition"
              >
                + Nuevo Producto
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="text-xs sm:text-sm font-medium text-indigo-100 hidden md:inline">
                Hola, <strong className="text-white">{user?.name || 'Usuario'}</strong>
              </span>
              <button
                onClick={handleCerrarSesion}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-lg transition"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className="bg-white text-indigo-600 px-3.5 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-50 shadow-sm transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <NavigationBar />

        <main className="max-w-6xl mx-auto p-4 md:p-6">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* Rutas Protegidas por Token */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/productos" replace />} />
              <Route path="/productos" element={<ProductosList />} />
              <Route path="/productos/nuevo" element={<ProductoForm />} />
              <Route path="/productos/:id/editar" element={<ProductoForm />} />
            </Route>

            {/* Ruta no encontrada */}
            <Route
              path="*"
              element={
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-slate-800">404 - Página no encontrada</h2>
                  <Link to="/productos" className="mt-4 inline-block text-indigo-600 hover:underline">
                    Volver al inicio
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
