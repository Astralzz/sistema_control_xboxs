<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Renta;
use App\Models\Xbox;
use Dotenv\Exception\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

// TODO, Controlador de rentas
class RentaController extends Controller
{
    // * Renta
    protected $renta;

    // * Validaciones
    private $validaciones = [
        'id_xbox' => 'required|numeric|min:0|exists:xboxs,id',
        'fecha' => 'required|date',
        'inicio' => 'required|date_format:H:i:s',
        'final' => 'nullable|date_format:H:i:s',
        'duracion' => 'nullable|numeric|min:0',
        'total' => 'nullable|numeric|min:0',
        'noControles' => 'nullable|numeric|min:1|max:10',
        'isPagado' => 'nullable|boolean',
        'cliente' => 'nullable|string|min:2|max:240',
        'comentario' => 'nullable|string|min:1',
    ];

    // * Respuestas a validaciones
    private $respuestas = [
        'id_xbox.required' => 'El campo renta es requerido.',
        'id_xbox.numeric' => 'El campo renta debe ser numérico.',
        'id_xbox.min' => 'El id del xbox debe ser mayor o igual a 0.',
        'id_xbox.exists' => 'La xbox no seleccionada no existe',
        'fecha.required' => 'El campo fecha es requerido.',
        'fecha.date' => 'El campo fecha debe ser una fecha válida.',
        'inicio.required' => 'El campo inicio de renta es requerido.',
        'inicio.date_format' => 'El campo inicio de renta debe ser una inicio válida.',
        'final.date_format' => 'El campo final de renta debe ser una inicio válida.',
        'duracion.numeric' => 'El campo duración debe ser numérico.',
        'duracion.min' => 'El campo duración debe ser mayor o igual a 0.',
        'total.numeric' => 'El campo total debe ser numérico.',
        'total.min' => 'El campo total debe ser mayor o igual a 0.',
        'noControles.numeric' => 'El campo numero de controles debe ser numérico.',
        'noControles.min' => 'El campo numero de controles debe ser mayor a 0.',
        'noControles.max' => 'El campo numero de controles debe ser menor a 11.',
        'isPagado.boolean' => 'El campo pagado debe ser 1 o 0.',
        'cliente.string' => 'El campo cliente debe ser una cadena de texto.',
        'cliente.min' => 'El campo cliente debe tener al menos 2 caracteres.',
        'cliente.max' => 'El campo cliente debe tener como máximo 240 caracteres.',
        'comentario.string' => 'El campo comentario debe ser una cadena de texto.',
        'comentario.min' => 'El campo comentario debe tener al menos 1 carácter.',
    ];

    //Constructor
    public function __construct(Renta $renta)
    {
        $this->renta = $renta;
    }

    // * -------------- FUNCIONES --------------

