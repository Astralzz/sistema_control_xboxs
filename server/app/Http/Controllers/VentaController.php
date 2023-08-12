<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Venta;
use Dotenv\Exception\ValidationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// TODO, Controlador de ventas
class VentaController extends Controller
{
    // * Venta
    protected $venta;

    // * Validaciones
    private $validaciones = [
        'fecha' => 'required|date',
        'hora' => 'required|date_format:H:i:s',
        'noProductos' => 'required|integer|min:1',
        'total' => 'required|numeric|min:0',
        'comentario' => 'nullable|string|min:5',
        'detalles' => 'required|json|min:1',
        'detalles.*.id_producto' => 'required|numeric|min:1',
        'detalles.*.cantidad' => 'required|integer|min:1'
    ];

    // * Respuestas a validaciones
    private $respuestas = [
        'fecha.required' => 'El campo fecha es requerido.',
        'fecha.date' => 'El campo fecha debe ser una fecha válida.',
        'hora.required' => 'El campo hora es requerido.',
        'hora.date_format' => 'El campo hora debe ser una hora válida.',
        'noProductos.required' => 'El campo noProductos es requerido.',
        'noProductos.integer' => 'El campo noProductos debe ser un número entero.',
        'noProductos.min' => 'El campo noProductos debe ser mayor o igual a 1.',
        'total.required' => 'El campo total es requerido.',
        'total.numeric' => 'El campo total debe ser numérico.',
        'total.min' => 'El campo total debe ser mayor o igual a 0.',
        'comentario.string' => 'El campo comentario debe ser una cadena de texto.',
        'comentario.min' => 'El campo comentario debe tener al menos 5 caracteres.',
        'detalles.required' => 'Debe proporcionar al menos un detalle de producto.',
        'detalles.array' => 'Los detalles deben estar en un formato de arreglo.',
        'detalles.min' => 'Debe proporcionar al menos un detalle de producto.',
        'detalles.*.id_producto.required' => 'El ID del producto en los detalles es requerido.',
        'detalles.*.id_producto.numeric' => 'El ID del producto en los detalles debe ser numérico.',
        'detalles.*.id_producto.min' => 'El ID del producto en los detalles debe ser mayor o igual a 1.',
        'detalles.*.cantidad.required' => 'La cantidad del producto en los detalles es requerida.',
        'detalles.*.cantidad.integer' => 'La cantidad del producto en los detalles debe ser un número entero.',
        'detalles.*.cantidad.min' => 'La cantidad del producto en los detalles debe ser mayor o igual a 1.'
    ];

    //Constructor
    public function __construct(Venta $venta)
    {
        $this->venta = $venta;
    }

    // * -------------- FUNCIONES --------------

