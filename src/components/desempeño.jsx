"use client";

import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Registramos los componentes necesarios para los gráficos
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const DesempeñoView = () => {
  // Datos iniciales de desempeño
  const [evaluaciones, setEvaluaciones] = useState([
    {
      id: 1,
      empleado: 'Juan Pérez',
      fecha: '2024-10-01',
      evaluador: 'Carlos Sánchez',
      puntuacion: 4.5,
      comentarios: 'Excelente desempeño en todas las tareas.',
    },
    {
      id: 2,
      empleado: 'María Gómez',
      fecha: '2024-10-05',
      evaluador: 'Ana López',
      puntuacion: 3.2,
      comentarios: 'Cumple con las expectativas, pero puede mejorar en tiempos de entrega.',
    },
    {
      id: 3,
      empleado: 'Carlos Sánchez',
      fecha: '2024-10-10',
      evaluador: 'Juan Pérez',
      puntuacion: 5.0,
      comentarios: 'Desempeño sobresaliente, muy proactivo y puntual.',
    },
  ]);

  // Datos para el gráfico de barras
  const barData = {
    labels: evaluaciones.map((evaluacion) => evaluacion.empleado), // Nombres de los empleados
    datasets: [
      {
        label: 'Puntuación de Desempeño',
        data: evaluaciones.map((evaluacion) => evaluacion.puntuacion), // Puntuación de desempeño
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de las barras
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de líneas
  const lineData = {
    labels: evaluaciones.map((evaluacion) => evaluacion.fecha), // Fechas de las evaluaciones
    datasets: [
      {
        label: 'Puntuación de Desempeño',
        data: evaluaciones.map((evaluacion) => evaluacion.puntuacion), // Puntuación de desempeño
        backgroundColor: 'rgba(153, 102, 255, 0.6)', // Color de las líneas
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  // Opciones para los gráficos
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Evaluaciones de Desempeño de Empleados',
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Puntuación: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5, // Máximo de la escala Y para reflejar puntuaciones
      },
    },
  };

  return (
    <div className="p-6 bg-primary min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Evaluación de Desempeño</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de barras */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-neu">
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">Puntuación de Desempeño</h2>
          <Bar data={barData} options={options} />
        </div>

        {/* Gráfico de líneas */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-neu">
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">Puntuación a lo Largo del Tiempo</h2>
          <Line data={lineData} options={options} />
        </div>
      </div>

      {/* Tabla de evaluaciones */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-neu">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Detalles de Evaluaciones</h2>
        <table className="table-auto w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Empleado</th>
              <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Fecha</th>
              <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Evaluador</th>
              <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Puntuación</th>
              <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Comentarios</th>
              <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((evaluacion) => (
              <tr key={evaluacion.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border text-sm text-gray-700">{evaluacion.empleado}</td>
                <td className="px-4 py-2 border text-sm text-gray-700">{evaluacion.fecha}</td>
                <td className="px-4 py-2 border text-sm text-gray-700">{evaluacion.evaluador}</td>
                <td className="px-4 py-2 border text-sm text-gray-700">{evaluacion.puntuacion}</td>
                <td className="px-4 py-2 border text-sm text-gray-700">{evaluacion.comentarios}</td>
                <td className="px-4 py-2 border text-sm text-gray-700">
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesempeñoView;
