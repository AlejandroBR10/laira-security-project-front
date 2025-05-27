import { API_URL } from "/constants/constants.js";

// Función para obtener los datos del formulario y hacer la petición POST para agregar una ubicación
export async function agregarUbicacion(formAgregarUbicacion) {
  const nombre = formAgregarUbicacion.querySelector('[name="nombre"]').value;
  const direccion = formAgregarUbicacion.querySelector('[name="direccion"]').value;
  const coordenadas = formAgregarUbicacion.querySelector('[name="coordenadas"]').value;
  console.log(nombre,direccion,coordenadas);

  // Separar lat y lng
  const [lat, lng] = coordenadas.split(',').map(coord => parseFloat(coord.trim()));

  const newLocation = {
    locationName: nombre,
    locationAddress: direccion,
    locationLatLng: [lat, lng]
  };
    

  const res = await fetch(`${API_URL}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(newLocation)
  });


  if (res.status === 201) {
    alert("Ubicación agregada exitosamente.");
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarUbicacion"));
    modal.hide();
    window.location.reload();
  } else {
    const error = await res.json();
    alert(error.message || "Error al agregar la ubicación.");
  }
}