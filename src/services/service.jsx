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


export const getAllTasks = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/tareas/", {
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

export const getTasKToEmployee = async (employeeId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tareas/empleado/${employeeId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las tareas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener tareas del empleado:", error);
    throw error;
  }
};

export const getAreas = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/areas/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las tareas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener tareas del empleado:", error);
    throw error;
  }
};

export const getOneArea = async (areaId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/area/${areaId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las tareas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener tareas del empleado:", error);
    throw error;
  }
};

export const getOneEmpleado = async (empleadoId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/empleados/${empleadoId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las tareas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener tareas del empleado:", error);
    throw error;
  }
};

export const addEmpleado = async (empleado) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/empleados/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleado),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el rol");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar rol:", error);
    throw error;
  }
};

export const addTask = async (task) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tareas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Error al agregar la tarea: ${errorDetails.message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar la tarea:", error);
    throw error;
  }
};

export const addAsignacionTarea = async (task) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/asignacionestareas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Error al agregar la tarea: ${errorDetails.message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar la tarea:", error);
    throw error;
  }
};

export const updateEmpleado = async (id, updatedArea) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/empleados/${id}/`, {
      method: "PUT", // O "PATCH" si solo quieres actualizar algunos campos
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedArea),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el área");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar área:", error);
    throw error;
  }
};

export const deleteTarea= async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tareas/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el rol");
    }

    return;
  } catch (error) {
    console.error("Error en el servicio de eliminar rol:", error);
    throw error;
  }
};

export const deleteEmpleado = async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/empleados/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el rol");
    }

    return;
  } catch (error) {
    console.error("Error en el servicio de eliminar rol:", error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/roles/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los roles");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener roles:", error);
    throw error;
  }
};


export const addRole = async (role) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/roles/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el rol");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar rol:", error);
    throw error;
  }
};

export const addArea = async (area) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/areas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(area),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el area");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar area:", error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/roles/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el rol");
    }

    return;
  } catch (error) {
    console.error("Error en el servicio de eliminar rol:", error);
    throw error;
  }
};

export const deleteArea = async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/areas/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el área");
    }

    return;
  } catch (error) {
    console.error("Error en el servicio de eliminar área:", error);
    throw error;
  }
};

export const updateArea = async (id, updatedArea) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/areas/${id}/`, {
      method: "PUT", // O "PATCH" si solo quieres actualizar algunos campos
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedArea),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el área");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar área:", error);
    throw error;
  }
};

export const updateTareas = async (id, updateTareas) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tareas/${id}/`, {
      method: "PATCH", // O "PATCH" si solo quieres actualizar algunos campos
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateTareas),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el área");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar área:", error);
    throw error;
  }
};

export const updateAsignacionesTareas = async (id, updateTareas) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/asignacionestareas/${id}/`, {
      method: "PATCH", // O "PATCH" si solo quieres actualizar algunos campos
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateTareas),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el área");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar área:", error);
    throw error;
  }
};