import CalendarioTareas from "@/components/calendar";
import React from "react";


const App = () => {
  const id_empleado = 6; // Reemplaza con el ID del empleado que desees

  return (
    <div>
      <CalendarioTareas id_empleado={id_empleado} />
    </div>
  );
};

export default App;