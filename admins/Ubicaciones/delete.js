import { API_URL } from "/constants/constants.js";

// Función para obtener los datos del formulario y hacer la petición POST para agregar una ubicación
export async function eliminarUbicacion(formEliminarUbicacion) {
   
  const locationId = formEliminarUbicacion.querySelector('[name="id"]').value;
   console.log(locationId);

  const res = await fetch(`${API_URL}/locations/${locationId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });


  if (res.status === 200) {
    alert("Ubicación eliminada exitosamente.");
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarUbicacion"));
    //modal.hide();
    window.location.reload();
  } else {
    const error =  res.json();
    alert(error.message || "Error al agregar la ubicación.");
  }
}