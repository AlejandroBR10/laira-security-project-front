import { API_URL } from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonCliente = document.querySelector("#botonAgregar");
  const formReset = document.querySelector("#formMessage");
  const modalElement = document.querySelector("#addClientModal");

  botonCliente?.addEventListener("click", async (e) => {
    e.preventDefault();

    const newMessage = {
      supportFullName: document.querySelector("#clientName")?.value || "",
      supportPhoneNumber: document.querySelector("#clientPhone")?.value || "",
      supportEmail: document.querySelector("#clientEmail")?.value || "",
      supportMessage: document.querySelector("#clientMessage")?.value || "",
    };

    try {
      const response = await fetch(`${API_URL}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (response.status === 201) {
        alert("Mensaje enviado exitosamente.");
      
        if (modalElement && window.bootstrap) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
          modal.hide();
        }
    
        if (formReset) formReset.reset();
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