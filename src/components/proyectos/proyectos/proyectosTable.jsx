"use client";

import {
  getProyectos,
  addProyecto,
  updateProyecto,
  deleteProyecto,
} from "@/services/service";
import useStore from "@/store";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const ProyectosTable = () => {
  const { proyectos, setProyectos } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newProyecto, setNewProyecto] = useState({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "En progreso",
    presupuesto: "",
    responsable_id: "",
  });
  const [editProyecto, setEditProyecto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectosData = await getProyectos();
        console.log("Fetched proyectos", proyectosData);
        if (Array.isArray(proyectosData)) setProyectos(proyectosData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas eliminar este proyecto?"
    );
    if (confirmacion) {
      try {
        await deleteProyecto(id);
        const updatedProyectos = await getProyectos();
        if (Array.isArray(updatedProyectos)) setProyectos(updatedProyectos);
        setMessage("Proyecto eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        setMessage("Error al eliminar el proyecto");
      }
    }
  };

  const handleAddProyecto = async () => {
    try {
      await addProyecto(newProyecto);
      const updatedProyectos = await getProyectos();
      if (Array.isArray(updatedProyectos)) setProyectos(updatedProyectos);
      setShowModal(false);
      setNewProyecto({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "En progreso",
        presupuesto: "",
        responsable_id: "",
      });
      setMessage("Proyecto agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar el proyecto:", error);
      setMessage("Error al agregar el proyecto");
    }
  };

  const handleEditProyecto = async () => {
    try {
      await updateProyecto(editProyecto.proyecto_id, editProyecto);
      const updatedProyectos = await getProyectos();
      if (Array.isArray(updatedProyectos)) setProyectos(updatedProyectos);
      setShowModal(false);
      setEditProyecto(null);
      setIsEditing(false);
      setMessage("Proyecto actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      setMessage("Error al actualizar el proyecto");
    }
  };

  const openEditModal = (proyecto) => {
    setEditProyecto(proyecto);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Gestión de Proyectos
      </h2>

      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center hover:bg-green-700 transition"
        onClick={() => {
          setNewProyecto({
            nombre: "",
            descripcion: "",
            fecha_inicio: "",
            fecha_fin: "",
            estado: "En progreso",
            presupuesto: "",
            responsable_id: "",
          });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        <FaPlus className="mr-3" />
        Agregar Proyecto
      </button>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
          {message}
        </div>
      )}

      <table className="table-auto w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Nombre
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Descripción
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Fecha de Inicio
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Fecha de Fin
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Estado
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Presupuesto
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Responsable ID
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(proyectos) &&
            proyectos.map((proyecto) => (
              <tr
                key={proyecto.proyecto_id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {proyecto.nombre}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {proyecto.descripcion}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {proyecto.fecha_inicio}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {proyecto.fecha_fin}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {proyecto.estado}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {proyecto.presupuesto}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {proyecto.responsable_id}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  <div className="flex gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => openEditModal(proyecto)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => handleDelete(proyecto.proyecto_id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-3/4 md:w-1/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {isEditing ? "Editar Proyecto" : "Agregar Nuevo Proyecto"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {[
              {
                label: "Nombre",
                value: isEditing ? editProyecto.nombre : newProyecto.nombre,
                key: "nombre",
              },
              {
                label: "Descripción",
                value: isEditing
                  ? editProyecto.descripcion
                  : newProyecto.descripcion,
                key: "descripcion",
              },
              {
                label: "Fecha de Inicio",
                value: isEditing
                  ? editProyecto.fecha_inicio
                  : newProyecto.fecha_inicio,
                key: "fecha_inicio",
                type: "date",
              },
              {
                label: "Fecha de Fin",
                value: isEditing
                  ? editProyecto.fecha_fin
                  : newProyecto.fecha_fin,
                key: "fecha_fin",
                type: "date",
              },
              {
                label: "Presupuesto",
                value: isEditing
                  ? editProyecto.presupuesto
                  : newProyecto.presupuesto,
                key: "presupuesto",
                type: "number",
              },
              {
                label: "Responsable ID",
                value: isEditing
                  ? editProyecto.responsable_id
                  : newProyecto.responsable_id,
                key: "responsable_id",
                type: "number",
              },
            ].map(({ label, value, key, type = "text" }) => (
              <div className="mb-6" key={key}>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value}
                  onChange={(e) => {
                    const updatedProyecto = isEditing
                      ? { ...editProyecto, [key]: e.target.value }
                      : { ...newProyecto, [key]: e.target.value };
                    isEditing
                      ? setEditProyecto(updatedProyecto)
                      : setNewProyecto(updatedProyecto);
                  }}
                />
              </div>
            ))}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Estado
              </label>
              <select
                className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isEditing ? editProyecto.estado : newProyecto.estado}
                onChange={(e) => {
                  const updatedProyecto = isEditing
                    ? { ...editProyecto, estado: e.target.value }
                    : { ...newProyecto, estado: e.target.value };
                  isEditing
                    ? setEditProyecto(updatedProyecto)
                    : setNewProyecto(updatedProyecto);
                }}
              >
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-3 hover:bg-blue-700 transition"
                onClick={isEditing ? handleEditProyecto : handleAddProyecto}
              >
                {isEditing ? "Actualizar" : "Agregar"}
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
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

export default ProyectosTable;
