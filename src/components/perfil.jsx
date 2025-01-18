"use client";

import React, { useState } from "react";
import useStore from "@/store/index";
import { sendEmailService } from "@/services/service";
import { getInitials } from "@/utils/funciones";

const PerfilView = () => {
  const { usuarioLogeado } = useStore();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  const enviarCorreo = async () => {
    try {
      await sendEmailService(usuarioLogeado.email);
      setSuccess("Correo enviado correctamente");
      setError("");
    } catch (error) {
      setError("Error al cambiar la contraseña");
      setSuccess("");
    }
  };

  if (!usuarioLogeado) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-center text-gray-600">No hay usuario logeado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 h-[100%]">
      <div className="bg-gray-900 p-6 rounded-lg max-w-lg mx-auto h-[100%]">
        <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">
          Perfil del Usuario
        </h2>
        <div className="flex flex-col items-center space-y-6 mb-8">
          {/* Iniciales del Usuario */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg flex items-center justify-center text-white text-3xl font-bold">
            {getInitials(usuarioLogeado.first_name, usuarioLogeado.last_name)}
          </div>
          {/* Información del Usuario */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-100">
              {usuarioLogeado.first_name} {usuarioLogeado.last_name}
            </h3>
          </div>
        </div>
        {/* Detalles del Usuario */}
        <div className="space-y-5">
          <Detail label="Correo" value={usuarioLogeado.email} />
          <Detail label="Especialidad" value={usuarioLogeado.especialidad} />
          <Detail label="Sueldo" value={usuarioLogeado.sueldo} />
          <Detail
            label="Fecha de Contratación"
            value={usuarioLogeado.fecha_contratacion}
          />
          <Detail label="Área" value={usuarioLogeado.area?.nombre} />
        </div>
        <button
          onClick={enviarCorreo}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Cambiar Contraseña
        </button>
      </div>
    </div>
  );
};

// Componente reutilizable para mostrar detalles
const Detail = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="text-gray-100 font-semibold">
      {value || "No disponible"}
    </span>
  </div>
);

export default PerfilView;