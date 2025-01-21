"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { changePassword } from "@/services/service"; // Ajusta la ruta según sea necesario
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from 'next/image';
import logo from '@/assets/img/logo.jpg'; // Ajusta la ruta según sea necesario

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!uid || !token) {
      setError("Parámetros inválidos");
    }
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      console.log("Enviando a changePassword:", { uid, token, password });

      await changePassword(uid, token, password);
      setSuccess("Contraseña restablecida con éxito");
      setError("");
      toast.success("Contraseña restablecida con éxito");
    } catch (error) {
      setError("Error al restablecer la contraseña");
      setSuccess("");
      toast.error("Error al restablecer la contraseña");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <Image src={logo} alt="Logo" width={150} height={150} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Restablecer Contraseña
        </h1>
        {error && (
          <p className="text-sm text-red-600 text-center mb-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 text-center mb-2">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Nueva Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Restablecer Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
