import {API_URL} from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonMensaje = document.querySelector("#botonEliminarMensaje");

  botonMensaje.addEventListener("click", async (e) => {
    e.preventDefault();

    const supportId = document.querySelector("#deleteSupportId").value;

    try {
      const response = await fetch(`${API_URL}/support/${supportId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.status === 200) {
        alert("Mensaje eliminado exitosamente.");
        const modal = bootstrap.Modal.getInstance(document.querySelector("#deleteMessageModal"));
        modal.hide();
        window.location.reload();
      } else {
        alert("Error al eliminar el mensaje. Verifica los datos.");
      }
    } catch (error) {
      alert("Error de red. Intenta más tarde.");
    }
  });
});