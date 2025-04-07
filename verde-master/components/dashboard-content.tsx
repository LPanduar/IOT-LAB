"use client"

import { useState, useEffect } from "react"
import { Thermometer, Droplets, Wind, Sun, Cloud, Zap, MapPin, Info, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Import types
import type { ApiResponse, HistoricalData, DeletedParcela, Metrics } from "@/types/api-types"

// Import services
import ApiService from "@/services/api-service"

// Import components
import MetricCard from "@/components/ui/metric-card"
import ApiStatusIndicator from "@/components/ui/api-status-indicator"
import MapSection from "@/components/map/map-section"
import HistoricalCharts from "@/components/charts/historical-charts"
import DeletedParcelasSection from "@/components/deleted-parcelas/deleted-parcelas-section"

// Import utils
import { parcelasCoords } from "@/utils/map-utils"

export default function Dashboard() {
  // States - Applying Single Responsibility Principle (SOLID)
  const [metrics, setMetrics] = useState<Metrics>({
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    solarRadiation: 0,
    pressure: 0,
    co2Levels: 0,
    rainProbability: 0,
    energyConsumption: 0,
  })

  const [data, setData] = useState<Array<Metrics & { time: string }>>([])
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [deletedParcelas, setDeletedParcelas] = useState<DeletedParcela[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [apiStatus, setApiStatus] = useState<"loading" | "success" | "error">("loading")
  const [externalApiStatus, setExternalApiStatus] = useState<"loading" | "success" | "error">("loading")

  // Load historical data - Applying Interface Segregation Principle (SOLID)
  const loadHistoricalData = async () => {
    try {
      const data = await ApiService.fetchHistoricalData()
      setHistoricalData(data)
      return true
    } catch (error) {
      console.error("Error loading historical data:", error)
      return false
    }
  }

  // Load deleted parcels
  const loadDeletedParcelas = async () => {
    try {
      const data = await ApiService.fetchDeletedParcelas()
      setDeletedParcelas(data)
      return true
    } catch (error) {
      console.error("Error loading deleted parcels:", error)
      return false
    }
  }

  // Check connection with Laravel API
  const checkApiConnection = async () => {
    try {
      const connected = await ApiService.checkApiConnection()
      setApiStatus(connected ? "success" : "error")
      return connected
    } catch (error) {
      setApiStatus("error")
      return false
    }
  }

  // Effect to load data - Applying Dependency Inversion Principle (SOLID)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check API connection
        const apiConnected = await checkApiConnection()

        // Get data from external API
        try {
          const response = await ApiService.fetchIoTData()
          setExternalApiStatus("success")

          // Keep coordinates of existing parcels and only assign new ones to those that don't exist
          const parcelasWithCoords = response.parcelas.map((parcela) => {
            // If the parcel already has coordinates from the API, use them
            if (parcela.lat && parcela.lng) {
              console.log(`Parcel ${parcela.id} has API coordinates: ${parcela.lat}, ${parcela.lng}`)
              return parcela
            }

            // Check if the parcel already exists in the current state to keep its coordinates
            const existingParcela = apiData?.parcelas.find((p) => p.id === parcela.id)
            if (existingParcela?.lat && existingParcela?.lng) {
              console.log(
                  `Keeping existing coordinates for parcel ${parcela.id}: ${existingParcela.lat}, ${existingParcela.lng}`,
              )
              return {
                ...parcela,
                lat: existingParcela.lat,
                lng: existingParcela.lng,
              }
            }

            // If it's a new parcel, assign fixed coordinates based on ID or with a small variation
            const baseCoords = parcelasCoords.find((p) => p.id === parcela.id)
            const baseLat = baseCoords?.lat || 21.16
            const baseLng = baseCoords?.lng || -86.85

            // Add a small fixed variation based on ID to be consistent
            const idVariation = (parcela.id * 0.005) % 0.03
            const lat = baseLat + idVariation
            const lng = baseLng - idVariation

            console.log(`Assigning new coordinates to parcel ${parcela.id}: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)

            return {
              ...parcela,
              lat,
              lng,
            }
          })

          setApiData({
            ...response,
            parcelas: parcelasWithCoords,
          })

          // Save data to Laravel database if API is connected
          // Important: send parcels with coordinates to be saved in Laravel
          if (apiConnected) {
            await ApiService.saveDataToDatabase({
              ...response,
              parcelas: parcelasWithCoords,
            })
          }

          // Update metrics with API data
          setMetrics({
            temperature: response.sensores.temperatura,
            humidity: response.sensores.humedad,
            windSpeed: Math.round(Math.random() * 20 * 10) / 10,
            solarRadiation: response.sensores.sol,
            pressure: Math.round((Math.random() * 40 + 980) * 10) / 10,
            co2Levels: Math.round((Math.random() * 700 + 300) * 10) / 10,
            rainProbability: response.sensores.lluvia,
            energyConsumption: Math.round(Math.random() * 500 * 10) / 10,
          })

          // Update historical data for the chart
          setData((prevData) => [
            ...prevData.slice(-9), // Keep only the last 10 points
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
          console.error("Error getting data from external API:", error)
          setExternalApiStatus("error")
        }

        // Load historical data and deleted parcels if API is connected
        if (apiConnected) {
          await loadHistoricalData()
          await loadDeletedParcelas()
        }

        setLoading(false)
      } catch (error) {
        console.error("General error:", error)
        setLoading(false)
        setApiStatus("error")
      }
    }

    // Load data immediately when mounting the component
    loadData()

    // Set interval to update data every 15 seconds
    const interval = setInterval(() => {
      loadData()
    }, 15000)

    return () => clearInterval(interval)
  }, [apiData?.parcelas])

  return (
      <div className="min-h-screen bg-white py-10">
        {/* Header with visible system status */}
        <header className="max-w-[1600px] mx-auto px-6 md:px-10 mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-green-800">Datos parcelas</h1>
              <p className="text-base text-muted-foreground mt-2">Última actualización: {new Date().toLocaleString()}</p>
            </div>
            <ApiStatusIndicator apiStatus={apiStatus} externalApiStatus={externalApiStatus} />
          </div>
        </header>

        {/* Improved and centered tab navigation */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="dashboard">
            <div className="flex justify-center mb-10">
              <TabsList className="h-16 bg-white/80 backdrop-blur-sm rounded-full shadow-md p-2 gap-2">
                <TabsTrigger
                    value="dashboard"
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-full px-8 h-full text-base transition-all"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <span>Dashboard</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                    value="historical"
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-full px-8 h-full text-base transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5" />
                    <span>Datos Históricos</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                    value="deleted"
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-full px-8 h-full text-base transition-all"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Parcelas Eliminadas</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dashboard Content */}
            <TabsContent value="dashboard" className="focus:outline-none">
              {loading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="h-[500px] w-full rounded-xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {Array(6)
                          .fill(0)
                          .map((_, i) => (
                              <Skeleton key={i} className="h-40 w-full rounded-xl" />
                          ))}
                    </div>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Parcels Map */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-green-800 flex items-center">
                        <MapPin className="h-6 w-6 mr-3 text-green-600" />
                        Mapa de Parcelas
                      </h2>
                      <MapSection parcelas={apiData?.parcelas || []} loading={loading} />
                    </div>

                    {/* Metric Cards */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-green-800 flex items-center">
                        <Info className="h-6 w-6 mr-3 text-green-600" />
                        Resumen del Sistema
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <MetricCard
                            title="Temperatura"
                            value={metrics.temperature}
                            unit="°C"
                            icon={Thermometer}
                            description="Temperatura ambiente actual"
                        />
                        <MetricCard
                            title="Humedad"
                            value={metrics.humidity}
                            unit="%"
                            icon={Droplets}
                            description="Humedad relativa del aire"
                        />
                        <MetricCard
                            title="Velocidad del Viento"
                            value={metrics.windSpeed}
                            unit="km/h"
                            icon={Wind}
                            description="Velocidad actual del viento"
                        />
                        <MetricCard
                            title="Radiación Solar"
                            value={metrics.solarRadiation}
                            unit="W/m²"
                            icon={Sun}
                            description="Intensidad de radiación solar"
                        />
                        <MetricCard
                            title="Probabilidad de Lluvia"
                            value={metrics.rainProbability}
                            unit="%"
                            icon={Cloud}
                            description="Probabilidad de precipitaciones"
                        />
                        <MetricCard
                            title="Consumo de Energía"
                            value={metrics.energyConsumption}
                            unit="kWh"
                            icon={Zap}
                            description="Consumo energético del sistema"
                        />
                      </div>
                    </div>
                  </div>
              )}
            </TabsContent>

            {/* Historical Data Content */}
            <TabsContent value="historical" className="focus:outline-none">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-green-800 flex items-center">
                  <Info className="h-6 w-6 mr-3 text-green-600" />
                  Resumen de Datos Históricos
                </h2>
                <p className="text-lg text-muted-foreground">
                  Visualización de tendencias y patrones históricos de los sensores en todas las parcelas.
                </p>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {Array(4)
                          .fill(0)
                          .map((_, i) => (
                              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
                          ))}
                    </div>
                ) : (
                    <HistoricalCharts
                        historicalData={historicalData}
                        apiStatus={apiStatus}
                        currentSensorData={
                            apiData?.sensores || {
                              temperatura: 0,
                              humedad: 0,
                              lluvia: 0,
                              sol: 0,
                            }
                        }
                    />
                )}
              </div>
            </TabsContent>

            {/* Deleted Parcels Content */}
            <TabsContent value="deleted" className="focus:outline-none">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-green-800 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3 text-amber-500" />
                  Parcelas Eliminadas
                </h2>
                <p className="text-lg text-muted-foreground">
                  Este apartado muestra las parcelas que han sido eliminadas de la API, pero que se mantienen en la base
                  de datos para referencia histórica.
                </p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {Array(3)
                          .fill(0)
                          .map((_, i) => (
                              <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                          ))}
                    </div>
                ) : apiStatus === "error" ? (
                    <div className="p-8 rounded-xl bg-red-50 shadow-sm">
                      <div className="flex items-center text-red-800 gap-3">
                        <AlertTriangle className="h-6 w-6" />
                        <p className="text-lg">
                          No se pudieron cargar las parcelas eliminadas. Error de conexión con la API.
                        </p>
                      </div>
                    </div>
                ) : (
                    <DeletedParcelasSection deletedParcelas={deletedParcelas} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="max-w-[1600px] mx-auto px-6 md:px-10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Sistema de Monitoreo Agrícola</p>
            <p className="mt-4 md:mt-0">Desarrollado con tecnologías modernas para optimizar la producción agrícola</p>
          </div>
        </footer>
      </div>
  )
}

