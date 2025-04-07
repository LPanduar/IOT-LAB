import type React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Skeleton } from "@/components/ui/skeleton"
import { Thermometer, Droplets, MapPin } from "lucide-react"
import type { Parcela } from "@/types/api-types"
import { getParcelaIcon, formatDate, getTempBackground, getHumBackground } from "@/utils/map-utils"
import "leaflet/dist/leaflet.css"

interface MapSectionProps {
  parcelas: Parcela[]
  loading: boolean
}

const MapSection: React.FC<MapSectionProps> = ({ parcelas, loading }) => {
  if (loading) {
    return <Skeleton className="h-[500px] w-full rounded-xl" />
  }

  return (
    <div className="h-[500px] rounded-xl overflow-hidden shadow-md">
      <MapContainer center={[21.1619, -86.8515]} zoom={12} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {parcelas.map((parcela) => (
          <Marker
            key={parcela.id}
            position={[parcela.lat || 0, parcela.lng || 0]}
            icon={getParcelaIcon(parcela.tipo_cultivo)}
          >
            <Popup className="w-72">
              <div className="p-2">
                <div className="bg-green-50 p-2 -m-2 mb-2 rounded-t-lg border-b border-green-100">
                  <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    {parcela.nombre}
                  </h3>
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <p>{parcela.ubicacion}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Responsable</p>
                      <p className="font-medium text-gray-800">{parcela.responsable}</p>
                    </div>

                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Cultivo</p>
                      <p className="font-medium text-gray-800">{parcela.tipo_cultivo}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Último riego</p>
                    <p className="font-medium text-gray-800">{formatDate(parcela.ultimo_riego)}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Datos del sensor:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`flex items-center gap-2 ${getTempBackground(
                          parcela.sensor.temperatura,
                        )} p-2 rounded-lg border border-gray-100`}
                      >
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500">Temperatura</p>
                          <p className="font-medium text-gray-800">{parcela.sensor.temperatura}°C</p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-2 ${getHumBackground(
                          parcela.sensor.humedad,
                        )} p-2 rounded-lg border border-gray-100`}
                      >
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Humedad</p>
                          <p className="font-medium text-gray-800">{parcela.sensor.humedad}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapSection

