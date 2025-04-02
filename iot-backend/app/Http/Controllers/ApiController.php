<?php
// app/Http/Controllers/ApiController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SensorData;
use App\Models\Parcela;
use Illuminate\Support\Facades\Log;

class ApiController extends Controller
{
    public function ping()
    {
        return response()->json(['message' => 'API funcionando correctamente', 'timestamp' => now()]);
    }

    public function saveData(Request $request)
    {
        try {
            Log::info('Recibiendo datos para guardar', $request->all());

            // Guardar datos de sensores
            $sensorData = new SensorData([
                'temperatura' => $request->input('sensores.temperatura'),
                'humedad' => $request->input('sensores.humedad'),
                'lluvia' => $request->input('sensores.lluvia'),
                'sol' => $request->input('sensores.sol')
            ]);
            $sensorData->save();

            Log::info('Datos de sensores guardados', ['id' => $sensorData->id]);

            // Procesar parcelas
            if ($request->has('parcelas') && is_array($request->input('parcelas'))) {
                foreach ($request->input('parcelas') as $parcelaData) {
                    // Buscar si la parcela ya existe
                    $parcela = Parcela::withTrashed()->where('id', $parcelaData['id'])->first();

                    if ($parcela) {
                        // Si la parcela existe y está eliminada, restaurarla
                        if ($parcela->trashed()) {
                            $parcela->restore();
                            Log::info('Parcela restaurada', ['id' => $parcela->id]);
                        }

                        // Actualizar datos
                        $parcela->update([
                            'nombre' => $parcelaData['nombre'],
                            'ubicacion' => $parcelaData['ubicacion'],
                            'responsable' => $parcelaData['responsable'],
                            'tipo_cultivo' => $parcelaData['tipo_cultivo'],
                            'ultimo_riego' => $parcelaData['ultimo_riego'],
                            'sensor_humedad' => $parcelaData['sensor']['humedad'],
                            'sensor_temperatura' => $parcelaData['sensor']['temperatura'],
                            'lat' => $parcelaData['lat'] ?? null,
                            'lng' => $parcelaData['lng'] ?? null,
                        ]);

                        Log::info('Parcela actualizada', ['id' => $parcela->id]);
                    } else {
                        // Crear nueva parcela
                        $parcela = new Parcela([
                            'id' => $parcelaData['id'],
                            'nombre' => $parcelaData['nombre'],
                            'ubicacion' => $parcelaData['ubicacion'],
                            'responsable' => $parcelaData['responsable'],
                            'tipo_cultivo' => $parcelaData['tipo_cultivo'],
                            'ultimo_riego' => $parcelaData['ultimo_riego'],
                            'sensor_humedad' => $parcelaData['sensor']['humedad'],
                            'sensor_temperatura' => $parcelaData['sensor']['temperatura'],
                            'lat' => $parcelaData['lat'] ?? null,
                            'lng' => $parcelaData['lng'] ?? null,
                        ]);
                        $parcela->save();

                        Log::info('Nueva parcela creada', ['id' => $parcela->id]);
                    }
                }
            }

            // Verificar parcelas eliminadas
            // Si una parcela existe en la base de datos pero no en los datos recibidos, marcarla como eliminada
            $parcelasIds = collect($request->input('parcelas', []))->pluck('id')->toArray();
            $parcelasToDelete = Parcela::whereNotIn('id', $parcelasIds)->get();

            foreach ($parcelasToDelete as $parcelaToDelete) {
                $parcelaToDelete->delete(); // Soft delete
                Log::info('Parcela marcada como eliminada', ['id' => $parcelaToDelete->id]);
            }

            return response()->json(['success' => true, 'message' => 'Datos guardados correctamente']);
        } catch (\Exception $e) {
            Log::error('Error al guardar datos', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function getHistoricalData()
    {
        try {
            Log::info('Obteniendo datos históricos');
            $data = SensorData::orderBy('created_at', 'desc')->take(100)->get();
            Log::info('Datos históricos obtenidos', ['count' => $data->count()]);

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error al obtener datos históricos', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function getDeletedParcelas()
    {
        try {
            Log::info('Obteniendo parcelas eliminadas');
            $deletedParcelas = Parcela::onlyTrashed()->get()->map(function($parcela) {
                return [
                    'id' => $parcela->id,
                    'nombre' => $parcela->nombre,
                    'ubicacion' => $parcela->ubicacion,
                    'responsable' => $parcela->responsable,
                    'tipo_cultivo' => $parcela->tipo_cultivo,
                    'ultimo_riego' => $parcela->ultimo_riego,
                    'sensor' => [
                        'humedad' => $parcela->sensor_humedad,
                        'temperatura' => $parcela->sensor_temperatura
                    ],
                    'deleted_at' => $parcela->deleted_at
                ];
            });

            Log::info('Parcelas eliminadas obtenidas', ['count' => $deletedParcelas->count()]);

            return response()->json($deletedParcelas);
        } catch (\Exception $e) {
            Log::error('Error al obtener parcelas eliminadas', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}

