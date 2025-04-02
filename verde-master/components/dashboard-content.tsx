"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Sun, Cloud, Zap, AlertTriangle } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Definición de tipos para la API
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
}

export interface DeletedParcela extends Parcela {
  deleted_at: string
}

// Configuración de la API de Laravel
const LARAVEL_API_URL = "http://localhost:8000/api"
// URL correcta de la API externa
const EXTERNAL_API_URL = "http://moriahmkt.com/iotapp/updated/"

// Función para realizar peticiones HTTP a Laravel
async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  }

  try {
    console.log(`Realizando petición a ${LARAVEL_API_URL}/${endpoint}`)
    const response = await fetch(`${LARAVEL_API_URL}/${endpoint}`, defaultOptions)
    console.log(`Respuesta de ${endpoint}:`, response)

    if (!response.ok) {
      throw new Error(`Error API: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Datos de ${endpoint}:`, data)
    return data
  } catch (error) {
    console.error(`Error en la petición API (${endpoint}):`, error)
    throw error
  }
}

// Función para obtener datos de la API externa
export async function fetchIoTData(): Promise<ApiResponse> {
  try {
    console.log("Obteniendo datos de la API externa:", EXTERNAL_API_URL)
    const response = await fetch(EXTERNAL_API_URL)

    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    console.log("Datos obtenidos de la API externa:", data)
    return data
  } catch (error) {
    console.error("Error al obtener datos de la API:", error)

    // Devolver datos de respaldo en caso de error
    return {
      sensores: {
        humedad: 80,
        temperatura: 30.1,
        lluvia: 0.93, // Scaled down by factor of 10
        sol: 1.0, // Scaled down by factor of 10
      },
      parcelas: [
        {
          id: 1,
          nombre: "Ki'ik",
          ubicacion: "Zona Norte",
          responsable: "Juan Pérez",
          tipo_cultivo: "Tomate",
          ultimo_riego: "2025-03-25 08:18:33",
          sensor: {
            humedad: 90,
            temperatura: 26.3,
          },
        },
        {
          id: 2,
          nombre: "Parcela 2",
          ubicacion: "Zona Sur",
          responsable: "María López",
          tipo_cultivo: "Maíz",
          ultimo_riego: "2025-03-19 05:30:00",
          sensor: {
            humedad: 65,
            temperatura: 28,
          },
        },
        {
          id: 3,
          nombre: "Parcela 3",
          ubicacion: "Zona Este",
          responsable: "Carlos Rodríguez",
          tipo_cultivo: "Frijol",
          ultimo_riego: "2025-03-19 07:15:22",
          sensor: {
            humedad: 60,
            temperatura: 30,
          },
        },
      ],
    }
  }
}

// Función para guardar datos en la base de datos Laravel
export async function saveDataToDatabase(data: ApiResponse): Promise<void> {
  try {
    console.log("Guardando datos en la base de datos Laravel:", data)
    await fetchFromAPI("save-data", {
      method: "POST",
      body: JSON.stringify(data),
    })
    console.log("Datos guardados correctamente en Laravel")
  } catch (error) {
    console.error("Error al guardar datos en Laravel:", error)
  }
}

// Función para obtener datos históricos
export async function fetchHistoricalData(): Promise<HistoricalData[]> {
  try {
    console.log("Obteniendo datos históricos de Laravel")
    const data = await fetchFromAPI("historical-data")
    console.log("Datos históricos obtenidos:", data)
    return data
  } catch (error) {
    console.error("Error al obtener datos históricos:", error)
    return []
  }
}

// Función para obtener parcelas eliminadas
export async function fetchDeletedParcelas(): Promise<DeletedParcela[]> {
  try {
    console.log("Obteniendo parcelas eliminadas de Laravel")
    const data = await fetchFromAPI("deleted-parcelas")
    console.log("Parcelas eliminadas obtenidas:", data)
    return data
  } catch (error) {
    console.error("Error al obtener parcelas eliminadas:", error)
    return []
  }
}

