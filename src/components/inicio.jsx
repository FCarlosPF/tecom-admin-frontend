"use client";

import React, { useEffect, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import useStore from "@/store";
import {
  getAllEmployees,
  getAllTasks,
  getAsignacionesTareas,
  getTasKToEmployee,
  updateAsignacionesTareas,
  updateTareas,
} from "@/services/service";

const TareasView = () => {
  const {
    tareas,
    setTareas,
    usuarioLogeado,
    setEmpleados,
    setAsignacionesTareas,
    asignacionesTareas,
  } = useStore();
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
        console.error("Error al obtener las asignaciones de tareas:", error);
      }
    };

    fetchUsuarios();
    fetchAsignacionesTareas();
  }, [setEmpleados, setAsignacionesTareas]);

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
      console.log(
        "Estado de usuarioLogeado al iniciar fetchTareas:",
        usuarioLogeado
      );
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
        console.log(
          `Usuario con rol ${usuarioLogeado.rol}, obteniendo tareas para el empleado ${usuarioLogeado.id_empleado}`
        );
        data = await getTasKToEmployee(usuarioLogeado.id_empleado);
      }
      console.log("Datos obtenidos:", data);
      setTareas(Array.isArray(data) ? data : []); // Asegúrate de que data sea un array
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
  
      let nuevoEstado;
      const estadoActual = usuarioLogeado.rol === 1 ? tareaActual.estado : tareaActual.tarea.estado;
      
      if (estadoActual === "Pendiente") {
        nuevoEstado = "En Progreso";
      } else if (estadoActual === "En Progreso") {
        nuevoEstado = "Completada";
      } else {
        console.error("Estado de tarea no válido para completar:", estadoActual);
        return;
      }
  
      const fechaRealFin = nuevoEstado === "Completada" ? new Date().toISOString().split("T")[0] : null;
  
      if (usuarioLogeado.rol === 1) {
        const updatedTask = await updateTareas(id, {
          ...tareaActual,
          estado: nuevoEstado,
          fecha_real_fin: fechaRealFin,
        });
        console.log("Tarea actualizada correctamente:", updatedTask);
      } else {
        const dataToSend = {
          tarea: {
            ...tareaActual.tarea,
            estado: nuevoEstado,
            fecha_real_fin: fechaRealFin,
          },
        };
        console.log("Datos enviados a updateAsignacionesTareas:", dataToSend);
        const updatedTask = await updateAsignacionesTareas(id, dataToSend);
        console.log("Tarea actualizada correctamente:", updatedTask);
      }
  
      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          (usuarioLogeado.rol === 1 ? tarea.tarea_id : tarea.asignacion_id) === id
            ? { ...tarea, estado: nuevoEstado }
            : tarea
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

  // Agrupar tareas por estado
  const tareasPorEstado = (Array.isArray(tareas) ? tareas : []).reduce(
    (acc, tarea) => {
      const estado =
        usuarioLogeado.rol === 1 ? tarea.estado : tarea.tarea?.estado;
      if (!acc[estado]) {
        acc[estado] = [];
      }
      acc[estado].push(tarea);
      return acc;
    },
    {}
  );

  const estados = ["Pendiente", "En Progreso", "Completada"];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Panel de Tareas
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {estados.map((estado) => (
          <div key={estado} className="bg-gray-100 p-2 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {estado}
            </h2>
            {tareasPorEstado[estado] && tareasPorEstado[estado].length > 0 ? (
              tareasPorEstado[estado].map((tarea) => {
                let asignadorNombres, empleadoNombres;

                if (usuarioLogeado.rol === 1) {
                  const asignaciones = asignacionesTareas.filter(
                    (asignacion) => asignacion.tarea.tarea_id === tarea.tarea_id
                  );
                  asignadorNombres = [
                    ...new Set(
                      asignaciones.map(
                        (asignacion) => asignacion.asignador.nombre
                      )
                    ),
                  ].join(", ");
                  empleadoNombres = asignaciones
                    .map((asignacion) => asignacion.empleado.nombre)
                    .join(", ");
                } else {
                  asignadorNombres = tarea.asignador.nombre;
                  empleadoNombres = tarea.empleado.nombre;
                }

                return (
                  <div
                    key={
                      usuarioLogeado && usuarioLogeado.rol === 1
                        ? tarea.tarea_id
                        : tarea.tarea?.tarea_id
                    }
                    className="bg-white shadow-lg rounded-lg overflow-hidden mb-2 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="p-3">
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {usuarioLogeado && usuarioLogeado.rol === 1
                          ? tarea.titulo
                          : tarea.tarea?.titulo}
                      </h2>
                      <p className="text-gray-600 mb-2">
                        {usuarioLogeado && usuarioLogeado.rol === 1
                          ? tarea.descripcion
                          : tarea.tarea?.descripcion}
                      </p>
                      <p className="text-gray-600 mb-2">
                        Asignador: {asignadorNombres}
                      </p>
                      <p className="text-gray-600 mb-2">
                        Empleado: {empleadoNombres}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block px-2 py-1 text-sm font-medium text-white bg-indigo-500 rounded-md">
                          {usuarioLogeado && usuarioLogeado.rol === 1
                            ? tarea.prioridad
                            : tarea.tarea?.prioridad}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            (
                              usuarioLogeado && usuarioLogeado.rol === 1
                                ? tarea.tiempo_restante.dias === 0 &&
                                  tarea.tiempo_restante.horas === 0
                                : tarea.tarea?.tiempo_restante.dias === 0 &&
                                  tarea.tarea?.tiempo_restante.horas === 0
                            )
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {usuarioLogeado && usuarioLogeado.rol === 1
                            ? tarea.tiempo_restante.dias === 0 &&
                              tarea.tiempo_restante.horas === 0
                              ? `Vencido: ${tarea.tiempo_pasado.dias} días y ${tarea.tiempo_pasado.horas} horas pasados`
                              : `Tiempo restante: ${tarea.tiempo_restante.dias} días y ${tarea.tiempo_restante.horas} horas`
                            : tarea.tarea?.tiempo_restante.dias === 0 &&
                              tarea.tarea?.tiempo_restante.horas === 0
                            ? `Vencido: ${tarea.tarea?.tiempo_pasado.dias} días y ${tarea.tarea?.tiempo_pasado.horas} horas pasados`
                            : `Días restantes: ${tarea.tarea?.tiempo_restante.dias} días y ${tarea.tarea?.tiempo_restante.horas} horas`}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {((usuarioLogeado &&
                          usuarioLogeado.rol === 1 &&
                          tarea.estado !== "Completada") ||
                          (usuarioLogeado &&
                            usuarioLogeado.rol !== 1 &&
                            tarea.tarea?.estado !== "Completada")) && (
                          <button
                            className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-colors duration-300"
                            onClick={() =>
                              completarTarea(
                                usuarioLogeado && usuarioLogeado.rol === 1
                                  ? tarea.tarea_id
                                  : tarea.asignacion_id
                              )
                            }
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No hay tareas en este estado.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TareasView;
