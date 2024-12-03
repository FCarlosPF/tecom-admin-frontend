"use client"

import { getPagos, addPago, updatePago, deletePago } from '@/services/service';
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const PagosTable = () => {
  const [pagos, setPagos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPago, setNewPago] = useState({
    monto: "",
    fecha_pago: "",
    metodo_pago: "Transferencia",
    id_factura: "",
  });
  const [editPago, setEditPago] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pagosData = await getPagos();
        if (Array.isArray(pagosData)) setPagos(pagosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este pago?");
    if (confirmacion) {
      try {
        await deletePago(id);
        const updatedPagos = await getPagos();
        if (Array.isArray(updatedPagos)) setPagos(updatedPagos);
        setMessage("Pago eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar el pago:", error);
        setMessage("Error al eliminar el pago");
      }
    }
  };

  const handleAddPago = async () => {
    try {
      await addPago(newPago);
      const updatedPagos = await getPagos();
      if (Array.isArray(updatedPagos)) setPagos(updatedPagos);
      setShowModal(false);
      setNewPago({
        monto: "",
        fecha_pago: "",
        metodo_pago: "Transferencia",
        id_factura: "",
      });
      setMessage("Pago agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar el pago:", error);
      setMessage("Error al agregar el pago");
    }
  };

  const handleEditPago = async () => {
    try {
      await updatePago(editPago.id_pago, editPago);
      const updatedPagos = await getPagos();
      if (Array.isArray(updatedPagos)) setPagos(updatedPagos);
      setShowModal(false);
      setEditPago(null);
      setIsEditing(false);
      setMessage("Pago actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
      setMessage("Error al actualizar el pago");
    }
  };

  const openEditModal = (pago) => {
    setEditPago(pago);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gestión de Pagos</h2>
      
      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center hover:bg-green-700 transition"
        onClick={() => {
          setNewPago({
            monto: "",
            fecha_pago: "",
            metodo_pago: "Transferencia",
            id_factura: "",
          });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        <FaPlus className="mr-3" />
        Agregar Pago
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
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Fecha de Pago</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Método de Pago</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">ID de Factura</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pagos) && pagos.map((pago) => (
            <tr
              key={pago.id_pago}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-4 border-b text-sm text-gray-700">{pago.monto}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{pago.fecha_pago}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{pago.metodo_pago}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{pago.id_factura}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    onClick={() => openEditModal(pago)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition"
                    onClick={() => handleDelete(pago.id_pago)}
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
                {isEditing ? "Editar Pago" : "Agregar Nuevo Pago"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {[ 
              { label: "Monto", value: isEditing ? editPago.monto : newPago.monto, key: "monto", type: "number" },
              { label: "Fecha de Pago", value: isEditing ? editPago.fecha_pago : newPago.fecha_pago, key: "fecha_pago", type: "date" },
              { label: "ID de Factura", value: isEditing ? editPago.id_factura : newPago.id_factura, key: "id_factura", type: "number" },
            ].map(({ label, value, key, type = "text" }) => (
              <div className="mb-6" key={key}>
                <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
                <input
                  type={type}
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value}
                  onChange={(e) => {
                    const updatedPago = isEditing
                      ? { ...editPago, [key]: e.target.value }
                      : { ...newPago, [key]: e.target.value };
                    isEditing ? setEditPago(updatedPago) : setNewPago(updatedPago);
                  }}
                />
              </div>
            ))}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Método de Pago</label>
              <select
                className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isEditing ? editPago.metodo_pago : newPago.metodo_pago}
                onChange={(e) => {
                  const updatedPago = isEditing
                    ? { ...editPago, metodo_pago: e.target.value }
                    : { ...newPago, metodo_pago: e.target.value };
                  isEditing ? setEditPago(updatedPago) : setNewPago(updatedPago);
                }}
              >
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-3 hover:bg-blue-700 transition"
                onClick={isEditing ? handleEditPago : handleAddPago}
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

export default PagosTable;
