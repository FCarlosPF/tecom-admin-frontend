import { create } from 'zustand';

const useStore = create((set) => ({
  usuarioLogeado: {
    id_empleado: null,
    nombre: '',
    apellidos: '',
    correo: '',
    especialidad: '',
    sueldo: '',
    activo: false,
    foto: '',
    nombre_usuario: '',
    fecha_contratacion: '',
    area: null,
    rol: null
  },
  empleados: [],
  tareas: [],
  asignacionesTareas: [],
  proyectos: [],
  notificaciones: [],
  setUsuarioLogeado: (usuario) => set({ usuarioLogeado: usuario }),
  setEmpleados: (empleados) => set({ empleados }),
  setTareas: (tareas) => set({ tareas }),
  setAsignacionesTareas: (asignacionesTareas) => set({ asignacionesTareas }),
  setProyectos: (proyectos) => set({ proyectos }), 
  setNotificaciones: (notificaciones) => set({ notificaciones })
}));

export default useStore;