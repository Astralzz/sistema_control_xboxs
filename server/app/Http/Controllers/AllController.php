<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Xbox;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

// Todo, controlador
class AllController extends Controller
{

    // * N totales
    public function noTotalDatosTablas(): JsonResponse
    {
        try {
            $noProductos = $this->obtenerConteo(new Producto());
            $noXboxs = $this->obtenerConteo(new Xbox());

            return response()->json([
                'noProductos' => $noProductos,
                'noXboxs' => $noXboxs
            ], 200); // Cambiar el código de estado a 200 OK
        } catch (QueryException $e) {
            return $this->responderError('Error en la consulta: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return $this->responderError('Error desconocido: ' . $e->getMessage(), 500);
        }
    }

    // * Conteo
    private function obtenerConteo($modelo): int
    {
        return $modelo->count();
    }

    // * Respuesta
    private function responderError($mensaje, $codigo): JsonResponse
    {
        return response()->json([
            'error' => $mensaje
        ], $codigo);
    }
}
