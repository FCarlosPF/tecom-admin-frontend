import React, { useEffect, useState } from 'react';
import useStore from '@/store';
import { getNotificacionesPorEmpleado } from '@/services/service';

const CampanaModal = ({ isOpen, onClose }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const { usuarioLogeado } = useStore();

  useEffect(() => {
    if (isOpen) {
      const fetchNotificaciones = async () => {
        try {
          const data = await getNotificacionesPorEmpleado(usuarioLogeado.id_empleado);
          setNotificaciones(data);
        } catch (error) {
          console.error("Error al obtener las notificaciones:", error);
        }
      };

      fetchNotificaciones();
    }
  }, [isOpen, usuarioLogeado?.id_empleado]);

  if (!isOpen) return null;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-end" onClick={handleBackgroundClick}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 h-full overflow-y-auto relative">
        <button className="absolute top-0 right-0 m-4 text-3xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
        <div className="space-y-4">
          {notificaciones.map((notificacion) => (
            <div key={notificacion.id_notificacion} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{notificacion.titulo_notificacion}</h3>
              <p>{notificacion.descripcion_notificacion}</p>
              <p className="text-sm text-gray-500">{new Date(notificacion.fecha_evento).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampanaModal;