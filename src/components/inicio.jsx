"use client";

import React, { useEffect, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import useStore from "@/store";
import { getAllTasks, getTasKToEmployee } from "@/services/service";

const TareasView = () => {
  const { tareas, setTareas, usuarioLogeado } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        let data;
        if (usuarioLogeado.rol === 1) {
          data = await getAllTasks();
        } else if (usuarioLogeado.id_empleado) {
          data = await getTasKToEmployee(usuarioLogeado.id_empleado);
        } else {
          throw new Error("ID de empleado no válido");
        }
        setTareas(data);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTareas();
  }, [setTareas, usuarioLogeado]);

  const completarTarea = (id) => {
    // Lógica para completar la tarea
  };

  const eliminarTarea = (id) => {
    // Lógica para eliminar la tarea
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Cargando...</p>
      </div>
    );
  }

  // Filtrar tareas activas
  const tareasActivas = tareas.filter((tarea) => {
    const estado =
      usuarioLogeado.rol === 1 ? tarea.estado : tarea.tarea.estado;
    return estado !== "Completada";
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Panel de Tareas
      </h1>
      {tareasActivas.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl">¡No tienes tareas pendientes!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tareasActivas.map((tarea) => (
            <div
              key={
                usuarioLogeado.rol === 1
                  ? tarea.tarea_id
                  : tarea.tarea.tarea_id
              }
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {usuarioLogeado.rol === 1
                    ? tarea.titulo
                    : tarea.tarea.titulo}
                </h2>
                <p className="text-gray-600 mb-4">
                  {usuarioLogeado.rol === 1
                    ? tarea.descripcion
                    : tarea.tarea.descripcion}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded-md">
                    {usuarioLogeado.rol === 1
                      ? tarea.prioridad
                      : tarea.tarea.prioridad}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      (usuarioLogeado.rol === 1
                        ? tarea.dias_restantes
                        : tarea.tarea.dias_restantes) === 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {usuarioLogeado.rol === 1
                      ? tarea.dias_restantes === 0
                        ? "Vencido"
                        : `Días restantes: ${tarea.dias_restantes}`
                      : tarea.tarea.dias_restantes === 0
                      ? "Vencido"
                      : `Días restantes: ${tarea.tarea.dias_restantes}`}
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-colors duration-300"
                    onClick={() =>
                      completarTarea(
                        usuarioLogeado.rol === 1
                          ? tarea.tarea_id
                          : tarea.tarea.tarea_id
                      )
                    }
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
                    onClick={() =>
                      eliminarTarea(
                        usuarioLogeado.rol === 1
                          ? tarea.tarea_id
                          : tarea.tarea.tarea_id
                      )
                    }
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TareasView;
