import React from "react";

const RenderPrioridad = ({ prioridad }) => {
  const colores = {
    Alta: "bg-red-500",
    Media: "bg-yellow-500",
    Baja: "bg-green-500",
  };

  return (
    <div className={`w-6 h-6 rounded-full shadow-md ${colores[prioridad]} flex items-center justify-center text-white font-bold`} title={prioridad} />
  );
};

export default RenderPrioridad;