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
  descargarReporteExcel,
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
    asignacionesTareas,
    setAsignacionesTareas,
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasks, assignments, employees] = await Promise.all([
        usuarioLogeado.rol === 1
          ? getAllTasks()
          : getTasKToEmployee(usuarioLogeado.id_empleado),
        getAsignacionesTareas(),
        getAllEmployees(),
      ]);
      setTareas(tasks);
      setAsignacionesTareas(assignments);
      setEmpleados(employees);
    } catch (error) {
      console.error("Error al realizar los fetch:", error.message, error.stack);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioLogeado && usuarioLogeado.id_empleado !== null) {
      fetchData();
    } else {
      console.log("usuarioLogeado no está definido o id_empleado es null");
    }
  }, [usuarioLogeado]);

  const eliminarTarea = async (id) => {
    try {
      await deleteTarea(id);
      setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
      fetchData();
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
      fetchData();
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
      const currentAssignments = asignacionesTareas
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
      console.log(tareas);
      fetchData();
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
      fetchData();
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
                <div className="flex gap-4">
                  <button
                    className="p-2 bg-gray-800 text-white rounded-full shadow-lg flex items-center hover:shadow-xl transition"
                    onClick={() => setModalOpen(true)}
                  >
                    <FaPlus />
                  </button>

                </div>
              )}
          </div>
          <div className="bg-gray-900  p-6 rounded-lg">
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
          {usuarioLogeado &&
          (usuarioLogeado.rol === 1 || usuarioLogeado.rol === 2) && (
            <div className="flex justify-end mt-4">
              <button
                className="p-2 bg-blue-600 text-white rounded-full shadow-lg flex items-center hover:shadow-xl transition"
                onClick={descargarReporteExcel}
              >
                Descargar Reporte
              </button>
            </div>
          )}
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
          asignacionesTareas={asignacionesTareas} // Pasar asignacionesTareas para inicializar selectedUsers
        />
      </div>
    </>
  );
};

export default TareasView;
