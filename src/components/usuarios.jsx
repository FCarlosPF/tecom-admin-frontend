"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import {
  getAllEmployees,
  addEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "@/services/service";
import useStore from "@/store";

const UsuariosView = () => {
  const { empleados, setEmpleados, usuarioLogeado, setUsuarioLogeado } =
    useStore();
  const [showModal, setShowModal] = useState(false);

  const [newEmpleado, setNewEmpleado] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    especialidad: "",
    sueldo: "",
    activo: true,
    fecha_contratacion: "",
  });
  const [editEmpleado, setEditEmpleado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const fetchEmpleados = async () => {
    if (!usuarioLogeado) {
      console.error("usuarioLogeado no está definido");
      setLoading(false);
      return;
    }

    if (usuarioLogeado.id_empleado === null) {
      console.log("id_empleado es null, no se ejecuta fetchEmpleados");
      setLoading(false);
      return;
    }

    try {
      console.log(
        "Estado de usuarioLogeado al iniciar fetchEmpleados:",
        usuarioLogeado
      );
      let data;
      if (usuarioLogeado.rol === 1) {
        console.log("Usuario con rol 1, obteniendo todas las tareas");
        data = await getAllEmployees();
        setEmpleados(data);
      } else {
        if (!usuarioLogeado.id_empleado) {
          console.error("id_empleado no está definido en usuarioLogeado");
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Error al obtener las tareas:", error.message, error.stack);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
    console.log("Cargando usuarioLogeado desde localStorage:", usuarioLogeado);
    if (usuarioLogeado) {
      setUsuarioLogeado(usuarioLogeado);
    }
  }, [setUsuarioLogeado]);

  useEffect(() => {
    if (usuarioLogeado) {
      fetchEmpleados();
    } else {
      console.log("usuarioLogeado no está definido, no se ejecuta fetchTareas");
    }
  }, [usuarioLogeado, setEmpleados]);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleDelete = async (id) => {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (confirmacion) {
      try {
        await deleteEmpleado(id);
        setEmpleados((prevEmpleados) =>
          prevEmpleados.filter((empleado) => empleado.id_empleado !== id)
        );
        setMessage("Empleado eliminado exitosamente");
        const empleaditos = await getAllEmployees();
        setEmpleados(empleaditos);
      } catch (error) {
        console.error("Error al eliminar el empleado:", error);
        setMessage("Error al eliminar el empleado");
      }
    }
  };
  const handleAddEmpleado = async () => {
    try {
      console.log("Nuevo Empleado:", newEmpleado); // Verificar el estado de newEmpleado
      const addedEmpleado = await addEmpleado(newEmpleado);
      setEmpleados((prevEmpleados) => [...prevEmpleados, addedEmpleado]);
      setShowModal(false);
      setNewEmpleado({
        nombre: "",
        apellidos: "",
        correo: "",
        especialidad: "",
        sueldo: "",
        activo: true,
        fecha_contratacion: "",
      });
      setMessage("Empleado agregado exitosamente");
      console.log(empleados);
    } catch (error) {
      console.error("Error al agregar el empleado:", error);
      setMessage("Error al agregar el empleado");
    }
  };

  const handleEditEmpleado = async () => {
    try {
      await updateEmpleado(editEmpleado.id_empleado, editEmpleado);

      // Update the specific employee in the state without changing its position
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((empleado) =>
          empleado.id_empleado === editEmpleado.id_empleado
            ? editEmpleado
            : empleado
        )
      );
      const empleaditos = await getAllEmployees();
      setEmpleados(empleaditos);
      setShowModal(false);
      setEditEmpleado(null);
      setIsEditing(false);
      setMessage("Empleado actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el empleado:", error);
      setMessage("Error al actualizar el empleado");
    }
  };

  const openEditModal = (empleado) => {
    setEditEmpleado(empleado);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Gestión de Empleados
      </h2>

      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center hover:bg-green-700 transition"
        onClick={() => {
          setNewEmpleado({
            nombre: "",
            apellidos: "",
            correo: "",
            especialidad: "",
            sueldo: "",
            activo: true,
            fecha_contratacion: "",
          });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        <FaPlus className="mr-3" />
        Agregar Empleado
      </button>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
          {message}
        </div>
      )}
      {usuarioLogeado &&
      (usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) ? (
        <table className="table-auto w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
                Nombre
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
                Apellidos
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
                Correo
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
                Especialidad
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
                Sueldo
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
                Estado
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
                Fecha de contratación
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(empleados) &&
              empleados.map((usuario) => (
                <tr
                  key={usuario.id_empleado}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {usuario.nombre}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {usuario.apellidos}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {usuario.correo}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {usuario.especialidad}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {usuario.sueldo}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-5 rounded-full text-white ${
                          usuario.activo ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        <strong>
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </strong>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {usuario.fecha_contratacion}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    <div className="flex gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition"
                        onClick={() => openEditModal(usuario)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        onClick={() => handleDelete(usuario.id_empleado)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div>No tienes permiso para ver esta información</div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-3/4 md:w-1/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {isEditing ? "Editar Empleado" : "Agregar Nuevo Empleado"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {[
              {
                label: "Nombre",
                value: isEditing ? editEmpleado.nombre : newEmpleado.nombre,
                key: "nombre",
              },
              {
                label: "Apellidos",
                value: isEditing
                  ? editEmpleado.apellidos
                  : newEmpleado.apellidos,
                key: "apellidos",
              },
              {
                label: "Correo",
                value: isEditing ? editEmpleado.correo : newEmpleado.correo,
                key: "correo",
                type: "email",
              },
              {
                label: "Especialidad",
                value: isEditing
                  ? editEmpleado.especialidad
                  : newEmpleado.especialidad,
                key: "especialidad",
              },
              {
                label: "Sueldo",
                value: isEditing ? editEmpleado.sueldo : newEmpleado.sueldo,
                key: "sueldo",
                type: "number",
              },
              {
                label: "Fecha de contratación",
                value: isEditing
                  ? editEmpleado.fecha_contratacion
                  : newEmpleado.fecha_contratacion,
                key: "fecha_contratacion",
                type: "date",
              },
            ].map(({ label, value, key, type = "text" }) => (
              <div className="mb-6" key={key}>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value}
                  onChange={(e) => {
                    const updatedEmpleado = isEditing
                      ? { ...editEmpleado, [key]: e.target.value }
                      : { ...newEmpleado, [key]: e.target.value };
                    isEditing
                      ? setEditEmpleado(updatedEmpleado)
                      : setNewEmpleado(updatedEmpleado);
                  }}
                />
              </div>
            ))}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Estado
              </label>
              <select
                className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isEditing ? editEmpleado.activo : newEmpleado.activo}
                onChange={(e) => {
                  const updatedEmpleado = isEditing
                    ? { ...editEmpleado, activo: e.target.value === "true" }
                    : { ...newEmpleado, activo: e.target.value === "true" };
                  isEditing
                    ? setEditEmpleado(updatedEmpleado)
                    : setNewEmpleado(updatedEmpleado);
                }}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-3 hover:bg-blue-700 transition"
                onClick={isEditing ? handleEditEmpleado : handleAddEmpleado}
              >
                {isEditing ? "Actualizar" : "Agregar"}
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosView;
