<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// TODO, Rentas
class Renta extends Model
{
    // * Tabla
    protected $table = 'rentas';
    use HasFactory;

    // Mostrables
    protected $fillable = [
        'id_xbox',
        'fecha',
        'inicio',
        'final',
        'duracion',
        'total',
        "isPagado",
        "noControles",
        'cliente',
        'comentario',
    ];

    // Ocultos
    protected $hidden = [
        'updated_at',
        'created_at',
    ];

    //Pertenece
    public function xbox()
    {
        return $this->belongsTo(Xbox::class, 'id_xbox');
    }
}
