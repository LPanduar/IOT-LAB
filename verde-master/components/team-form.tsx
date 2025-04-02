"use client";

import { useState } from "react";

interface Team {
  id: number;
  name: string;
  members: string[]; // Nombres de los miembros del equipo
}

export default function TeamForm() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState({
    name: "",
    members: [] as string[],
  });

  const handleAddTeam = () => {
    if (newTeam.name) {
      setTeams([
        ...teams,
        { id: teams.length + 1, ...newTeam },
      ]);
      setNewTeam({ name: "", members: [] });
    }
  };

  const handleDeleteTeam = (id: number) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-700 mb-4">Lista de Equipos</h2>
      <table className="w-full text-left mb-4">
        <thead>
          <tr className="border-b">
            <th className="p-2">Nombre</th>
            <th className="p-2">Miembros</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id} className="border-b">
              <td className="p-2">{team.name}</td>
              <td className="p-2">{team.members.join(", ")}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold text-green-700 mb-4">Agregar Equipo</h2>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={newTeam.name}
          onChange={(e) =>
            setNewTeam({ ...newTeam, name: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAddTeam}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
        >
          Agregar Equipo
        </button>
      </div>
    </div>
  );
}