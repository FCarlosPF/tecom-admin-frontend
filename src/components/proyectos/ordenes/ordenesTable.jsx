"use client"

import { getOrdenesCompra, addOrdenCompra, updateOrdenCompra, deleteOrdenCompra } from '@/services/service';
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const OrdenesTable = () => {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOrden, setNewOrden] = useState({
    monto: "",
    fecha: "",
    estado: "Pendiente",
    id_proyecto: "",
    id_proveedor: "",
  });
  const [editOrden, setEditOrden] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordenesData = await getOrdenesCompra();
        if (Array.isArray(ordenesData)) setOrdenesCompra(ordenesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta orden?");
    if (confirmacion) {
      try {
        await deleteOrdenCompra(id);
        const updatedOrdenes = await getOrdenesCompra();
        if (Array.isArray(updatedOrdenes)) setOrdenesCompra(updatedOrdenes);
        setMessage("Orden eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar la orden:", error);
        setMessage("Error al eliminar la orden");
      }
    }
  };

  const handleAddOrden = async () => {
    try {
      await addOrdenCompra(newOrden);
      const updatedOrdenes = await getOrdenesCompra();
      if (Array.isArray(updatedOrdenes)) setOrdenesCompra(updatedOrdenes);
      setShowModal(false);
      setNewOrden({
        monto: "",
        fecha: "",
        estado: "Pendiente",
        id_proyecto: "",
        id_proveedor: "",
      });
      setMessage("Orden agregada exitosamente");
    } catch (error) {
      console.error("Error al agregar la orden:", error);
      setMessage("Error al agregar la orden");
    }
  };

  const handleEditOrden = async () => {
    try {
      await updateOrdenCompra(editOrden.id_orden, editOrden);
      const updatedOrdenes = await getOrdenesCompra();
      if (Array.isArray(updatedOrdenes)) setOrdenesCompra(updatedOrdenes);
      setShowModal(false);
      setEditOrden(null);
      setIsEditing(false);
      setMessage("Orden actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      setMessage("Error al actualizar la orden");
    }
  };

  const openEditModal = (orden) => {
    setEditOrden(orden);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gestión de Órdenes de Compra</h2>
      
      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center hover:bg-green-700 transition"
        onClick={() => {
          setNewOrden({
            monto: "",
            fecha: "",
            estado: "Pendiente",
            id_proyecto: "",
            id_proveedor: "",
          });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        <FaPlus className="mr-3" />
        Agregar Orden
      </button>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
          {message}
        </div>
      )}

      <table className="table-auto w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Monto</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Fecha</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Estado</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">ID de Proyecto</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">ID de Proveedor</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(ordenesCompra) && ordenesCompra.map((orden) => (
            <tr
              key={orden.id_orden}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-4 border-b text-sm text-gray-700">{orden.monto}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{orden.fecha}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{orden.estado}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{orden.id_proyecto}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{orden.id_proveedor}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    onClick={() => openEditModal(orden)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition"
                    onClick={() => handleDelete(orden.id_orden)}
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
                {isEditing ? "Editar Orden" : "Agregar Nueva Orden"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {[ 
              { label: "Monto", value: isEditing ? editOrden.monto : newOrden.monto, key: "monto", type: "number" },
              { label: "Fecha", value: isEditing ? editOrden.fecha : newOrden.fecha, key: "fecha", type: "date" },
              { label: "ID de Proyecto", value: isEditing ? editOrden.id_proyecto : newOrden.id_proyecto, key: "id_proyecto", type: "number" },
              { label: "ID de Proveedor", value: isEditing ? editOrden.id_proveedor : newOrden.id_proveedor, key: "id_proveedor", type: "number" },
            ].map(({ label, value, key, type = "text" }) => (
              <div className="mb-6" key={key}>
                <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
                <input
                  type={type}
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value}
                  onChange={(e) => {
                    const updatedOrden = isEditing
                      ? { ...editOrden, [key]: e.target.value }
                      : { ...newOrden, [key]: e.target.value };
                    isEditing ? setEditOrden(updatedOrden) : setNewOrden(updatedOrden);
                  }}
                />
              </div>
            ))}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Estado</label>
              <select
                className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isEditing ? editOrden.estado : newOrden.estado}
                onChange={(e) => {
                  const updatedOrden = isEditing
                    ? { ...editOrden, estado: e.target.value }
                    : { ...newOrden, estado: e.target.value };
                  isEditing ? setEditOrden(updatedOrden) : setNewOrden(updatedOrden);
                }}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-3 hover:bg-blue-700 transition"
                onClick={isEditing ? handleEditOrden : handleAddOrden}
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

export default OrdenesTable;
