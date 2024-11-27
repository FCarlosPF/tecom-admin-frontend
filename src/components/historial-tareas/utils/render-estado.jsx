import React from "react";

const RenderEstado = ({ estado }) => {
  const colores = {
    Pendiente: "bg-yellow-400",
    "En Progreso": "bg-blue-400",
    Programada: "bg-gray-400",
    Completada: "bg-green-400",
  };

  return (
    <div className={`w-full h-6 rounded-full ${colores[estado]} flex items-center justify-center text-white font-bold`} title={estado}>
      {estado}
    </div>
  );
};

export default RenderEstado;