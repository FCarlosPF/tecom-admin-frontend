"use client";

import React, { useEffect, useState } from "react";
import useStore from "@/store/index";
import {
  getAreas,
  sendEmailService,
  updateEmpleado,
  getOneEmpleado,
} from "@/services/service";
import { getInitials } from "@/utils/funciones";

const PerfilView = () => {
  const { usuarioLogeado } = useStore();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empleadoData, setEmpleadoData] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    especialidad: "",
    sueldo: "",
    fecha_contratacion: "",
    foto: null, // Añade esta línea
  });
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchEmpleadoData = async () => {
      try {
        const data = await getOneEmpleado(usuarioLogeado.id_empleado);
        setEmpleadoData(data);
        setUpdatedData({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          especialidad: data.especialidad,
          sueldo: data.sueldo,
          fecha_contratacion: data.fecha_contratacion,
        });
      } catch (error) {
        console.error("Error al obtener los datos del empleado:", error);
      }
    };

    fetchEmpleadoData();
    fetchAreas();
  }, [usuarioLogeado.id_empleado]);

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

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateEmpleado(usuarioLogeado.id_empleado, updatedData);
      setSuccess("Datos actualizados correctamente");
      setError("");
      setIsModalOpen(false);
      setEmpleadoData(updatedData); // Actualiza los datos del perfil
    } catch (error) {
      setError("Error al actualizar los datos");
      setSuccess("");
    }
  };

  const fetchAreas = async () => {
    try {
      const areasData = await getAreas();
      setAreas(areasData);
    } catch (error) {
      console.error("Error al obtener las áreas:", error);
    }
  };

  if (!empleadoData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-center text-gray-600">
          Cargando datos del usuario...
        </p>
      </div>
    );
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUpdatedData({
      ...updatedData,
      foto: file,
    });
  };

  return (
    <div className="p-6 bg-gray-100 h-[100%]">
      <div className="bg-gray-900 p-6 rounded-lg max-w-lg mx-auto h-[100%] flex flex-col">
        <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">
          Perfil del Usuario
        </h2>
        <div className="flex flex-col items-center space-y-6 mb-8">
          {/* Iniciales del Usuario */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg flex items-center justify-center text-white text-3xl font-bold">
            {getInitials(empleadoData.first_name, empleadoData.last_name)}
          </div>
          {/* Información del Usuario */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-100">
              {empleadoData.first_name} {empleadoData.last_name}
            </h3>
          </div>
        </div>
        {/* Detalles del Usuario */}
        <div className="space-y-5">
          <Detail label="Correo" value={empleadoData.email} />
          <Detail label="Especialidad" value={empleadoData.especialidad} />
          <Detail
            label="Fecha de Contratación"
            value={empleadoData.fecha_contratacion}
          />
          <Detail label="Área" value={empleadoData.area_nombre} />
        </div>
        <div className="mt-auto">
          <button
            onClick={handleEdit}
            className="mt-4 w-full bg-green-600 text-white p-3 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Editar Datos
          </button>
          <button
            onClick={enviarCorreo}
            className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>

      {/* Modal para editar datos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full md:w-1/2 lg:w-1/3">
            <h3 className="text-2xl font-semibold mb-4">Editar Datos</h3>
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="space-y-4">
                <input
                  type="text"
                  name="first_name"
                  value={updatedData.first_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Primer Nombre"
                />
                <input
                  type="text"
                  name="last_name"
                  value={updatedData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Apellido"
                />
                <input
                  type="email"
                  name="email"
                  value={updatedData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Correo"
                />
                <input
                  type="text"
                  name="especialidad"
                  value={updatedData.especialidad}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Especialidad"
                />
                <input
                  type="file"
                  name="profile_picture"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-600 text-white p-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
