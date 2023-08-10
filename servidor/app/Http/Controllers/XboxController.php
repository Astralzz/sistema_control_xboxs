<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Xbox;
use Dotenv\Exception\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

// TODO, Controlador de los xbox
class XboxController extends Controller
{
    // * Xbox
    protected $xbox;

    // * Validaciones
    private $validaciones = [
        'nombre' => 'required|string|min:2|max:240',
        'estado' => 'required|in:DISPONIBLE,NO DISPONIBLE',
        'descripcion' => 'nullable|string|min:5',
    ];

    // * Respuestas a validaciones
    private $respuestas = [
        'nombre.required' => 'El campo nombre es requerido.',
        'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
        'nombre.min' => 'El campo nombre debe tener al menos 2 caracteres.',
        'nombre.max' => 'El campo nombre debe tener como máximo 240 caracteres.',
        'estado.required' => 'El campo estado es requerido.',
        'estado.in' => 'El campo estado debe ser DISPONIBLE o NO DISPONIBLE.',
        'descripcion.string' => 'El campo descripción debe ser una cadena de texto.',
        'descripcion.min' => 'El campo descripción debe tener al menos 5 caracteres.',
    ];

    //Constructor
    public function __construct(Xbox $xbox)
    {
        $this->xbox = $xbox;
    }

    // * -------------- FUNCIONES --------------

    // * Lista completa
    public function Lista($desde = 0, $asta = 30): JsonResponse | Collection
    {
        try {
            // Lista
            $lista = $this->xbox
                ->orderBy('nombre', 'asc')
                ->skip($desde)
                ->take($asta)
                ->get();

            // * Retornamos
            return $lista;

            // ! Error de consulta
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 401);
            // ! Error desconocido
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Crear xbox
    public function crear(Request $request): JsonResponse
    {
        try {
            // ? Son validos
            $datosValidados = $request->validate($this->validaciones, $this->respuestas);


            // Obtenemos nombre
            $nombre = $datosValidados['nombre'];
            $existeXbox = Xbox::where('nombre', $nombre)->exists();

            // ? Existe el nombre
            if ($existeXbox) {
                return response()->json([
                    'error' => 'El nombre del xbox ya está en uso. Por favor, elija otro nombre.'
                ], 400);
            }

            // Creamos el registro
            $xbox = $this->xbox;
            $xbox->fill($datosValidados);
            $xbox->save();

            return response()->json([
                'mensaje' => 'Registro de Xbox creado exitosamente',
                'xbox' => $xbox
            ], 201);

            // ! Error de validación
        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Error en la validación, error: ' . $e->getMessage()
            ], 401);
            // ! Error de consulta
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 422);
            // ! Error desconocido
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Buscar por id
    public function obtenerPorId($id): JsonResponse
    {
        try {
            // Buscar el Xbox por ID
            $xbox = $this->xbox->find($id);

            // ? No existe
            if (!$xbox) {
                // Xbox no encontrado
                return response()->json([
                    'error' => 'No se encontró ningún Xbox con el ID proporcionado.'
                ], 404);
            }

            // Retornar el Xbox
            return response()->json($xbox);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ningún Xbox con el ID proporcionado.'
            ], 404);
            // ! Error de consulta
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 422);
            // ! Error desconocido
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Actualizar un Xbox existente.
    public function actualizar(Request $request, $id): JsonResponse
    {
        try {
            // Validar los datos
            $datosValidados = $request->validate($this->validaciones, $this->respuestas);

            // Buscar el Xbox por ID
            $xbox = $this->xbox->find($id);

            // ? No existe
            if (!$xbox) {
                // Xbox no encontrado
                return response()->json([
                    'error' => 'No se encontró ningún Xbox con el ID proporcionado.'
                ], 404);
            }

            // Actualizar el Xbox
            $xbox->fill($datosValidados);
            $xbox->save();

            return response()->json([
                'mensaje' => 'Xbox actualizado exitosamente',
                'xbox' => $xbox
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ningún Xbox con el ID proporcionado.'
            ], 404);
            // ! Error de validación
        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Error en la validación, error: ' . $e->getMessage()
            ], 401);
            // ! Error de consulta
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 422);
            // ! Error desconocido
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Eliminar xbox
    public function eliminar($id): JsonResponse
    {
        try {
            // Buscar el Xbox por ID
            $xbox = $this->xbox->find($id);

            // ? No existe
            if (!$xbox) {
                // Xbox no encontrado
                return response()->json([
                    'error' => 'No se encontró ningún Xbox con el ID proporcionado.'
                ], 404);
            }

            // Eliminar el Xbox
            $xbox->delete();

            return response()->json([
                'mensaje' => 'Xbox eliminado exitosamente'
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ningún Xbox con el ID proporcionado.'
            ], 404);
            // ! Error de consulta
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 422);
            // ! Error desconocido
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }
}
