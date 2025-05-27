import { API_URL } from "/constants/constants.js";

// Función para obtener los datos del formulario y hacer la petición POST para agregar una ubicación
export async function editarUbicacion(formEditarUbicacion) {
    const locationId = formEditarUbicacion.querySelector('[name=id]').value;
  const nombre = formEditarUbicacion.querySelector('[name="nombre"]').value;
  const direccion = formEditarUbicacion.querySelector('[name="direccion"]').value;
  const coordenadas = formEditarUbicacion.querySelector('[name="coordenadas"]').value;
  console.log("UPDATE:",locationId);

  // Separar lat y lng
  const [lat, lng] = coordenadas.split(',').map(coord => parseFloat(coord.trim()));

  const newLocation = {
    locationName: nombre,
    locationAddress: direccion,
    locationLatLng: [lat, lng]
  };
    

  const res = await fetch(`${API_URL}/locations/${locationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(newLocation)
  });


  if (res.status === 200) {
    alert("Ubicación actualizada exitosamente.");
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarUbicacion"));
    //modal.hide();
    window.location.reload();
  } else {
    const error = await res.json();
    alert(error.message || "Error al agregar la ubicación.");
  }
}