"use client";

import React, { useEffect, useState } from "react";
import { getRoles, deleteRole, addRole } from "@/services/service"; // Asegúrate de tener estas funciones en tu servicio
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const RolesView = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ nombre: "", descripcion: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (error) {
        setError(error.message || "Error al cargar los roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este rol?")) return;
    try {
      await deleteRole(id);
      setRoles(roles.filter((role) => role.id_rol !== id));
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.nombre || !newRole.descripcion) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    setSubmitting(true);
    try {
      const addedRole = await addRole(newRole);
      setRoles([...roles, addedRole]);
      setShowModal(false);
      setNewRole({ nombre: "", descripcion: "" });
    } catch (error) {
      console.error("Error al agregar el rol:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error)
    return <p className="text-center text-red-600 mt-4">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Gestión de Roles</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="mr-2" />
          Agregar Rol
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Nombre
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr
                key={role.id_rol}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-3 px-4 text-gray-700">{role.nombre}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center justify-center"
                      onClick={() => handleDelete(role.id_rol)}
                    >
                      <FaTrash className="mr-1" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">
                Agregar Nuevo Rol
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">
                Nombre
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={newRole.nombre}
                onChange={(e) =>
                  setNewRole({ ...newRole, nombre: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">
                Descripción
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={newRole.descripcion}
                onChange={(e) =>
                  setNewRole({ ...newRole, descripcion: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                onClick={handleAddRole}
                disabled={submitting}
              >
                {submitting ? "Guardando..." : "Agregar"}
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg "
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

export default RolesView;
