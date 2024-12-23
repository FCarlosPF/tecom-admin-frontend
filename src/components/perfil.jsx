"use client";

import React, { useState } from "react";
import useStore from "@/store/index";
import { changePasswordService } from "@/services/service";

const PerfilView = () => {
  const { usuarioLogeado } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getInitials = (nombre, apellidos) => {
    const nombreInicial = nombre ? nombre.charAt(0).toUpperCase() : "";
    const apellidoInicial = apellidos ? apellidos.charAt(0).toUpperCase() : "";
    return `${nombreInicial}${apellidoInicial}`;
  };

  const handleChangePassword = async () => {
    try {
      await changePasswordService(oldPassword, newPassword);
      setSuccess("Contraseña cambiada exitosamente");
      setError("");
      setIsModalOpen(false);
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
            {getInitials(usuarioLogeado.nombre, usuarioLogeado.apellidos)}
          </div>
          {/* Información del Usuario */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-100">
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
          <Detail label="Área" value={usuarioLogeado.area?.nombre} />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Cambiar Contraseña
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Cambiar Contraseña</h3>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}
              <input
                type="password"
                placeholder="Contraseña Antigua"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="password"
                placeholder="Contraseña Nueva"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangePassword}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                  Cambiar
                </button>
              </div>
            </div>
          </div>
        )}
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