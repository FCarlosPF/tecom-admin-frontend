"use client"

import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/utils/protectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  

  return (
    <ProtectedRoute>
      <div className="flex bg-primary">
        <Navbar />
        <main className="flex-1  ml-72 h-screen overflow-y-auto bg-gray-100">
          {children}
          <ToastContainer />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;