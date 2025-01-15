export const getInitials = (nombre, apellidos) => {
    const nombreInicial = nombre ? nombre.charAt(0).toUpperCase() : "";
    const apellidoInicial = apellidos ? apellidos.charAt(0).toUpperCase() : "";
    return `${nombreInicial}${apellidoInicial}`;
  };

export const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
export const capitalizeWords = (string) => {
  if (!string) return '';
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};  