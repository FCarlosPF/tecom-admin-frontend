// src/app/panel/layout.jsx
"use client";

import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/utils/protectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBars } from "react-icons/fa";

const Layout = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isClient) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="flex bg-primary">
        <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <main
          className={`flex-1 ${
            isMenuOpen ? "ml-72" : "ml-0"
          } h-screen overflow-y-auto bg-gray-100 transition-all duration-300`}
        >
          <button
            onClick={toggleMenu}
            className="text-black p-4 md:hidden fixed top-0 left-0"
          >
            <FaBars />
          </button>
          {children}
          <ToastContainer />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;