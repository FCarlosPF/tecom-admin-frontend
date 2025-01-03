"use client";

import React, { useEffect, useState } from "react";
import {
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
import TareaModal from "./utils/TareaModal";
import Estados from "./utils/Estados";

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
    console.log("Tarea seleccionada:", tarea); // Agregar console.log
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
      <Estados
        estados={estados}
        tareasPorEstado={tareasPorEstado}
        usuarioLogeado={usuarioLogeado}
        tareas={tareas}
        handleCardClick={handleCardClick}
        completarTarea={completarTarea}
        toggleExpand={toggleExpand}
        expandedTareas={expandedTareas}
      />
      <TareaModal
        selectedTarea={selectedTarea}
        asignadorNombres={asignadorNombres}
        empleadoNombres={empleadoNombres}
        closeModal={closeModal}
        handleOutsideClick={handleOutsideClick}
      />
      <CampanaModal isOpen={isModalCampanaOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default TareasView;
