<?php
// routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

// Ruta para verificar que la API está funcionando
Route::get('/ping', function() {
    return response()->json(['message' => 'API funcionando correctamente', 'timestamp' => now()]);
});

// Tus rutas API
Route::post('/save-data', [ApiController::class, 'saveData']);
Route::get('/historical-data', [ApiController::class, 'getHistoricalData']);
Route::get('/deleted-parcelas', [ApiController::class, 'getDeletedParcelas']);
Route::get('/ping', [ApiController::class, 'ping']);

// Manejar solicitudes OPTIONS para CORS preflight
Route::options('/{any}', function() {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

// Aplicar encabezados CORS a todas las respuestas
app()->afterResolving(function($response) {
    if ($response instanceof \Illuminate\Http\Response || $response instanceof \Illuminate\Http\JsonResponse) {
        $response->header('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');
        $response->header('Access-Control-Allow-Credentials', 'true');
    }
    return $response;
});
