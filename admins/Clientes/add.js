import {API_URL} from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonCliente = document.querySelector("#botonAgregar");

  botonCliente.addEventListener("click", async (e) => {
    e.preventDefault();

    const newClient = {
      customerName: document.querySelector("#clientName").value,
      customerLastName: document.querySelector("#clientLastName").value,
      customerPhoneNumber: document.querySelector("#clientPhone").value,
      customerEmail: document.querySelector("#clientEmail").value,
    };
    console.log("Cliente: ",newClient);

    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
        credentials: "include",
      });

      if (response.status === 201) {
        alert("Cliente agregado exitosamente.");
        const modal = bootstrap.Modal.getInstance(document.querySelector("#addClientModal"));
        modal.hide(); 
        window.location.href = "../Clientes/index.html";
        
      } else {
        alert("Error al agregar el cliente. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al agregar el cliente:", error);
      alert("Error de red. Intenta más tarde.");
    }
  });
});

