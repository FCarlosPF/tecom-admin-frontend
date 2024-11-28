"use client";

import React, { useEffect, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import useStore from "@/store";
import { getAllEmployees, getAllTasks, getAsignacionesTareas, getTasKToEmployee, updateAsignacionesTareas, updateTareas } from "@/services/service";

const TareasView = () => {
  const { tareas, setTareas, usuarioLogeado, setEmpleados, setAsignacionesTareas } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getAllEmployees();
        if (Array.isArray(data)) {
          setEmpleados(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
        console.log("Usuarios:", data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    const fetchAsignacionesTareas = async () => {
      try {
        const data = await getAsignacionesTareas();
        if (Array.isArray(data)) {
          setAsignacionesTareas(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
        console.log("AsignacionesTareas:", data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };    
    fetchAsignacionesTareas();
    fetchUsuarios();
  }, [setEmpleados]);

  const fetchTareas = async () => {
    if (!usuarioLogeado) {
      console.error("usuarioLogeado no está definido");
      setTareas([]);
      setLoading(false);
      return;
    }

    if (usuarioLogeado.id_empleado === null) {
      console.log("id_empleado es null, no se ejecuta fetchTareas");
      setLoading(false);
      return;
    }

    try {
      console.log("Estado de usuarioLogeado al iniciar fetchTareas:", usuarioLogeado);
      let data;
      if (usuarioLogeado.rol === 1) {
        console.log("Usuario con rol 1, obteniendo todas las tareas");
        data = await getAllTasks();
      } else {
        if (!usuarioLogeado.id_empleado) {
          console.error("id_empleado no está definido en usuarioLogeado");
          setTareas([]);
          setLoading(false);
          return;
        }
        console.log(`Usuario con rol ${usuarioLogeado.rol}, obteniendo tareas para el empleado ${usuarioLogeado.id_empleado}`);
        data = await getTasKToEmployee(usuarioLogeado.id_empleado);
      }
      console.log("Datos obtenidos:", data);
      setTareas(data || []); // Asegúrate de que data sea un array
    } catch (error) {
      console.error("Error al obtener las tareas:", error.message, error.stack);
      setTareas([]); // En caso de error, asegúrate de que tareas sea un array vacío
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, [setTareas, usuarioLogeado]);

  useEffect(() => {
    console.log("Tareas:", tareas);
  }, [tareas]);

  const completarTarea = async (id) => {
    let tareaActual;
    try {
      if (usuarioLogeado.rol === 1) {
        tareaActual = tareas.find((tarea) => tarea.tarea_id === id);

        if (!tareaActual) {
          throw new Error("Tarea no encontrada");
        }
      } else {
        tareaActual = tareas.find((tarea) => tarea.asignacion_id === id);
        if (!tareaActual) {
          throw new Error("Tarea no encontrada");
        }
      }

      const fechaRealFin = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

      if (usuarioLogeado.rol === 1) {
        const updatedTask = await updateTareas(id, {
          titulo: tareaActual.titulo,
          fecha_de_inicio: tareaActual.fecha_de_inicio,
          estado: "Completada",
          fecha_real_fin: fechaRealFin,
        });
        console.log("Tarea completada correctamente:", updatedTask);
      } else {
        const dataToSend = {
          tarea: {
            titulo: tareaActual.tarea.titulo,
            fecha_de_inicio: tareaActual.tarea.fecha_inicio,
            estado: "Completada",
            fecha_real_fin: fechaRealFin,
          }
        };
        console.log("Datos enviados a updateAsignacionesTareas:", dataToSend);
        const updatedTask = await updateAsignacionesTareas(id, dataToSend);
        console.log("Tarea completada correctamente:", updatedTask);
      }

      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.tarea_id === id ? { ...tarea, estado: "Completada" } : tarea
        )
      );
      fetchTareas();
    } catch (error) {
      console.error("Error al completar la tarea:", error);
    }
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
  const tareasActivas = Array.isArray(tareas)
    ? tareas.filter((tarea) => {
        const estado =
          usuarioLogeado && usuarioLogeado.rol === 1
            ? tarea.estado
            : tarea.tarea?.estado;
        return estado !== "Completada";
      })
    : [];

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
                usuarioLogeado && usuarioLogeado.rol === 1 ? tarea.tarea_id : tarea.tarea?.tarea_id
              }
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  { usuarioLogeado && usuarioLogeado.rol === 1 ? tarea.titulo : tarea.tarea?.titulo}
                </h2>
                <p className="text-gray-600 mb-4">
                  { usuarioLogeado && usuarioLogeado.rol === 1
                    ? tarea.descripcion
                    : tarea.tarea?.descripcion}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded-md">
                    {usuarioLogeado && usuarioLogeado.rol === 1
                      ? tarea.prioridad
                      : tarea.tarea?.prioridad}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      (usuarioLogeado && usuarioLogeado.rol === 1
                        ? tarea.dias_restantes
                        : tarea.tarea?.dias_restantes) === 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {usuarioLogeado && usuarioLogeado.rol === 1
                      ? tarea.dias_restantes === 0
                        ? "Vencido"
                        : `Días restantes: ${tarea.dias_restantes}`
                      : tarea.tarea?.dias_restantes === 0
                      ? "Vencido"
                      : `Días restantes: ${tarea.tarea?.dias_restantes}`}
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-colors duration-300"
                    onClick={() =>
                      completarTarea(
                        usuarioLogeado &&usuarioLogeado.rol === 1
                          ? tarea.tarea_id
                          : tarea.asignacion_id
                      )
                    }
                  >
                    <FaCheck />
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