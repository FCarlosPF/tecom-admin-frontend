import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import useStore from "@/store";
import { capitalizeFirstLetter } from "@/utils/funciones";

const Modal = ({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  handleAddTask,
  tareas,
  usuarioLogeado,
  empleados,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [parentTaskEndDate, setParentTaskEndDate] = useState("");
  const { proyectos } = useStore();
  useEffect(() => {
    if (newTask.tarea_padre) {
      const parentTask = Array.isArray(tareas)
        ? tareas.find((tarea) => {
            if (usuarioLogeado?.rol?.id === 1) {
              return tarea.tarea_id === parseInt(newTask.tarea_padre, 10);
            } else {
              return tarea.tarea.tarea_id === parseInt(newTask.tarea_padre, 10);
            }
          })
        : null;
      if (parentTask) {
        setParentTaskEndDate(
          usuarioLogeado?.rol?.id === 1
            ? parentTask.fecha_estimada_fin
            : parentTask.tarea.fecha_estimada_fin
        );
      }
    } else {
      setParentTaskEndDate("");
    }
  }, [newTask.tarea_padre, tareas, usuarioLogeado?.rol]);

  if (!isOpen) return null;

  const handleUserSelection = (e) => {
    const value = parseInt(e.target.value, 10);
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(value)
        ? prevSelectedUsers.filter((user) => user !== value)
        : [...prevSelectedUsers, value]
    );
  };

  const handleAddTaskWithAssignment = () => {
    handleAddTask(selectedUsers);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start"
      onClick={onClose}
    >
      <div
        className="bg-gray-200 p-6 rounded-l-lg shadow-2xl w-full md:w-1/3 lg:w-1/4 h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Agregar Tarea</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Título</label>
          <input
            type="text"
            className="w-full p-2 border rounded shadow-inner"
            value={newTask.titulo}
            onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Descripción</label>
          <textarea
            className="w-full p-2 border rounded"
            value={newTask.descripcion}
            onChange={(e) =>
              setNewTask({ ...newTask, descripcion: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Proyecto</label>
          <select
            className="w-full p-2 border rounded"
            value={newTask.proyecto_id || ""}
            onChange={(e) =>
              setNewTask({ ...newTask, proyecto_id: Number(e.target.value) })
            }
          >
            <option value="">Seleccione un proyecto</option>
            {Array.isArray(proyectos) &&
              proyectos.map((proyecto) => (
                <option key={proyecto.proyecto_id} value={proyecto.proyecto_id}>
                  {proyecto.nombre}
                </option>
              ))}
          </select>
        </div>
        {usuarioLogeado &&
          (usuarioLogeado?.rol?.id === 1 || usuarioLogeado?.rol?.id === 2) && (
            <div className="mb-4">
              <label className="block text-gray-700">Tarea Padre</label>
              <select
                className="w-full p-2 border rounded"
                value={newTask.tarea_padre || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, tarea_padre: e.target.value })
                }
              >
                <option value="">Seleccione una tarea padre</option>
                {Array.isArray(tareas) &&
                  tareas.map((tarea) => (
                    <option
                      key={
                        usuarioLogeado?.rol?.id === 2
                          ? tarea.tarea.tarea_id
                          : tarea.tarea_id
                      }
                      value={
                        usuarioLogeado?.rol?.id === 2
                          ? tarea.tarea.tarea_id
                          : tarea.tarea_id
                      }
                    >
                      {usuarioLogeado?.rol?.id === 2
                        ? tarea.tarea.titulo
                        : tarea.titulo}
                    </option>
                  ))}
              </select>
            </div>
          )}
        <div className="mb-4">
          <label className="block text-gray-700">Fecha Estimada de Fin</label>
          <input
            type="datetime-local"
            value={
              newTask.fecha_estimada_fin
                ? format(
                    new Date(newTask.fecha_estimada_fin),
                    "yyyy-MM-dd'T'HH:mm"
                  )
                : ""
            }
            min={getCurrentDateTime()}
            max={
              parentTaskEndDate
                ? format(new Date(parentTaskEndDate), "yyyy-MM-dd'T'HH:mm")
                : ""
            }
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev,
                fecha_estimada_fin: new Date(e.target.value).toISOString(),
              }))
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Prioridad</label>
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
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Asignar a Usuarios</label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {Array.isArray(empleados) &&
              empleados.map((empleado) => (
                <label key={empleado.id_empleado} className="flex items-center">
                  <input
                    type="checkbox"
                    value={empleado.id_empleado}
                    checked={selectedUsers.includes(empleado.id_empleado)}
                    onChange={handleUserSelection}
                    className="mr-2"
                  />
                  <p>{capitalizeFirstLetter(empleado.first_name)}</p>
                </label>
              ))}
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md shadow-lg hover:shadow-xl transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-lg hover:shadow-xl transition"
            onClick={handleAddTaskWithAssignment}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
