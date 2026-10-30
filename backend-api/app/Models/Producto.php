<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
    ];

    /**
     * Casteo de atributos para PHP 8.2
     */
    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'stock'  => 'integer',
        ];
    }
}

