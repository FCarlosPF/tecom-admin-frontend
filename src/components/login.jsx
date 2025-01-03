"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { loginService } from "@/services/service";
import useStore from "@/store/index";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from 'next/image';

const ParticlesMemo = React.memo(({ options, particlesLoaded }) => (
  <Particles
    id="tsparticles"
    particlesLoaded={particlesLoaded}
    options={options}
  />
));

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUsuarioLogeado, usuarioLogeado } = useStore();
  const particlesInit = useRef(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioLogeado");
    if (storedUser) {
      setUsuarioLogeado(JSON.parse(storedUser));
      router.push("/panel");
    }
  }, [setUsuarioLogeado, router]);

  useEffect(() => {
    if (!particlesInit.current) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        particlesInit.current = true;
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginService(username, password);
      if (data) {
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
        localStorage.setItem("usuarioLogeado", JSON.stringify(usuario));
        router.push("/panel");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      setError("Credenciales incorrectas");
    }
  };

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "white-blue",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          enable: false,
        },
        move: {
          direction: MoveDirection.bottom,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 1600,
        },
        opacity: {
          value: 0.8,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black">
      <ParticlesMemo particlesLoaded={particlesLoaded} options={options} />
      <div className="flex items-center justify-center rounded-lg shadow-lg bg-blue-800 bg-opacity-90 max-w-4xl w-full z-10">
        {/* Imagen a la izquierda */}
        <div className="w-1/2 hidden md:block">
          <Image
            src="https://media.licdn.com/dms/image/v2/D4E0BAQGgGk-XuOr2cA/company-logo_200_200/company-logo_200_200/0/1666116188527?e=1741824000&v=beta&t=Yx0Q88ghBsl--XUhVQuOak_VdJeLx-l0HoT1mjmovAo"
            alt="Login Image"
            width={200}
            height={200}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Formulario a la derecha */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-center text-3xl font-bold text-white mb-6">
            Iniciar Sesión
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-bold text-white mb-2"
              >
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="w-full p-3 rounded-lg bg-gray-800 shadow-inner focus:outline-none text-white font-bold"
                placeholder="nombre de usuario"
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-white mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full p-3 rounded-lg bg-gray-800 shadow-inner focus:outline-none text-white font-bold pr-10"
                  placeholder="********"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg active:shadow-inner transition-all font-medium text-white"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

Login.displayName = "Login";

export default Login;
