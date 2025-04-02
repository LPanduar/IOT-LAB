import { auth } from "@/auth";
import LogoutButton from "@/components/logout-button";
import { PlusCircle, Users, Briefcase, Activity } from "lucide-react"
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }
  return (
    <div className="container">
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard de Administración</h1>
      </header>

      <main>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Equipos Activos</h3>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">+2 este mes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Proyectos en Curso</h3>
              <Briefcase className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-gray-500">+5 esta semana</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Tasa de Actividad</h3>
              <Activity className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-gray-500">+12% respecto al mes pasado</p>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Equipos Activos</h2>
            <p className="text-sm text-gray-500">Una lista de los equipos actualmente trabajando en proyectos.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Equipo</th>
                  <th className="p-4">Líder</th>
                  <th className="p-4">Miembros</th>
                  <th className="p-4">Proyecto Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-4 font-medium text-gray-900">Equipo Alfa</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-800 font-semibold">JD</span>
                      </div>
                      Juan Díaz
                    </div>
                  </td>
                  <td className="p-4">6</td>
                  <td className="p-4">Proyecto Phoenix</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Equipo Beta</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="text-green-800 font-semibold">ML</span>
                      </div>
                      María López
                    </div>
                  </td>
                  <td className="p-4">4</td>
                  <td className="p-4">Proyecto Omega</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Proyectos en Curso</h2>
            <p className="text-sm text-gray-500">Un vistazo a los proyectos actualmente en desarrollo.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Proyecto</th>
                  <th className="p-4">Equipo</th>
                  <th className="p-4">Progreso</th>
                  <th className="p-4">Fecha Límite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-4 font-medium text-gray-900">Proyecto Phoenix</td>
                  <td className="p-4">Equipo Alfa</td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <span className="text-sm text-gray-600">75%</span>
                  </td>
                  <td className="p-4">15 de Julio, 2025</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Proyecto Omega</td>
                  <td className="p-4">Equipo Beta</td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                    <span className="text-sm text-gray-600">40%</span>
                  </td>
                  <td className="p-4">30 de Agosto, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Acciones Rápidas</h2>
          </div>
          <div className="p-6 flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center transition duration-300">
              <PlusCircle className="mr-2 h-5 w-5" /> Nuevo Equipo
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center transition duration-300">
              <PlusCircle className="mr-2 h-5 w-5" /> Nuevo Proyecto
            </button>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
};
export default AdminPage;





