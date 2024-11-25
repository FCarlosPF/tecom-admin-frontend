"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  const data = {
    labels: ["Empleados Activos", "Asistencias Hoy", "Permisos Pendientes", "Tareas en Progreso"],
    datasets: [
      {
        label: "Estadísticas",
        data: [125, 98, 8, 15],
        backgroundColor: ["rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Estadísticas del Dashboard",
      },
    },
  };

  return (
    <div className="p-6 bg-primary min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de barras */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-neu flex justify-center items-center">
          <div className="w-full max-w-lg">
            <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">Estadísticas</h2>
            <div className="h-64">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>

        {/* Sección de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg shadow-neu">
            <h2 className="text-lg text-gray-600">Empleados Activos</h2>
            <p className="text-3xl font-bold text-gray-800">125</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-neu">
            <h2 className="text-lg text-gray-600">Asistencias Hoy</h2>
            <p className="text-3xl font-bold text-gray-800">98</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-neu">
            <h2 className="text-lg text-gray-600">Permisos Pendientes</h2>
            <p className="text-3xl font-bold text-gray-800">8</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-neu">
            <h2 className="text-lg text-gray-600">Tareas en Progreso</h2>
            <p className="text-3xl font-bold text-gray-800">15</p>
          </div>
        </div>
      </div>

      {/* Actividades recientes */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-neu mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Actividades Recientes</h2>
        <ul className="space-y-4">
          <li className="flex justify-between text-gray-600">
            <span>Juan Pérez solicitó un permiso</span>
            <span className="text-sm">Hace 2 horas</span>
          </li>
          <li className="flex justify-between text-gray-600">
            <span>Evaluación de desempeño: María García</span>
            <span className="text-sm">Hoy</span>
          </li>
          <li className="flex justify-between text-gray-600">
            <span>Nueva tarea asignada: Actualizar informes</span>
            <span className="text-sm">Ayer</span>
          </li>
        </ul>
      </div>

      {/* Calendario */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-neu w-[25%]">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Calendario</h2>
        <Calendar onChange={setDate} value={date} />
      </div>
    </div>
  );
};

export default Dashboard;
