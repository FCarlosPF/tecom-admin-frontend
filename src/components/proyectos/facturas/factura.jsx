"use client"

import { getFacturas, addFactura, updateFactura, deleteFactura } from '@/services/service';
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const FacturaView = () => {
  const [facturas, setFacturas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFactura, setNewFactura] = useState({
    numero_factura: "",
    fecha_emision: "",
    monto: "",
    estado_pago: "Pendiente",
    id_orden: "",
  });
  const [editFactura, setEditFactura] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facturasData = await getFacturas();
        if (Array.isArray(facturasData)) setFacturas(facturasData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta factura?");
    if (confirmacion) {
      try {
        await deleteFactura(id);
        const updatedFacturas = await getFacturas();
        if (Array.isArray(updatedFacturas)) setFacturas(updatedFacturas);
        setMessage("Factura eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar la factura:", error);
        setMessage("Error al eliminar la factura");
      }
    }
  };

  const handleAddFactura = async () => {
    try {
      await addFactura(newFactura);
      const updatedFacturas = await getFacturas();
      if (Array.isArray(updatedFacturas)) setFacturas(updatedFacturas);
      setShowModal(false);
      setNewFactura({
        numero_factura: "",
        fecha_emision: "",
        monto: "",
        estado_pago: "Pendiente",
        id_orden: "",
      });
      setMessage("Factura agregada exitosamente");
    } catch (error) {
      console.error("Error al agregar la factura:", error);
      setMessage("Error al agregar la factura");
    }
  };

  const handleEditFactura = async () => {
    try {
      await updateFactura(editFactura.id_factura, editFactura);
      const updatedFacturas = await getFacturas();
      if (Array.isArray(updatedFacturas)) setFacturas(updatedFacturas);
      setShowModal(false);
      setEditFactura(null);
      setIsEditing(false);
      setMessage("Factura actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar la factura:", error);
      setMessage("Error al actualizar la factura");
    }
  };

  const openEditModal = (factura) => {
    setEditFactura(factura);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gestión de Facturas</h2>
      
      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center hover:bg-green-700 transition"
        onClick={() => {
          setNewFactura({
            numero_factura: "",
            fecha_emision: "",
            monto: "",
            estado_pago: "Pendiente",
            id_orden: "",
          });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        <FaPlus className="mr-3" />
        Agregar Factura
      </button>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
          {message}
        </div>
      )}

      <table className="table-auto w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Número de Factura</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Fecha de Emisión</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Monto</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Estado de Pago</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">ID de Orden</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(facturas) && facturas.map((factura) => (
            <tr
              key={factura.id_factura}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-4 border-b text-sm text-gray-700">{factura.numero_factura}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{factura.fecha_emision}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{factura.monto}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{factura.estado_pago}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{factura.id_orden}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    onClick={() => openEditModal(factura)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition"
                    onClick={() => handleDelete(factura.id_factura)}
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
                {isEditing ? "Editar Factura" : "Agregar Nueva Factura"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {[ 
              { label: "Número de Factura", value: isEditing ? editFactura.numero_factura : newFactura.numero_factura, key: "numero_factura" },
              { label: "Fecha de Emisión", value: isEditing ? editFactura.fecha_emision : newFactura.fecha_emision, key: "fecha_emision", type: "date" },
              { label: "Monto", value: isEditing ? editFactura.monto : newFactura.monto, key: "monto", type: "number" },
              { label: "ID de Orden", value: isEditing ? editFactura.id_orden : newFactura.id_orden, key: "id_orden", type: "number" },
            ].map(({ label, value, key, type = "text" }) => (
              <div className="mb-6" key={key}>
                <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
                <input
                  type={type}
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value}
                  onChange={(e) => {
                    const updatedFactura = isEditing
                      ? { ...editFactura, [key]: e.target.value }
                      : { ...newFactura, [key]: e.target.value };
                    isEditing ? setEditFactura(updatedFactura) : setNewFactura(updatedFactura);
                  }}
                />
              </div>
            ))}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Estado de Pago</label>
              <select
                className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isEditing ? editFactura.estado_pago : newFactura.estado_pago}
                onChange={(e) => {
                  const updatedFactura = isEditing
                    ? { ...editFactura, estado_pago: e.target.value }
                    : { ...newFactura, estado_pago: e.target.value };
                  isEditing ? setEditFactura(updatedFactura) : setNewFactura(updatedFactura);
                }}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-3 hover:bg-blue-700 transition"
                onClick={isEditing ? handleEditFactura : handleAddFactura}
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

export default FacturaView;
