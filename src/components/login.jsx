"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "@/services/service";
import useStore from "@/store/index";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUsuarioLogeado, usuarioLogeado } = useStore();

  useEffect(() => {
    // Cargar los datos del usuario desde localStorage si existen
    const storedUser = localStorage.getItem('usuarioLogeado');
    if (storedUser) {
      setUsuarioLogeado(JSON.parse(storedUser));
      router.push("/panel");
    }
  }, [setUsuarioLogeado, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar el estado de error al inicio
    try {
      const data = await loginService(username, password);
      console.log("Respuesta del servicio:", data); // Agregar un log para verificar la respuesta del servicio
  
      if (data) {
        console.log("Data existe:", data);
        const usuario = {
          id_empleado: data.id_empleado,
          nombre: data.nombre,
          apellidos: data.apellidos,
          correo: data.correo,
          especialidad: data.especialidad,
          sueldo: data.sueldo,
          activo: data.activo,
          foto: data.foto,
          nombre_usuario: data.nombre_usuario,
          fecha_contratacion: data.fecha_contratacion,
          area: data.area,
          rol: data.rol,
        };
        setUsuarioLogeado(usuario);
        localStorage.setItem('usuarioLogeado', JSON.stringify(usuario));
        console.log("Usuario logeado:", usuario); // Verificar que el usuario se ha establecido correctamente
        router.push("/panel");
        console.log("Redirigiendo a /panel"); // Verificar que se está intentando redirigir
      } else {
        setError("Credenciales incorrectas");
        console.log("Credenciales incorrectas"); // Verificar que se ha establecido el error
      }
    } catch (error) {
      setError("Credenciales incorrectas");
      console.log("Error en el login:", error); // Verificar que se ha capturado el error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="p-8 rounded-lg shadow-neu bg-primary max-w-sm w-full">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">
          Iniciar Sesión
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-primary shadow-neu focus:outline-none"
              placeholder="nombredeusuario"
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-primary shadow-neu focus:outline-none"
              placeholder="********"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gray-300 hover:bg-gray-400 shadow-neu active:shadow-inner transition-all font-medium text-gray-700"
          >
            Entrar
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
