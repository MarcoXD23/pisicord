<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProductoController extends Controller
{
    /**
     * Listar todos los productos.
     * HTTP 200 OK
     */
    public function index(): JsonResponse
    {
        $productos = Producto::latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $productos,
        ], Response::HTTP_OK);
    }

    /**
     * Crear un nuevo producto.
     * HTTP 201 Created
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre'      => ['required', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string'],
            'precio'      => ['required', 'numeric', 'min:0'],
            'stock'       => ['required', 'integer', 'min:0'],
        ]);

        $producto = Producto::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Producto creado exitosamente.',
            'data'    => $producto,
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostrar un producto específico.
     * HTTP 200 OK
     */
    public function show(Producto $producto): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $producto,
        ], Response::HTTP_OK);
    }

    /**
     * Actualizar un producto existente.
     * HTTP 200 OK
     */
    public function update(Request $request, Producto $producto): JsonResponse
    {
        $validated = $request->validate([
            'nombre'      => ['sometimes', 'required', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string'],
            'precio'      => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock'       => ['sometimes', 'required', 'integer', 'min:0'],
        ]);

        $producto->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Producto actualizado exitosamente.',
            'data'    => $producto,
        ], Response::HTTP_OK);
    }

    /**
     * Eliminar un producto.
     * HTTP 204 No Content
     */
    public function destroy(Producto $producto): Response
    {
        $producto->delete();

        return response()->noContent();
    }
}

