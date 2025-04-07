import { ApiResponse, HistoricalData, DeletedParcela } from "@/types/api-types"

// API configuration
const LARAVEL_API_URL = "http://localhost:8000/api"
const EXTERNAL_API_URL = "http://moriahmkt.com/iotapp/updated/"

// API Service - Single Responsibility Principle (SOLID)
const ApiService = {
  // Function to make HTTP requests to Laravel
  async fetchFromAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...options,
    }

    try {
      console.log(`Making request to ${LARAVEL_API_URL}/${endpoint}`)
      const response = await fetch(`${LARAVEL_API_URL}/${endpoint}`, defaultOptions)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error in API request (${endpoint}):`, error)
      throw error
    }
  },

  // Function to get data from the external API
  async fetchIoTData(): Promise<ApiResponse> {
    try {
      const response = await fetch(EXTERNAL_API_URL)

      if (!response.ok) {
        throw new Error(`Error in response: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      return data
    } catch (error) {
      console.error("Error getting data from API:", error)

      // Return fallback data in case of error
      return {
        sensores: {
          humedad: 80,
          temperatura: 30.1,
          lluvia: 0.93,
          sol: 1.0,
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
  },

  // Function to save data to the Laravel database
  async saveDataToDatabase(data: ApiResponse): Promise<void> {
    try {
      await this.fetchFromAPI("save-data", {
        method: "POST",
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error("Error saving data to Laravel:", error)
      throw error
    }
  },

  // Function to get historical data
  async fetchHistoricalData(): Promise<HistoricalData[]> {
    try {
      const data = await this.fetchFromAPI("historical-data")
      return data
    } catch (error) {
      console.error("Error getting historical data:", error)
      return []
    }
  },

  // Function to get deleted parcels
  async fetchDeletedParcelas(): Promise<DeletedParcela[]> {
    try {
      const data = await this.fetchFromAPI("deleted-parcelas")
      return data
    } catch (error) {
      console.error("Error getting deleted parcels:", error)
      return []
    }
  },

  // Check connection with Laravel API
  async checkApiConnection(): Promise<boolean> {
    try {
      await this.fetchFromAPI("ping")
      return true
    } catch (error) {
      console.error("Error connecting to Laravel API:", error)
      return false
    }
  },
}

export default ApiService
