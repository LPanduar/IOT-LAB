"use client";

import { useState } from "react";

export default function ResourceForm() {
  const [resources, setResources] = useState([
    { id: 1, name: "Madera", quantity: 100, unit: "kg" },
    { id: 2, name: "Botes de basura", quantity: 50, unit: "unidades" },
    { id: 3, name: "Litros de agua", quantity: 1000, unit: "litros" },
    { id: 4, name: "Hojas de papel", quantity: 500, unit: "hojas" },
  ]);

  const [newResource, setNewResource] = useState({
    name: "",
    quantity: 0,
    unit: "",
  });

  const handleAddResource = () => {
    if (newResource.name && newResource.quantity > 0 && newResource.unit) {
      setResources([
        ...resources,
        { id: resources.length + 1, ...newResource },
      ]);
      setNewResource({ name: "", quantity: 0, unit: "" });
    }
  };

  const handleDeleteResource = (id: number) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-700 mb-4">Lista de Recursos</h2>
      <table className="w-full text-left mb-4">
        <thead>
          <tr className="border-b">
            <th className="p-2">Nombre</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Unidad</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id} className="border-b">
              <td className="p-2">{resource.name}</td>
              <td className="p-2">{resource.quantity}</td>
              <td className="p-2">{resource.unit}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteResource(resource.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold text-green-700 mb-4">Agregar Recurso</h2>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nombre del recurso"
          value={newResource.name}
          onChange={(e) =>
            setNewResource({ ...newResource, name: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={newResource.quantity}
          onChange={(e) =>
            setNewResource({ ...newResource, quantity: parseInt(e.target.value) })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Unidad (kg, litros, etc.)"
          value={newResource.unit}
          onChange={(e) =>
            setNewResource({ ...newResource, unit: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAddResource}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
        >
          Agregar Recurso
        </button>
      </div>
    </div>
  );
}