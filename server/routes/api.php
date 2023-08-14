<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\RentaController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\XboxController;

// Todo, Xboxs
Route::prefix('xboxs')->group(function () {
    // * GET - Lista completa
    Route::prefix('lista/global')->group(function () {
        Route::get('', [XboxController::class, 'lista']);
        Route::get('{desde}', [XboxController::class, 'lista']);
        Route::get('{desde}/{asta}', [XboxController::class, 'lista']);
    });
    // * OTROS - Acciones en general
    Route::prefix('opciones')->group(function () {
        Route::get('buscar/{id}', [XboxController::class, 'obtenerPorId']);
        Route::post('crear', [XboxController::class, 'crear']);
        Route::post('actualizar/{id}', [XboxController::class, 'actualizar']);
        Route::delete('eliminar/{id}', [XboxController::class, 'eliminar']);
    });
});

// ? <------------------------->

// Todo, Productos
Route::prefix('productos')->group(function () {

    // * GET - Listas
    Route::prefix('lista')->group(function () {

        // ? Global
        Route::prefix('global')->group(function () {
            Route::get('', [ProductoController::class, 'lista']);
            Route::get('{desde}', [ProductoController::class, 'lista']);
            Route::get('{desde}/{asta}', [ProductoController::class, 'lista']);
        });

        // ? Filtradas
        Route::prefix('filtrada')->group(function () {

            // Nombre
            Route::prefix('nombre')->group(function () {
                Route::get('{nombre}', [ProductoController::class, 'listaPorNombre']);
                Route::get('{nombre}/{desde}', [ProductoController::class, 'listaPorNombre']);
                Route::get('{nombre}/{desde}/{asta}', [ProductoController::class, 'listaPorNombre']);
            });

            // stock
            Route::prefix('stock')->group(function () {
                Route::get('{stock}', [ProductoController::class, 'listaPorStock']);
                Route::get('{stock}/{desde}', [ProductoController::class, 'listaPorStock']);
                Route::get('{stock}/{desde}/{asta}', [ProductoController::class, 'listaPorStock']);
            });
        });
    });

    // * OTROS - Acciones en general
    Route::prefix('opciones')->group(function () {
        Route::get('buscar/{id}', [ProductoController::class, 'obtenerPorId']);
        Route::post('crear', [ProductoController::class, 'crear']);
        Route::post('actualizar/{id}', [ProductoController::class, 'actualizar']);
        Route::delete('eliminar/{id}', [ProductoController::class, 'eliminar']);
        Route::get('no/datos', [ProductoController::class, 'noTotalDatos']);
    });
});

// ? <------------------------->

// Todo, Rentas
Route::prefix('rentas')->group(function () {
    // * GET - Lista por Xbox
    Route::prefix('lista/xbox')->group(function () {
        Route::get('{id}', [RentaController::class, 'listaPorXboxs']);
        Route::get('{id}/{desde}', [RentaController::class, 'listaPorXboxs']);
        Route::get('{id}/{desde}/{asta}', [RentaController::class, 'listaPorXboxs']);
    });
    // * GET - Lista completa
    Route::prefix('lista/global')->group(function () {
        Route::get('', [RentaController::class, 'lista']);
        Route::get('{desde}', [RentaController::class, 'lista']);
        Route::get('{desde}/{asta}', [RentaController::class, 'lista']);
    });
    // * OTROS - Acciones en general
    Route::prefix('opciones')->group(function () {
        Route::get('buscar/{id}', [RentaController::class, 'obtenerPorId']);
        Route::post('crear', [RentaController::class, 'crear']);
        Route::post('actualizar/{id}', [RentaController::class, 'actualizar']);
        Route::delete('eliminar/{id}', [RentaController::class, 'eliminar']);
    });
});

// ? <------------------------->

// Todo, Ventas
Route::prefix('ventas')->group(function () {

    // * GET - Listas
    Route::prefix('lista')->group(function () {

        // ? Global
        Route::prefix('global')->group(function () {
            Route::get('', [VentaController::class, 'lista']);
            Route::get('{desde}', [VentaController::class, 'lista']);
            Route::get('{desde}/{asta}', [VentaController::class, 'lista']);
        });

        // ? Periodica
        Route::prefix('periodica')->group(function () {
            Route::get('', [VentaController::class, 'ListaVentasPorDias']);
            Route::get('{dias}', [VentaController::class, 'ListaVentasPorDias']);
        });

        // ? Semanal
        Route::prefix('semanal')->group(function () {
            Route::get('', [VentaController::class, 'ListaVentasSemanales']);
            Route::get('{semanas}', [VentaController::class, 'ListaVentasSemanales']);
        });

        // ? Mensual
        Route::prefix('mensual')->group(function () {
            Route::get('', [VentaController::class, 'ListaVentasMensuales']);
            Route::get('{meses}', [VentaController::class, 'ListaVentasMensuales']);
        });

        // ? Anual
        Route::prefix('anual')->group(function () {
            Route::get('', [VentaController::class, 'ListaVentasAnuales']);
            Route::get('{anios}', [VentaController::class, 'ListaVentasAnuales']);
        });

        // ? Filtradas
        Route::prefix('filtrada')->group(function () {
            // Producto
            Route::prefix('producto')->group(function () {
                Route::get('{id}', [VentaController::class, 'listaPorProducto']);
                Route::get('{id}/{desde}', [VentaController::class, 'listaPorProducto']);
                Route::get('{id}/{desde}/{asta}', [VentaController::class, 'listaPorProducto']);
            });

            // Dia
            Route::prefix('dia')->group(function () {
                Route::get('{dia}', [VentaController::class, 'ListaPorDiaEspecifico']);
                Route::get('{dia}/{desde}', [VentaController::class, 'ListaPorDiaEspecifico']);
                Route::get('{dia}/{desde}/{asta}', [VentaController::class, 'ListaPorDiaEspecifico']);
            });

            // Mes
            Route::prefix('mes')->group(function () {
                Route::get('{anio}/{mes}', [VentaController::class, 'ListaPorMesEspecifico']);
                Route::get('{anio}/{mes}/{desde}', [VentaController::class, 'ListaPorMesEspecifico']);
                Route::get('{anio}/{mes}/{desde}/{asta}', [VentaController::class, 'ListaPorMesEspecifico']);
            });
        });
    });

    // * OTROS - Acciones en general
    Route::prefix('opciones')->group(function () {
        Route::get('buscar/{id}', [VentaController::class, 'obtenerPorId']);
        Route::post('crear', [VentaController::class, 'crear']);
        Route::post('actualizar/{id}', [VentaController::class, 'actualizar']);
        Route::delete('eliminar/{id}', [VentaController::class, 'eliminar']);
    });
});

// ? <------------------------->

// Todo, Notas
Route::prefix('notas')->group(function () {
    // * GET - Lista completa
    Route::prefix('lista/global')->group(function () {
        Route::get('', [NotaController::class, 'lista']);
        Route::get('{desde}', [NotaController::class, 'lista']);
        Route::get('{desde}/{asta}', [NotaController::class, 'lista']);
    });
    // * OTROS - Acciones en general
    Route::prefix('opciones')->group(function () {
        Route::get('buscar/{id}', [NotaController::class, 'obtenerPorId']);
        Route::post('crear', [NotaController::class, 'crear']);
        Route::post('actualizar/{id}', [NotaController::class, 'actualizar']);
        Route::delete('eliminar/{id}', [NotaController::class, 'eliminar']);
    });
});
