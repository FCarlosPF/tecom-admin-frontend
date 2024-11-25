import Navbar from "@/components/navbar";
import React from "react";
import ProtectedRoute from "@/utils/protectedRoute";

const Layout = ({ children }) => {
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