import React from "react";

const RenderPrioridad = ({ prioridad }) => {
  const colores = {
    Alta: "bg-red-400",
    Media: "bg-yellow-300",
    Baja: "bg-green-400",
  };

  return (
    <div className={`w-6 h-6 rounded-full ${colores[prioridad]} flex items-center justify-center text-white font-bold`} title={prioridad} />
  );
};

export default RenderPrioridad;