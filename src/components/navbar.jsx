"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaUserCircle,
  FaClipboardList,
  FaUsersCog,
  FaChartBar,
  FaSignOutAlt,
  FaMapMarkedAlt,
  FaThLarge,
  FaUserShield,
  FaCalendarCheck, 
  FaProjectDiagram,
  FaChevronDown
} from "react-icons/fa";
import { logoutService } from "@/services/service";
import useStore from "@/store/index";

const Navbar = () => {
  const router = useRouter();
  const { usuarioLogeado, setUsuarioLogeado } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuarioLogeado"));
    if (storedUser) {
      setUsuarioLogeado(storedUser);
    }
  }, [setUsuarioLogeado]);

  const handleLogout = async () => {
    try {
      await logoutService();
      localStorage.removeItem("usuarioLogeado");
      setUsuarioLogeado(null);
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside className="w-72 bg-primary shadow-neu p-4 fixed top-0 left-0 h-full flex flex-col justify-between">
      <div className="overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Admin Panel</h1>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                href="/panel"
                className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
              >
                <FaHome className="mr-2" />
                Panel
              </Link>
            </li>
            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li>
                <Link
                  href="/panel/dashboard"
                  className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
                >
                  <FaThLarge className="mr-2" />
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/panel/perfil"
                className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
              >
                <FaUserCircle className="mr-2" />
                Perfil
              </Link>
            </li>
            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li>
                <Link
                  href="/panel/areas"
                  className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
                >
                  <FaMapMarkedAlt className="mr-2" />
                  Áreas
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/panel/tareas"
                className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
              >
                <FaClipboardList className="mr-2" />
                Tareas
              </Link>
            </li>
            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li>
                <Link
                  href="/panel/usuarios"
                  className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
                >
                  <FaUsersCog className="mr-2" />
                  Empleados
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/panel/desempenio"
                className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
              >
                <FaChartBar className="mr-2" />
                Desempeño
              </Link>
            </li>
            <li>
              <Link
                href="/panel/asistencias"
                className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
              >
                <FaCalendarCheck className="mr-2" />
                Asistencias
              </Link>
            </li>
            <li>
              <div
                onClick={toggleDropdown}
                className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition cursor-pointer"
              >
                <FaProjectDiagram className="mr-2" />
                Proyectos
                <FaChevronDown className="ml-2" />
              </div>
              {isDropdownOpen && (
                <ul className="ml-4 mt-2 space-y-2">
                  <li>
                    <Link
                      href="/panel/proyectos"
                      className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/panel/proyectos/proyecto"
                      className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                    >
                      Proyecto
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/panel/proyectos/facturas"
                      className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                    >
                      Facturas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/panel/proyectos/ordenesCompra"
                      className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                    >
                      Órdenes de Compra
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/panel/proyectos/costos"
                      className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                    >
                      Costos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/panel/proyectos/pagos"
                      className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                    >
                      Pagos
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li>
                <Link
                  href="/panel/roles"
                  className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition"
                >
                  <FaUserShield className="mr-2" />
                  Roles
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg shadow-neu text-gray-700 hover:bg-gray-300 hover:shadow-inner transition w-full"
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Navbar;