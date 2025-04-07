// Types for the API data
export interface SensorData {
  humedad: number
  temperatura: number
}

export interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  ultimo_riego: string
  sensor: SensorData
  lat?: number
  lng?: number
}

export interface ApiResponse {
  sensores: {
    humedad: number
    temperatura: number
    lluvia: number
    sol: number
  }
  parcelas: Parcela[]
}

export interface HistoricalData {
  id: number
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
  created_at: string
  lat?: number
  lng?: number
}

export interface DeletedParcela extends Parcela {
  deleted_at: string
}

export interface Metrics {
  temperature: number
  humidity: number
  windSpeed: number
  solarRadiation: number
  pressure: number
  co2Levels: number
  rainProbability: number
  energyConsumption: number
}
