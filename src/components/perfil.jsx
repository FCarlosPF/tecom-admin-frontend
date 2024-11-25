"use client";

import React, { useEffect } from "react";
import useStore from "@/store/index";

const PerfilView = () => {
  const { usuarioLogeado, setUsuarioLogeado } = useStore();

  useEffect(() => {
    // Cargar los datos del usuario desde localStorage si existen
    const storedUser = localStorage.getItem('usuarioLogeado');  
    if (storedUser) {
      setUsuarioLogeado(JSON.parse(storedUser));
    }
  }, [setUsuarioLogeado]);

  if (!usuarioLogeado) {
    return (
      <div className="p-6 rounded-lg bg-primary shadow-neu max-w-md mx-auto min-h-[90vh] flex flex-col justify-center">
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Perfil</h2>
        <p className="text-center text-gray-700">No hay usuario logeado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-primary shadow-neu max-w-md mx-auto min-h-[90vh] flex flex-col justify-center">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Perfil</h2>
      <div className="flex flex-col items-center space-y-4 mb-6">
        {/* Imagen de Perfil */}
        <div className="w-24 h-24 rounded-full bg-gray-300 shadow-neu flex items-center justify-center text-gray-500">
          {usuarioLogeado.foto ? (
            <img src={usuarioLogeado.foto} alt="Perfil" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>
        {/* Información del Usuario */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-700">{usuarioLogeado.nombre} {usuarioLogeado.apellidos}</h3>
        </div>
      </div>
      {/* Detalles del Usuario */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Correo:</span>
          <span className="text-sm text-gray-700 font-medium">
            {usuarioLogeado.correo || "No disponible"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Especialidad:</span>
          <span className="text-sm text-gray-700 font-medium">
            {usuarioLogeado.especialidad || "No disponible"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Sueldo:</span>
          <span className="text-sm text-gray-700 font-medium">
            {usuarioLogeado.sueldo || "No disponible"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Fecha de Contratación:</span>
          <span className="text-sm text-gray-700 font-medium">
            {usuarioLogeado.fecha_contratacion || "No disponible"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Área:</span>
          <span className="text-sm text-gray-700 font-medium">
            {usuarioLogeado.area || "No disponible"}
          </span>
        </div>
      </div>
      {/* Botón de edición */}
      <button className="w-full mt-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 shadow-neu active:shadow-inner transition text-gray-700 font-medium">
        Editar Perfil
      </button>
    </div>
  );
};

export default PerfilView;