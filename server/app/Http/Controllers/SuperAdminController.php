<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Renta;
use App\Models\Venta;
use App\Models\Xbox;
use Exception;
use InvalidArgumentException;

// TODO, Controles del administrador
class SuperAdminController extends Controller
{

    // ? PASOS
    // php artisan tinker
    // $opc = ?
    // $query = new App\Http\Controllers\SuperAdminController;
    // $query->accionGlobal($opc);

    // * GLOBAL
    public function accionGlobal($opc, $tipoDatos = 1): bool
    {
        try {

            // ? Se ejecuta desde la terminal
            if (app()->runningInConsole()) {

                //Función
                switch ($opc) {

                    case 1: //Crear datos primarios
                        $this->generarDatosPrimariosGlobales($tipoDatos);
                        break;

                    case 2: //Crear datos secundarios
                        $this->generarDatosSecundariosGlobales();
                        break;

                    default: // ! Error
                        throw new Exception("La opción " . $opc . " no esta disponible.");
                        break;
                }

                // * Éxito
                echo "\n\nÉXITO, la consulta global se hizo correctamente";
                return true;
            }

            // ! Error
            throw new InvalidArgumentException("Este evento solo puede ser ejecutado desde la consola.");

            // ! Error
        } catch (\Throwable $th) {
            echo "ERROR, detalles -> " . $th->getMessage();
            return false;
        }
    }

    // -------------------- FUNCIONES INTERMEDIARIAS --------------------

    // * Generar todos los datos primarios
    private function generarDatosPrimariosGlobales($opc = 1): void
    {

        //Función
        switch ($opc) {

            case 1: // Normales
                $this->generarXbox();
                $this->generarProductos();
                break;

            case 2: // Aleatorios
                $this->generarProductosAleatorios();
                break;

            default: // ! Error
                throw new Exception("La opción " . $opc . " no esta disponible.");
                break;
        }
        // Éxito
        echo "\nÉXITO, los datos en las tablas primarias se crearon correctamente";
    }

    // * Generar todos los datos primarios
    private function generarDatosSecundariosGlobales(): void
    {

        // Ejecutamos funciones de creación
        $this->generarRentasAleatorias();
        $this->generarVentasAleatorias();

        // * Éxito
        echo "\nÉXITO, los datos en las tablas secundarias se crearon correctamente";
    }

    // ! -------------------- DATOS PRIMARIOS --------------------

    // * Generar xbox
    private function generarXbox()
    {

        //Datos
        $datos = [
            [
                'nombre' => 'XBOX 1',
                'descripcion' => 'Este xbox No tiene perfil o juego comprado actualmente',
            ],
            [
                'nombre' => 'XBOX 2',
                'descripcion' => 'En este xbox para jugar gears 4/halo 5 necesitas abrir yoyo, para jugar GTA necesitas abrir Galaxy Y para jugar nier/cyberpunk/resident Necesitas abrir el perfil llamado nier',
            ],
            [
                'nombre' => 'XBOX 3',
                'descripcion' => 'En este xbox puedes jugar tanto gta, gears 4 y halo 5, sin ningún perfil abierto. NO USAR YOYO NI GALAXY',
            ],
        ];

        // Recorremos
        foreach ($datos as $data) {
            try {
                $miTabla = new Xbox();
                $miTabla->nombre = $data['nombre'];
                $miTabla->descripcion = $data['descripcion'];
                $miTabla->save();
                // ! Error
            } catch (\Exception $e) {
                throw new \Exception('Error al generar xbox: ' . $e->getMessage());
            }
        }

        echo "\nÉXITO, los xbox se agregaron correctamente";
    }

    // * Generar productos
    private function generarProductos()
    {

        //Datos
        $datos = [
            [
                'nombre' => 'Maruchan preparada',
                'precio' => 25,
                'stock' => 17,
                'descripcion' => 'Maruchan preparada para la venta',
            ],
            [
                'nombre' => 'Jugo de naranja',
                'precio' => 30,
                'stock' => 10,
                'descripcion' => 'Jugo de naranja natural recién exprimido',
            ],
            [
                'nombre' => 'Palomitas de maíz',
                'precio' => 20,
                'stock' => 25,
                'descripcion' => 'Deliciosas palomitas de maíz para disfrutar durante la renta de Xbox',
            ],
            [
                'nombre' => 'Refresco de cola',
                'precio' => 15,
                'stock' => 8,
                'descripcion' => 'Refresco de cola clásico en lata',
            ],
            [
                'nombre' => 'Agua mineral',
                'precio' => 10,
                'stock' => 15,
                'descripcion' => 'Agua mineral natural sin gas',
            ],
            [
                'nombre' => 'Chocolate',
                'precio' => 18,
                'stock' => 12,
                'descripcion' => 'Tableta de chocolate con leche',
            ],
            [
                'nombre' => 'Cheetos',
                'precio' => 22,
                'stock' => 20,
                'descripcion' => 'Snacks de queso crujientes',
            ],
            [
                'nombre' => 'Galletas',
                'precio' => 12,
                'stock' => 30,
                'descripcion' => 'Paquete de galletas dulces surtidas',
            ],
            [
                'nombre' => 'Papas fritas',
                'precio' => 18,
                'stock' => 18,
                'descripcion' => 'Papas fritas crujientes',
            ],
            [
                'nombre' => 'Goma de mascar',
                'precio' => 5,
                'stock' => 50,
                'descripcion' => 'Paquete de goma de mascar con varios sabores',
            ],
        ];

        // Recorremos
        foreach ($datos as $data) {
            try {
                $miTabla = new Producto();
                $miTabla->nombre = $data['nombre'];
                $miTabla->precio = $data['precio'];
                $miTabla->stock = $data['stock'];
                $miTabla->descripcion = $data['descripcion'];
                $miTabla->save();
                // ! Error
            } catch (\Exception $e) {
                throw new \Exception('Error al generar producto: ' . $e->getMessage());
            }
        }

        echo "\nÉXITO, los productos se agregaron correctamente";
    }

    // * Generar productos aleatorios
    private function generarProductosAleatorios()
    {
        // Generar registros
        $faker = \Faker\Factory::create();
        $cantidadVentas = 50;

        // Recorremos
        for ($i = 0; $i < $cantidadVentas; $i++) {

            try {
                $producto = new Producto();
                $producto->nombre =  $faker->unique()->word();
                $producto->precio = $faker->randomFloat(2, 10, 100);
                $producto->stock = $faker->randomNumber(2);
                $producto->descripcion = $faker->optional()->sentence();
                $producto->enlace_img = $faker->optional()->imageUrl('products', true);
                $producto->save();
                // ! Error
            } catch (\Illuminate\Database\QueryException $e) {
                // Si ocurre un error de integridad, se genera un nuevo nombre único y se intenta guardar nuevamente
                if ($e->errorInfo[1] === 1062) { // 1062 es el código de error para duplicado en MySQL
                    $producto->nombre =  $faker->unique()->word();
                    $producto->save();
                } else {
                    throw new \Exception('Error al generar producto: ' . $e->getMessage());
                }
            } catch (\Exception $e) {
                throw new \Exception('Error al generar producto: ' . $e->getMessage());
            }
        }

        echo "\nÉXITO, los productos aleatorios se agregaron correctamente";
    }

    // ! -------------------- DATOS SECUNDARIOS --------------------

    // * Generar ventas aleatorias
    private function generarVentasAleatorias()
    {
        // Obtener todos los IDs de productos existentes
        $productos = Producto::pluck('id')->toArray();

        // ? Vacío
        if (empty($productos)) {
            throw new InvalidArgumentException('No hay productos disponibles para generar ventas.');
        }

        // Generar registros de ventas aleatorios
        $faker = \Faker\Factory::create();
        $cantidadVentas = 50;

        // Recorremos
        for ($i = 0; $i < $cantidadVentas; $i++) {

            try {
                $numDetalles = $faker->numberBetween(1, 5); // Número aleatorio de detalles por venta
                $detalles = [];

                $totalVenta = 0; // Valor total de la venta

                for ($j = 0; $j < $numDetalles; $j++) {
                    $productoId = $faker->randomElement($productos);
                    $producto = Producto::find($productoId);

                    // Ajustar la cantidad y el precio para que el cálculo del subtotal esté dentro del rango permitido
                    $cantidad = $faker->numberBetween(1, 10); // Ajusta el rango de cantidades
                    $precio = $producto ? $producto->precio : 0;
                    $nombre = $producto ? $producto->nombre : $faker->word();

                    $detalle = [
                        'id_producto' => $productoId,
                        "nombre_producto" => $nombre,
                        'cantidad' => $cantidad,
                    ];
                    $detalles[] = $detalle;

                    // Calcular el subtotal y sumarlo al total de la venta
                    $subtotal = $cantidad * $precio;
                    $totalVenta += $subtotal;
                }

                $venta = new Venta();
                $venta->fecha = $faker->date();
                $venta->hora = $faker->time();
                $venta->noProductos = count($detalles);
                $venta->total = max(min($totalVenta, 999999.99), 0); // Ajustar al rango permitido
                $venta->comentario = $faker->optional()->sentence();
                $venta->detalles = json_encode($detalles);
                $venta->save();

                // ! Error
            } catch (\Exception $e) {
                throw new \Exception('Error al generar venta: ' . $e->getMessage());
            }
        }

        echo "\nÉXITO, las ventas se agregaron correctamente";
    }


    // * Generar Rentas aleatorias
    private function generarRentasAleatorias()
    {
        // Obtener todos los IDs de Xbox existentes
        $xboxs = Xbox::pluck('id')->toArray();

        // ? Vació
        if (empty($xboxs)) {
            throw new InvalidArgumentException('No hay xboxs disponibles para generar rentas.');
        }

        // Generar registros de rentas aleatorios
        $faker = \Faker\Factory::create();
        $cantidadRentas = 50; // Número de rentas a generar

        // Recorremos
        for ($i = 0; $i < $cantidadRentas; $i++) {

            try {

                $renta = new Renta();
                $renta->id_xbox = $faker->randomElement($xboxs);
                $renta->fecha = $faker->date();
                $renta->inicio = $faker->time();
                $renta->final = $faker->optional()->time();

                // Calcular duración en minutos si se proporciona el campo "final"
                if ($renta->final) {
                    $inicio = \Carbon\Carbon::parse($renta->inicio);
                    $final = \Carbon\Carbon::parse($renta->final);
                    $renta->duracion = $inicio->diffInMinutes($final);
                }

                $renta->total = $faker->randomFloat(2, 10, 100);
                $renta->noControles = $faker->randomNumber(1, 2);
                $renta->isPagado = $faker->boolean();
                $renta->cliente = $faker->optional()->name();
                $renta->comentario = $faker->optional()->text();
                $renta->save();

                // ! Error
            } catch (\Exception $e) {
                throw new \Exception('Error al generar renta: ' . $e->getMessage());
            }
        }

        echo "\nÉXITO, las rentas se agregaron correctamente";
    }
}
