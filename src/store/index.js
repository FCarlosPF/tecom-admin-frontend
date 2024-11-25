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
    rol: null,
  },
  empleados: [],
  tareas: [],
  setUsuarioLogeado: (usuario) => set({ usuarioLogeado: usuario }),
  setEmpleados: (empleados) => set({ empleados }),
  setTareas: (tareas) => set({ tareas }),
}));

export default useStore;