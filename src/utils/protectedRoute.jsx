"use client";

import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!accessToken) {
      router.push('/'); // Redirige a la página de login si no hay token
    }
  }, [accessToken, router]);

  if (typeof window === 'undefined' || !accessToken) {
    return null; // O muestra un spinner/cargando mientras redirige
  }

  return children;
};

export default ProtectedRoute;