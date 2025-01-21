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

  if (
    usuarioLogeado &&
    (usuarioLogeado?.rol?.id === 1 || usuarioLogeado?.rol?.id === 2)
  ) {
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
      <thead className="bg-gray-800">
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="px-4 py-3 text-left text-sm text-white font-bold"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tareas.map((task) => {
          const tarea = usuarioLogeado && usuarioLogeado?.rol?.id === 1 ? task : task.tarea;
          return (
            <tr key={tarea.tarea_id} className="hover:bg-gray-700 transition">
              <td className="px-4 py-3 text-sm text-gray-100">
                {tarea.titulo}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {tarea.descripcion}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100 flex justify-center">
                <RenderPrioridad prioridad={tarea.prioridad} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                <RenderEstado estado={tarea.estado} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {tarea.fecha_inicio
                  ? formatDate(tarea.fecha_inicio)
                  : "Fecha inválida"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {tarea.fecha_estimada_fin
                  ? formatDate(tarea.fecha_estimada_fin)
                  : "Fecha inválida"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {tarea.fecha_real_fin ? formatDate(tarea.fecha_real_fin) : ""}
              </td>
              {usuarioLogeado && (usuarioLogeado?.rol?.id === 1 || usuarioLogeado?.rol?.id === 2) && (
                <td className="px-4 py-3 text-sm text-gray-100">
                  <div className="flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition"
                      onClick={() => editarTarea(tarea)}
                    >
                      <FaEdit />
                    </button>
                    {usuarioLogeado?.rol?.id === 1 && (
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
