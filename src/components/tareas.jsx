"use client";

import { addTask, getAllTasks, getTasKToEmployee } from "@/services/service";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTrash, FaPlus } from "react-icons/fa";
import useStore from "@/store";

const TareasView = () => {
  const { tareas, setTareas, usuarioLogeado, setUsuarioLogeado } = useStore();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: new Date().toISOString().split("T")[0], // Fecha de hoy
    fecha_estimada_fin: "",
    prioridad: "",
    estado: "Pendiente",
  });

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

  // Cargar usuario logeado desde localStorage
  useEffect(() => {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    console.log("Cargando usuarioLogeado desde localStorage:", usuarioLogeado);
    if (usuarioLogeado) {
      setUsuarioLogeado(usuarioLogeado);
    }
  }, [setUsuarioLogeado]);

  // Obtener tareas del servidor
  useEffect(() => {
    if (usuarioLogeado) {
      fetchTareas();
    } else {
      console.log("usuarioLogeado no está definido, no se ejecuta fetchTareas");
    }
  }, [usuarioLogeado, setTareas, setLoading]);

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

  // Agregar nueva tarea
  const handleAddTask = async () => {
    try {
      const taskToAdd = { ...newTask, estado: "Pendiente" };
      console.log("Enviando a la API:", taskToAdd); // Agrega este console.log para ver lo que se envía a la API
      const addedTask = await addTask(taskToAdd);
      
      if (addedTask) {
        setTareas((prev) => [
          ...prev,
          addedTask,
        ]);
      }
  
      setNewTask({
        titulo: "",
        descripcion: "",
        fecha_inicio: new Date().toISOString().split("T")[0],
        fecha_estimada_fin: "",
        prioridad: "",
        estado: "Pendiente",
      });
      setModalOpen(false);
      fetchTareas()
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  // Renderizar prioridad
  const renderPrioridad = (prioridad) => {
    const colores = {
      Alta: "bg-red-400",
      Media: "bg-yellow-300",
      Baja: "bg-green-400",
    };

    return (
      <div
        className={`w-6 h-6 rounded-full ${colores[prioridad]} flex items-center justify-center text-white font-bold`}
        title={prioridad}
      />
    );
  };

  // Renderizar estado
  const renderEstado = (estado) => {
    const colores = {
      Pendiente: "bg-yellow-400",
      "En Progreso": "bg-blue-400",
      Programada: "bg-gray-400",
      Completada: "bg-green-400",
    };

    return (
      <div
        className={`w-full h-6 rounded-full ${colores[estado]} flex items-center justify-center text-white font-bold`}
        title={estado}
      >
        {estado}
      </div>
    );
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
            Historial de Tareas
          </h2>
          <button
            className="p-2 bg-white rounded-full shadow-neu flex items-center hover:shadow-neu-active transition"
            onClick={() => setModalOpen(true)}
          >
            <FaPlus className="text-blue-500" />
          </button>
        </div>
        <div className="bg-white shadow-neu p-6 rounded-lg">
          <table className="w-full rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "Título",
                  "Descripción",
                  "Prioridad",
                  "Estado",
                  "Fecha Inicio",
                  "Fecha Estimada Fin",
                  "Fecha Fin",
                  "Acciones",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(tareas) && tareas.map((tarea) => (
                <tr
                  key={
                    usuarioLogeado.rol === 1
                      ? tarea.tarea_id
                      : tarea.tarea.tarea_id
                  }
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {usuarioLogeado.rol === 1
                      ? tarea.titulo
                      : tarea.tarea.titulo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {usuarioLogeado.rol === 1
                      ? tarea.descripcion
                      : tarea.tarea.descripcion}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {renderPrioridad(
                      usuarioLogeado.rol === 1
                        ? tarea.prioridad
                        : tarea.tarea.prioridad
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {renderEstado(
                      usuarioLogeado.rol === 1
                        ? tarea.estado
                        : tarea.tarea.estado
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {usuarioLogeado.rol === 1
                      ? tarea.fecha_inicio
                      : tarea.tarea.fecha_inicio}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {usuarioLogeado.rol === 1
                      ? tarea.fecha_estimada_fin
                      : tarea.tarea.fecha_estimada_fin}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {usuarioLogeado.rol === 1
                      ? tarea.fecha_real_fin
                      : tarea.tarea.fecha_real_fin}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex gap-4">
                      <button
                        className="text-green-500 hover:text-green-700 transition"
                        onClick={() => completarTarea(tarea.id)}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition"
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
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-neu w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Agregar Tarea
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Título"
                value={newTask.titulo}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, titulo: e.target.value }))
                }
                className="p-2 rounded-md shadow-inner border"
              />
              <textarea
                placeholder="Descripción"
                value={newTask.descripcion}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
                className="p-2 rounded-md shadow-inner border"
              />
              <label className="block mb-4 text-sm font-medium text-gray-700">
                Fecha Estimada de Fin
                <input
                  type="date"
                  value={newTask.fecha_estimada_fin}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      fecha_estimada_fin: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </label>
              <select
                value={newTask.prioridad}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, prioridad: e.target.value }))
                }
                className="p-2 rounded-md shadow-inner border"
              >
                <option value="" disabled>
                  Selecciona Prioridad
                </option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
              <div className="flex gap-4 justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md shadow hover:shadow-lg transition"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                  onClick={handleAddTask}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TareasView;