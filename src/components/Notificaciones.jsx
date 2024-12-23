"use client";

import {
  getNotificaciones,
  addNotificacion,
  updateNotificacion,
  deleteNotificacion,
  enviarNotificacion,
  getAreas,
  getRoles,
  getAllEmployees,
} from "@/services/service";
import useStore from "@/store";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const Notificaciones = () => {
  const { notificaciones, setNotificaciones } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newNotificacion, setNewNotificacion] = useState({
    titulo: "",
    descripcion: "",
    fecha_evento: "",
    tipo: "",
    estado: "Activa",
    para: "Personalizado",
  });
  const [editNotificacion, setEditNotificacion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [areas, setAreas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedPara, setSelectedPara] = useState("Personalizado");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notificacionesData = await getNotificaciones();
        console.log("Fetched notificaciones", notificacionesData);
        if (Array.isArray(notificacionesData))
          setNotificaciones(notificacionesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchParaData = async () => {
      try {
        if (selectedPara === "Área") {
          const areasData = await getAreas();
          setAreas(areasData);
        } else if (selectedPara === "Rol") {
          const rolesData = await getRoles();
          setRoles(rolesData);
        } else if (selectedPara === "Empleado") {
          const empleadosData = await getAllEmployees();
          setEmpleados(empleadosData);
        }
      } catch (error) {
        console.error("Error fetching para data:", error);
      }
    };
    fetchParaData();
  }, [selectedPara]);

  const handleDelete = async (id) => {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas eliminar esta notificación?"
    );
    if (confirmacion) {
      try {
        await deleteNotificacion(id);
        const updatedNotificaciones = await getNotificaciones();
        if (Array.isArray(updatedNotificaciones))
          setNotificaciones(updatedNotificaciones);
        setMessage("Notificación eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar la notificación:", error);
        setMessage("Error al eliminar la notificación");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      let notificacion = isEditing ? editNotificacion : newNotificacion;
      const response = await (isEditing
        ? updateNotificacion(notificacion.id_notificacion, notificacion)
        : addNotificacion(notificacion));

      console.log("Respuesta del servidor:", response); // Agregar console.log

      if (response.id_notificacion) {
        notificacion = response; // Actualiza notificacion con la respuesta del servidor
        const updatedNotificaciones = await getNotificaciones();
        if (Array.isArray(updatedNotificaciones))
          setNotificaciones(updatedNotificaciones);

        if (!isEditing) {
          const notificacionData =
            selectedPara === "Todos"
              ? {}
              : {
                  area_id: selectedPara === "Área" ? selectedIds : null,
                  rol_id: selectedPara === "Rol" ? selectedIds : null,
                  empleados_ids: selectedPara === "Empleado" ? selectedIds : [],
                };

          console.log("Notificación Data:", notificacionData); // Agregar console.log

          try {
            // Asegúrate de que notificacion.id_notificacion esté definido
            if (notificacion.id_notificacion) {
              console.log(
                "Enviando notificación con ID:",
                notificacion.id_notificacion
              ); // Agregar console.log
              const enviarResponse = await enviarNotificacion(
                notificacion.id_notificacion,
                notificacionData
              );
              console.log("Respuesta de enviarNotificacion:", enviarResponse); // Agregar console.log
            } else {
              console.error("ID de notificación no definido"); // Agregar console.error
            }
          } catch (enviarError) {
            console.error("Error al enviar la notificación:", enviarError); // Agregar console.error
          }
        }

        setShowModal(false);
        setNewNotificacion({
          titulo: "",
          descripcion: "",
          fecha_evento: "",
          tipo: "",
          estado: "Activa",
          para: "Personalizado",
        });
        setEditNotificacion(null);
        setIsEditing(false);
        setMessage(
          isEditing
            ? "Notificación actualizada exitosamente"
            : "Notificación agregada y enviada exitosamente"
        );
      } else {
        console.error("Error en la respuesta del servidor:", response); // Agregar console.error
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al procesar la notificación:", error);
      setMessage("Error al procesar la notificación");
    }
  };

  const openEditModal = (notificacion) => {
    setEditNotificacion(notificacion);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Gestión de Notificaciones
      </h2>

      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center hover:bg-green-700 transition"
        onClick={() => {
          setNewNotificacion({
            titulo: "",
            descripcion: "",
            fecha_evento: "",
            tipo: "",
            estado: "Activa",
            para: "Personalizado",
          });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        <FaPlus className="mr-3" />
        Agregar Notificación
      </button>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
          {message}
        </div>
      )}

      <table className="table-auto w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Título
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Descripción
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Fecha de Evento
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Tipo
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Estado
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Para
            </th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(notificaciones) &&
            notificaciones.map((notificacion) => (
              <tr
                key={notificacion.id_notificacion}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {notificacion.titulo}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {notificacion.descripcion}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {notificacion.fecha_evento}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {notificacion.tipo}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {notificacion.estado}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {notificacion.para}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  <div className="flex gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => openEditModal(notificacion)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => handleDelete(notificacion.id_notificacion)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-3/4 md:w-1/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {isEditing
                  ? "Editar Notificación"
                  : "Agregar Nueva Notificación"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {[
              {
                label: "Título",
                value: isEditing
                  ? editNotificacion.titulo
                  : newNotificacion.titulo,
                key: "titulo",
              },
              {
                label: "Descripción",
                value: isEditing
                  ? editNotificacion.descripcion
                  : newNotificacion.descripcion,
                key: "descripcion",
              },
              {
                label: "Fecha de Evento",
                value: isEditing
                  ? editNotificacion.fecha_evento
                  : newNotificacion.fecha_evento,
                key: "fecha_evento",
                type: "datetime-local",
              },
              {
                label: "Tipo",
                value: isEditing ? editNotificacion.tipo : newNotificacion.tipo,
                key: "tipo",
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
                    const updatedNotificacion = isEditing
                      ? { ...editNotificacion, [key]: e.target.value }
                      : { ...newNotificacion, [key]: e.target.value };
                    isEditing
                      ? setEditNotificacion(updatedNotificacion)
                      : setNewNotificacion(updatedNotificacion);
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
                value={
                  isEditing ? editNotificacion.estado : newNotificacion.estado
                }
                onChange={(e) => {
                  const updatedNotificacion = isEditing
                    ? { ...editNotificacion, estado: e.target.value }
                    : { ...newNotificacion, estado: e.target.value };
                  isEditing
                    ? setEditNotificacion(updatedNotificacion)
                    : setNewNotificacion(updatedNotificacion);
                }}
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Para
              </label>
              <select
                className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isEditing ? editNotificacion.para : newNotificacion.para}
                onChange={(e) => {
                  const updatedNotificacion = isEditing
                    ? { ...editNotificacion, para: e.target.value }
                    : { ...newNotificacion, para: e.target.value };
                  isEditing
                    ? setEditNotificacion(updatedNotificacion)
                    : setNewNotificacion(updatedNotificacion);
                  setSelectedPara(e.target.value);
                }}
              >
                <option value="">Seleccione una Opción</option>
                <option value="Área">Área</option>
                <option value="Rol">Rol</option>
                <option value="Empleado">Empleado</option>
                <option value="Todos">Todos</option>{" "}
                {/* Agregar opción Todos */}
              </select>
            </div>

            {selectedPara === "Área" && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Seleccionar Área
                </label>
                <select
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Selected Area ID:", selectedValue); // Agregar console.log
                    setSelectedIds(selectedValue);
                  }}
                >
                  <option value="">Seleccione un área</option>

                  {areas.map((area) => (
                    <option key={area.area_id} value={area.area_id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedPara === "Rol" && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Seleccionar Rol
                </label>
                <select
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Selected Rol ID:", selectedValue); // Agregar console.log
                    setSelectedIds(selectedValue);
                  }}
                >
                  {roles.map((rol) => (
                    <option key={rol.id_rol} value={rol.id_rol}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedPara === "Empleado" && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Seleccionar Empleados
                </label>
                <select
                  multiple
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setSelectedIds(
                      Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      )
                    )
                  }
                >
                  {empleados.map((empleado) => (
                    <option
                      key={empleado.id_empleado}
                      value={empleado.id_empleado}
                    >
                      {empleado.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-3 hover:bg-blue-700 transition"
                onClick={handleSubmit}
              >
                {isEditing ? "Actualizar" : "Agregar y Enviar"}
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

export default Notificaciones;
