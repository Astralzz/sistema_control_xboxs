<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    // * Tabla
    protected $table = 'ventas';
    use HasFactory;

    // Mostrables
    protected $fillable = [
        'fecha',
        'hora',
        'noProductos',
        'total',
        'comentario',
        'detalles',
    ];

    // Ocultos
    protected $hidden = [
        'updated_at',
        'created_at',
    ];
}
