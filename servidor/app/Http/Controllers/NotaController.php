<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Nota;
use Dotenv\Exception\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

// TODO, Controlador de las notas
class NotaController extends Controller
{
    // * Nota
    protected $nota;

    // * Validaciones
    private $validaciones = [
        'fecha' => 'required|date',
        'nombre' => 'required|string|min:2|max:240|unique:notas',
        'descripcion' => 'required|string|min:5',
    ];

    // * Respuestas a validaciones
    private $respuestas = [
        'fecha.required' => 'El campo fecha es requerido.',
        'fecha.date' => 'El campo fecha debe ser una fecha válida.',
        'nombre.required' => 'El campo nombre es requerido.',
        'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
        'nombre.min' => 'El campo nombre debe tener al menos 2 caracteres.',
        'nombre.max' => 'El campo nombre debe tener como máximo 240 caracteres.',
        'nombre.unique' => 'El campo nombre debe ser único.',
        'descripcion.required' => 'El campo descripcion es requerido.',
        'descripcion.string' => 'El campo descripcion debe ser una cadena de texto.',
        'descripcion.min' => 'El campo descripcion debe tener al menos 5 caracteres.',
    ];

    //Constructor
    public function __construct(Nota $nota)
    {
        $this->nota = $nota;
    }

    // * -------------- FUNCIONES --------------

    // * Lista completa
    public function Lista($desde = 0, $asta = 30)
    {
        try {
            // Lista
            $lista = $this->nota
                ->orderBy('fecha', 'desc')
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

    // * Crear nota
    public function crear(Request $request)
    {
        try {
            // ? Son validos
            $datosValidados = $request->validate($this->validaciones, $this->respuestas);

            // Creamos el registro
            $nota = $this->nota;
            $nota->fill($datosValidados);
            $nota->save();

            return response()->json([
                'mensaje' => 'Registro de Nota creado exitosamente',
                'data' => $nota
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
    public function obtenerPorId($id)
    {
        try {
            // Buscar la nota por ID
            $nota = $this->nota->find($id);

            // ? No existe
            if (!$nota) {
                // Nota no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Nota con el ID proporcionado.'
                ], 404);
            }

            // Retornar la nota
            return response()->json($nota);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Nota con el ID proporcionado.'
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

    // * Actualizar un Nota existente.
    public function actualizar(Request $request, $id)
    {
        try {
            // Validar los datos
            $datosValidados = $request->validate($this->validaciones, $this->respuestas);

            // Buscar la nota por ID
            $nota = $this->nota->find($id);

            // ? No existe
            if (!$nota) {
                // Nota no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Nota con el ID proporcionado.'
                ], 404);
            }

            // Actualizar la nota
            $nota->fill($datosValidados);
            $nota->save();

            return response()->json([
                'mensaje' => 'Nota actualizado exitosamente',
                'data' => $nota
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Nota con el ID proporcionado.'
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

    // * Eliminar nota
    public function eliminar($id)
    {
        try {
            // Buscar la nota por ID
            $nota = $this->nota->find($id);

            // ? No existe
            if (!$nota) {
                // Nota no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Nota con el ID proporcionado.'
                ], 404);
            }

            // Eliminar la nota
            $nota->delete();

            return response()->json([
                'mensaje' => 'Nota eliminada exitosamente'
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Nota con el ID proporcionado.'
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
