import React from "react";

const RenderEstado = ({ estado }) => {
  const colores = {
    Pendiente: "bg-yellow-500",
    "En Progreso": "bg-blue-500",
    Programada: "bg-gray-500",
    Completada: "bg-green-500",
  };

  return (
    <div className={`w-full h-6 rounded-full shadow-md ${colores[estado]} flex items-center justify-center text-white font-bold`} title={estado}>
      {estado}
    </div>
  );
};

export default RenderEstado;