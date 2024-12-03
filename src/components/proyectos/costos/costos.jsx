"use client"

import { getCostos, addCosto, updateCosto, deleteCosto } from '@/services/service';
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const CostosView = () => {
  const [costos, setCostos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCosto, setNewCosto] = useState({
    descripcion: "",
    monto: "",
    fecha: "",
    categoria: "",
    tipo: "Fijo",
    proyecto: "",
  });
  const [editCosto, setEditCosto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const costosData = await getCostos();
        if (Array.isArray(costosData)) setCostos(costosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este costo?");
    if (confirmacion) {
      try {
        await deleteCosto(id);
        const updatedCostos = await getCostos();
        if (Array.isArray(updatedCostos)) setCostos(updatedCostos);
        setMessage("Costo eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar el costo:", error);
        setMessage("Error al eliminar el costo");
      }
    }
  };

  const handleAddCosto = async () => {
    try {
      await addCosto(newCosto);
      const updatedCostos = await getCostos();
      if (Array.isArray(updatedCostos)) setCostos(updatedCostos);
      setShowModal(false);
      setNewCosto({
        descripcion: "",
        monto: "",
        fecha: "",
        categoria: "",
        tipo: "Fijo",
        proyecto: "",
      });
      setMessage("Costo agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar el costo:", error);
      setMessage("Error al agregar el costo");
    }
  };

  const handleEditCosto = async () => {
    try {
      await updateCosto(editCosto.costo_id, editCosto);
      const updatedCostos = await getCostos();
      if (Array.isArray(updatedCostos)) setCostos(updatedCostos);
      setShowModal(false);
      setEditCosto(null);
      setIsEditing(false);
      setMessage("Costo actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el costo:", error);
      setMessage("Error al actualizar el costo");
    }
  };

  const openEditModal = (costo) => {
    setEditCosto(costo);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gestión de Costos</h2>
      
      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center hover:bg-green-700 transition"
        onClick={() => {
          setNewCosto({
            descripcion: "",
            monto: "",
            fecha: "",
            categoria: "",
            tipo: "Fijo",
            proyecto: "",
          });
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        <FaPlus className="mr-3" />
        Agregar Costo
      </button>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
          {message}
        </div>
      )}

      <table className="table-auto w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Descripción</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Monto</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Fecha</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Categoría</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Tipo</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Proyecto</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(costos) && costos.map((costo) => (
            <tr
              key={costo.costo_id}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-4 border-b text-sm text-gray-700">{costo.descripcion}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{costo.monto}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{costo.fecha}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{costo.categoria}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{costo.tipo}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">{costo.proyecto}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-700">
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    onClick={() => openEditModal(costo)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition"
                    onClick={() => handleDelete(costo.costo_id)}
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
                {isEditing ? "Editar Costo" : "Agregar Nuevo Costo"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {[ 
              { label: "Descripción", value: isEditing ? editCosto.descripcion : newCosto.descripcion, key: "descripcion" },
              { label: "Monto", value: isEditing ? editCosto.monto : newCosto.monto, key: "monto", type: "number" },
              { label: "Fecha", value: isEditing ? editCosto.fecha : newCosto.fecha, key: "fecha", type: "date" },
              { label: "Categoría", value: isEditing ? editCosto.categoria : newCosto.categoria, key: "categoria" },
              { label: "Proyecto", value: isEditing ? editCosto.proyecto : newCosto.proyecto, key: "proyecto", type: "number" },
            ].map(({ label, value, key, type = "text" }) => (
              <div className="mb-6" key={key}>
                <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
                <input
                  type={type}
                  className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value}
                  onChange={(e) => {
                    const updatedCosto = isEditing
                      ? { ...editCosto, [key]: e.target.value }
                      : { ...newCosto, [key]: e.target.value };
                    isEditing ? setEditCosto(updatedCosto) : setNewCosto(updatedCosto);
                  }}
                />
              </div>
            ))}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Tipo</label>
              <select
                className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isEditing ? editCosto.tipo : newCosto.tipo}
                onChange={(e) => {
                  const updatedCosto = isEditing
                    ? { ...editCosto, tipo: e.target.value }
                    : { ...newCosto, tipo: e.target.value };
                  isEditing ? setEditCosto(updatedCosto) : setNewCosto(updatedCosto);
                }}
              >
                <option value="Fijo">Fijo</option>
                <option value="Variable">Variable</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-3 hover:bg-blue-700 transition"
                onClick={isEditing ? handleEditCosto : handleAddCosto}
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

export default CostosView;
