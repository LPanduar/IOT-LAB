import type React from "react"
import { auth } from "@/auth"
import LogoutButton from "@/components/logout-button"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Users, Folder, Package } from "lucide-react" // Importamos los iconos

export default async function DashboardLayout({
                                                children,
                                              }: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    return <div>No autenticado</div>
  }

  // Verificar si el usuario es administrador
  const isAdmin = session.user?.role === "admin"

  return (
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside
            className="w-64 bg-green-600 text-white p-6"
            style={{
              backgroundImage: "linear-gradient(to bottom right, #136B69 , #9DCC9B, #6EB47D, #499C70, #2A836B, #D5E4CF)",
            }}
        >
          <h1 className="text-center text-3xl font-bold mt-6 mb-8">OKABOOKS</h1>

          {/* Perfil del Usuario con Imagen Estática */}
          <div className="flex flex-col items-center mb-6">
            <Image src="/avatar_woman.png" alt="Foto de perfil" width={80} height={80} className="rounded-full" />
            <h2 className="text-center mt-4 text-lg font-semibold">{session.user?.name || "Usuario"}</h2>
            <p className="text-sm text-gray-200">{session.user?.email}</p>
            {isAdmin && <p className="text-sm text-yellow-300">Administrador</p>}
          </div>

          {/* Navegación */}
          <nav>
            <ul className="space-y-3">
              <li>
                <Link href="/admin" className="flex items-center py-2 px-4 rounded hover:bg-emerald-700">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/equipos" className="flex items-center py-2 px-4 rounded hover:bg-emerald-700">
                  <Users className="w-5 h-5 mr-2" />
                  Mis Equipos
                </Link>
              </li>
              <li>
                <Link href="/admin/proyectos" className="flex items-center py-2 px-4 rounded hover:bg-emerald-700">
                  <Folder className="w-5 h-5 mr-2" />
                  Mis Proyectos
                </Link>
              </li>
              {/* Nueva sección para Recursos (solo para administradores) */}
              {isAdmin && (
                  <li>
                    <Link href="/admin/recursos" className="flex items-center py-2 px-4 rounded hover:bg-emerald-700">
                      <Package className="w-5 h-5 mr-2" /> {/* Icono de recursos */}
                      Recursos
                    </Link>
                  </li>
              )}
            </ul>
          </nav>

          {/* Botón de Cerrar Sesión */}
          <div className="ml-4 mt-8">
            <LogoutButton />
          </div>
        </aside>

        {/* Contenido Principal con ambiente verde */}
        <main
            className="flex-1 p-8 text-green-900"
            style={{
              background: "linear-gradient(to bottom, #f0f9f0, #e6f5e6, #ffffff)",
              backgroundAttachment: "fixed",
              boxShadow: "inset 0 0 20px rgba(104, 211, 145, 0.1)",
            }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">{children}</div>
        </main>
      </div>
  )
}

