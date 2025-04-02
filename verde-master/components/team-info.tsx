"use client"

import { useState } from "react"

export default function TeamInfo() {
  const [teamInfo] = useState({
    projectName: "Sistema de Gestión de Inventario Eco-Friendly",
    teamLeader: "Ana Rodríguez",
    members: [
      { name: "Carlos Gómez", role: "Desarrollador Frontend" },
      { name: "Laura Martínez", role: "Desarrolladora Backend" },
      { name: "Miguel Sánchez", role: "Diseñador UX/UI" },
      { name: "Sofia Torres", role: "Analista de Datos" },
    ],
    activities: [
      { name: "Diseño de la interfaz de usuario", responsible: "Miguel Sánchez", deadline: "2023-07-15" },
      { name: "Implementación de la base de datos", responsible: "Laura Martínez", deadline: "2023-07-20" },
      { name: "Desarrollo del módulo de reportes", responsible: "Carlos Gómez, Sofia Torres", deadline: "2023-08-05" },
      { name: "Pruebas de integración", responsible: "Todo el equipo", deadline: "2023-08-15" },
    ],
    description:
      "Aplicación web diseñada para gestionar inventarios de manera sostenible, rastreando el ciclo de vida de los productos y minimizando el desperdicio.",
  })

  return (
    <div className=" p-4 flex flex-col">
      {/* Título y Líder */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-center text-green-800">{teamInfo.projectName}</h2>
        <p className="text-green-700 text-sm mt-1">
          <span className="font-semibold">Líder:</span> {teamInfo.teamLeader}
        </p>
        {/* Descripción */}
      <div className="text-center text-sm text-green-700">
        <h3 className="font-bold text-green-800 mb-1">Descripción</h3>
        <p className="leading-tight">{teamInfo.description}</p>
      </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow flex gap-4 overflow-hidden">
        {/* Miembros del Equipo */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-teal-700 ml-20 mb-2">Miembros</h3>
          <div className="ml-20 space-y-2 overflow-auto flex-grow">
            {teamInfo.members.map((member, index) => (
              <div key={index} className="bg-green-50 p-2 rounded-md text-sm">
                <p className="font-semibold text-gray-700">{member.name}</p>
                <p className="text-green-600 text-xs">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actividades del Proyecto */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-teal-700 mr-20 mb-2">Actividades</h3>
          <div className="space-y-2 overflow-auto flex-grow">
            {teamInfo.activities.map((activity, index) => (
              <div key={index} className="bg-green-50 p-2 rounded-md text-sm">
                <p className="font-semibold text-emerald-700">{activity.name}</p>
                <p className="text-green-600 text-xs">
                  <span className="font-semibold">Responsable:</span> {activity.responsible}
                </p>
                <p className="text-green-600 text-xs">
                  <span className="font-semibold">Fecha límite:</span> {activity.deadline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

