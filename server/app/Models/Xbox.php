<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// TODO, XBOX
class Xbox extends Model
{
    // * Tabla
    protected $table = 'xboxs';
    use HasFactory;

    // Mostrables
    protected $fillable = [
        'nombre',
        'estado',
        'descripcion',
    ];

    // Ocultos
    protected $hidden = [
        'updated_at',
        'created_at',
    ];

    // Tiene
    public function rentas()
    {
        return $this->hasMany(Renta::class, 'id_xbox');
    }
}
