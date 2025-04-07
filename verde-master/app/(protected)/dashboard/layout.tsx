import type React from "react"
import { auth } from "@/auth"
import LogoutButton from "@/components/logout-button"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard } from "lucide-react" // Importamos los iconos

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        return <div>No autenticado</div>
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar con ambiente verde */}
            <aside
                className="w-64 text-white p-6"
                style={{
                    backgroundImage: "linear-gradient(to bottom right, #0B5345, #117A65, #138D75, #16A085, #1ABC9C, #0E6655)",
                }}
            >
                <h1 className="text-center text-3xl font-bold mt-6 mb-8">IOT</h1>

                {/* Perfil del Usuario con Imagen Estática */}
                <div className="flex flex-col items-center mb-6">
                    {/* Imagen Estática */}
                    <Image
                        src="/avatar_woman.png" // Ruta a tu imagen estática
                        alt="Foto de perfil"
                        width={80}
                        height={80}
                        className="rounded-full border-2 border-green-200"
                    />
                    <h2 className="text-center mt-4 text-lg font-semibold">{session.user?.name || "Usuario"}</h2>
                    <p className="text-sm text-green-100">{session.user?.email}</p>
                </div>

                {/* Navegación */}
                <nav>
                    <ul className="space-y-3">
                        <li>
                            <Link
                                href="/dashboard"
                                className="flex items-center py-2 px-4 rounded hover:bg-green-800 transition-colors duration-200"
                            >
                                <LayoutDashboard className="w-5 h-5 mr-2" />
                                Datos Parcelas
                            </Link>
                        </li>
                    </ul>
                </nav>
                {/* Botón de Cerrar Sesión */}
                <div className="ml-4 mt-8">
                    <LogoutButton />
                </div>
            </aside>

            {/* Contenido Principal con ambiente verde */}
            <main className="flex-1 p-8">
                <div className="">{children}</div>
            </main>
        </div>
    )
}

