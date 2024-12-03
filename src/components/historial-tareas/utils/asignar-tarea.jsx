import React, { useState, useEffect } from "react";

const AssignTask = ({
  tareas,
  usuarios,
  usuarioLogeado,
  handleAssignTask,
  asignacionesTareas,
}) => {
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Tareas:", tareas);
  }, [tareas]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const asignador = usuarioLogeado.id_empleado; // Asignador es el id del usuario logeado

    // Verificar si asignacionesTareas está definido
    if (asignacionesTareas && Array.isArray(asignacionesTareas)) {


      const tareaAsignada = asignacionesTareas.some(
        (asignacion) =>
          asignacion.tarea?.tarea_id === parseInt(selectedTask) &&
          asignacion.empleado?.id_empleado === parseInt(selectedUser)
      );

      if (tareaAsignada) {
        setError("Esta tarea ya ha sido asignada a este empleado.");
        return;
      }
    }

    const data = {
      tarea: selectedTask,
      empleado: selectedUser,
      asignador: asignador,
    };
    console.log("Datos enviados:", data);
    handleAssignTask(data);
    setSelectedTask("");
    setSelectedUser("");
    setError("");
  };

  return (
    <div className="bg-white shadow-neu p-6 rounded-lg mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Asignar Tarea
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-500">{error}</p>}
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="p-2 rounded-md shadow-inner border"
        >
          <option value="" disabled>
            Selecciona una Tarea
          </option>
          {Array.isArray(tareas) &&
            tareas
              .filter((tarea) =>
                usuarioLogeado.rol === 1
                  ? tarea.estado === "Pendiente"
                  : tarea.tarea?.estado === "Pendiente"
              )
              .map((tarea) => (
                <option
                  key={
                    usuarioLogeado.rol === 1
                      ? tarea.tarea_id
                      : tarea.tarea.tarea_id
                  }
                  value={
                    usuarioLogeado.rol === 1
                      ? tarea.tarea_id
                      : tarea.tarea.tarea_id
                  }
                >
                  {usuarioLogeado.rol === 1 ? tarea.titulo : tarea.tarea.titulo}
                </option>
              ))}
        </select>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 rounded-md shadow-inner border"
        >
          <option value="" disabled>
            Selecciona un Usuario
          </option>
          {Array.isArray(usuarios) &&
            usuarios.map((usuario) => (
              <option key={usuario.id_empleado} value={usuario.id_empleado}>
                {usuario.nombre}
              </option>
            ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
        >
          Asignar
        </button>
      </form>
    </div>
  );
};

export default AssignTask;