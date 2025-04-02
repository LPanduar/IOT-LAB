"use client"

import { useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function ProjectInfo() {
  const [projectInfo] = useState({
    name: "Sistema de Gestión de Inventario Eco-Friendly",
    leader: "Ana Rodríguez",
    description:
      "Aplicación web para gestión sostenible de inventarios, rastreando ciclo de vida de productos y minimizando desperdicio.",
    activities: {
      completed: 15,
      pending: 10,
    },
    progress: 60,
  })

  const [comment, setComment] = useState("")

  const activitiesData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [
      {
        data: [projectInfo.activities.completed, projectInfo.activities.pending],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 159, 64, 0.6)"],
      },
    ],
  }

  const progressData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Progreso",
        data: [10, 25, 35, 50, 60, projectInfo.progress],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 8,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="h-min-screen flex flex-col bg-white p-2 rounded-lg shadow-md text-xs">
      <h2 className="text-lg font-semibold text-green-700 mb-1">{projectInfo.name}</h2>
      <p className="mb-1">
        <strong>Líder:</strong> {projectInfo.leader}
      </p>
      <p className="mb-2">{projectInfo.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="h-60">
          <h3 className="font-semibold text-green-600 mb-1">Actividades</h3>
          <Bar data={activitiesData} options={chartOptions} />
        </div>
        <div className="h-60">
          <h3 className="font-semibold text-green-600 mb-1">Progreso</h3>
          <Line data={progressData} options={chartOptions} />
        </div>
      </div>

      <h3 className="font-semibold text-green-600 mb-1">Comentarios:</h3>
      <textarea
        className="w-full p-1 border rounded mb-1 text-xs"
        rows={9}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escribe un comentario..."
      />
      <button 
  className="bg-teal-700 hover:bg-emerald-700/50 text-white font-bold py-1 px-1 rounded text-xs w-24"
  onClick={() => {
    console.log("Comentario enviado:", comment);
    setComment("");
  }}
>
  Enviar
</button>

    </div>
  )
}



