"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import fiberfield from "@/assets/img/Fiberfield.png";
import person from "@/assets/img/person.svg";
import eyeSlash from "@/assets/img/eye-slash.svg";
import eye from "@/assets/img/eye.svg";
import fondo from "@/assets/img/fondo.jpg";
import { useRouter } from "next/navigation";
import useStore from "@/store/index";
import { loginService } from "@/services/service";

const Login2 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUsuarioLogeado, usuarioLogeado } = useStore();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioLogeado");
    if (storedUser) {
      setUsuarioLogeado(JSON.parse(storedUser));
      router.push("/panel");
    }
  }, [setUsuarioLogeado, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginService(username, password);
      if (data) {
        setUsuarioLogeado(data);
        router.push("/panel");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${fondo.src})` }} // Asegúrate de usar `.src`
    >
      {" "}
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black opacity-70"></div>
      {/* Tarjeta de login */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm p-8 z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src={fiberfield} alt="logoFiberField" className="w-48" />
        </div>

        {/* Input Usuario */}
        <div className="relative mb-6">
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Usuario"
            className="w-full border-b border-gray-700 focus:border-gray-900 focus:outline-none text-sm py-2 px-3 text-gray-700 peer"
          />
          <Image
            src={person}
            alt="Icono user"
            className="absolute w-5 h-5 top-1/2 right-3 transform -translate-y-1/2"
          />
        </div>

        {/* Input Contraseña */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Contraseña"
            className="w-full border-b border-gray-700 focus:border-gray-900 focus:outline-none text-sm py-2 px-3 text-gray-700 peer"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          >
            <Image
              src={showPassword ? eye : eyeSlash}
              alt="Icono password"
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* Botón de Ingreso */}
        <button
          onClick={handleLogin}
          className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition-all"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
};

export default Login2;
