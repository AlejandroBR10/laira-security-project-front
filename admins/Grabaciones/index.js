import { API_URL } from "../../constants/constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("personaSelect");
  const camarasContainer = document.getElementById("camarasContainer");
  const defaultCameras = document.getElementById("defaultCameras");

  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 200) {
      const clientes = await response.json();

      // Configurar las opciones del select
      select.innerHTML = `<option value="">-- Selecciona una persona --</option>`;
      clientes.forEach((cliente, index) => {
        const option = document.createElement("option");
        option.value = `persona${index + 1}`;
        option.textContent = `${cliente.customerName} ${cliente.customerLastName}`;
        select.appendChild(option);
      });

      // 💡 Al inicio, asegurar que las imágenes sean estáticas (.png) y apagadas
      document.querySelectorAll(".default-cameras img").forEach(img => {
        img.src = img.src.replace(".gif", ".png");
      });

      select.addEventListener("change", () => {
        document.querySelectorAll("#camarasContainer > div").forEach(div => {
          div.style.display = "none";
          div.querySelectorAll("img").forEach(img => img.classList.remove("camara-activa"));
        });
      
        if (select.value === "") {
          defaultCameras.style.display = "flex";
          defaultCameras.querySelectorAll("img").forEach(img => {
            img.src = img.src.replace(".gif", ".png");
            img.classList.remove("camara-activa"); // Mantiene apagadas
          });
      
        } else {
          defaultCameras.style.display = "none";
      
          document.querySelectorAll(`.${select.value} img`).forEach(img => {
            img.src = img.src.replace(".png", ".gif");
            img.classList.add("camara-activa"); // Activa el efecto de encendido
          });
      
          const selectedDiv = document.querySelector(`.${select.value}`);
          if (selectedDiv) {
            selectedDiv.style.display = "flex";
          }
        }
      });
      

    } else {
      console.error("Error al obtener clientes:", response.status);
    }

  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
});
