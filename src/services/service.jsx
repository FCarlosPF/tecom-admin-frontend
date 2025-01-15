// service.jsx

export const loginService = async (username, password) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }), // Actualiza los campos enviados
    });

    if (!response.ok) {
      throw new Error("Error en la autenticación");
    }

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("usuarioLogeado", JSON.stringify(data.empleado));
    }

    return data.empleado;
  } catch (error) {
    console.error("Error en el servicio de login:", error);
    throw error;
  }
};

export const changePasswordService = async (oldPassword, newPassword) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/change-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cambiar la contraseña");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error en el servicio de cambio de contraseña:", error);
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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleados/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados
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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tareas/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados
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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tareas/empleado/${employeeId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las tareas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error en el servicio de obtener tareas del empleado:",
      error
    );
    throw error;
  }
};

export const getAreas = async () => {
  let accessToken = localStorage.getItem("accessToken");
  console.log("Access Token:", accessToken); // Agrega este console.log para mostrar el access token

  try {
    let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/areas/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las áreas");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener áreas:", error);
    throw error;
  }
};

export const getOneArea = async (areaId) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/area/${areaId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados

      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las tareas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error en el servicio de obtener tareas del empleado:",
      error
    );
    throw error;
  }
};

export const getOneEmpleado = async (empleadoId) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleados/${empleadoId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados

        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las tareas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error en el servicio de obtener tareas del empleado:",
      error
    );
    throw error;
  }
};

export const addEmpleado = async (empleado) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleados/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados

      },
      body: JSON.stringify(empleado),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el empleado");
    }

    console.log("Empleado añadido correctamente");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar el empleado:", error);
    throw error;
  }
};

export const addTask = async (task) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tareas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados

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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/asignacionestareas/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados

        },
        body: JSON.stringify(task),
      }
    );

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

export const updateEmpleado = async (id, updatedEmpleado) => {

  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleados/${id}/`, {
      method: "PUT", // O "PATCH" si solo quieres actualizar algunos campos
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(updatedEmpleado),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar empleado:", error);
    throw error;
  }
};

export const deleteTarea = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tareas/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/empleados/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/areas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/areas/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/areas/${id}/`, {
      method: "PUT", // O "PATCH" si solo quieres actualizar algunos campos
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

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
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tareas/${id}/`, {
      method: "PATCH", // O "PATCH" si solo quieres actualizar algunos campos
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

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

export const getAsignacionesTareas = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/asignacionestareas/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados
        },
      }
    );

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

export const updateAsignacionesTareas = async (id, updateTareas) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/asignacionestareas/${id}/`,
      {
        method: "PATCH", // O "PATCH" si solo quieres actualizar algunos campos
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados

        },
        body: JSON.stringify(updateTareas),
      }
    );

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

