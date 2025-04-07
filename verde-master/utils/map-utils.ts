import L from "leaflet"

// Function to get parcel icon based on crop type
export const getParcelaIcon = (tipoCultivo: string) => {
  // Define inline SVG icons for each crop type
  const getSvgIcon = () => {
    switch (tipoCultivo.toLowerCase()) {
      case "tomate":
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="36" r="24" fill="#e74c3c"/><path d="M32 12c-4 0-8 2-8 6 0 0 4-2 8-2s8 2 8 2c0-4-4-6-8-6z" fill="#27ae60"/><path d="M32 16c-2 0-4 1-4 3 0 0 2-1 4-1s4 1 4 1c0-2-2-3-4-3z" fill="#2ecc71"/><path d="M26 20c0 0-2-4-6-4s-6 4-6 4c2 0 4-2 6-2s6 2 6 2z" fill="#27ae60"/><path d="M38 20c0 0 2-4 6-4s6 4 6 4c-2 0-4-2-6-2s-6 2-6 2z" fill="#27ae60"/></svg>')}`
      case "maíz":
      case "maiz":
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="14" ry="28" fill="#f1c40f"/><path d="M32 4v56" stroke="#e67e22" strokeWidth="1.5" fill="none"/><path d="M26 8v48" stroke="#e67e22" strokeWidth="1.5" fill="none"/><path d="M38 8v48" stroke="#e67e22" strokeWidth="1.5" fill="none"/><path d="M28 4c0 0-4 4-4 8s4 8 4 8" fill="none" stroke="#27ae60" strokeWidth="2"/><path d="M36 4c0 0 4 4 4 8s-4 8-4 8" fill="none" stroke="#27ae60" strokeWidth="2"/></svg>')}`
      case "frijol":
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="18" ry="14" fill="#8e44ad"/><ellipse cx="32" cy="40" rx="14" ry="10" fill="#9b59b6"/><path d="M32 26c-6 0-10 4-10 10s4 10 10 10 10-4 10-10-4-10-10-10z" fill="#8e44ad"/><path d="M32 10c0 0-6 4-6 10s6 8 6 8 6-2 6-8-6-10-6-10z" fill="#27ae60"/><path d="M28 16c0 0-4-2-8 2s0 8 0 8 4-2 6-6 2-4 2-4z" fill="#2ecc71"/><path d="M36 16c0 0 4-2 8 2s0 8 0 8-4-2-6-6-2-4-2-4z" fill="#2ecc71"/></svg>')}`
      case "chile":
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 8c0 0-4 2-4 6s4 8 4 8 4-4 4-8-4-6-4-6z" fill="#27ae60"/><path d="M26 22c0 0-2-4-6-2s-2 6-2 6 2-2 4-2 4-2 4-2z" fill="#2ecc71"/><path d="M38 22c0 0 2-4 6-2s2 6 2 6-2-2-4-2-4-2-4-2z" fill="#2ecc71"/><path d="M32 22c-6 0-10 4-10 14 0 10 10 20 10 20s10-10 10-20c0-10-4-14-10-14z" fill="#e74c3c"/></svg>')}`
      case "aguacate":
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="16" ry="20" fill="#27ae60"/><ellipse cx="32" cy="36" rx="12" ry="16" fill="#2ecc71"/><circle cx="32" cy="36" r="8" fill="#f39c12"/><path d="M32 16c0 0-2-4-6-4s-4 4-4 4 2-2 4-2 6 2 6 2z" fill="#7f8c8d"/><path d="M30 16c0 0 0-4 0-6s2-2 4-2 2 2 2 2-2 2-2 4 0 6 0 6z" fill="#7f8c8d"/></svg>')}`
      case "limón":
      case "limon":
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="16" ry="20" fill="#27ae60"/><ellipse cx="32" cy="36" rx="12" ry="16" fill="#2ecc71"/><circle cx="32" cy="36" r="8" fill="#f1c40f"/><path d="M32 16c0 0-2-4-6-4s-4 4-4 4 2-2 4-2 6 2 6 2z" fill="#7f8c8d"/><path d="M30 16c0 0 0-4 0-6s2-2 4-2 2 2 2 2-2 2-2 4 0 6 0 6z" fill="#7f8c8d"/></svg>')}`
      case "naranja":
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#e67e22"/><circle cx="32" cy="32" r="18" fill="#f39c12"/><path d="M32 10c0 0-4-2-4 4s4 4 4 4 4 0 4-4-4-4-4-4z" fill="#27ae60"/><path d="M36 14c0 0 2-4 6-2s2 4 2 4-2-2-4-2-4 0-4 0z" fill="#2ecc71"/><path d="M28 14c0 0-2-4-6-2s-2 4-2 4 2-2 4-2 4 0 4 0z" fill="#2ecc71"/></svg>')}`
      default:
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="40" r="16" fill="#3498db"/><path d="M32 12v28" stroke="#27ae60" strokeWidth="2"/><path d="M32 16c0 0-8 4-8 12" stroke="#27ae60" strokeWidth="2" fill="none"/><path d="M32 20c0 0 8 4 8 12" stroke="#27ae60" strokeWidth="2" fill="none"/><path d="M32 24c0 0-6 2-6 8" stroke="#27ae60" strokeWidth="2" fill="none"/><path d="M32 28c0 0 6 2 6 8" stroke="#27ae60" strokeWidth="2" fill="none"/><path d="M26 32c0 0-2-6-8-6" stroke="#27ae60" strokeWidth="2" fill="none"/><path d="M38 32c0 0 2-6 8-6" stroke="#27ae60" strokeWidth="2" fill="none"/></svg>')}`
    }
  }

  // Create a custom icon for Leaflet
  return L.icon({
    iconUrl: getSvgIcon(),
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  })
}

// Fixed coordinates for parcels
export const parcelasCoords = [
  { id: 1, lat: 21.1619, lng: -86.8515 }, // Cancún Center
  { id: 2, lat: 21.145, lng: -86.82 }, // Hotel Zone
  { id: 3, lat: 21.178, lng: -86.84 }, // North Zone
]

// Format date for display in popup
export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString("es-ES")
}

// Get background color based on temperature
export const getTempBackground = (temp: number) => {
  if (temp > 30) return "bg-red-100"
  if (temp > 25) return "bg-orange-100"
  return "bg-green-100"
}

// Get background color based on humidity
export const getHumBackground = (hum: number) => {
  if (hum > 80) return "bg-blue-100"
  if (hum > 60) return "bg-cyan-100"
  return "bg-yellow-100"
}

