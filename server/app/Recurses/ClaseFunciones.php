<?php

namespace App\Recurses;

use DateTime;
use Exception;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

// Todo, Funciones globales
class ClaseFunciones
{

    // * Crear id con la fecha
    public static function crearIdFecha()
    {

        //Obtenemos fecha
        $fechaActual = new DateTime();
        //Convertimos fecha a dígitos
        $fechaActual = $fechaActual->getTimestamp();
        //retornamos
        return $fechaActual;
    }

    // * Guardar archivo
    public static function guardarArchivo($file, $ruta, $nombreProvisional)
    {
        try {
            //Extension
            $extension = $file->getClientOriginalExtension();
            //Id
            $Id = ClaseFunciones::crearIdFecha();
            //Nombre
            $nombre = "{$nombreProvisional}_{$Id}.{$extension}";
            //Disco a almacenar (carpeta publica, s3, etc, crear en config/filesystem.php )
            $disco = "public";
            // Almacenamos la imagen y devolvemos la ruta
            return $file->storeAs($ruta, $nombre, $disco);
        } catch (\Exception $e) {
            // Si ocurre algún error durante el proceso de almacenamiento, lanzamos una excepción
            throw new \Exception('Error al guardar el archivo: ' . $e->getMessage());
        }
    }

    // * Eliminar archivo
    public static function eliminarArchivo($rutaArchivo)
    {
        try {
            if ($rutaArchivo != null) {
                // Verificamos si el archivo existe
                if (Storage::exists("public/" . $rutaArchivo)) {
                    // Eliminamos el archivo
                    Storage::disk('public')->delete($rutaArchivo);
                }
            }
        } catch (\Exception $e) {
            // Si ocurre algún error durante el proceso de eliminación, lanzamos una excepción
            throw new \Exception('Error al eliminar el archivo: ' . $e->getMessage());
        }
    }

    // * Reemplazar archivo
    public static function reemplazarArchivo($archivoNuevo, $rutaArchivoViejo, $nombreProvisional)
    {
        try {
            // Eliminamos el archivo viejo
            self::eliminarArchivo($rutaArchivoViejo);
            // Guardamos el archivo nuevo
            $rutaArchivoNuevo = self::guardarArchivo($archivoNuevo, 'ruta-de-almacenamiento', $nombreProvisional);

            return $rutaArchivoNuevo;
        } catch (\Exception $e) {
            // Si ocurre algún error durante el proceso de reemplazo, lanzamos una excepción
            throw new \Exception('Error al reemplazar el archivo: ' . $e->getMessage());
        }
    }

    // * Obtener ruta img
    public static function obtenerRutaImg($img)
    {
        //Si existe
        if ($img !== null) {
            //Si existe el archivo
            if (Storage::exists("public/" . $img)) {
                //Obtenemos imagen
                return  Storage::url($img);
            }
        }

        return null;
    }

    // * Obtener ruta archivo
    public static function obtenerRutaFile($file)
    {
        //Si existe
        if ($file !== null) {
            //Si existe el archivo
            if (Storage::exists("public/" . $file)) {
                //Obtenemos archivo
                return  Storage::url($file);
            }
        }

        return null;
    }
}
