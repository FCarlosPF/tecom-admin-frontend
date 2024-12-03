"use client";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { getProyectos, getCostos, getOrdenesCompra, getPagos, getProveedores, getFacturas } from '@/services/service'; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const ProyectosView = () => {
  const [proyectos, setProyectos] = useState([]);
  const [costos, setCostos] = useState([]);
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectosData = await getProyectos();
        const costosData = await getCostos();
        const ordenesCompraData = await getOrdenesCompra();
        const pagosData = await getPagos();
        const proveedoresData = await getProveedores();
        const facturasData = await getFacturas();

        if (Array.isArray(proyectosData)) setProyectos(proyectosData);
        if (Array.isArray(costosData)) setCostos(costosData);
        if (Array.isArray(ordenesCompraData)) setOrdenesCompra(ordenesCompraData);
        if (Array.isArray(pagosData)) setPagos(pagosData);
        if (Array.isArray(proveedoresData)) setProveedores(proveedoresData);
        if (Array.isArray(facturasData)) setFacturas(facturasData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const proyectoOptions = proyectos.map((proyecto) => ({
    value: proyecto.proyecto_id,
    label: proyecto.nombre,
  }));

  const pagosData = {
    labels: pagos.map(pago => pago.fecha_pago),
    datasets: [
      {
        label: 'Pagos',
        data: pagos.map(pago => pago.monto),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const costosData = {
    labels: costos.map(costo => costo.fecha),
    datasets: [
      {
        label: 'Costos',
        data: costos.map(costo => costo.monto),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const ordenesCompraData = {
    labels: ordenesCompra.map(orden => orden.fecha),
    datasets: [
      {
        label: 'Órdenes de Compra',
        data: ordenesCompra.map(orden => orden.monto),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const proveedoresData = {
    labels: proveedores.map(proveedor => proveedor.nombre),
    datasets: [
      {
        label: 'Proveedores',
        data: proveedores.map(proveedor => proveedor.id_proveedor),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const facturasData = {
    labels: facturas.map(factura => factura.fecha_emision),
    datasets: [
      {
        label: 'Facturas',
        data: facturas.map(factura => factura.monto),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard de Proyectos</h1>
      <div style={{ marginBottom: '20px' }}>
        <Select options={proyectoOptions} placeholder="Selecciona un proyecto" />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: '1 1 45%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Gráfico de Proveedores</h2>
          <div style={{ height: '300px' }}>
            <Pie data={proveedoresData} />
          </div>
        </div>

        <div style={{ flex: '1 1 45%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Gráfico de Órdenes de Compra</h2>
          <div style={{ height: '300px' }}>
            <Bar data={ordenesCompraData} />
          </div>
        </div>

        <div style={{ flex: '1 1 45%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Gráfico de Facturas</h2>
          <div style={{ height: '300px' }}>
            <Bar data={facturasData} />
          </div>
        </div>

        <div style={{ flex: '1 1 45%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Gráfico de Costos</h2>
          <div style={{ height: '300px' }}>
            <Line data={costosData} />
          </div>
        </div>

        <div style={{ flex: '1 1 45%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Gráfico de Pagos</h2>
          <div style={{ height: '300px' }}>
            <Bar data={pagosData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProyectosView;