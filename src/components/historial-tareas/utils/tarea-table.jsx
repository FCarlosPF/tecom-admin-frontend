import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import RenderPrioridad from "./render-prioridad";
import RenderEstado from "./render-estado";
import { format } from "date-fns";

const TaskTable = ({ tareas, usuarioLogeado, eliminarTarea, editarTarea }) => {
  const headers = [
    "Título",
    "Descripción",
    "Prioridad",
    "Estado",
    "Fecha Inicio",
    "Fecha Estimada Fin",
    "Fecha Fin",
  ];

  if (usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) {
    headers.push("Acciones");
  }

  const formatDate = (date) => {
    try {
      return format(new Date(date), "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Invalid date:", date);
      return "Fecha inválida";
    }
  };

  return (
    <table className="w-full rounded-lg">
      <thead className="bg-gray-200">
        <tr>
          {headers.map((header) => (
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
        {tareas.map((task) => {
          const tarea = usuarioLogeado.rol === 2 ? task.tarea : task;
          return (
            <tr key={tarea.tarea_id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-sm text-gray-700">{tarea.titulo}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{tarea.descripcion}</td>
              <td className="px-4 py-3 text-sm text-gray-700 flex justify-center">
                <RenderPrioridad prioridad={tarea.prioridad} />
              </td>
              <td className="px-4 py-3 text-sm">
                <RenderEstado estado={tarea.estado} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {tarea.fecha_inicio ? formatDate(tarea.fecha_inicio) : "Fecha inválida"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {tarea.fecha_estimada_fin ? formatDate(tarea.fecha_estimada_fin) : "Fecha inválida"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {tarea.fecha_real_fin ? formatDate(tarea.fecha_real_fin) : ""}
              </td>
              {(usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) && (
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition"
                      onClick={() => editarTarea(tarea)}
                    >
                      <FaEdit />
                    </button>
                    {usuarioLogeado.rol === 1 && (
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => eliminarTarea(tarea.tarea_id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TaskTable;