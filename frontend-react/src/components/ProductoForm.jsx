import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProducto, createProducto, updateProducto } from '../services/productos.service';

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);

  useEffect(() => {
    if (esEdicion) {
      cargarProducto();
    }
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      setErrorGeneral(null);
      const res = await getProducto(id);
      const { nombre, descripcion, precio, stock } = res.data;
      setFormData({
        nombre: nombre || '',
        descripcion: descripcion || '',
        precio: precio || '',
        stock: stock || '',
      });
    } catch (err) {
      setErrorGeneral('No se pudo encontrar o cargar el producto solicitado.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error puntual al escribir
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrores({});
    setErrorGeneral(null);

    const payload = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
    };

    try {
      if (esEdicion) {
        await updateProducto(id, payload);
      } else {
        await createProducto(payload);
      }
      navigate('/productos');
    } catch (err) {
      if (err.response && err.response.status === 422) {
        // Errores de validación devueltos por Laravel
        setErrores(err.response.data.errors || {});
      } else {
        setErrorGeneral(err.response?.data?.message || 'Ocurrió un error inesperado al guardar.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        Cargando datos del producto...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {esEdicion ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h2>
        <p className="text-sm text-slate-500">
          {esEdicion
            ? 'Modifica los datos correspondientes al producto existente.'
            : 'Completa los campos para registrar un nuevo producto en la API.'}
        </p>
      </div>

      {errorGeneral && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm">
          {errorGeneral}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">
            Nombre del Producto *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              errores.nombre
                ? 'border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
            }`}
            placeholder="Ej: Teclado Mecánico RGB"
          />
          {errores.nombre && (
            <p className="mt-1 text-xs text-red-600">{errores.nombre[0]}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              errores.descripcion
                ? 'border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
            }`}
            placeholder="Breve detalle de especificaciones o características..."
          />
          {errores.descripcion && (
            <p className="mt-1 text-xs text-red-600">{errores.descripcion[0]}</p>
          )}
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-slate-700 mb-1">
              Precio ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 transition ${
                errores.precio
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
              }`}
              placeholder="0.00"
            />
            {errores.precio && (
              <p className="mt-1 text-xs text-red-600">{errores.precio[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              min="0"
              step="1"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 transition ${
                errores.stock
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-600'
              }`}
              placeholder="0"
            />
            {errores.stock && (
              <p className="mt-1 text-xs text-red-600">{errores.stock[0]}</p>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/productos"
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {esEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

