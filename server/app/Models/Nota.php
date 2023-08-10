<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// TODO, NOTAS
class Nota extends Model
{
    // * Tabla
    protected $table = 'notas';
    use HasFactory;

    // Mostrables
    protected $fillable = [
        'fecha',
        'hora',
        'nombre',
        'descripcion',
    ];

    // Ocultos
    protected $hidden = [
        'updated_at',
        'created_at',
    ];
}
