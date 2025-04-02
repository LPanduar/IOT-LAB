"use client";

import { useState } from "react";

interface Project {
  id: number;
  name: string;
  description: string;
  teams: number[]; // IDs de los equipos asignados
}

export default function ProjectForm() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    teams: [] as number[],
  });

  const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      setProjects([
        ...projects,
        { id: projects.length + 1, ...newProject },
      ]);
      setNewProject({ name: "", description: "", teams: [] });
    }
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-700 mb-4">Lista de Proyectos</h2>
      <table className="w-full text-left mb-4">
        <thead>
          <tr className="border-b">
            <th className="p-2">Nombre</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Equipos Asignados</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b">
              <td className="p-2">{project.name}</td>
              <td className="p-2">{project.description}</td>
              <td className="p-2">{project.teams.join(", ")}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold text-green-700 mb-4">Agregar Proyecto</h2>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={newProject.name}
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Descripción del proyecto"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          className="w-full p-2 border rounded"
          rows={3}
        />
        <button
          onClick={handleAddProject}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
        >
          Agregar Proyecto
        </button>
      </div>
    </div>
  );
}