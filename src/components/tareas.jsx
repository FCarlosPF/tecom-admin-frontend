"use client"

import React, { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { FaCheck, FaTrash } from 'react-icons/fa';

const TareasView = () => {
  // Datos iniciales
  const [tareas, setTareas] = useState([
    {
      id: 1,
      titulo: 'Revisar informes',
      descripcion: 'Verificar los datos del último trimestre.',
      prioridad: 'Alta',
      estado: 'Pendiente',
      fecha_entrega: '2024-11-25',
    },
    {
      id: 2,
      titulo: 'Actualizar servidores',
      descripcion: 'Actualizar las máquinas virtuales en producción.',
      prioridad: 'Media',
      estado: 'En Progreso',
      fecha_entrega: '2024-11-30',
    },
    {
      id: 3,
      titulo: 'Capacitación del equipo',
      descripcion: 'Organizar y liderar la sesión de capacitación.',
      prioridad: 'Baja',
      estado: 'Completada',
      fecha_entrega: '2024-12-05',
    },
  ]);

  // Columnas de la tabla
  const columns = useMemo(
    () => [
      { Header: 'Título', accessor: 'titulo' },
      { Header: 'Descripción', accessor: 'descripcion' },
      { Header: 'Prioridad', accessor: 'prioridad' },
      { Header: 'Estado', accessor: 'estado' },
      { Header: 'Fecha de Entrega', accessor: 'fecha_entrega' },
      {
        Header: 'Acciones',
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="text-green-500 hover:text-green-700"
              onClick={() => completarTarea(row.original.id)}
            >
              <FaCheck />
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => eliminarTarea(row.original.id)}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Completar tarea
  const completarTarea = (id) => {
    setTareas((prev) =>
      prev.map((tarea) =>
        tarea.id === id ? { ...tarea, estado: 'Completada' } : tarea
      )
    );
  };

  // Eliminar tarea
  const eliminarTarea = (id) => {
    setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
  };

  // Configuración de la tabla
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tareas });

  return (
    <div className="p-4 bg-white shadow-neu rounded-md">
      <h2 className="text-xl font-bold mb-4">Gestión de Tareas</h2>
      <table
        {...getTableProps()}
        className="table-auto w-full border border-gray-200 rounded-lg"
      >
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-4 py-2 border text-left text-sm font-medium text-gray-600"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-gray-50 transition"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-2 border text-sm text-gray-700"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TareasView;
