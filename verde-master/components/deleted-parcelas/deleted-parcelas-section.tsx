import type React from "react"
import { AlertTriangle, Info, Thermometer, Droplets } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { DeletedParcela } from "@/types/api-types"

interface DeletedParcelasSectionProps {
  deletedParcelas: DeletedParcela[]
}

const DeletedParcelasSection: React.FC<DeletedParcelasSectionProps> = ({ deletedParcelas }) => {
  if (deletedParcelas.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-white shadow-sm text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
          <Info className="h-10 w-10 text-blue-500" />
          <p className="text-lg">No hay parcelas eliminadas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {deletedParcelas.map((parcela) => (
        <div
          key={parcela.id}
          className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-red-100"
        >
          <div className="space-y-5">
            {/* Header with deleted badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-red-800">{parcela.nombre}</h3>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                Eliminada
              </Badge>
            </div>

            {/* Deletion date highlighted */}
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Eliminada el: {new Date(parcela.deleted_at).toLocaleString()}
              </p>
            </div>

            {/* Main information */}
            <div className="space-y-3 text-sm pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Ubicación</p>
                  <p className="font-medium text-gray-800">{parcela.ubicacion}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Responsable</p>
                  <p className="font-medium text-gray-800">{parcela.responsable}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tipo de cultivo</p>
                  <p className="font-medium text-gray-800">{parcela.tipo_cultivo}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Último riego</p>
                  <p className="font-medium text-gray-800">{new Date(parcela.ultimo_riego).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Sensor data */}
              <div className="mt-4 pt-3 border-t">
                <h4 className="font-semibold text-base mb-3 text-gray-700">Últimos datos registrados</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                    <Thermometer className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Temperatura</p>
                      <p className="font-medium text-gray-800">{parcela.sensor.temperatura}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Humedad</p>
                      <p className="font-medium text-gray-800">{parcela.sensor.humedad}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeletedParcelasSection

