import type React from "react"
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
import { AlertTriangle, Info } from "lucide-react"
import type { HistoricalData } from "@/types/api-types"

interface HistoricalChartsProps {
  historicalData: HistoricalData[]
  apiStatus: "loading" | "success" | "error"
  currentSensorData: {
    temperatura: number
    humedad: number
    lluvia: number
    sol: number
  }
}

const HistoricalCharts: React.FC<HistoricalChartsProps> = ({ historicalData, apiStatus, currentSensorData }) => {
  // Prepare data for historical charts
  const prepareHistoricalChartData = () => {
    return historicalData.map((data) => {
      const date = new Date(data.created_at)
      return {
        fecha: `${date.getDate()}/${date.getMonth() + 1}`,
        hora: date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        temperatura: data.temperatura,
        humedad: data.humedad,
        lluvia: data.lluvia,
        sol: data.sol,
        // Add property for tooltips
        fechaCompleta: date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
    })
  }

  const chartData = prepareHistoricalChartData()

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  // Data for pie chart
  const pieData = [
    { name: "Temperatura", value: currentSensorData.temperatura || 0 },
    { name: "Humedad", value: currentSensorData.humedad || 0 },
    { name: "Lluvia", value: currentSensorData.lluvia || 0 },
    { name: "Sol", value: currentSensorData.sol || 0 },
  ]

  if (apiStatus === "error") {
    return (
      <div className="p-8 rounded-xl bg-red-50 shadow-sm">
        <div className="flex items-center text-red-800 gap-3">
          <AlertTriangle className="h-6 w-6" />
          <p className="text-lg">No se pudieron cargar los datos históricos. Error de conexión con la API.</p>
        </div>
      </div>
    )
  }

  if (historicalData.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-blue-50 shadow-sm text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
          <Info className="h-10 w-10 text-blue-500" />
          <p className="text-lg">No hay datos históricos disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Line chart */}
      <div className="p-6 rounded-xl bg-white shadow-md">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Evolución de Temperatura y Humedad</h3>
          <p className="text-sm text-muted-foreground">Tendencia de los últimos 7 días - Valores diarios</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 12 }}
                height={40}
                tickFormatter={(value) => value}
                textAnchor="middle"
              />
              <YAxis
                yAxisId="left"
                label={{ value: "Temperatura (°C)", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Humedad (%)", angle: -90, position: "insideRight" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "temperatura") return [`${value}°C`, "Temperatura"]
                  if (name === "humedad") return [`${value}%`, "Humedad"]
                  return [value, name]
                }}
                labelFormatter={(label) => label}
                contentStyle={{ fontSize: "14px", padding: "10px", width: "auto", minWidth: "200px" }}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
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
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• Los puntos muestran mediciones exactas tomadas a intervalos regulares</p>
          <p>• Las líneas indican la tendencia entre mediciones consecutivas</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="p-6 rounded-xl bg-white shadow-md">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Niveles de Lluvia y Radiación Solar</h3>
          <p className="text-sm text-muted-foreground">Comparativa diaria - Últimos 7 registros</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 12 }}
                height={40}
                tickFormatter={(value) => value}
                textAnchor="middle"
              />
              <YAxis
                label={{ value: "Valor registrado", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "lluvia") return [`${value}%`, "Probabilidad de lluvia"]
                  if (name === "sol") return [`${value} W/m²`, "Radiación solar"]
                  return [value, name]
                }}
                labelFormatter={(label) => label}
                contentStyle={{ fontSize: "14px", padding: "10px", width: "auto", minWidth: "200px" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "14px" }}
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
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• Barras azules: Probabilidad de lluvia en porcentaje</p>
          <p>• Barras amarillas: Radiación solar en vatios por metro cuadrado</p>
        </div>
      </div>

      {/* Area chart */}
      <div className="p-6 rounded-xl bg-white shadow-md">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Tendencias Acumulativas de Indicadores Ambientales
          </h3>
          <p className="text-sm text-muted-foreground">Distribución diaria - Muestra patrones de cambio</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 12 }}
                height={40}
                tickFormatter={(value) => value}
                textAnchor="middle"
              />
              <YAxis
                label={{ value: "Valores acumulados", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "temperatura") return [`${value}°C`, "Temperatura"]
                  if (name === "humedad") return [`${value}%`, "Humedad"]
                  return [value, name]
                }}
                itemSorter={(item) => -item.value}
                contentStyle={{ fontSize: "14px", padding: "10px", width: "auto", minWidth: "200px" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "14px" }}
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
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• Áreas verdes: Temperatura acumulada en grados Celsius</p>
          <p>• Áreas azules: Humedad acumulada en porcentaje</p>
          <p>• El gráfico muestra tendencias de comportamiento a lo largo del tiempo</p>
        </div>
      </div>

      {/* Pie chart */}
      <div className="p-6 rounded-xl bg-white shadow-md">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Distribución Proporcional de Factores Climáticos
          </h3>
          <p className="text-sm text-muted-foreground">Valores actuales - Relación entre variables</p>
        </div>
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
                contentStyle={{ fontSize: "14px" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "14px" }}
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
        <div className="mt-4 text-sm text-muted-foreground">
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
      </div>
    </div>
  )
}

export default HistoricalCharts

