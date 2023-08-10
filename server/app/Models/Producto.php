<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    // * Tabla
    protected $table = 'productos';
    use HasFactory;

    // Mostrables
    protected $fillable = [
        'nombre',
        'precio',
        'stock',
        'descripcion',
        'enlace_img',
    ];

    // Ocultos
    protected $hidden = [
        'updated_at',
        'created_at',
    ];

    // Tiene
    public function ventas()
    {
        return $this->hasMany(Venta::class, 'id_producto');
    }
}
