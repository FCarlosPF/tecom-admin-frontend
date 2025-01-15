import { create } from 'zustand';

const useStore = create((set) => ({
  usuarioLogeado: {},
  empleados: [],
  tareas: [],
  asignacionesTareas: [],
  proyectos: [],
  notificaciones: [],
  setUsuarioLogeado: (usuarioLogeado) => set({ usuarioLogeado }),
  setEmpleados: (empleados) => set({ empleados }),
  setTareas: (tareas) => set({ tareas }),
  setAsignacionesTareas: (asignacionesTareas) => set({ asignacionesTareas }),
  setProyectos: (proyectos) => set({ proyectos }), 
  setNotificaciones: (notificaciones) => set({ notificaciones })
}));

export default useStore;