import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, deleteProducto } from '../services/productos.service';

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProductos();
      setProductos(res.data || []);
    } catch (err) {
      setError('No se pudieron cargar los productos. Verifica que el servidor API esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    const confirmacion = window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`);
    if (!confirmacion) return;

    // Actualización optimista: respaldar y remover del estado inmediatamente
    const copiaOriginal = [...productos];
    setProductos((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProducto(id);
    } catch (err) {
      // Revertir estado si el backend responde con error
      setProductos(copiaOriginal);
      alert('Error al eliminar el producto. Inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-500 text-lg">
        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Cargando catálogo...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Listado de Productos</h1>
          <p className="text-sm text-slate-500">Administra los productos de tu inventario</p>
        </div>
        <Link
          to="/productos/nuevo"
          className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
        >
          Nuevo Producto
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {productos.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-500 shadow-sm">
          No hay productos registrados actualmente.
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Nombre</th>
                  <th className="px-6 py-3.5">Descripción</th>
                  <th className="px-6 py-3.5 text-right">Precio</th>
                  <th className="px-6 py-3.5 text-center">Stock</th>
                  <th className="px-6 py-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {productos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono text-slate-500">{prod.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{prod.nombre}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {prod.descripcion || '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      ${Number(prod.precio).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          prod.stock > 10
                            ? 'bg-emerald-100 text-emerald-800'
                            : prod.stock > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prod.stock} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Link
                        to={`/productos/${prod.id}/editar`}
                        className="inline-block text-indigo-600 hover:text-indigo-900 font-medium hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleEliminar(prod.id, prod.nombre)}
                        className="inline-block text-rose-600 hover:text-rose-900 font-medium hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

