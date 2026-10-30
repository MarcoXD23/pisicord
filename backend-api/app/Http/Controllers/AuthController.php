<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registro de nuevo usuario y generación de token.
     * HTTP 201 Created
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado exitosamente.',
            'data'    => [
                'user'       => $user,
                'token'      => $token,
                'token_type' => 'Bearer',
            ],
        ], Response::HTTP_CREATED);
    }

    /**
     * Inicio de sesión y generación de token.
     * HTTP 200 OK / HTTP 401 Unauthorized
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Las credenciales proporcionadas son incorrectas.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso.',
            'data'    => [
                'user'       => $user,
                'token'      => $token,
                'token_type' => 'Bearer',
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Cierre de sesión y revocación del token activo.
     * HTTP 200 OK
     */
    public function logout(Request $request): JsonResponse
    {
        // Elimina el token que se usó para autenticar la petición actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente.',
        ], Response::HTTP_OK);
    }

    /**
     * Obtener el perfil del usuario autenticado.
     * HTTP 200 OK
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user(),
        ], Response::HTTP_OK);
    }
}

