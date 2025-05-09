import {API_URL} from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonCliente = document.querySelector("#botonActualizar");

  botonCliente.addEventListener("click", async (e) => {
    e.preventDefault();

     const customerId = document.querySelector("#editClientId").value;

    const updatedClient = {
     
      customerName: document.querySelector("#editClientName").value,
      customerLastName: document.querySelector("#editClientLastName").value,
      customerPhoneNumber: document.querySelector("#editClientPhone").value,
      customerEmail: document.querySelector("#editClientEmail").value,
    };
    console.log("Cliente: ",updatedClient);

    try {
      const response = await fetch(`${API_URL}/customers/${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClient),
        credentials: "include",
      });

      if (response.status === 200) {
        alert("Cliente actualizado exitosamente.");
        const modal = bootstrap.Modal.getInstance(document.querySelector("#editClientModal"));
        modal.hide(); 
        window.location.href = "../Clientes/index.html";
        
      } else {
        alert("Error al actualizar el cliente. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      alert("Error de red. Intenta más tarde.");
    }
  });
});

