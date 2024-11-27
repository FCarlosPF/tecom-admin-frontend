"use client";

import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useStore from "@/store";
import { getAllEmployees } from "@/services/service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const {
    tareas,
    setTareas,
    usuarioLogeado,
    setUsuarioLogeado,
    empleados,
    setEmpleados,
  } = useStore();
  const barData = {
    labels: [
      "Empleados Activos",
      "Asistencias Hoy",
      "Permisos Pendientes",
      "Tareas en Progreso",
    ],
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

  const lineData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Tareas Completadas",
        data: [30, 45, 60, 70, 80, 100],
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const pieData = {
    labels: ["Alta", "Media", "Baja"],
    datasets: [
      {
        label: "Prioridad de Tareas",
        data: [10, 20, 30],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getAllEmployees();
        if (Array.isArray(data)) {
          setEmpleados(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
        console.log("Usuarios:", data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsuarios();
  }, [setEmpleados]);

  return (
    <div className="p-6 bg-primary min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de barras */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-neu flex justify-center items-center">
          <div className="w-full max-w-lg">
            <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
              Estadísticas
            </h2>
            <div className="h-64">
              <Bar data={barData} options={options} />
            </div>
          </div>
        </div>

        {/* Gráfico de líneas */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-neu flex justify-center items-center">
          <div className="w-full max-w-lg">
            <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
              Tareas Completadas
            </h2>
            <div className="h-64">
              <Line data={lineData} options={options} />
            </div>
          </div>
        </div>

        {/* Gráfico de pastel */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-neu flex justify-center items-center">
          <div className="w-full max-w-lg flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
              Prioridad de Tareas
            </h2>
            <div className="h-64 w-full flex justify-center items-center">
              <Pie data={pieData} options={options} />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-gray-100 rounded-lg shadow-neu flex flex-col items-center justify-center">
          <h2 className="text-lg text-gray-600">Empleados Activos</h2>
          <p className="text-3xl font-bold text-gray-800">
            {empleados.filter((empleado) => empleado.activo).length}
          </p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-neu flex flex-col items-center justify-center">
          <h2 className="text-lg text-gray-600">Asistencias Hoy</h2>
          <p className="text-3xl font-bold text-gray-800">98</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-neu flex flex-col items-center justify-center">
          <h2 className="text-lg text-gray-600">Permisos Pendientes</h2>
          <p className="text-3xl font-bold text-gray-800">8</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-neu flex flex-col items-center justify-center">
          <h2 className="text-lg text-gray-600">Tareas en Progreso</h2>
          <p className="text-3xl font-bold text-gray-800">15</p>
        </div>
      </div>

      {/* Actividades recientes */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-neu mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Actividades Recientes
        </h2>
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
      <div className="bg-gray-100 p-6 rounded-lg shadow-neu w-full lg:w-1/3 xl:w-1/4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Calendario</h2>
        <Calendar onChange={setDate} value={date} />
      </div>
    </div>
  );
};

export default Dashboard;
