"use client";

import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import useStore from "@/store";
import {
  addTask,
  getAllTasks,
  getTasKToEmployee,
  deleteTarea,
  addAsignacionTarea,
  getAsignacionesTareas,
  getAllEmployees,
  updateTareas,
  updateAsignacionesTareas,
  deleteAsignacionesTareas,
} from "@/services/service";
import Modal from "./utils/create-modal";
import TaskTable from "./utils/tarea-table";
import Pagination from "./utils/paginations";
import AssignTask from "./utils/asignar-tarea";
import { toast } from "react-toastify";
import { formatISO } from "date-fns";
import EditModal from "./utils/edit-modal";
import EditTaskModal from "./utils/edit-modal";

const TareasView = () => {
  const {
    tareas,
    setTareas,
    usuarioLogeado,
    setUsuarioLogeado,
    empleados,
    setEmpleados,
  } = useStore();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [newTask, setNewTask] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: formatISO(new Date()),
    fecha_estimada_fin: "",
    prioridad: "",
    estado: "Pendiente",
    tarea_padre: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [asignacionestareas, setAsignacionesTareas] = useState([]);

  const fetchTareas = async () => {
    if (!usuarioLogeado) {
      console.error("usuarioLogeado no está definido");
      setTareas([]);
      setLoading(false);
      return;
    }

    if (usuarioLogeado.id_empleado === null) {
      console.log("id_empleado es null, no se ejecuta fetchTareas");
      setLoading(false);
      return;
    }

    try {
      console.log(
        "Estado de usuarioLogeado al iniciar fetchTareas:",
        usuarioLogeado
      );
      let data;
      if (usuarioLogeado.rol === 1) {
        console.log("Usuario con rol 1, obteniendo todas las tareas");
        data = await getAllTasks();
      } else {
        if (!usuarioLogeado.id_empleado) {
          console.error("id_empleado no está definido en usuarioLogeado");
          setTareas([]);
          setLoading(false);
          return;
        }
        console.log(
          `Usuario con rol ${usuarioLogeado.rol}, obteniendo tareas para el empleado ${usuarioLogeado.id_empleado}`
        );
        data = await getTasKToEmployee(usuarioLogeado.id_empleado);
        console.log(data);
      }
      const dataAsignacionesTareas = await getAsignacionesTareas();
      setAsignacionesTareas(dataAsignacionesTareas);
      console.log("Datos obtenidos de asignaciones:", dataAsignacionesTareas);
      const dataEmpelados = await getAllEmployees();
      setEmpleados(dataEmpelados);

      setTareas(data || []);
    } catch (error) {
      console.error("Error al obtener las tareas:", error.message, error.stack);
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
    console.log("Cargando usuarioLogeado desde localStorage:", usuarioLogeado);
    if (usuarioLogeado) {
      setUsuarioLogeado(usuarioLogeado);
    }
  }, [setUsuarioLogeado]);

  useEffect(() => {
    if (usuarioLogeado) {
      fetchTareas();
    } else {
      console.log("usuarioLogeado no está definido, no se ejecuta fetchTareas");
    }
  }, [usuarioLogeado, setTareas, setLoading]);

  const eliminarTarea = async (id) => {
    try {
      await deleteTarea(id);
      setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
      fetchTareas();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const editarTarea = (task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  const handleAddTask = async (selectedUsers) => {
    try {
      const taskToAdd = { ...newTask, estado: "Pendiente" };
      console.log("Enviando a la API:", taskToAdd);
      const addedTask = await addTask(taskToAdd);
      console.log("Tarea añadida:", addedTask);

      if (addedTask && addedTask.tarea_id) {
        setTareas((prev) => [...prev, addedTask]);

        if (usuarioLogeado && usuarioLogeado.rol === 2) {
          const tarea = addedTask.tarea_id;
          const empleado = usuarioLogeado.id_empleado;

          // Asignar la tarea al usuario logeado
          await handleAssignTask({
            tarea,
            empleado,
            asignador: usuarioLogeado.id_empleado,
          });
        }

        if (selectedUsers.length > 0) {
          for (const userId of selectedUsers) {
            await handleAssignTask({
              tarea: addedTask.tarea_id,
              empleado: userId,
              asignador: usuarioLogeado.id_empleado,
            });
          }
        }
      } else {
        console.error("La tarea añadida no contiene un id:", addedTask);
      }

      setNewTask({
        titulo: "",
        descripcion: "",
        fecha_inicio: formatISO(new Date()), // Incluye fecha y hora exacta
        fecha_estimada_fin: "",
        prioridad: "",
        estado: "Pendiente",
        tarea_padre: null,
      });
      setModalOpen(false);
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  };

  const handleEditTask = async (editedTask, selectedUsers) => {
    try {
      console.log("Editando tarea:", editedTask);
      await updateTareas(editedTask.tarea_id, editedTask);
      console.log("Tarea actualizada:", editedTask);

      // Obtener las asignaciones actuales de la tarea
      const currentAssignments = asignacionestareas
        .filter(
          (asignacion) => asignacion.tarea.tarea_id === editedTask.tarea_id
        )
        .map((asignacion) => ({
          asignacion_id: asignacion.asignacion_id,
          userId: asignacion.empleado.id_empleado,
        }));

      console.log("currentAssignments", currentAssignments);

      // Asignar la tarea a los usuarios seleccionados
      await Promise.all(
        selectedUsers.map(async (userId) => {
          if (
            !currentAssignments.some(
              (asignacion) => asignacion.userId === userId
            )
          ) {
            await handleAssignTask({
              tarea: editedTask.tarea_id,
              empleado: userId,
              asignador: usuarioLogeado.id_empleado,
            });
          }
        })
      );

      // Eliminar asignaciones de los usuarios deseleccionados
      await Promise.all(
        currentAssignments.map(async ({ asignacion_id, userId }) => {
          if (!selectedUsers.includes(userId)) {
            await deleteAsignacionesTareas(asignacion_id);
          }
        })
      );

      setTareas((prev) =>
        prev.map((tarea) =>
          tarea.tarea_id === editedTask.tarea_id ? editedTask : tarea
        )
      );
      fetchTareas();
      toast.success("Tarea editada correctamente");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error al editar la tarea:", error);
      toast.error("Error al editar la tarea");
    }
  };

  const handleAssignTask = async (taskId, userId, asignador) => {
    try {
      console.log("Asignando tarea:", { taskId, userId, asignador });
      await addAsignacionTarea(taskId, userId, asignador);
      fetchTareas();
      toast.success("Tarea asignada correctamente");
      console.log("Tarea asignada correctamente");
    } catch (error) {
      console.error("Error al asignar la tarea:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(tareas)
    ? tareas.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Historial de Tareas
            </h2>
            {usuarioLogeado &&
              (usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) && (
                <button
                  className="p-2 bg-gray-200 text-gray-700 rounded-full shadow-neu flex items-center hover:shadow-neu-active transition"
                  onClick={() => setModalOpen(true)}
                >
                  <FaPlus />
                </button>
              )}
          </div>
          <div className="bg-gray-200 shadow-neu p-6 rounded-lg">
            <TaskTable
              tareas={currentItems}
              usuarioLogeado={usuarioLogeado}
              eliminarTarea={eliminarTarea}
              editarTarea={editarTarea} // Pasar la función editarTarea como prop
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(tareas.length / itemsPerPage)}
              paginate={setCurrentPage}
            />
          </div>
        </div>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          newTask={newTask}
          setNewTask={setNewTask}
          handleAddTask={handleAddTask}
          tareas={tareas} // Pasar las tareas para seleccionar tarea_padre
          usuarioLogeado={usuarioLogeado} // Pasar usuarioLogeado para verificar el rol
          empleados={empleados} // Pasar empleados para asignar tareas
        />
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          taskToEdit={taskToEdit}
          handleEditTask={handleEditTask}
          tareas={tareas}
          usuarioLogeado={usuarioLogeado}
          empleados={empleados}
          asignacionesTareas={asignacionestareas} // Pasar asignacionesTareas para inicializar selectedUsers
        />
      </div>
    </>
  );
};

export default TareasView;
