"use client";

import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import useStore from "@/store";
import { getAreas, deleteArea, addArea, updateArea } from "@/services/service";
import { toast } from "react-toastify";
import { capitalizeFirstLetter, capitalizeWords } from "@/utils/funciones";

const AreasView = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newArea, setNewArea] = useState({ nombre: "", supervisor: "" });
  const [editArea, setEditArea] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { empleados } = useStore();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        setAreas(data);
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  useEffect(() => {
    console.log("empleados:", empleados);
  }, [empleados]);

  const handleDelete = async (id) => {
    try {
      await deleteArea(id);
      setAreas((prev) => prev.filter((area) => area.area_id !== id));
      toast.success("Área eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar el área:", error);
      toast.error("Error al eliminar el área");
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
      toast.success("Área agregada exitosamente");
    } catch (error) {
      console.error("Error al agregar el área:", error);
      toast.error("Error al agregar el área");
    }
  };

  const handleEditArea = async () => {
    try {
      const areaToUpdate = {
        ...editArea,
        supervisor: editArea.supervisor
          ? editArea.supervisor.id_empleado
          : null,
      };
      await updateArea(areaToUpdate.area_id, areaToUpdate);
      const updatedAreas = await getAreas();
      setAreas(updatedAreas);
      setShowModal(false);
      setEditArea(null);
      setIsEditing(false);
      toast.success("Área actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar el área:", error);
      toast.error("Error al actualizar el área");
    }
  };

  const openEditModal = (area) => {
    setEditArea(area);
    setIsEditing(true);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Gestión de Áreas
          </h2>
          <button
            className="p-2 bg-gray-800 text-white rounded-full shadow-lg flex items-center hover:shadow-xl transition"
            onClick={() => {
              setNewArea({ nombre: "", supervisor: "" });
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            <FaPlus />
          </button>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg">
          <table className="w-full rounded-lg">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-white font-bold">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-sm text-white font-bold">
                  Supervisor
                </th>
                <th className="px-4 py-3 text-center text-sm text-white font-bold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.area_id} className="hover:bg-gray-700 transition">
                  <td className="px-4 py-3 text-sm text-gray-100">
                    {area.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-100">
                    {area.supervisor
                      ? `${capitalizeFirstLetter(
                          area.supervisor.first_name
                        )} ${capitalizeWords(area.supervisor.last_name)}`
                      : "Sin supervisor"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-100 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition"
                        onClick={() => openEditModal(area)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => handleDelete(area.area_id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
                    {empleado.first_name}
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
  );
};

export default AreasView;
