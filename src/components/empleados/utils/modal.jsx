import React from "react";
import { FaTimes } from "react-icons/fa";

const EmpleadoModal = ({
  isEditing,
  empleado,
  setEmpleado,
  onClose,
  onSave,
}) => {
  const handleChange = (key, value) => {
    setEmpleado((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start"
      onClick={onClose}
    >
      <div
        className="bg-gray-200 p-6 rounded-r-lg shadow-2xl w-full md:w-1/3 lg:w-1/4 h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Editar Empleado" : "Agregar Nuevo Empleado"}
          </h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        {[
          { label: "Nombre", key: "nombre" },
          { label: "Apellidos", key: "apellidos" },
          { label: "Correo", key: "correo", type: "email" },
          { label: "Especialidad", key: "especialidad" },
          { label: "Sueldo", key: "sueldo", type: "number" },
          { label: "Fecha de contratación", key: "fecha_contratacion", type: "date" },
        ].map(({ label, key, type = "text" }) => (
          <div className="mb-4" key={key}>
            <label className="block text-gray-700">{label}</label>
            <input
              type={type}
              className="w-full p-2 border rounded shadow-inner"
              value={empleado[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-gray-700">Estado</label>
          <select
            className="w-full p-2 border rounded shadow-inner"
            value={empleado.activo}
            onChange={(e) => handleChange("activo", e.target.value === "true")}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md shadow-lg hover:shadow-xl transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-lg hover:shadow-xl transition"
            onClick={onSave}
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoModal;