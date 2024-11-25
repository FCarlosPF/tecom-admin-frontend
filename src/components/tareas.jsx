"use client";

import { getAllTasks, getTasKToEmployee } from "@/services/service";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import useStore from "@/store";

const TareasView = () => {
  // Datos iniciales
  const { tareas, setTareas, usuarioLogeado } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        if (usuarioLogeado.rol === 1) {
          const data = await getAllTasks();
          setTareas(data);
          console.log("Tareas:", data);
        } else {
          const data = await getTasKToEmployee(usuarioLogeado.id_empleado);
          setTareas(data);
          console.log("Tareas:", data);
          console.log("usuarioLogeado:", usuarioLogeado);
        }
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTareas();
  }, [setTareas, usuarioLogeado]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Completar tarea
  const completarTarea = (id) => {
    setTareas((prev) =>
      prev.map((tarea) =>
        tarea.id === id ? { ...tarea, estado: "Completada" } : tarea
      )
    );
  };

  // Eliminar tarea
  const eliminarTarea = (id) => {
    setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
  };

  return (
    <div className="p-4 bg-white shadow-neu rounded-md">
      <h2 className="text-xl font-bold mb-4">Gestión de Tareas</h2>
      <table className="table-auto w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">
              Título
            </th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">
              Descripción
            </th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">
              Prioridad
            </th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">
              Estado
            </th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">
              Fecha Inicio
            </th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">
              Fecha Estimada Fin
            </th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={usuarioLogeado.rol === 1 ? tarea.tarea_id : tarea.tarea.tarea_id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-2 border text-sm text-gray-700">
                {usuarioLogeado.rol === 1 ? tarea.titulo : tarea.tarea.titulo}
              </td>
              <td className="px-4 py-2 border text-sm text-gray-700">
                {usuarioLogeado.rol === 1 ? tarea.descripcion : tarea.tarea.descripcion}
              </td>
              <td className="px-4 py-2 border text-sm text-gray-700">
                {usuarioLogeado.rol === 1 ? tarea.prioridad : tarea.tarea.prioridad}
              </td>
              <td className="px-4 py-2 border text-sm text-gray-700">
                {usuarioLogeado.rol === 1 ? tarea.estado : tarea.tarea.estado}
              </td>
              <td className="px-4 py-2 border text-sm text-gray-700">
                {usuarioLogeado.rol === 1 ? tarea.fecha_inicio : tarea.tarea.fecha_inicio}
              </td>
              <td className="px-4 py-2 border text-sm text-gray-700">
                {usuarioLogeado.rol === 1 ? tarea.fecha_estimada_fin : tarea.tarea.fecha_estimada_fin}
              </td>
              <td className="px-4 py-2 border text-sm text-gray-700">
                <div className="flex gap-2">
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => completarTarea(tarea.id)}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => eliminarTarea(tarea.id)}
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
  );
};

export default TareasView;