    // * Lista completa
    public function Lista($desde = 0, $asta = 30): JsonResponse
    {
        try {
            // Lista
            $lista = $this->renta::with([
                'xbox:id,nombre',
            ])
                ->orderBy('fecha', 'desc')
                ->orderBy('inicio', 'desc')
                ->skip($desde)
                ->take($asta)
                ->get();

            // Total de datos
            $totalDatos = $this->renta->count();

            // * Retornamos
            return response()->json([
                'lista' => $lista,
                'totalDatos' => $totalDatos
            ]);

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

    // * Lista por xbox
    public function listaPorXboxs($id, $desde = 0, $asta = 10): JsonResponse | Collection
    {
        try {

            // Buscar el Xbox por su ID
            $xbox = Xbox::find($id);

            // ? No existe
            if (!$xbox) {
                // Renta no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Renta con el ID proporcionado.'
                ], 404);
            }

            // Obtener las rentas del Xbox
            $rentas = $this->renta::where('id_xbox', $id)
                ->with('xbox:id,nombre')
                ->orderBy('fecha', 'desc')
                ->orderBy('inicio', 'desc')
                ->skip($desde)
                ->take($asta)
                ->get();

            // Retornar las rentas
            return $rentas;
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ningún Xbox con el ID proporcionado.'
            ], 404);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Lista por dias
    public function ListaPorDiaEspecifico($dia, $desde = 0, $asta = 30): JsonResponse
    {
        try {
            // ? Dia correcto
            if ($dia !== null) {
                $parsedDate = \DateTime::createFromFormat('Y-m-d', $dia);
                if (!$parsedDate || $parsedDate->format('Y-m-d') !== $dia) {
                    return response()->json([
                        'error' => 'Fecha inválida'
                    ], 400);
                }
            }

            // Lista
            $query = $this->renta::orderBy('fecha', 'desc')
                ->with('xbox:id,nombre')
                ->orderBy('inicio', 'desc')
                ->skip($desde)
                ->take($asta);

            // Por dia
            if ($dia !== null) {
                $query->whereDate('fecha', $dia);
            }

            $lista = $query->get();

            // Total de datos
            $totalDatos = $this->renta->whereDate('fecha', $dia)->count();

            // * Retornamos
            return response()->json([
                'lista' => $lista,
                'totalDatos' => $totalDatos
            ]);

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

    // * Lista por mes
    public function ListaPorMesEspecifico($anio, $mes, $desde = 0, $asta = 30): JsonResponse
    {
        try {
            // Validar si el año y el mes son correctos
            if (!checkdate($mes, 1, $anio)) {
                return response()->json([
                    'error' => 'Fecha inválida'
                ], 400);
            }

            // Lista
            $query = $this->renta::orderBy('fecha', 'desc')
                ->with('xbox:id,nombre')
                ->orderBy('inicio', 'desc')
                ->skip($desde)
                ->take($asta);

            // Filtrar por mes y año
            $query->whereYear('fecha', $anio)->whereMonth('fecha', $mes);

            $lista = $query->get();

            // Total de datos para el mes específico
            $totalDatos = $this->renta->whereYear('fecha', $anio)->whereMonth('fecha', $mes)->count();

            // Retornamos la respuesta
            return response()->json([
                'lista' => $lista,
                'totalDatos' => $totalDatos
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Lista por los últimos n dias
    public function ListaRentasPorDias($dias = 7): JsonResponse
    {
        try {
            // Fecha de inicio
            $fechaInicio = now()->subDays($dias);

            // Lista
            $rentasPorDia = [];

            // Recorremos
            for ($i = 0; $i < $dias; $i++) {
                // Datos
                $dia = $fechaInicio->format('Y-m-d');

                // Suma de los totales de rentas para el día actual
                $totalRentasDia = $this->renta::whereBetween('fecha', [$dia . ' 00:00:00', $dia . ' 23:59:59'])
                    ->sum('total');

                // Agregamos
                $rentasPorDia[] = [
                    'fecha' => $dia,
                    'total' => $totalRentasDia,
                ];

                // Pasamos al siguiente día
                $fechaInicio->addDay();
            }

            // Retornamos
            return response()->json([
                'rentasFiltradas' => $rentasPorDia,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Lista por ultimas n semanas
    public function ListaRentasSemanales($semanas = 30): JsonResponse
    {
        try {
            // Fecha de inicio
            $fechaInicio = now()->subWeeks($semanas);

            // Lista
            $rentasPorSemana = [];

            // Recorremos
            for ($i = 0; $i < $semanas; $i++) {
                // Datos
                $semana = $fechaInicio->format('Y-m-d');
                $semanaSiguiente = $fechaInicio->copy()->addWeek()->format('Y-m-d');

                // Suma de los totales de rentas para la semana actual
                $totalRentasSemana = $this->renta::whereBetween('fecha', [$semana, $semanaSiguiente])
                    ->sum('total');

                // Agregamos
                $rentasPorSemana[] = [
                    'fecha' => $semana,
                    'total' => $totalRentasSemana,
                ];

                // Actualizamos la fecha de inicio para el próximo ciclo
                $fechaInicio->addWeek();
            }

            // Retornamos
            return response()->json([
                'rentasFiltradas' => $rentasPorSemana,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Lista por últimos n meses
    public function ListaRentasMensuales($meses = 12): JsonResponse
    {
        try {
            // Fecha de inicio
            $fechaInicio = now();

            // Lista
            $rentasPorMes = [];

            // Recorremos
            for ($i = 0; $i < $meses; $i++) {
                // Datos
                $mes = $fechaInicio->format('Y-m');

                // Suma de los totales de rentas para el mes actual
                $totalRentasMes = $this->renta::whereYear('fecha', $fechaInicio->year)
                    ->whereMonth('fecha', $fechaInicio->month)
                    ->sum('total');

                // Agregamos
                $rentasPorMes[] = [
                    'fecha' => $mes,
                    'total' => $totalRentasMes,
                ];

                // Actualizamos
                $fechaInicio->subMonth();
            }

            // Retornamos
            return response()->json([
                'rentasFiltradas' => array_reverse($rentasPorMes), // Revertir el arreglo para el orden correcto
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Lista por últimos n años
    public function ListaRentasAnuales($anios = 5): JsonResponse
    {
        try {
            // Fecha de inicio
            $fechaInicio = now()->subYears($anios);

            // Lista
            $rentasPorAnio = [];

            // Recorremos
            for ($i = 0; $i < $anios; $i++) {
                // Datos
                $anio = $fechaInicio->format('Y');
                $anioSiguiente = $fechaInicio->copy()->addYear()->format('Y'); // Copia de la fecha

                // Suma de los totales de rentas para el año actual
                $totalRentasAnio = $this->renta::whereBetween('fecha', [$anio . '-01-01', $anioSiguiente . '-01-01'])
                    ->sum('total');

                // Agregamos
                $rentasPorAnio[] = [
                    'fecha' => $anio,
                    'total' => $totalRentasAnio,
                ];

                // Actualizamos la fecha de inicio para el próximo ciclo
                $fechaInicio->addYear();
            }

            // Retornamos
            return response()->json([
                'rentasFiltradas' => $rentasPorAnio,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta, error: ' . $e->getMessage()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error desconocido, error: ' . $e->getMessage()
            ], 501);
        }
    }

    // * Crear renta
    public function crear(Request $request): JsonResponse
    {
        try {
            // ? Son validos
            $datosValidados = $request->validate($this->validaciones, $this->respuestas);

            // Creamos el registro
            $renta = $this->renta;
            $renta->fill($datosValidados);
            $renta->save();

            return response()->json([
                'mensaje' => 'Registro de Renta creado exitosamente',
                'renta' => $renta
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
            // Buscar la renta por ID
            $renta = $this->renta::with('xbox:id,nombre')->find($id);

            // ? No existe
            if (!$renta) {
                // Renta no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Renta con el ID proporcionado.'
                ], 404);
            }

            // Retornar la renta
            return response()->json($renta);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Renta con el ID proporcionado.'
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

    // * Actualizar un Renta existente.
    public function actualizar(Request $request, $id): JsonResponse
    {
        try {
            // Validar los datos
            $datosValidados = $request->validate($this->validaciones, $this->respuestas);

            // Buscar la renta por ID
            $renta = $this->renta->find($id);

            // ? No existe
            if (!$renta) {
                // Renta no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Renta con el ID proporcionado.'
                ], 404);
            }

            // Actualizar la renta
            $renta->fill($datosValidados);
            $renta->save();

            return response()->json([
                'mensaje' => 'Renta actualizada exitosamente',
                'renta' => $this->renta::with('xbox:id,nombre')->find($id)
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Renta con el ID proporcionado.'
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

    // * Eliminar renta
    public function eliminar($id): JsonResponse
    {
        try {
            // Buscar la renta por ID
            $renta = $this->renta->find($id);

            // ? No existe
            if (!$renta) {
                // Renta no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Renta con el ID proporcionado.'
                ], 404);
            }

            // Eliminar la renta
            $renta->delete();

            return response()->json([
                'mensaje' => 'Renta eliminada exitosamente'
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Renta con el ID proporcionado.'
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
