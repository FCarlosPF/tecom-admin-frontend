// service.jsx

export const loginService = async (username, password) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_usuario: username, contrasenia: password }),
    });

    if (!response.ok) {
      throw new Error("Error en la autenticación");
    }

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("refreshToken", data.tokens.refresh);
      localStorage.setItem("accessToken", data.tokens.access);
      localStorage.setItem("usuarioLogeado", JSON.stringify(data.empleado));
    }

    return data.empleado;
  } catch (error) {
    console.error("Error en el servicio de login:", error);
    throw error;
  }
};

export const logoutService = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    if (!refreshToken || !accessToken) {
      throw new Error("No tokens found");
    }

    // Eliminar tokens del almacenamiento local
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuarioLogeado");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export const getAllEmployees = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/empleados/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los empleados");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener empleados:", error);
    throw error;
  }
};