    // * Lista completa
    public function Lista($desde = 0, $asta = 30): JsonResponse
    {
        try {
            // Lista
            $lista = $this->venta::orderBy('fecha', 'desc')
                ->orderBy('hora', 'desc')
                ->skip($desde)
                ->take($asta)
                ->get();

            // Total de datos
            $totalDatos = $this->venta->count();

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

    // * Lista por los últimos n dias
    public function ListaVentasPorDias($dias = 7): JsonResponse
    {
        try {
            // Fecha de inicio
            $fechaInicio = now()->subDays($dias);

            // Lista
            $ventasPorDia = [];

            // Recorremos
            for ($i = 0; $i < $dias; $i++) {
                // Datos
                $dia = $fechaInicio->format('Y-m-d');
                $diaSiguiente = $fechaInicio->addDay()->format('Y-m-d');

                // Suma de los totales de ventas para el día actual
                $totalVentasDia = $this->venta::whereBetween('fecha', [$dia, $diaSiguiente])
                    ->sum('total');

                // Agregamos
                $ventasPorDia[] = [
                    'fecha' => $dia,
                    'total' => $totalVentasDia,
                ];
            }

            // Retornamos
            return response()->json([
                'ventasFiltradas' => $ventasPorDia,
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
    public function ListaVentasSemanales($semanas = 30): JsonResponse
    {
        try {
            // Fecha de inicio
            $fechaInicio = now()->subWeeks($semanas);

            // Lista
            $ventasPorSemana = [];

            // Recorremos
            for ($i = 0; $i < $semanas; $i++) {
                // Datos
                $semana = $fechaInicio->format('Y-m-d');
                $semanaSiguiente = $fechaInicio->addWeek()->format('Y-m-d');

                // Suma de los totales de ventas para la semana actual
                $totalVentasSemana = $this->venta::whereBetween('fecha', [$semana, $semanaSiguiente])
                    ->sum('total');

                // Agregamos
                $ventasPorSemana[] = [
                    'fecha' => $semana,
                    'total' => $totalVentasSemana,
                ];
            }

            // * Retornamos
            return response()->json([
                'ventasFiltradas' => $ventasPorSemana,
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

    // * Lista por últimos n meses
    public function ListaVentasMensuales($meses = 12): JsonResponse
    {
        try {
            // Fecha de inicio
            $fechaInicio = now()->subMonths($meses);

            // Lista
            $ventasPorMes = [];

            // Recorremos
            for ($i = 0; $i < $meses; $i++) {
                // Datos
                $mes = $fechaInicio->format('Y-m');
                $mesSiguiente = $fechaInicio->addMonth()->format('Y-m');

                // Suma de los totales de ventas para el mes actual
                $totalVentasMes = $this->venta::whereBetween('fecha', [$mes . '-01', $mesSiguiente . '-01'])
                    ->sum('total');

                // Agregamos
                $ventasPorMes[] = [
                    'fecha' => $mes,
                    'total' => $totalVentasMes,
                ];
            }

            // Retornamos
            return response()->json([
                'ventasFiltradas' => $ventasPorMes,
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
    public function ListaVentasAnuales($anios = 5): JsonResponse
    {
        try {
            // Fecha de inicio
            $fechaInicio = now()->subYears($anios);

            // Lista
            $ventasPorAnio = [];

            // Recorremos
            for ($i = 0; $i < $anios; $i++) {
                // Datos
                $anio = $fechaInicio->format('Y');
                $anioSiguiente = $fechaInicio->copy()->addYear()->format('Y'); // Copia de la fecha

                // Suma de los totales de ventas para el año actual
                $totalVentasAnio = $this->venta::whereBetween('fecha', [$anio . '-01-01', $anioSiguiente . '-01-01'])
                    ->sum('total');

                // Agregamos
                $ventasPorAnio[] = [
                    'fecha' => $anio,
                    'total' => $totalVentasAnio,
                ];

                // Actualizamos la fecha de inicio para el próximo ciclo
                $fechaInicio->addYear();
            }

            // Retornamos
            return response()->json([
                'ventasFiltradas' => $ventasPorAnio,
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

    // * Lista por producto
    public function listaPorProducto($idProducto, $desde = 0, $asta = 10): JsonResponse
    {
        try {

            // Datos
            $ventas = $this->getVentasPorProducto($idProducto, $desde, $asta);
            $totalDatos = $this->getTotalVentasPorProducto($idProducto);

            // * Retornamos
            return response()->json([
                'lista' => $ventas,
                'totalDatos' => $totalDatos
            ]);

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

    // * Crear venta
    public function crear(Request $request)
    {
        try {
            // ? Son validos
            $datosValidados = $request->validate($this->validaciones, $this->respuestas);

            // Decodificamos
            $detalles = json_decode($datosValidados['detalles'], true);

            // ? Error al decodificar
            if ($detalles === null) {
                return response()->json([
                    'error' => 'Error al decodificar los detalles JSON'
                ], 400);
            }

            // Creamos el registro
            $venta = $this->venta;
            $venta->fill($datosValidados);
            $venta->save();

            // Recorremos
            foreach ($detalles as $detalle) {
                try {
                    // * Datos
                    $idProducto = $detalle['id_producto'];
                    $cantidad = $detalle['cantidad'];

                    // Disminuimos
                    ProductoController::disminuirStock($idProducto, $cantidad);

                    // ! Error
                } catch (\Exception $e) {
                    throw new \Exception('Error al disminuir producto: ' . $e->getMessage());
                }
            }

            // Datos
            return response()->json([
                'mensaje' => 'Venta realizada con éxito',
                'venta' => $venta
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
            // Buscar la venta por ID
            $venta = $this->venta->find($id);

            // ? No existe
            if (!$venta) {
                // Venta no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Venta con el ID proporcionado.'
                ], 404);
            }

            // Retornar la venta
            return response()->json($venta);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Venta con el ID proporcionado.'
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

    // * Actualizar un Venta existente.
    public function actualizar(Request $request, $id)
    {
        try {
            // Validar los datos
            $datosValidados = $request->validate($this->validaciones, $this->respuestas);

            // Buscar la venta por ID
            $venta = $this->venta->find($id);

            // ? No existe
            if (!$venta) {
                // Venta no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Venta con el ID proporcionado.'
                ], 404);
            }

            // Actualizar la venta
            $venta->fill($datosValidados);
            $venta->save();

            return response()->json([
                'mensaje' => 'Venta actualizada exitosamente',
                'data' => $venta
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Venta con el ID proporcionado.'
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

    // * Eliminar venta
    public function eliminar($id)
    {
        try {
            // Buscar la venta por ID
            $venta = $this->venta->find($id);

            // ? No existe
            if (!$venta) {
                // Venta no encontrado
                return response()->json([
                    'error' => 'No se encontró ninguna Venta con el ID proporcionado.'
                ], 404);
            }

            // Eliminar la venta
            $venta->delete();

            return response()->json([
                'mensaje' => 'Venta eliminada exitosamente'
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ninguna Venta con el ID proporcionado.'
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

    // Todo, ---------------- Privadas -------------------

    // * Total datos
    private function noTotalDatos(): int | JsonResponse
    {
        try {
            // Datos totales
            return $this->venta->count();
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


    // * Ventas por producto
    private function getVentasPorProducto($idProducto, $desde, $asta): Collection
    {
        return $this->venta::whereRaw('JSON_CONTAINS(detalles, \'{"id_producto": ' . $idProducto . '}\')')
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'desc')
            ->skip($desde)
            ->take($asta)
            ->get();
    }

    // * Total por producto
    private function getTotalVentasPorProducto($idProducto): int
    {
        return $this->venta::whereRaw('JSON_CONTAINS(detalles, \'{"id_producto": ' . $idProducto . '}\')')
            ->count();
    }
}
