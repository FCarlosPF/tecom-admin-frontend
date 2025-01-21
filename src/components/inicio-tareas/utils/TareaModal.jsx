import React, { useEffect, useState } from 'react';
import { FaClock, FaTag, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { getObservacionTarea, agregarObservacion } from '@/services/service';
import useStore from '@/store';

const TareaModal = ({ selectedTarea, asignadorNombres, empleadoNombres, closeModal, handleOutsideClick}) => {
  const [observaciones, setObservaciones] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newObservacion, setNewObservacion] = useState('');
  const { usuarioLogeado } = useStore();

  useEffect(() => {
    if (selectedTarea) {
      getObservacionTarea(selectedTarea.tarea_id)
        .then(data => setObservaciones(data))
        .catch(error => console.error('Error al obtener las observaciones:', error));
    }
  }, [selectedTarea]);

  const handleAddObservacion = async () => {
    try {
      const nuevaObservacion = await agregarObservacion(usuarioLogeado.id_empleado, newObservacion, selectedTarea.tarea_id);
      setObservaciones([...observaciones, nuevaObservacion]);
      setNewObservacion('');
      setShowInput(false);
    } catch (error) {
      console.error('Error al agregar la observación:', error);
    }
  };

  return (
    selectedTarea && (
      <div
        id="modal-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start"
        onClick={handleOutsideClick}
      >
        <div
          className="w-[25%] md:w-[30%] lg:w-[25%] h-full bg-white shadow-2xl rounded-l-lg p-6 relative z-50 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-3xl"
            onClick={closeModal}
          >
            &times;
          </button>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {selectedTarea.titulo}
          </h2>
          <p className="text-gray-600 mb-6 text-base leading-relaxed">
            {selectedTarea.descripcion}
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-base text-gray-600">
              <FaClock className="mr-2 text-blue-500" />
              <span className="font-medium">Fecha de inicio:</span>{" "}
              <span className="ml-1">
                {format(
                  new Date(selectedTarea.fecha_inicio),
                  "dd/MM/yyyy HH:mm"
                )}
              </span>
            </div>
            <div className="flex items-center text-base text-gray-600">
              <FaClock className="mr-2 text-blue-500" />
              <span className="font-medium">Fecha estimada de fin:</span>{" "}
              <span className="ml-1">
                {format(
                  new Date(selectedTarea.fecha_estimada_fin),
                  "dd/MM/yyyy HH:mm"
                )}
              </span>
            </div>
            {selectedTarea.fecha_real_fin && (
              <div className="flex items-center text-base text-gray-600">
                <FaClock className="mr-2 text-green-500" />
                <span className="font-medium">Fecha real de fin:</span>{" "}
                <span className="ml-1">
                  {format(
                    new Date(selectedTarea.fecha_real_fin),
                    "dd/MM/yyyy HH:mm"
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center text-base text-gray-600">
              <FaTag className="mr-2 text-yellow-500" />
              <span className="font-medium">Prioridad:</span>{" "}
              <span className="ml-1">{selectedTarea.prioridad}</span>
            </div>
            <div className="flex items-center text-base text-gray-600">
              <FaUser className="mr-2 text-purple-500" />
              <span className="font-medium">Asignador:</span>{" "}
              <span className="ml-1">{asignadorNombres}</span>
            </div>
            <div className="flex items-center text-base text-gray-600">
              <FaUser className="mr-2 text-purple-500" />
              <span className="font-medium">Empleado:</span>{" "}
              <span className="ml-1">{empleadoNombres}</span>
            </div>
            <div className="flex items-center text-base text-gray-600">
              <FaClock className="mr-2 text-teal-500" />
              <span className="font-medium">Tiempo restante:</span>{" "}
              <span className="ml-1">
                {selectedTarea.tiempo_restante.dias} días,{" "}
                {selectedTarea.tiempo_restante.horas} horas,{" "}
                {selectedTarea.tiempo_restante.minutos} minutos
              </span>
            </div>
            <div className="flex items-center text-base text-gray-600">
              <FaClock className="mr-2 text-red-500" />
              <span className="font-medium">Tiempo pasado:</span>{" "}
              <span className="ml-1">
                {selectedTarea.tiempo_pasado.dias} días,{" "}
                {selectedTarea.tiempo_pasado.horas} horas,{" "}
                {selectedTarea.tiempo_pasado.minutos} minutos
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Observaciones</h3>
              {observaciones.length > 0 ? (
                observaciones.map((obs) => (
                  <div key={obs.observacion_id} className="mb-4 p-4 border rounded-lg">
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Observación:</span> {obs.observacion}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Empleado:</span> {obs.empleado.first_name} {obs.empleado.last_name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Fecha:</span> {format(new Date(obs.fecha), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No hay observaciones para esta tarea.</p>
              )}
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => setShowInput(true)}
              >
                Agregar Observación
              </button>
              {showInput && (
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newObservacion}
                    onChange={(e) => setNewObservacion(e.target.value)}
                    placeholder="Escribe tu observación"
                  />
                  <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    onClick={handleAddObservacion}
                  >
                    Guardar Observación
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default TareaModal;