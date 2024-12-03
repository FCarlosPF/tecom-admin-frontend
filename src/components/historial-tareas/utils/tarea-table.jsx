import React from "react";
import { FaTrash } from "react-icons/fa";
import RenderPrioridad from "./render-prioridad";
import RenderEstado from "./render-estado";
import { format } from "date-fns";

const TaskTable = ({ tareas, usuarioLogeado, eliminarTarea }) => {
  const headers = [
    "Título",
    "Descripción",
    "Prioridad",
    "Estado",
    "Fecha Inicio",
    "Fecha Estimada Fin",
    "Fecha Fin",
  ];

  if (usuarioLogeado.rol === 1) {
    headers.push("Acciones");
  }

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
        {Array.isArray(tareas) &&
          tareas.map((tarea) => (
            <tr
              key={
                usuarioLogeado.rol === 1 ? tarea.tarea_id : tarea.tarea.tarea_id
              }
              className="hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 text-sm text-gray-700">
                {usuarioLogeado.rol === 1 ? tarea.titulo : tarea.tarea.titulo}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {usuarioLogeado.rol === 1
                  ? tarea.descripcion
                  : tarea.tarea.descripcion}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 flex justify-center">
                <RenderPrioridad
                  prioridad={
                    usuarioLogeado.rol === 1
                      ? tarea.prioridad
                      : tarea.tarea.prioridad
                  }
                />
              </td>
              <td className="px-4 py-3 text-sm">
                <RenderEstado
                  estado={
                    usuarioLogeado.rol === 1 ? tarea.estado : tarea.tarea.estado
                  }
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {usuarioLogeado.rol === 1
                  ? format(new Date(tarea.fecha_inicio), "dd/MM/yyyy HH:mm")
                  : format(
                      new Date(tarea.tarea.fecha_inicio),
                      "dd/MM/yyyy HH:mm"
                    )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {usuarioLogeado.rol === 1
                  ? format(
                      new Date(tarea.fecha_estimada_fin),
                      "dd/MM/yyyy HH:mm"
                    )
                  : format(
                      new Date(tarea.tarea.fecha_estimada_fin),
                      "dd/MM/yyyy HH:mm"
                    )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {usuarioLogeado.rol === 1
                  ? tarea.fecha_real_fin
                    ? format(new Date(tarea.fecha_real_fin), "dd/MM/yyyy HH:mm")
                    : ""
                  : tarea.tarea.fecha_real_fin
                  ? format(
                      new Date(tarea.tarea.fecha_real_fin),
                      "dd/MM/yyyy HH:mm"
                    )
                  : ""}
              </td>
              {usuarioLogeado.rol === 1 && (
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex justify-center">
                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() =>
                        eliminarTarea(
                          usuarioLogeado.rol === 1
                            ? tarea.tarea_id
                            : tarea.tarea.tarea_id
                        )
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
