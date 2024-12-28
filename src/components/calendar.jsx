"use client";

import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { obtenerTareasPendientesEmpleado } from "../services/service";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import useStore from "@/store";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarioTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { usuarioLogeado} = useStore();

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const data = await obtenerTareasPendientesEmpleado(
          usuarioLogeado.id_empleado
        );
        setTareas(data);
      } catch (error) {
        console.error(
          "Error al obtener las tareas pendientes:",
          error.message,
          error.stack
        );
      } 
    };

    if (usuarioLogeado && usuarioLogeado.id_empleado !== null) {
      fetchTareas();
    } else {
      console.log("usuarioLogeado no está definido o id_empleado es null");
    }
  }, [usuarioLogeado]);

  const events = tareas.map((tarea) => ({
    title: tarea.tarea_titulo,
    start: new Date(tarea.tarea_fecha_inicio),
    end: new Date(tarea.tarea_fecha_estimada_fin),
    allDay: false,
    resource: tarea,
  }));

  const handleNavigate = (newDate) => {
    console.log("Nueva fecha:", newDate);
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    console.log("Nueva vista:", newView);
    setView(newView);
  };

  // Mostrar solo algunos eventos si hay más de 4 en un día
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const eventsInSelectedDate = events.filter(
    (event) => event.start.toDateString() === selectedDate?.toDateString()
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Calendario de Tareas
      </h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        messages={{
          next: ">",
          previous: "<",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
        }}
        eventPropGetter={(event) => {
          let backgroundColor;
          let borderColor;

          switch (event.resource.tarea_estado) {
            case "Pendiente":
              backgroundColor = "#f56565";
              borderColor = "#c53030";
              break;
            case "En Progreso":
              backgroundColor = "#f6ad55";
              borderColor = "#dd6b20";
              break;
            default:
              backgroundColor = "#3182ce";
              borderColor = "#2b6cb0";
          }

          return {
            style: {
              backgroundColor,
              borderColor,
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "4px",
              padding: "4px",
              color: "white",
              fontSize: "12px", // Reducir el tamaño de la fuente
              whiteSpace: "nowrap", // Asegura que el texto no se desborde
              textOverflow: "ellipsis", // Muestra "..." cuando el texto es demasiado largo
              overflow: "hidden", // Oculta el texto cuando es muy largo
              textAlign: "center", // Centra el texto
              fontWeight: "bold", // Hace el texto en negrita
            },
          };
        }}
        onSelectSlot={handleDayClick} // Para seleccionar un día
        components={{
          toolbar: (props) => (
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => props.onNavigate("PREV")}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Anterior
                </button>
                <button
                  onClick={() => props.onNavigate("TODAY")}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Hoy
                </button>
                <button
                  onClick={() => props.onNavigate("NEXT")}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Siguiente
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => props.onView("month")}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Mes
                </button>
                <button
                  onClick={() => props.onView("week")}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Semana
                </button>
                <button
                  onClick={() => props.onView("day")}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Día
                </button>
                <button
                  onClick={() => props.onView("agenda")}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Agenda
                </button>
              </div>
            </div>
          ),
        }}
      />

      {/* Modal para mostrar los detalles del día */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">
              Tareas para el {selectedDate.toLocaleDateString()}
            </h2>
            <ul>
              {eventsInSelectedDate.map((event, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>{event.title}</strong>
                  </p>
                  <p>
                    {new Date(event.start).toLocaleTimeString()} -{" "}
                    {new Date(event.end).toLocaleTimeString()}
                  </p>
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioTareas;
