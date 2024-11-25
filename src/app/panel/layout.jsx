"use client"

import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/utils/protectedRoute";

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
        <main className="flex-1 p-6 ml-72">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;