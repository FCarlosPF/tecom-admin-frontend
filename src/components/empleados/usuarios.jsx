"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import {
  getAllEmployees,
  addEmpleado,
  updateEmpleado,
  deleteEmpleado,
  getAreas,
} from "@/services/service";
import EmpleadoModal from "./utils/modal";
import EmpleadosTable from "./utils/table";
import useStore from "@/store";

const UsuariosView = () => {
  const { usuarioLogeado } = useStore();
  const [empleados, setEmpleados] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEmpleado, setNewEmpleado] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    especialidad: "",
    sueldo: "",
    activo: true,
    fecha_contratacion: "",
    area: "",
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
        console.log("Usuario con rol 1, obteniendo todos los empleados");
        data = await getAllEmployees();
        setEmpleados(data);
      } else {
        console.log("Usuario con rol diferente a 1, no se obtienen empleados");
      }
    } catch (error) {
      console.error("Error al obtener los empleados:", error.message, error.stack);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (usuarioLogeado) {
      fetchEmpleados();
      fetchAreas();
    } else {
      console.log("usuarioLogeado no está definido, no se ejecuta fetchEmpleados");
    }
  }, [usuarioLogeado]);

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
        area: "",
      });
      setMessage("Empleado agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar el empleado:", error);
      setMessage("Error al agregar el empleado");
    }
  };

  const handleEditEmpleado = async () => {
    try {
      console.log("Empleado Editado:", editEmpleado); // Verificar el estado de editEmpleado
      await updateEmpleado(editEmpleado.id_empleado, editEmpleado);

      // Update the specific employee in the state without changing its position
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((empleado) =>
          empleado.id_empleado === editEmpleado.id_empleado
            ? { ...empleado, ...editEmpleado }
            : empleado
        )
      );
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

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-black">Gestión de Empleados</h2>
        <button
          className="p-2 bg-gray-800 text-white rounded-full shadow-lg flex items-center hover:shadow-xl transition"
          onClick={() => {
            setNewEmpleado({
              nombre: "",
              apellidos: "",
              correo: "",
              especialidad: "",
              sueldo: "",
              activo: true,
              fecha_contratacion: "",
              area: "",
            });
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          <FaPlus />
        </button>
      </div>
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
            {message}
          </div>
        )}
        {usuarioLogeado &&
        (usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) ? (
          <EmpleadosTable
            empleados={empleados}
            onEdit={openEditModal}
            onDelete={handleDelete}
            areas={areas}
          />
        ) : (
          <div className="text-white">No tienes permiso para ver esta información</div>
        )}
        {showModal && (
          <EmpleadoModal
            isEditing={isEditing}
            empleado={isEditing ? editEmpleado : newEmpleado}
            setEmpleado={isEditing ? setEditEmpleado : setNewEmpleado}
            onClose={() => setShowModal(false)}
            onSave={isEditing ? handleEditEmpleado : handleAddEmpleado}
            areas={areas} // Pasar las áreas al modal
          />
        )}
      </div>
    </div>
  );
};

export default UsuariosView;