import React from "react";

const Modal = ({ isOpen, onClose, newTask, setNewTask, handleAddTask }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-neu w-96">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar Tarea</h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Título"
            value={newTask.titulo}
            onChange={(e) => setNewTask((prev) => ({ ...prev, titulo: e.target.value }))}
            className="p-2 rounded-md shadow-inner border"
          />
          <textarea
            placeholder="Descripción"
            value={newTask.descripcion}
            onChange={(e) => setNewTask((prev) => ({ ...prev, descripcion: e.target.value }))}
            className="p-2 rounded-md shadow-inner border"
          />
          <label className="block mb-4 text-sm font-medium text-gray-700">
            Fecha Estimada de Fin
            <input
              type="date"
              value={newTask.fecha_estimada_fin}
              onChange={(e) => setNewTask((prev) => ({ ...prev, fecha_estimada_fin: e.target.value }))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
          <select
            value={newTask.prioridad}
            onChange={(e) => setNewTask((prev) => ({ ...prev, prioridad: e.target.value }))}
            className="p-2 rounded-md shadow-inner border"
          >
            <option value="" disabled>Selecciona Prioridad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          <div className="flex gap-4 justify-end">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md shadow hover:shadow-lg transition"
              onClick={onClose}
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
  );
};

export default Modal;