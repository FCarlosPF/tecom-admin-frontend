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
    const response = await fetch(
      `http://127.0.0.1:8000/api/tareas/empleado/${employeeId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
    console.error(
      "Error en el servicio de obtener tareas del empleado:",
      error
    );
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
    console.error(
      "Error en el servicio de obtener tareas del empleado:",
      error
    );
    throw error;
  }
};

export const getOneEmpleado = async (empleadoId) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/empleados/${empleadoId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/empleados/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleado),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el empleado");
    }

    console.log("Empleado añadido correctamente")
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de agregar el empleado:", error);
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
    const response = await fetch(
      `http://127.0.0.1:8000/api/asignacionestareas/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

export const deleteTarea = async (id) => {
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

export const getAsignacionesTareas = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/asignacionestareas/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/asignacionestareas/${id}/`,
      {
        method: "PATCH", // O "PATCH" si solo quieres actualizar algunos campos
        headers: {
          "Content-Type": "application/json",
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
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/asignacionestareas/${id}/`,
      {
        method: "DELETE", // O "PATCH" si solo quieres actualizar algunos campos
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el proyecto");
    }

    return { message: "Proyecto eliminado correctamente" };
  } catch (error) {
    console.error("Error en el servicio de eliminar la asignacionTarea:", error);
    throw error;
  }
};

export const getProyectos = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/proyectos/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el proyecto");
    }

    return { message: "Proyecto eliminado correctamente" };
  } catch (error) {
    console.error("Error en el servicio de obtener proyectos:", error);
    throw error;
  }
};

export const addProyecto = async (proyecto) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/proyectos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/proyectos/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/proyectos/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/costos/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/costos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/costos/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/costos/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/facturas/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/facturas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/facturas/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/facturas/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/proveedores/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/proveedores/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/proveedores/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/proveedores/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/pagos/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/pagos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/pagos/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/pagos/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/ordenescompra/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/ordenescompra/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/ordenescompra/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/ordenescompra/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
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
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/metricas-empleado/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las métricas del empleado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el servicio de obtener métricas del empleado:", error);
    throw error;
  }
};