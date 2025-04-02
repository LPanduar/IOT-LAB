<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Parcela extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'ubicacion',
        'responsable',
        'tipo_cultivo',
        'ultimo_riego',
        'sensor_humedad',
        'sensor_temperatura',
        'lat',
        'lng'
    ];

    protected $dates = ['deleted_at'];
}
