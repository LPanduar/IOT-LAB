import type React from "react"
import { Badge } from "@/components/ui/badge"

interface ApiStatusIndicatorProps {
  apiStatus: "loading" | "success" | "error"
  externalApiStatus: "loading" | "success" | "error"
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ apiStatus, externalApiStatus }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <Badge
      variant="outline"
      className={`flex items-center gap-2 px-4 py-2 ${
        apiStatus === "success"
          ? "bg-green-100 text-green-800 border-green-200"
          : apiStatus === "error"
            ? "bg-red-100 text-red-800 border-red-200"
            : "bg-yellow-100 text-yellow-800 border-yellow-200"
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
    </Badge>

    <Badge
      variant="outline"
      className={`flex items-center gap-2 px-4 py-2 ${
        externalApiStatus === "success"
          ? "bg-green-100 text-green-800 border-green-200"
          : externalApiStatus === "error"
            ? "bg-red-100 text-red-800 border-red-200"
            : "bg-yellow-100 text-yellow-800 border-yellow-200"
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
    </Badge>
  </div>
)

export default ApiStatusIndicator