export const deleteAsignacionesTareas = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/asignacionestareas/${id}/`,
      {
        method: "DELETE", // O "PATCH" si solo quieres actualizar algunos campos
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el proyecto");
    }

    return { message: "Proyecto eliminado correctamente" };
  } catch (error) {
    console.error(
      "Error en el servicio de eliminar la asignacionTarea:",
      error
    );
    throw error;
  }
};

export const getProyectos = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyectos/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el proyecto");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener proyectos:", error);
    throw error;
  }
};

export const addProyecto = async (proyecto) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyectos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(proyecto),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el proyecto");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar proyecto:", error);
    throw error;
  }
};

export const updateProyecto = async (id, proyecto) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyectos/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(proyecto),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el proyecto");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar proyecto:", error);
    throw error;
  }
};

export const deleteProyecto = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyectos/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el proyecto");
    }

    return { message: "Proyecto eliminado correctamente" };
  } catch (error) {
    console.error("Error en el servicio de eliminar proyecto:", error);
    throw error;
  }
};

export const getCostos = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/costos/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los costos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener costos:", error);
    throw error;
  }
};

export const addCosto = async (costo) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/costos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(costo),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el costo");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar costo:", error);
    throw error;
  }
};

export const updateCosto = async (id, costo) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/costos/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(costo),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el costo");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar costo:", error);
    throw error;
  }
};

export const deleteCosto = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/costos/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el costo");
    }

    return { message: "Costo eliminado correctamente" };
  } catch (error) {
    console.error("Error en el servicio de eliminar costo:", error);
    throw error;
  }
};

export const getFacturas = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facturas/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las facturas");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener facturas:", error);
    throw error;
  }
};

export const addFactura = async (factura) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facturas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(factura),
    });

    if (!response.ok) {
      throw new Error("Error al agregar la factura");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar factura:", error);
    throw error;
  }
};

export const updateFactura = async (id, factura) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facturas/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(factura),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la factura");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar factura:", error);
    throw error;
  }
};

export const deleteFactura = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facturas/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la factura");
    }

    return { message: "Factura eliminada correctamente" };
  } catch (error) {
    console.error("Error en el servicio de eliminar factura:", error);
    throw error;
  }
};

export const getProveedores = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proveedores/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los proveedores");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener proveedores:", error);
    throw error;
  }
};

export const addProveedor = async (proveedor) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proveedores/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(proveedor),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el proveedor");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar proveedor:", error);
    throw error;
  }
};

export const updateProveedor = async (id, proveedor) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proveedores/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
        body: JSON.stringify(proveedor),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el proveedor");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar proveedor:", error);
    throw error;
  }
};

export const deleteProveedor = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proveedores/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el proveedor");
    }

    return { message: "Proveedor eliminado correctamente" };
  } catch (error) {
    console.error("Error en el servicio de eliminar proveedor:", error);
    throw error;
  }
};

export const getPagos = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pagos/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los pagos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener pagos:", error);
    throw error;
  }
};

export const addPago = async (pago) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pagos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(pago),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el pago");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar pago:", error);
    throw error;
  }
};

export const updatePago = async (id, pago) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pagos/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(pago),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el pago");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar pago:", error);
    throw error;
  }
};

export const deletePago = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pagos/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el pago");
    }

    return { message: "Pago eliminado correctamente" };
  } catch (error) {
    console.error("Error en el servicio de eliminar pago:", error);
    throw error;
  }
};

export const getOrdenesCompra = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ordenescompra/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las órdenes de compra");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener órdenes de compra:", error);
    throw error;
  }
};

export const addOrdenCompra = async (ordenCompra) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ordenescompra/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(ordenCompra),
    });

    if (!response.ok) {
      throw new Error("Error al agregar la orden de compra");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar orden de compra:", error);
    throw error;
  }
};

export const updateOrdenCompra = async (id, ordenCompra) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ordenescompra/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
        body: JSON.stringify(ordenCompra),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar la orden de compra");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar orden de compra:", error);
    throw error;
  }
};

export const deleteOrdenCompra = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ordenescompra/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar la orden de compra");
    }

    return { message: "Orden de compra eliminada correctamente" };
  } catch (error) {
    console.error("Error en el servicio de eliminar orden de compra:", error);
    throw error;
  }
};

export const getMetricasPorEmpleado = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/metricas-empleado/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las métricas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error en el servicio de obtener métricas del empleado:",
      error
    );
    throw error;
  }
};

export const descargarReporteExcel = async () => {

  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reporte-tareas-no-entregadas-a-tiempo/`,
      {
        method: "GET",
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al descargar el reporte");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte-tareas-no-entregadas-a-tiempo.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error al descargar el reporte:", error);
  }
};

export const obtenerTareasPendientesEmpleado = async (id_empleado) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tareas-pendientes/${id_empleado}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Incluye el token de acceso en los encabezados
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las tareas pendientes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las tareas pendientes:", error);
    throw error;
  }
};

export const getNotificaciones = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notificaciones/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las notificaciones");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener notificaciones:", error);
    throw error;
  }
};

export const addNotificacion = async (ordenCompra) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notificaciones/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(ordenCompra),
    });

    if (!response.ok) {
      throw new Error("Error al agregar la notificación");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar notificación:", error);
    throw error;
  }
};

export const updateNotificacion = async (id, ordenCompra) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notificaciones/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
        body: JSON.stringify(ordenCompra),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar la notificación");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de actualizar la notificación:", error);
    throw error;
  }
};

export const deleteNotificacion = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notificaciones/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar la notificación");
    }

    return { message: "Notificación eliminada correctamente" };
  } catch (error) {
    console.error("Error en el servicio de eliminar notificación:", error);
    throw error;
  }
};

export const enviarNotificacion = async (notificacionId, notificacion) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notificaciones/${notificacionId}/enviar/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
        body: JSON.stringify(notificacion),
      }
    );

    if (!response.ok) {
      throw new Error("Error al enviar la notificación");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de enviar notificación:", error);
    throw error;
  }
};

export const getNotificacionesPorEmpleado = async (idEmpleado) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notificaciones/empleado/${idEmpleado}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las notificaciones");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener notificaciones:", error);
    throw error;
  }
};
