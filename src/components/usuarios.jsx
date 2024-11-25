"use client";

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getAllEmployees } from '@/services/service';
import useStore from '@/store';

const UsuariosView = () => {
  const { empleados, setEmpleados } = useStore();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getAllEmployees();
        setEmpleados(data);
        console.log('Usuarios:', data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, [setEmpleados]);

  // Función para editar usuario
  const editarUsuario = (id) => {
    alert(`Editar usuario con ID: ${id}`);
  };

  // Función para eliminar usuario
  const eliminarUsuario = (id) => {
    const confirmacion = confirm(
      '¿Estás seguro de que deseas eliminar este usuario?'
    );
    if (confirmacion) {
      setEmpleados((prev) => prev.filter((usuario) => usuario.id_empleado !== id));
    }
  };

  return (
    <div className="p-4 bg-white shadow-neu rounded-md">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      <table className="table-auto w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Nombre</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Correo</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Rol</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Estado</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((usuario) => (
            <tr key={usuario.id_empleado} className="hover:bg-gray-50 transition">
              <td className="px-4 py-2 border text-sm text-gray-700">{usuario.nombre}</td>
              <td className="px-4 py-2 border text-sm text-gray-700">{usuario.correo}</td>
              <td className="px-4 py-2 border text-sm text-gray-700">{usuario.rol}</td>
              <td className="px-4 py-2 border text-sm text-gray-700">{usuario.estado}</td>
              <td className="px-4 py-2 border text-sm text-gray-700">
                <div className="flex gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => editarUsuario(usuario.id_empleado)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => eliminarUsuario(usuario.id_empleado)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosView;
