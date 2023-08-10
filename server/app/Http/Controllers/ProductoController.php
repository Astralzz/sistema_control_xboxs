<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Recurses\ClaseFunciones;
use Dotenv\Exception\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

// TODO, Controlador de los productos
class ProductoController extends Controller
{
    // * Producto
    protected $producto;

    // * Datos img
    private  $nombreImagen = 'img_producto';
    private $rutaGuardar = "app/imgs/productos";

    // * Validaciones
    private $validacionesCrear = [
        'nombre' => 'required|string|min:2|max:240|unique:productos',
        'precio' => 'required|numeric',
        'stock' => 'integer',
        'descripcion' => 'nullable|string|min:5',
        'enlace_img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,jfif|max:2048',
    ];

    private $validacionesActualizar = [
        'nombre' => 'required|string|min:2|max:240',
        'precio' => 'required|numeric',
        'stock' => 'integer',
        'descripcion' => 'nullable|string|min:2',
        'enlace_img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,jfif|max:2048',
    ];


    // * Respuestas a validaciones
    private $respuestas = [
        'nombre.required' => 'El campo nombre es requerido.',
        'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
        'nombre.min' => 'El campo nombre debe tener al menos 2 caracteres.',
        'nombre.max' => 'El campo nombre debe tener como máximo 240 caracteres.',
        'nombre.unique' => 'El nombre del producto ya está en uso.',
        'precio.required' => 'El campo precio es requerido.',
        'precio.numeric' => 'El campo precio debe ser un número.',
        'stock.integer' => 'El campo stock debe ser un número entero.',
        'descripcion.string' => 'El campo descripción debe ser una cadena de texto.',
        'descripcion.min' => 'El campo descripción debe tener al menos 5 caracteres.',
        'enlace_img.image' => 'El archivo adjunto debe ser una imagen.',
        'enlace_img.mimes' => 'El archivo adjunto debe tener uno de los siguientes formatos: jpeg, png, jpg, gif, svg, webp, jfif.',
        'enlace_img.max' => 'El archivo adjunto no debe superar los 2048 KB (2 MB).',
    ];

    //Constructor
    public function __construct(Producto $producto)
    {
        $this->producto = $producto;
    }

    // * -------------- FUNCIONES --------------

    // * Lista completa
    public function Lista($desde = 0, $asta = 30): JsonResponse
    {
        try {
            // Lista
            $lista = $this->producto
                ->orderBy('nombre', 'asc')
                ->skip($desde)
                ->take($asta)
                ->get();

            // Enlaces
            $lista = $this->obtenerEnlaceImg($lista);

            // Total de datos
            $totalDatos = $this->producto->count();

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

    // * Lista por nombre
    public function listaPorNombre($nombre, $desde = 0, $asta = 30): JsonResponse
    {
        try {
            // Buscar productos por nombre
            $lista = $this->producto
                ->where('nombre', 'like', "%$nombre%")
                ->orderBy('nombre', 'asc')
                ->skip($desde)
                ->take($asta)
                ->get();

            // Datos totales
            $totalDatos = $this->producto
                ->where('nombre', 'like', "%$nombre%")
                ->count();

            // Enlaces
            $lista = $this->obtenerEnlaceImg($lista);

            // Retornamos
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

    // * Lista por stock
    public function listaPorStock($stock, $desde = 0, $asta = 30): JsonResponse
    {
        try {
            // Buscar productos por nombre
            $lista = $this->producto
                ->where('stock', '=', $stock)
                ->orderBy('nombre', 'asc')
                ->skip($desde)
                ->take($asta)
                ->get();

            // Datos totales
            $totalDatos = $this->producto
                ->where('stock', '=', $stock)
                ->count();

            // Enlaces
            $lista = $this->obtenerEnlaceImg($lista);

            // Retornamos
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

    // * Crear producto
    public function crear(Request $request): JsonResponse
    {
        try {
            // ? Son validos
            $datosValidados = $request->validate($this->validacionesCrear, $this->respuestas);

            // Se se envió una imagen
            if (isset($datosValidados['enlace_img'])) {
                //Guardamos imagen
                $file = $request->file("enlace_img");
                $ruta = ClaseFunciones::guardarArchivo($file, $this->rutaGuardar, $this->nombreImagen);

                //Guardamos en la bd
                $datosValidados['enlace_img'] = $ruta;
            }

            // Creamos el registro
            $producto = $this->producto;
            $producto->fill($datosValidados);
            $producto->save();

            // ? Existe enlace
            if ($producto->enlace_img) {
                $producto->enlace_img = ClaseFunciones::obtenerRutaImg($producto->enlace_img);
            }

            return response()->json([
                'mensaje' => 'Producto creado exitosamente',
                'producto' => $producto
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
            // Buscar el Producto por ID
            $producto = $this->producto->find($id);

            // ? No existe
            if (!$producto) {
                // Producto no encontrado
                return response()->json([
                    'error' => 'No se encontró ningún Producto con el ID proporcionado.'
                ], 404);
            }

            // ? Existe enlace
            if ($producto->enlace_img) {
                $producto->enlace_img = ClaseFunciones::obtenerRutaImg($producto->enlace_img);
            }

            // Retornar el Producto
            return response()->json($producto);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ningún Producto con el ID proporcionado.'
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

    // * Actualizar un Producto existente.
    public function actualizar(Request $request, $id): JsonResponse
    {
        try {
            // Validar los datos
            $datosValidados = $request->validate($this->validacionesActualizar, $this->respuestas);

            // Buscar el Producto por ID
            $producto = $this->producto->find($id);

            // ? No existe
            if (!$producto) {
                // Producto no encontrado
                return response()->json([
                    'error' => 'No se encontró ningún Producto con el ID proporcionado.'
                ], 404);
            }

            // ? Se envió img
            if (isset($datosValidados['enlace_img'])) {

                // ? Existe enlace
                if ($producto->enlace_img) {
                    ClaseFunciones::eliminarArchivo($producto->enlace_img);
                }

                //Guardamos
                $file = $request->file("enlace_img");
                $ruta = ClaseFunciones::guardarArchivo($file, $this->rutaGuardar, $this->nombreImagen);

                // Insertamos
                $datosValidados['enlace_img'] = $ruta;
            }

            // Actualizar el Producto
            $producto->fill($datosValidados);
            $producto->save();

            // ? Existe enlace
            if ($producto->enlace_img) {
                $producto->enlace_img = ClaseFunciones::obtenerRutaImg($producto->enlace_img);
            }

            return response()->json([
                'mensaje' => 'Producto actualizado exitosamente',
                'producto' => $producto
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ningún Producto con el ID proporcionado.'
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

    // * Eliminar producto
    public function eliminar($id): JsonResponse
    {
        try {
            // Buscar el Producto por ID
            $producto = $this->producto->find($id);

            // ? No existe
            if (!$producto) {
                // Producto no encontrado
                return response()->json([
                    'error' => 'No se encontró ningún Producto con el ID proporcionado.'
                ], 404);
            }

            // obtenemos imagen
            $img = $producto->enlace_img;

            // Eliminar el Producto
            $producto->delete();

            //Eliminamos img
            if ($img) {
                ClaseFunciones::eliminarArchivo($img);
            }

            return response()->json([
                'mensaje' => 'Producto eliminado exitosamente'
            ]);

            // ! Error de modelo
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'No se encontró ningún Producto con el ID proporcionado.'
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

    // * Total datos
    public function noTotalDatos(): int | JsonResponse
    {
        try {
            // Datos totales
            return $this->producto->count();
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

    // Todo, ---------------- Privadas -------------------


    // * Obtener enlace de img
    private function obtenerEnlaceImg($lista): Collection
    {
        // Recorremos
        foreach ($lista as $producto) {
            // ? Tiene enlace
            if ($producto->enlace_img) {
                $producto->enlace_img = ClaseFunciones::obtenerRutaImg($producto->enlace_img);
            }
        }

        return $lista;
    }

    // Todo, ---------------- Estáticas -------------------

    // * Aumentar stock
    public static function aumentarStock($id, $n): void
    {

        // Buscar el Producto por ID
        $producto = Producto::find($id);

        // ? No existe
        if (!$producto) {
            throw new \Exception('No se encontró ningún Producto con el ID ' . $id);
        }


        // Aumentamos
        $preStock = $producto->stock;
        $producto->stock = $preStock + $n;
        $producto->save();
    }

    // * Aumentar stock
    public static function disminuirStock($id, $n): void
    {

        // Buscar el Producto por ID
        $producto = Producto::find($id);

        // ? No existe
        if (!$producto) {
            throw new \Exception('No se encontró ningún Producto con el ID ' . $id);
        }

        // ? Es menor a 1
        if ($producto->stock < 0) {
            throw new \Exception('El producto con el id ' . $id . ' no tiene existencias');
        }

        // Disminuimos
        $preStock = $producto->stock;
        $producto->stock = $preStock -  $n;
        $producto->save();
    }
}
