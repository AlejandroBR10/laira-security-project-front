import {API_URL} from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonCliente = document.querySelector("#botonEliminar");

  botonCliente.addEventListener("click", async (e) => {
    e.preventDefault();

     const customerId = document.querySelector("#deleteClientId").value;

    try {
      const response = await fetch(`${API_URL}/customers/${customerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
        console.log(response);
      if (response.status === 200) {
        alert("Cliente eliminado exitosamente.");
        const modal = bootstrap.Modal.getInstance(document.querySelector("#deleteClientModal"));
        modal.hide(); 
        window.location.href = "../Clientes/index.html";
        
      } else {
        alert("Error al eliminar el cliente. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      alert("Error de red. Intenta más tarde.");
    }
  });
});

