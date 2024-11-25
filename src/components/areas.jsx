"use client";

import React, { useEffect, useState } from "react";
import { getAreas, deleteArea, addArea, updateArea } from "@/services/service";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import useStore from "@/store/index";

const AreasView = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newArea, setNewArea] = useState({ nombre: "", supervisor: "" });
  const [editArea, setEditArea] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const { empleados } = useStore();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        setAreas(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteArea(id);
      setAreas(areas.filter((area) => area.area_id !== id));
    } catch (error) {
      console.error("Error al eliminar el área:", error);
    }
  };

  const handleAddArea = async () => {
    try {
      const areaToAdd = {
        ...newArea,
        supervisor: newArea.supervisor || null,
      };

      await addArea(areaToAdd);
      const updatedAreas = await getAreas();
      setAreas(updatedAreas);

      setShowModal(false);
      setNewArea({ nombre: "", supervisor: "" });
      setMessage("Área agregada exitosamente");
    } catch (error) {
      console.error("Error al agregar el área:", error);
      setMessage("Error al agregar el área");
    }
  };

  const handleEditArea = async () => {
    try {
      const areaToUpdate = {
        ...editArea,
        supervisor: editArea.supervisor ? editArea.supervisor.id_empleado : null,
      };

      await updateArea(areaToUpdate.area_id, areaToUpdate);
      const updatedAreas = await getAreas();
      setAreas(updatedAreas);

      setShowModal(false);
      setEditArea(null);
      setIsEditing(false);
      setMessage("Área actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar el área:", error);
      setMessage("Error al actualizar el área");
    }
  };

  const openEditModal = (area) => {
    setEditArea(area);
    setIsEditing(true);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">

    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Áreas</h1>
        <button
          className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
          onClick={() => {
            setNewArea({ nombre: "", supervisor: "" });
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          <FaPlus className="inline-block mr-2" />
          Nueva Área
        </button>
      </div>

      {message && (
        <div className="mb-6 bg-green-100 text-green-700 px-4 py-2 rounded shadow">
          {message}
        </div>
      )}

      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Nombre</th>
            <th className="py-3 px-4 text-left">Supervisor</th>
            <th className="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <tr
              key={area.area_id}
              className="border-b last:border-none hover:bg-gray-100"
            >
              <td className="py-3 px-4">{area.nombre}</td>
              <td className="py-3 px-4">
                {area.supervisor
                  ? `${area.supervisor.nombre} ${area.supervisor.apellidos}`
                  : "Sin supervisor"}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  className="bg-blue-500 text-white font-semibold px-3 py-1 rounded-lg shadow mr-2 hover:bg-blue-600 transition"
                  onClick={() => openEditModal(area)}
                >
                  <FaEdit />
                </button>
                <button
                  className="bg-red-500 text-white font-semibold px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                  onClick={() => handleDelete(area.area_id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Editar Área" : "Agregar Nueva Área"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Nombre
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                value={isEditing ? editArea.nombre : newArea.nombre}
                onChange={(e) =>
                  isEditing
                    ? setEditArea({ ...editArea, nombre: e.target.value })
                    : setNewArea({ ...newArea, nombre: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Supervisor
              </label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                value={
                  isEditing
                    ? editArea.supervisor?.id_empleado || ""
                    : newArea.supervisor
                }
                onChange={(e) =>
                  isEditing
                    ? setEditArea({
                        ...editArea,
                        supervisor: e.target.value
                          ? { id_empleado: e.target.value }
                          : null,
                      })
                    : setNewArea({
                        ...newArea,
                        supervisor: e.target.value || null,
                      })
                }
              >
                <option value="">Seleccione un supervisor</option>
                {empleados.map((empleado) => (
                  <option
                    key={empleado.id_empleado}
                    value={empleado.id_empleado}
                  >
                    {empleado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition"
                onClick={isEditing ? handleEditArea : handleAddArea}
              >
                {isEditing ? "Actualizar" : "Agregar"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default AreasView;