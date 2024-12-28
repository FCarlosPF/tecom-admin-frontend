// src/components/navbar.jsx
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
  FaChevronDown,
  FaBars,
  FaTimes,
  FaBell,
} from "react-icons/fa";
import { logoutService } from "@/services/service";
import useStore from "@/store/index";

const Navbar = ({ isMenuOpen, toggleMenu }) => {
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
    <aside
      className={`bg-black shadow-lg fixed top-0 left-0 h-full flex flex-col justify-between transition-all duration-300 ${
        isMenuOpen ? "w-72" : "w-0"
      }`}
    >
      <div className="flex justify-between items-center p-4 mr-9">
        {isMenuOpen && (
          <div className="hidden md:block p-4">
            <h1 className="text-2xl font-bold text-white">
              TECOM ADMINISTRADOR
            </h1>
          </div>
        )}

        <button
          onClick={toggleMenu}
          className={`text-${isMenuOpen ? "white" : "black"}`}
        >
          <FaBars />
        </button>
      </div>
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-black h-full">
        <nav className="p-4">
          <ul className="space-y-4">
            <li className="border-b border-gray-700">
              <Link
                href="/panel"
                className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
              >
                <FaHome className="mr-2" />
                <span className="hidden md:inline">Panel</span>
              </Link>
            </li>
            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li className="border-b border-gray-700">
                <Link
                  href="/panel/dashboard"
                  className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
                >
                  <FaThLarge className="mr-2" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              </li>
            )}
            <li className="border-b border-gray-700">
              <Link
                href="/panel/perfil"
                className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
              >
                <FaUserCircle className="mr-2" />
                <span className="hidden md:inline">Perfil</span>
              </Link>
            </li>
            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li className="border-b border-gray-700">
                <Link
                  href="/panel/areas"
                  className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
                >
                  <FaMapMarkedAlt className="mr-2" />
                  <span className="hidden md:inline">Áreas</span>
                </Link>
              </li>
            )}
            <li className="border-b border-gray-700">
              <Link
                href="/panel/tareas"
                className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
              >
                <FaClipboardList className="mr-2" />
                <span className="hidden md:inline">Tareas</span>
              </Link>
            </li>
            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li className="border-b border-gray-700">
                <Link
                  href="/panel/usuarios"
                  className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
                >
                  <FaUsersCog className="mr-2" />
                  <span className="hidden md:inline">Empleados</span>
                </Link>
              </li>
            )}
            <li className="border-b border-gray-700">
              <Link
                href="/panel/desempenio"
                className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
              >
                <FaChartBar className="mr-2" />
                <span className="hidden md:inline">Desempeño</span>
              </Link>
            </li>
            <li className="border-b border-gray-700">
              <Link
                href="/panel/asistencias"
                className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
              >
                <FaCalendarCheck className="mr-2" />
                <span className="hidden md:inline">Calendario</span>
              </Link>
            </li>
            {usuarioLogeado &&
              (usuarioLogeado.rol === 1 || usuarioLogeado.rol === 6) && (
                <li className="border-b border-gray-700">
                  <Link
                    href="/panel/notificaciones"
                    className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
                  >
                    <FaBell className="mr-2" />
                    <span className="hidden md:inline">Notificaciones</span>
                  </Link>
                </li>
              )}
            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li className="border-b border-gray-700">
                <div
                  onClick={toggleDropdown}
                  className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition cursor-pointer"
                >
                  <FaProjectDiagram className="mr-2" />
                  <span className="hidden md:inline">Proyectos</span>
                  <FaChevronDown className="ml-2" />
                </div>
                {isDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li className="border-b border-gray-700">
                      <Link
                        href="/panel/proyectos"
                        className="flex items-center p-2 rounded-lg text-white hover:bg-blue-600 transition"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li className="border-b border-gray-700">
                      <Link
                        href="/panel/proyectos/proyecto"
                        className="flex items-center p-2 rounded-lg text-white hover:bg-blue-600 transition"
                      >
                        Proyecto
                      </Link>
                    </li>
                    <li className="border-b border-gray-700">
                      <Link
                        href="/panel/proyectos/facturas"
                        className="flex items-center p-2 rounded-lg text-white hover:bg-blue-600 transition"
                      >
                        Facturas
                      </Link>
                    </li>
                    <li className="border-b border-gray-700">
                      <Link
                        href="/panel/proyectos/ordenesCompra"
                        className="flex items-center p-2 rounded-lg text-white hover:bg-blue-600 transition"
                      >
                        Órdenes de Compra
                      </Link>
                    </li>
                    <li className="border-b border-gray-700">
                      <Link
                        href="/panel/proyectos/costos"
                        className="flex items-center p-2 rounded-lg text-white hover:bg-blue-600 transition"
                      >
                        Costos
                      </Link>
                    </li>
                    <li className="border-b border-gray-700">
                      <Link
                        href="/panel/proyectos/pagos"
                        className="flex items-center p-2 rounded-lg text-white hover:bg-blue-600 transition"
                      >
                        Pagos
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {usuarioLogeado && usuarioLogeado.rol === 1 && (
              <li className="border-b border-gray-700">
                <Link
                  href="/panel/roles"
                  className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition"
                >
                  <FaUserShield className="mr-2" />
                  <span className="hidden md:inline">Roles</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg shadow-md text-white hover:bg-blue-600 hover:shadow-lg transition w-full"
        >
          <FaSignOutAlt className="mr-2" />
          <span className="hidden md:inline">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
