"use client";

import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaUser,
  FaClock,
  FaTag,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaBell,
} from "react-icons/fa";
import useStore from "@/store";
import {
  getAllEmployees,
  getAllTasks,
  getAsignacionesTareas,
  getTasKToEmployee,
  updateAsignacionesTareas,
  updateTareas,
} from "@/services/service";
import { format } from "date-fns";
import CampanaModal from "./utils/CampanaModal";

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
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [asignadorNombres, setAsignadorNombres] = useState("");
  const [empleadoNombres, setEmpleadoNombres] = useState("");
  const [expandedTareas, setExpandedTareas] = useState({});
  const [isModalCampanaOpen, setIsModalCampanaOpen] = useState(false);

  const handleBellClick = () => {
    setIsModalCampanaOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalCampanaOpen(false);
  };
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getAllEmployees();
        if (Array.isArray(data)) {
          setEmpleados(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
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
      } catch (error) {
        console.error("Error al obtener las asignaciones de tareas:", error);
      }
    };

    fetchUsuarios();
    fetchAsignacionesTareas();
  }, [setEmpleados, setAsignacionesTareas]);

  useEffect(() => {
    if (usuarioLogeado) {
      fetchTareas();
    }
  }, [usuarioLogeado]);

  useEffect(() => {
    console.log("Tareas:", tareas);
  }, [tareas]);

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
      let data;
      if (usuarioLogeado.rol === 1) {
        data = await getAllTasks();
      } else {
        if (!usuarioLogeado.id_empleado) {
          console.error("id_empleado no está definido en usuarioLogeado");
          setTareas([]);
          setLoading(false);
          return;
        }
        data = await getTasKToEmployee(usuarioLogeado.id_empleado);
      }
      setTareas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener las tareas:", error.message, error.stack);
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  const completarTarea = async (id) => {
    try {
      const tareaActual = tareas.find((tarea) =>
        usuarioLogeado.rol === 1
          ? tarea.tarea_id === id
          : tarea.asignacion_id === id
      );

      if (!tareaActual) {
        throw new Error("Tarea no encontrada");
      }

      const estadoActual =
        usuarioLogeado.rol === 1
          ? tareaActual.estado
          : tareaActual.tarea.estado;
      const nuevoEstado =
        estadoActual === "Pendiente" ? "En Progreso" : "Completada";
      const fechaRealFin =
        nuevoEstado === "Completada"
          ? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
          : null;

      if (usuarioLogeado.rol === 1) {
        await updateTareas(id, {
          ...tareaActual,
          estado: nuevoEstado,
          fecha_real_fin: fechaRealFin,
        });
      } else {
        await updateAsignacionesTareas(id, {
          tarea: {
            ...tareaActual.tarea,
            estado: nuevoEstado,
            fecha_real_fin: fechaRealFin,
          },
        });
      }

      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          (usuarioLogeado.rol === 1 ? tarea.tarea_id : tarea.asignacion_id) ===
          id
            ? { ...tarea, estado: nuevoEstado }
            : tarea
        )
      );
      fetchTareas();
    } catch (error) {
      console.error("Error al completar la tarea:", error);
    }
  };

  const handleCardClick = (tarea) => {
    setSelectedTarea(tarea);
    const asignaciones = asignacionesTareas.filter(
      (asignacion) => asignacion.tarea.tarea_id === tarea.tarea_id
    );
    setAsignadorNombres(
      [
        ...new Set(
          asignaciones.map((asignacion) => asignacion.asignador.nombre)
        ),
      ].join(", ")
    );
    setEmpleadoNombres(
      asignaciones.map((asignacion) => asignacion.empleado?.nombre).join(", ")
    );
  };

  const closeModal = () => {
    setSelectedTarea(null);
    setAsignadorNombres("");
    setEmpleadoNombres("");
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  const toggleExpand = (tareaId) => {
    setExpandedTareas((prev) => ({
      ...prev,
      [tareaId]: !prev[tareaId],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Cargando...</p>
      </div>
    );
  }

  const tareasPorEstado = (Array.isArray(tareas) ? tareas : []).reduce(
    (acc, tarea) => {
      const estado =
        usuarioLogeado && usuarioLogeado.rol === 1
          ? tarea.estado
          : tarea.tarea?.estado;
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
    <div className="container mx-auto p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-grow text-center">
          <h1 className="text-4xl font-bold text-black">Panel de Tareas</h1>
        </div>
        <FaBell
          className="text-4xl text-black cursor-pointer"
          onClick={handleBellClick}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full flex-grow">
        {estados.map((estado) => (
          <div
            key={estado}
            className="bg-gray-900 p-2 rounded-lg shadow-md flex flex-col h-full overflow-y-auto"
          >
            <h2 className="text-lg font-semibold text-white mb-2">{estado}</h2>
            <div className="flex flex-col space-y-2">
              {tareasPorEstado[estado] && tareasPorEstado[estado].length > 0 ? (
                tareasPorEstado[estado]
                  .filter((tarea) =>
                    usuarioLogeado && usuarioLogeado.rol == 1
                      ? !tarea.tarea_padre
                      : !tarea.tarea.tarea_padre
                  )
                  .map((tarea) => {
                    const subtareas = tareas.filter((subtarea) => {
                      return usuarioLogeado && usuarioLogeado.rol === 1
                        ? subtarea.tarea_padre === tarea.tarea_id
                        : subtarea.tarea.tarea_padre === tarea.tarea.tarea_id;
                    });
                    const tareaData =
                      usuarioLogeado && usuarioLogeado.rol === 1
                        ? tarea
                        : tarea.tarea;
                    return (
                      <div
                        key={tareaData.tarea_id}
                        className="bg-gray-800 shadow-md rounded-lg overflow-hidden p-2 border-l-4 border-blue-500 cursor-pointer"
                      >
                        <div
                          className="flex justify-between items-center"
                          onClick={() =>
                            usuarioLogeado.rol === 1
                              ? handleCardClick(tarea)
                              : handleCardClick(tarea.tarea)
                          }
                        >
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                              <h2 className="text-base font-semibold text-white">
                                {tareaData.titulo}
                              </h2>
                            </div>
                            <p className="text-sm text-gray-400 mb-1">
                              {tareaData.descripcion}
                            </p>
                            <div className="flex items-center text-sm text-gray-400 mb-1">
                              <FaClock className="mr-1 text-blue-500" />
                              <span
                                className={
                                  (tareaData.estado !== "Completada" &&
                                    tareaData.tiempo_restante.dias === 0 &&
                                    tareaData.tiempo_restante.horas === 0) ||
                                  (tareaData.estado === "Completada" &&
                                    new Date(tareaData.fecha_real_fin) >
                                      new Date(tareaData.fecha_estimada_fin))
                                    ? "text-red-500"
                                    : ""
                                }
                              >
                                {tareaData.estado === "Completada"
                                  ? `Completada el: ${format(
                                      new Date(tareaData.fecha_real_fin),
                                      "dd/MM/yyyy HH:mm"
                                    )}`
                                  : tareaData.tiempo_restante.dias === 0 &&
                                    tareaData.tiempo_restante.horas === 0
                                  ? `Vencido: ${tareaData.tiempo_pasado.dias} días y ${tareaData.tiempo_pasado.horas} horas pasados`
                                  : `Tiempo restante: ${tareaData.tiempo_restante.dias} días y ${tareaData.tiempo_restante.horas} horas`}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-400 mb-1">
                              <FaTag className="mr-1 text-yellow-500" />
                              <span>{tareaData.prioridad}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {tareaData.estado !== "Completada" && (
                              <button
                                className={`flex items-center justify-center w-6 h-6 text-white rounded-full shadow-md transition-colors duration-300 ${
                                  tareaData.estado === "Pendiente"
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-green-500 hover:bg-green-600"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  completarTarea(
                                    usuarioLogeado && usuarioLogeado.rol == 1
                                      ? tarea.tarea_id
                                      : tarea.tarea.tarea_id
                                  );
                                }}
                              >
                                {tareaData.estado === "Pendiente" ? (
                                  <FaArrowRight size={12} />
                                ) : (
                                  <FaCheck size={12} />
                                )}
                              </button>
                            )}
                            {subtareas.length > 0 && (
                              <button
                                className="ml-2 text-gray-400 hover:text-gray-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(
                                    usuarioLogeado.rol === 1
                                      ? tarea.tarea_id
                                      : tarea.tarea.tarea_id
                                  );
                                }}
                              >
                                {expandedTareas[
                                  usuarioLogeado.rol === 1
                                    ? tarea.tarea_id
                                    : tarea.tarea.tarea_id
                                ] ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        {expandedTareas[
                          usuarioLogeado && usuarioLogeado.rol === 1
                            ? tarea.tarea_id
                            : tarea.tarea.tarea_id
                        ] && (
                          <div className="pl-4 mt-2">
                            {subtareas.map((subtarea) => {
                              const subtareaData =
                                usuarioLogeado.rol === 1
                                  ? subtarea
                                  : subtarea.tarea;
                              return (
                                <div
                                  key={subtareaData.tarea_id}
                                  className="bg-gray-700 shadow-md rounded-lg overflow-hidden p-2 border-l-4 border-indigo-500 cursor-pointer"
                                >
                                  <div
                                    className="flex justify-between items-center"
                                    onClick={() =>
                                      handleCardClick(subtareaData)
                                    }
                                  >
                                    <div className="flex-grow">
                                      <div className="flex justify-between items-center mb-1">
                                        <h2 className="text-base font-semibold text-white">
                                          {subtareaData.titulo}
                                        </h2>
                                      </div>
                                      <p className="text-sm text-gray-400 mb-1">
                                        {subtareaData.descripcion}
                                      </p>
                                      <div className="flex items-center text-sm text-gray-400 mb-1">
                                        <FaClock className="mr-1 text-blue-500" />
                                        <span>
                                          {subtareaData.estado === "Completada"
                                            ? `Completada el: ${format(
                                                new Date(
                                                  subtareaData.fecha_real_fin
                                                ),
                                                "dd/MM/yyyy HH:mm"
                                              )}`
                                            : subtareaData.tiempo_restante
                                                .dias === 0 &&
                                              subtareaData.tiempo_restante
                                                .horas === 0
                                            ? `Vencido: ${subtareaData.tiempo_pasado.dias} días y ${subtareaData.tiempo_pasado.horas} horas pasados`
                                            : `Tiempo restante: ${subtareaData.tiempo_restante.dias} días y ${subtareaData.tiempo_restante.horas} horas`}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-400 mb-1">
                                        <FaTag className="mr-1 text-yellow-500" />
                                        <span>{subtareaData.prioridad}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      {subtareaData.estado !== "Completada" && (
                                        <button
                                          className={`flex items-center justify-center w-6 h-6 text-white rounded-full shadow-md transition-colors duration-300 ${
                                            subtareaData.estado === "Pendiente"
                                              ? "bg-blue-500 hover:bg-blue-600"
                                              : "bg-green-500 hover:bg-green-600"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            completarTarea(subtarea.tarea_id);
                                          }}
                                        >
                                          {subtareaData.estado ===
                                          "Pendiente" ? (
                                            <FaArrowRight size={12} />
                                          ) : (
                                            <FaCheck size={12} />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
              ) : (
                <p className="text-gray-500 text-sm">
                  No hay tareas en este estado.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedTarea && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start"
          onClick={handleOutsideClick}
        >
          <div
            className="w-[25%] md:w-[30%] lg:w-[25%] h-full bg-white shadow-2xl rounded-l-lg p-6 relative z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-3xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {selectedTarea.titulo}
            </h2>
            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              {selectedTarea.descripcion}
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-base text-gray-600">
                <FaClock className="mr-2 text-blue-500" />
                <span className="font-medium">Fecha de inicio:</span>{" "}
                <span className="ml-1">
                  {format(
                    new Date(selectedTarea.fecha_inicio),
                    "dd/MM/yyyy HH:mm"
                  )}
                </span>
              </div>
              <div className="flex items-center text-base text-gray-600">
                <FaClock className="mr-2 text-blue-500" />
                <span className="font-medium">Fecha estimada de fin:</span>{" "}
                <span className="ml-1">
                  {format(
                    new Date(selectedTarea.fecha_estimada_fin),
                    "dd/MM/yyyy HH:mm"
                  )}
                </span>
              </div>
              {selectedTarea.fecha_real_fin && (
                <div className="flex items-center text-base text-gray-600">
                  <FaClock className="mr-2 text-green-500" />
                  <span className="font-medium">Fecha real de fin:</span>{" "}
                  <span className="ml-1">
                    {format(
                      new Date(selectedTarea.fecha_real_fin),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center text-base text-gray-600">
                <FaTag className="mr-2 text-yellow-500" />
                <span className="font-medium">Prioridad:</span>{" "}
                <span className="ml-1">{selectedTarea.prioridad}</span>
              </div>
              <div className="flex items-center text-base text-gray-600">
                <FaUser className="mr-2 text-purple-500" />
                <span className="font-medium">Asignador:</span>{" "}
                <span className="ml-1">{asignadorNombres}</span>
              </div>
              <div className="flex items-center text-base text-gray-600">
                <FaUser className="mr-2 text-purple-500" />
                <span className="font-medium">Empleado:</span>{" "}
                <span className="ml-1">{empleadoNombres}</span>
              </div>
              <div className="flex items-center text-base text-gray-600">
                <FaClock className="mr-2 text-teal-500" />
                <span className="font-medium">Tiempo restante:</span>{" "}
                <span className="ml-1">
                  {selectedTarea.tiempo_restante.dias} días,{" "}
                  {selectedTarea.tiempo_restante.horas} horas,{" "}
                  {selectedTarea.tiempo_restante.minutos} minutos
                </span>
              </div>
              <div className="flex items-center text-base text-gray-600">
                <FaClock className="mr-2 text-red-500" />
                <span className="font-medium">Tiempo pasado:</span>{" "}
                <span className="ml-1">
                  {selectedTarea.tiempo_pasado.dias} días,{" "}
                  {selectedTarea.tiempo_pasado.horas} horas,{" "}
                  {selectedTarea.tiempo_pasado.minutos} minutos
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <CampanaModal isOpen={isModalCampanaOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default TareasView;
