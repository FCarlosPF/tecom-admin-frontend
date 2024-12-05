"use client";

import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import useStore from "@/store";
import {
  addTask,
  getAllTasks,
  getTasKToEmployee,
  deleteTarea,
  addAsignacionTarea,
  getAsignacionesTareas,
  getAllEmployees,
} from "@/services/service";
import Modal from "./utils/modal";
import TaskTable from "./utils/tarea-table";
import Pagination from "./utils/paginations";
import AssignTask from "./utils/asignar-tarea";
import { toast } from "react-toastify";
import { formatISO } from 'date-fns';

const TareasView = () => {
  const { tareas, setTareas, usuarioLogeado, setUsuarioLogeado, empleados, setEmpleados } = useStore();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: formatISO(new Date()),
    fecha_estimada_fin: "",
    prioridad: "",
    estado: "Pendiente",
    tarea_padre: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [asignacionestareas, setAsignacionesTareas] = useState([]);

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
      const dataAsignacionesTareas = await getAsignacionesTareas()
      setAsignacionesTareas(dataAsignacionesTareas)
      console.log("Datos obtenidos de asignaciones:", dataAsignacionesTareas);
      const dataEmpelados = await getAllEmployees();
      setEmpleados(dataEmpelados);

      setTareas(data || []);
    } catch (error) {
      console.error("Error al obtener las tareas:", error.message, error.stack);
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
    console.log("Cargando usuarioLogeado desde localStorage:", usuarioLogeado);
    if (usuarioLogeado) {
      setUsuarioLogeado(usuarioLogeado);
    }
  }, [setUsuarioLogeado]);

  useEffect(() => {
    if (usuarioLogeado) {
      fetchTareas();
    } else {
      console.log("usuarioLogeado no está definido, no se ejecuta fetchTareas");
    }
  }, [usuarioLogeado, setTareas, setLoading]);

  const eliminarTarea = async (id) => {
    try {
      await deleteTarea(id);
      setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
      fetchTareas();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const taskToAdd = { ...newTask, estado: "Pendiente" };
      console.log("Enviando a la API:", taskToAdd);
      const addedTask = await addTask(taskToAdd);

      if (addedTask) {
        setTareas((prev) => [...prev, addedTask]);
      }

      setNewTask({
        titulo: "",
        descripcion: "",
        fecha_inicio: formatISO(new Date()), // Incluye fecha y hora exacta
        fecha_estimada_fin: "",
        prioridad: "",
        estado: "Pendiente",
        tarea_padre: null,
      });
      setModalOpen(false);
      fetchTareas();
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  };

  const handleAssignTask = async (taskId, userId, asignador) => {
    try {
      await addAsignacionTarea(taskId, userId, asignador);
      fetchTareas();
      toast.success("Tarea asignada correctamente");
      console.log("Tarea asignada correctamente");
    } catch (error) {
      console.error("Error al asignar la tarea:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(tareas)
    ? tareas.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Historial de Tareas
            </h2>
            {(usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) && (
              <button
                className="p-2 bg-white rounded-full shadow-neu flex items-center hover:shadow-neu-active transition"
                onClick={() => setModalOpen(true)}
              >
                <FaPlus className="text-blue-500" />
              </button>
            )}
          </div>
          <div className="bg-white shadow-neu p-6 rounded-lg">
            <TaskTable
              tareas={currentItems}
              usuarioLogeado={usuarioLogeado}
              eliminarTarea={eliminarTarea}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(tareas.length / itemsPerPage)}
              paginate={setCurrentPage}
            />
          </div>
          {usuarioLogeado &&
            (usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) && (
              <AssignTask
                tareas={tareas}
                usuarios={empleados}
                usuarioLogeado={usuarioLogeado}
                handleAssignTask={handleAssignTask}
                asignacionesTareas={asignacionestareas}
              />
            )}
        </div>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          newTask={newTask}
          setNewTask={setNewTask}
          handleAddTask={handleAddTask}
          tareas={tareas} // Pasar las tareas para seleccionar tarea_padre
        />
      </div>
    </>
  );
};

export default TareasView;