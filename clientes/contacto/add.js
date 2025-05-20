import {API_URL} from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonCliente = document.querySelector("#botonAgregar");

  botonCliente.addEventListener("click", async (e) => {
    e.preventDefault();

    const newMessage = {
      customerName: document.querySelector("#clientName").value,
      customerPhoneNumber: document.querySelector("#clientPhone").value,
      customerEmail: document.querySelector("#clientEmail").value,
      customerMessage: document.querySelector("#clientMessage").value,
    };
    console.log("Mensaje: ",newMessage);

    try {
      const response = await fetch(`${API_URL}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
        credentials: "include",
      });

      if (response.status === 201) {
        alert("Mensaje enviado exitosamente.");
        const modal = document.querySelector("#addClientModal");
        modal.style.display = "none";
        const formReset = document.querySelector("#formMessage");
        formReset.reset();
        window.location.href = "../contacto/index.html";
        
      } else {
        alert("Error al redactar el mensaje. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al agregar mensaje:", error);
      alert("Error de red. Intenta más tarde.");
    }
  });
});