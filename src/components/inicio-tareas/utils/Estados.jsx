import React from 'react';
import { FaClock, FaTag, FaArrowRight, FaCheck, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { format } from 'date-fns';

const Estados = ({
  estados,
  tareasPorEstado,
  usuarioLogeado,
  tareas,
  handleCardClick,
  completarTarea,
  toggleExpand,
  expandedTareas
}) => {
  return (
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
                  usuarioLogeado && usuarioLogeado?.rol?.id == 1
                    ? !tarea.tarea_padre
                    : !tarea.tarea.tarea_padre
                )
                .map((tarea) => {
                  const subtareas = tareas.filter((subtarea) => {
                    return usuarioLogeado && usuarioLogeado?.rol?.id === 1
                      ? subtarea.tarea_padre === tarea.tarea_id
                      : subtarea.tarea.tarea_padre === tarea.tarea.tarea_id;
                  });
                  const tareaData =
                    usuarioLogeado && usuarioLogeado?.rol?.id === 1
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
                          usuarioLogeado?.rol?.id === 1
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
                                  usuarioLogeado && usuarioLogeado?.rol?.id == 1
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
                                  usuarioLogeado?.rol?.id === 1
                                    ? tarea.tarea_id
                                    : tarea.tarea.tarea_id
                                );
                              }}
                            >
                              {expandedTareas[
                                usuarioLogeado?.rol?.id === 1
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
                        usuarioLogeado && usuarioLogeado?.rol?.id === 1
                          ? tarea.tarea_id
                          : tarea.tarea.tarea_id
                      ] && (
                        <div className="pl-4 mt-2">
                          {subtareas.map((subtarea) => {
                            const subtareaData =
                              usuarioLogeado?.rol?.id === 1
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
                                        {subtareaData.estado === "Pendiente" ? (
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
  );
};

export default Estados;