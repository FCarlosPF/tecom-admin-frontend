import { capitalizeFirstLetter, capitalizeWords } from "@/utils/funciones";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const EmpleadosTable = ({ empleados, onEdit, onDelete }) => {

  return (
    <table className="w-full rounded-lg">
      <thead className="bg-gray-800">
        <tr>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Nombre
          </th>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Apellidos
          </th>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Correo
          </th>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Especialidad
          </th>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Sueldo
          </th>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Estado
          </th>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Fecha de contratación
          </th>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Área
          </th>
          <th className="px-4 py-3 text-left text-sm text-white font-bold">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(empleados) &&
          empleados.map((usuario) => (
            <tr
              key={usuario.id_empleado}
              className="hover:bg-gray-700 transition"
            >
              <td className="px-4 py-3 text-sm text-gray-100">
                {capitalizeFirstLetter(usuario.first_name)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {capitalizeWords(usuario.last_name)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {usuario.email}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {usuario.especialidad}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {usuario.sueldo}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-5 rounded-full text-white ${
                      usuario.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <strong>{usuario.is_active ? "Activo" : "Inactivo"}</strong>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                {usuario.fecha_contratacion}
              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
              {usuario.area_nombre}

              </td>
              <td className="px-4 py-3 text-sm text-gray-100">
                <div className="flex gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition"
                    onClick={() => onEdit(usuario)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => onDelete(usuario.id_empleado)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default EmpleadosTable;
