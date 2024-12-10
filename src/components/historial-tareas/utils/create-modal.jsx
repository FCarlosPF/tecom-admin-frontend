import React, { useState } from "react";
import { format } from "date-fns";

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
        {usuarioLogeado &&
          (usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) && (
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
                        usuarioLogeado.rol === 2
                          ? tarea.tarea.tarea_id
                          : tarea.tarea_id
                      }
                      value={
                        usuarioLogeado.rol === 2
                          ? tarea.tarea.tarea_id
                          : tarea.tarea_id
                      }
                    >
                      {usuarioLogeado.rol === 2
                        ? tarea.tarea.titulo
                        : tarea.titulo}
                    </option>
                  ))}
              </select>
            </div>
          )}
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
                  {empleado.nombre}
                </label>
              ))}
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md shadow-neu hover:shadow-neu-active transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-neu hover:shadow-neu-active transition"
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