// Definición de tipos para las métricas
interface Metrics {
  temperature: number
  humidity: number
  windSpeed: number
  solarRadiation: number
  pressure: number
  co2Levels: number
  rainProbability: number
  energyConsumption: number
}

// Definición de tipos para las props del componente MetricCard
interface MetricCardProps {
  title: string
  value: number
  unit: string
  icon: React.ComponentType<{ className?: string }>
}

// Función para generar datos aleatorios
const getRandomData = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

// Componente para cada métrica
const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon: Icon }) => (
    <Card className="h-40 flex flex-col justify-center items-center text-center bg-white border-green-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-col items-center space-y-2 pb-2">
        <Icon className="h-6 w-6 text-green-600" />
        <CardTitle className="text-lg font-semibold text-green-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-0">
        <div className="text-3xl font-bold text-green-700">
          {value} {unit}
        </div>
      </CardContent>
    </Card>
)

// Componente para mostrar parcelas eliminadas
const DeletedParcelasSection: React.FC<{ deletedParcelas: DeletedParcela[] }> = ({ deletedParcelas }) => {
  if (deletedParcelas.length === 0) {
    return (
        <Card className="p-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <p>No hay parcelas eliminadas</p>
          </div>
        </Card>
    )
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deletedParcelas.map((parcela) => (
            <Card key={parcela.id} className="overflow-hidden">
              <CardHeader className="bg-destructive/10 pb-2">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                  <CardTitle className="text-lg">{parcela.nombre}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Eliminada el: {new Date(parcela.deleted_at).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Ubicación:</span>
                    <span>{parcela.ubicacion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Responsable:</span>
                    <span>{parcela.responsable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tipo de cultivo:</span>
                    <span>{parcela.tipo_cultivo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Último riego:</span>
                    <span>{new Date(parcela.ultimo_riego).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="font-medium">Temperatura:</span>
                    <span>{parcela.sensor.temperatura}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Humedad:</span>
                    <span>{parcela.sensor.humedad}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
  )
}

// Componente principal
export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    solarRadiation: 0,
    pressure: 0,
    co2Levels: 0,
  })

  const [data, setData] = useState<Array<Metrics & { time: string }>>([])
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [deletedParcelas, setDeletedParcelas] = useState<DeletedParcela[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [apiStatus, setApiStatus] = useState<"loading" | "success" | "error">("loading")
  const [externalApiStatus, setExternalApiStatus] = useState<"loading" | "success" | "error">("loading")

  // Coordenadas para las parcelas (simuladas)
  const parcelasCoords = [
    { id: 1, lat: 21.1619, lng: -86.8515 }, // Centro de Cancún
    { id: 2, lat: 21.145, lng: -86.82 }, // Zona Hotelera
    { id: 3, lat: 21.178, lng: -86.84 }, // Zona Norte
  ]

  // Cargar datos históricos
  const loadHistoricalData = async () => {
    try {
      console.log("Cargando datos históricos...")
      const data = await fetchHistoricalData()
      console.log("Datos históricos cargados:", data)
      setHistoricalData(data)
      return true
    } catch (error) {
      console.error("Error al cargar datos históricos:", error)
      return false
    }
  }

  // Cargar parcelas eliminadas
  const loadDeletedParcelas = async () => {
    try {
      console.log("Cargando parcelas eliminadas...")
      const data = await fetchDeletedParcelas()
      console.log("Parcelas eliminadas cargadas:", data)
      setDeletedParcelas(data)
      return true
    } catch (error) {
      console.error("Error al cargar parcelas eliminadas:", error)
      return false
    }
  }

  // Verificar conexión con la API de Laravel
  const checkApiConnection = async () => {
    try {
      console.log("Verificando conexión con la API de Laravel...")
      await fetchFromAPI("ping")
      console.log("Conexión con la API de Laravel exitosa")
      setApiStatus("success")
      return true
    } catch (error) {
      console.error("Error al conectar con la API de Laravel:", error)
      setApiStatus("error")
      return false
    }
  }

  // Modificar el useEffect para actualizar los datos más frecuentemente y manejar posibles errores de CORS
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar conexión con la API
        const apiConnected = await checkApiConnection()

        if (!apiConnected) {
          console.error("No se pudo conectar con la API de Laravel. No se podrán guardar ni recuperar datos.")
        }

        // Obtener datos de la API externa
        try {
          console.log("Obteniendo datos de la API externa...")
          const response = await fetchIoTData()
          setExternalApiStatus("success")
          console.log("Datos de la API externa obtenidos:", response)

          // Asignar coordenadas a las parcelas
          const parcelasWithCoords = response.parcelas.map((parcela) => {
            const coords = parcelasCoords.find((p) => p.id === parcela.id)
            return {
              ...parcela,
              lat: coords?.lat || 21.16 + (Math.random() * 0.04 - 0.02),
              lng: coords?.lng || -86.85 + (Math.random() * 0.04 - 0.02),
            }
          })

          setApiData({
            ...response,
            parcelas: parcelasWithCoords,
          })

          // Guardar datos en la base de datos Laravel si la API está conectada
          if (apiConnected) {
            console.log("Guardando datos en la base de datos Laravel...")
            await saveDataToDatabase(response)
          }

          // Actualizar métricas con datos de la API
          setMetrics({
            temperature: response.sensores.temperatura,
            humidity: response.sensores.humedad,
            windSpeed: getRandomData(0, 20),
            solarRadiation: response.sensores.sol, // Already scaled appropriately
            pressure: getRandomData(980, 1020),
            co2Levels: getRandomData(300, 1000),
            rainProbability: response.sensores.lluvia, // Already scaled appropriately
            energyConsumption: getRandomData(0, 500),
          })

          // Actualizar datos históricos para el gráfico
          setData((prevData) => [
            ...prevData.slice(-9), // Mantener solo los últimos 10 puntos
            {
              ...metrics,
              time: new Date().toLocaleTimeString(),
              temperature: response.sensores.temperatura,
              humidity: response.sensores.humedad,
              rainProbability: response.sensores.lluvia,
              solarRadiation: response.sensores.sol,
            },
          ])
        } catch (error) {
          console.error("Error al obtener datos de la API externa:", error)
          setExternalApiStatus("error")
        }

        // Cargar datos históricos y parcelas eliminadas si la API está conectada
        if (apiConnected) {
          console.log("Cargando datos históricos y parcelas eliminadas...")
          await loadHistoricalData()
          await loadDeletedParcelas()
        }

        setLoading(false)
      } catch (error) {
        console.error("Error general:", error)
        setLoading(false)
        setApiStatus("error")
      }
    }

    // Cargar datos inmediatamente al montar el componente
    loadData()

    // Configurar intervalo para actualizar datos cada 15 segundos
    const interval = setInterval(() => {
      loadData()
    }, 15000) // Actualizar cada 15 segundos para mayor responsividad

    return () => clearInterval(interval)
  }, [])

  // Formatear fecha para mostrar en el popup
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-ES")
  }

  // Preparar datos para gráficos históricos
  const prepareHistoricalChartData = () => {
    return historicalData.map((data) => ({
      fecha: new Date(data.created_at).toLocaleDateString(),
      hora: new Date(data.created_at).toLocaleTimeString(),
      temperatura: data.temperatura,
      humedad: data.humedad,
      lluvia: data.lluvia, // Already scaled appropriately
      sol: data.sol, // Already scaled appropriately
    }))
  }

  const chartData = prepareHistoricalChartData()

  // Colores para gráficos
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  // Datos para gráfico de pastel
  const pieData = [
    { name: "Temperatura", value: apiData?.sensores.temperatura || 0 },
    { name: "Humedad", value: apiData?.sensores.humedad || 0 },
    { name: "Lluvia", value: apiData?.sensores.lluvia || 0 },
    { name: "Sol", value: apiData?.sensores.sol || 0 },
  ]

  // Componente para mostrar el estado de la API
  const ApiStatusIndicator = () => (
      <div className="flex gap-4">
        <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                apiStatus === "success"
                    ? "bg-green-100 text-green-800"
                    : apiStatus === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
            }`}
        >
          <div
              className={`w-2 h-2 rounded-full ${
                  apiStatus === "success" ? "bg-green-500" : apiStatus === "error" ? "bg-red-500" : "bg-yellow-500"
              }`}
          ></div>
          <span>
          {apiStatus === "success"
              ? "API Laravel conectada"
              : apiStatus === "error"
                  ? "Error de conexión API Laravel"
                  : "Conectando..."}
        </span>
        </div>

        <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                externalApiStatus === "success"
                    ? "bg-green-100 text-green-800"
                    : externalApiStatus === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
            }`}
        >
          <div
              className={`w-2 h-2 rounded-full ${
                  externalApiStatus === "success"
                      ? "bg-green-500"
                      : externalApiStatus === "error"
                          ? "bg-red-500"
                          : "bg-yellow-500"
              }`}
          ></div>
          <span>
          {externalApiStatus === "success"
              ? "API Externa conectada"
              : externalApiStatus === "error"
                  ? "Error de conexión API Externa"
                  : "Conectando..."}
        </span>
        </div>
      </div>
  )

  return (
      <div className="flex flex-col min-h-screen bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <ApiStatusIndicator />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="historical">Datos Históricos</TabsTrigger>
            <TabsTrigger value="deleted">Parcelas Eliminadas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {/* Contenedor superior: 50% Mapa / 50% Tarjetas */}
            <div className="flex-1 flex flex-col lg:flex-row">
              {/* Mapa (50%) */}
              <div className="flex-1 p-4">
                <h2 className="text-4xl font-bold mb-4 text-green-800">Mapa de Parcelas</h2>
                <div className="h-[500px]">
                  {!loading && (
                      <MapContainer center={[21.1619, -86.8515]} zoom={12} className="h-full w-full">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {apiData?.parcelas.map((parcela) => (
                            <Marker key={parcela.id} position={[parcela.lat || 0, parcela.lng || 0]}>
                              <Popup className="w-64">
                                <div className="p-2">
                                  <h3 className="font-bold text-lg">{parcela.nombre}</h3>
                                  <div className="mt-2 space-y-1 text-sm">
                                    <p>
                                      <span className="font-semibold">Ubicación:</span> {parcela.ubicacion}
                                    </p>
                                    <p>
                                      <span className="font-semibold">Responsable:</span> {parcela.responsable}
                                    </p>
                                    <p>
                                      <span className="font-semibold">Cultivo:</span> {parcela.tipo_cultivo}
                                    </p>
                                    <p>
                                      <span className="font-semibold">Último riego:</span> {formatDate(parcela.ultimo_riego)}
                                    </p>

                                    <div className="mt-3 pt-2 border-t">
                                      <h4 className="font-semibold">Datos del sensor:</h4>
                                      <div className="flex justify-between mt-1">
                                        <div className="flex items-center">
                                          <Thermometer className="h-4 w-4 mr-1 text-red-500" />
                                          <span>{parcela.sensor.temperatura}°C</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                                          <span>{parcela.sensor.humedad}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                        ))}
                      </MapContainer>
                  )}
                </div>
              </div>

              {/* Tarjetas de métricas (50%) */}
              <div className="flex-1 p-4">
                <h2 className="text-4xl font-bold mb-8 text-green-800">Resumen del Sistema</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <MetricCard title="Temperatura" value={metrics.temperature} unit="°C" icon={Thermometer} />
                  <MetricCard title="Humedad" value={metrics.humidity} unit="%" icon={Droplets} />
                  <MetricCard title="Velocidad del Viento" value={metrics.windSpeed} unit=" km/h" icon={Wind} />
                  <MetricCard title="Radiación Solar" value={metrics.solarRadiation} unit=" W/m²" icon={Sun} />
                  <MetricCard title="Probabilidad de Lluvia" value={metrics.rainProbability} unit="%" icon={Cloud} />
                  <MetricCard title="Consumo de Energía" value={metrics.energyConsumption} unit=" kWh" icon={Zap} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historical">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-green-800">Resumen de Datos Históricos</h2>

              {apiStatus === "error" ? (
                  <Card className="p-6 bg-red-50">
                    <div className="flex items-center text-red-800">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <p>No se pudieron cargar los datos históricos. Error de conexión con la API.</p>
                    </div>
                  </Card>
              ) : historicalData.length === 0 ? (
                  <Card className="p-6">
                    <div className="flex items-center justify-center text-muted-foreground">
                      <p>No hay datos históricos disponibles</p>
                    </div>
                  </Card>
              ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico de líneas con más especificaciones */}
                    <Card className="border border-green-200">
                      <CardHeader className="border-b border-green-100">
                        <CardTitle className="text-green-800">Evolución de Temperatura y Humedad</CardTitle>
                        <p className="text-sm text-muted-foreground">Tendencia de los últimos 7 días - Valores diarios</p>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.slice(-7)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis
                                  dataKey="fecha"
                                  label={{ value: "Fecha", position: "insideBottomRight", offset: -10 }}
                              />
                              <YAxis
                                  yAxisId="left"
                                  label={{ value: "Temperatura (°C)", angle: -90, position: "insideLeft" }}
                              />
                              <YAxis
                                  yAxisId="right"
                                  orientation="right"
                                  label={{ value: "Humedad (%)", angle: -90, position: "insideRight" }}
                              />
                              <Tooltip
                                  formatter={(value, name) => {
                                    if (name === "temperatura") return [`${value}°C`, "Temperatura"]
                                    if (name === "humedad") return [`${value}%`, "Humedad"]
                                    return [value, name]
                                  }}
                                  labelFormatter={(label) => `Fecha: ${label}`}
                              />
                              <Legend />
                              <Line
                                  yAxisId="left"
                                  type="monotone"
                                  dataKey="temperatura"
                                  stroke="#16a34a"
                                  name="Temperatura"
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6, stroke: "#047857", strokeWidth: 2 }}
                              />
                              <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="humedad"
                                  stroke="#0284c7"
                                  name="Humedad"
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6, stroke: "#0369a1", strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                          <p>• Los puntos muestran mediciones exactas tomadas a intervalos regulares</p>
                          <p>• Las líneas indican la tendencia entre mediciones consecutivas</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Gráfico de barras con más especificaciones */}
                    <Card className="border border-green-200">
                      <CardHeader className="border-b border-green-100">
                        <CardTitle className="text-green-800">Niveles de Lluvia y Radiación Solar</CardTitle>
                        <p className="text-sm text-muted-foreground">Comparativa diaria - Últimos 7 registros</p>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.slice(-7)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis
                                  dataKey="fecha"
                                  label={{ value: "Fecha", position: "insideBottomRight", offset: -10 }}
                              />
                              <YAxis label={{ value: "Valor registrado", angle: -90, position: "insideLeft" }} />
                              <Tooltip
                                  formatter={(value, name) => {
                                    if (name === "lluvia") return [`${value}%`, "Probabilidad de lluvia"]
                                    if (name === "sol") return [`${value} W/m²`, "Radiación solar"]
                                    return [value, name]
                                  }}
                                  labelFormatter={(label) => `Fecha: ${label}`}
                              />
                              <Legend
                                  formatter={(value) => {
                                    if (value === "lluvia") return "Probabilidad de lluvia (%)"
                                    if (value === "sol") return "Radiación solar (W/m²)"
                                    return value
                                  }}
                              />
                              <Bar dataKey="lluvia" fill="#0ea5e9" name="lluvia" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="sol" fill="#eab308" name="sol" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                          <p>• Barras azules: Probabilidad de lluvia en porcentaje</p>
                          <p>• Barras amarillas: Radiación solar en vatios por metro cuadrado</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Gráfico de área con más especificaciones */}
                    <Card className="border border-green-200">
                      <CardHeader className="border-b border-green-100">
                        <CardTitle className="text-green-800">Tendencias Acumulativas de Indicadores Ambientales</CardTitle>
                        <p className="text-sm text-muted-foreground">Distribución diaria - Muestra patrones de cambio</p>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.slice(-7)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis
                                  dataKey="fecha"
                                  label={{ value: "Fecha", position: "insideBottomRight", offset: -10 }}
                              />
                              <YAxis label={{ value: "Valores acumulados", angle: -90, position: "insideLeft" }} />
                              <Tooltip
                                  formatter={(value, name) => {
                                    if (name === "temperatura") return [`${value}°C`, "Temperatura"]
                                    if (name === "humedad") return [`${value}%`, "Humedad"]
                                    return [value, name]
                                  }}
                                  itemSorter={(item) => -item.value}
                              />
                              <Legend
                                  formatter={(value) => {
                                    if (value === "temperatura") return "Temperatura (°C)"
                                    if (value === "humedad") return "Humedad (%)"
                                    return value
                                  }}
                              />
                              <Area
                                  type="monotone"
                                  dataKey="temperatura"
                                  stackId="1"
                                  stroke="#16a34a"
                                  fill="#16a34a"
                                  fillOpacity={0.3}
                                  name="temperatura"
                              />
                              <Area
                                  type="monotone"
                                  dataKey="humedad"
                                  stackId="1"
                                  stroke="#0284c7"
                                  fill="#0284c7"
                                  fillOpacity={0.3}
                                  name="humedad"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                          <p>• Áreas verdes: Temperatura acumulada en grados Celsius</p>
                          <p>• Áreas azules: Humedad acumulada en porcentaje</p>
                          <p>• El gráfico muestra tendencias de comportamiento a lo largo del tiempo</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Gráfico de pastel con más especificaciones */}
                    <Card className="border border-green-200">
                      <CardHeader className="border-b border-green-100">
                        <CardTitle className="text-green-800">Distribución Proporcional de Factores Climáticos</CardTitle>
                        <p className="text-sm text-muted-foreground">Valores actuales - Relación entre variables</p>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={100}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                  nameKey="name"
                              >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                  formatter={(value, name) => {
                                    if (name === "Temperatura") return [`${value}°C`, name]
                                    if (name === "Humedad") return [`${value}%`, name]
                                    if (name === "Lluvia") return [`${value}%`, name]
                                    if (name === "Sol") return [`${value} W/m²`, name]
                                    return [value, name]
                                  }}
                              />
                              <Legend
                                  formatter={(value) => {
                                    if (value === "Temperatura") return "Temperatura (°C)"
                                    if (value === "Humedad") return "Humedad (%)"
                                    if (value === "Lluvia") return "Lluvia (%)"
                                    if (value === "Sol") return "Radiación solar (W/m²)"
                                    return value
                                  }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[0] }}></div>
                              <p>Temperatura (°C)</p>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[1] }}></div>
                              <p>Humedad (%)</p>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[2] }}></div>
                              <p>Lluvia (%)</p>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[3] }}></div>
                              <p>Radiación solar (W/m²)</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deleted">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Parcelas Eliminadas</h2>
              <p className="text-muted-foreground">
                Este apartado muestra las parcelas que han sido eliminadas de la API, pero que se mantienen en la base de
                datos para referencia histórica.
              </p>

              {apiStatus === "error" ? (
                  <Card className="p-6 bg-red-50">
                    <div className="flex items-center text-red-800">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <p>No se pudieron cargar las parcelas eliminadas. Error de conexión con la API.</p>
                    </div>
                  </Card>
              ) : (
                  <DeletedParcelasSection deletedParcelas={deletedParcelas} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}

