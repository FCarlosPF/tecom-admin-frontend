"use client";

import React, { useState, useEffect } from "react";
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
import { getMetricasPorEmpleado } from "@/services/service";
import useStore from "@/store";

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

const DesempeñoView = () => {
  const { usuarioLogeado, setUsuarioLogeado } = useStore();
  const [evaluaciones, setEvaluaciones] = useState(null);

  const fetchMetricas = async () => {
    if (!usuarioLogeado) {
      console.error("usuarioLogeado no está definido");
      setEvaluaciones([]);
      return;
    }

    if (usuarioLogeado.id_empleado === null) {
      console.log("id_empleado es null, no se ejecuta fetchMetricas");
      return;
    }

    try {
      console.log(
        "Estado de usuarioLogeado al iniciar fetchMetricas:",
        usuarioLogeado
      );
      const metricas = await getMetricasPorEmpleado(usuarioLogeado.id_empleado);
      setEvaluaciones(metricas);
    } catch (error) {
      console.error("Error al obtener las métricas del empleado:", error);
      setEvaluaciones([]);
    }
  };

  useEffect(() => {
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
    console.log("Cargando usuarioLogeado desde localStorage:", usuarioLogeado);
    if (usuarioLogeado) {
      setUsuarioLogeado(usuarioLogeado);
    }
  }, [setUsuarioLogeado]);

  useEffect(() => {
    if (usuarioLogeado) {
      fetchMetricas();
    } else {
      console.log(
        "usuarioLogeado no está definido, no se ejecuta fetchMetricas"
      );
    }
  }, [usuarioLogeado]);

  if (!evaluaciones) {
    return <div>Cargando...</div>;
  }

  const barData = {
    labels: ["Tareas Completadas", "Tareas en Progreso", "Tareas Pendientes"],
    datasets: [
      {
        label: "Tareas",
        data: [
          evaluaciones.datos_grafico_barras.tareas_completadas,
          evaluaciones.datos_grafico_barras.tareas_en_progreso,
          evaluaciones.datos_grafico_barras.tareas_pendientes,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels:
      evaluaciones.datos_grafico_linea_tiempo.tareas_completadas_por_dia.map(
        (item) => `Día ${item.dia}`
      ),
    datasets: [
      {
        label: "Tareas Completadas por Día",
        data: evaluaciones.datos_grafico_linea_tiempo.tareas_completadas_por_dia.map(
          (item) => item.count
        ),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: ["Completadas a Tiempo", "No Completadas a Tiempo"],
    datasets: [
      {
        label: "Tareas",
        data: [
          evaluaciones.datos_grafico_torta.completadas_a_tiempo,
          evaluaciones.datos_grafico_torta.no_completadas_a_tiempo,
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Valor: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {usuarioLogeado && `Evaluación de Desempeño de ${usuarioLogeado.nombre}`}
          </h2>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
              <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
                Tareas
              </h2>
              <div className="h-64">
                <Bar data={barData} options={options} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
              <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
                Tareas Completadas por Día
              </h2>
              <div className="h-64">
                <Line data={lineData} options={options} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex flex-col items-center justify-center">
              <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
                Tareas Completadas a Tiempo
              </h2>
              <div className="h-64 w-64">
                <Pie data={pieData} options={options} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex flex-col items-center justify-center">
              <h3 className="text-md font-bold text-gray-700 mb-2 text-center">
                Carga de Trabajo Actual
              </h3>
              <p className="text-2xl text-gray-800 text-center">
                {evaluaciones.carga_trabajo_actual}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex flex-col items-center justify-center">
              <h3 className="text-md font-bold text-gray-700 mb-2 text-center">
                Tareas Totales
              </h3>
              <p className="text-2xl text-gray-800 text-center">
                {evaluaciones.tareas_totales}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex flex-col items-center justify-center">
              <h3 className="text-md font-bold text-gray-700 mb-2 text-center">
                Porcentaje de Tareas Completadas a Tiempo
              </h3>
              <p className="text-2xl text-gray-800 text-center">
                {evaluaciones.porcentaje_tareas_completadas_a_tiempo}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex flex-col items-center justify-center">
              <h3 className="text-md font-bold text-gray-700 mb-2 text-center">
                Promedio de Retraso en Horas
              </h3>
              <p className="text-2xl text-gray-800 text-center">
                {evaluaciones.promedio_retraso_horas}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex flex-col items-center justify-center">
              <h3 className="text-md font-bold text-gray-700 mb-2 text-center">
                Promedio de Duración de Tareas Completadas
              </h3>
              <p className="text-2xl text-gray-800 text-center">
                {evaluaciones.promedio_duracion_tareas_completadas}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex flex-col items-center justify-center">
              <h3 className="text-md font-bold text-gray-700 mb-2 text-center">
                Tareas Completadas en el Último Mes
              </h3>
              <p className="text-2xl text-gray-800 text-center">
                {evaluaciones.tareas_completadas_ultimo_mes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesempeñoView;