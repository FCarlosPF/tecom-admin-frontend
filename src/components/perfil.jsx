"use client";

import React, { useEffect } from "react";
import useStore from "@/store/index";

const PerfilView = () => {
  const { usuarioLogeado } = useStore();



  const getInitials = (nombre, apellidos) => {
    const nombreInicial = nombre ? nombre.charAt(0).toUpperCase() : "";
    const apellidoInicial = apellidos ? apellidos.charAt(0).toUpperCase() : "";
    return `${nombreInicial}${apellidoInicial}`;
  };

  if (!usuarioLogeado) {
    return (
      <div className="p-6 rounded-lg bg-primary shadow-md max-w-md mx-auto min-h-[90vh] flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Perfil
        </h2>
        <p className="text-center text-gray-600">No hay usuario logeado.</p>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-xl bg-white shadow-lg max-w-lg mx-auto min-h-[90vh] flex flex-col justify-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Perfil del Usuario
      </h2>
      <div className="flex flex-col items-center space-y-6 mb-8">
        {/* Iniciales del Usuario */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg flex items-center justify-center text-white text-3xl font-bold">
          {getInitials(usuarioLogeado.nombre, usuarioLogeado.apellidos)}
        </div>
        {/* Información del Usuario */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">
            {usuarioLogeado.nombre} {usuarioLogeado.apellidos}
          </h3>
        </div>
      </div>
      {/* Detalles del Usuario */}
      <div className="space-y-5">
        <Detail label="Correo" value={usuarioLogeado.correo} />
        <Detail label="Especialidad" value={usuarioLogeado.especialidad} />
        <Detail label="Sueldo" value={usuarioLogeado.sueldo} />
        <Detail
          label="Fecha de Contratación"
          value={usuarioLogeado.fecha_contratacion}
        />
        <Detail label="Área" value={usuarioLogeado.area} />
      </div>
    </div>
  );
};

// Componente reutilizable para mostrar detalles
const Detail = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800 font-semibold">
      {value || "No disponible"}
    </span>
  </div>
);

export default PerfilView;