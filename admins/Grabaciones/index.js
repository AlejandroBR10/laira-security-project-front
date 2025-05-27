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

      // Configurar opciones del select
      select.innerHTML = `<option value="">-- Selecciona una persona --</option>`;
      clientes.forEach((cliente, index) => {
        const option = document.createElement("option");
        option.value = `persona${index + 1}`;
        option.textContent = `${cliente.customerName} ${cliente.customerLastName}`;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        document.querySelectorAll("#camarasContainer > div").forEach(div => {
          div.style.display = "none";
          div.querySelectorAll(".gif-loader").forEach(loader => {
            loader.classList.remove("loaded");
            loader.classList.add("loading");
          });
        });

        if (select.value === "") {
          defaultCameras.style.display = "flex";
          defaultCameras.querySelectorAll(".gif-loader").forEach(loader => {
            loader.classList.remove("loading");
            loader.classList.add("loaded");
          });
        } else {
          defaultCameras.style.display = "none";
          const selectedDiv = document.querySelector(`.${select.value}`);
          if (selectedDiv) {
            selectedDiv.style.display = "flex";
            selectedDiv.querySelectorAll(".gif-loader").forEach(loader => {
              loader.classList.remove("loaded");
              loader.classList.add("loading");
              setTimeout(() => {
                loader.classList.remove("loading");
                loader.classList.add("loaded");
              }, 1000);
            });
          }
        }
      });
    } else {
      console.error("Error al obtener clientes:", response.status);
    }

  } catch (error) {
    console.error("Error en la solicitud:", error);
  }

  // Mostrar cargador inicial
  document.querySelectorAll("#camarasContainer .gif-loader img").forEach((img) => {
    img.onload = () => {
      const parent = img.parentElement;
      parent.classList.add("loaded");
    };
  });

  // Alternar estado de cámaras
  document.querySelectorAll(".toggle-camera").forEach(button => {
    button.addEventListener("click", () => {
      const cameraDiv = button.previousElementSibling;
      const img = cameraDiv.querySelector("img");
      const cameraId = button.dataset.camera;

      const icon = button.querySelector("i");

      if (img.src.includes("tv-static.gif")) {
        img.src = img.src.replace("tv-static.gif", `sample_${cameraId}.gif`);
        cameraDiv.classList.add("loaded");
        cameraDiv.classList.remove("loading");

        button.classList.remove("btn-outline-success");
        button.classList.add("btn-outline-danger");
        button.innerHTML = `<i class="bi bi-power"></i> Apagar`;
      } else {
        img.src = img.src.replace(`sample_${cameraId}.gif`, "tv-static.gif");
        cameraDiv.classList.remove("loaded");
        cameraDiv.classList.add("loading");

        button.classList.remove("btn-outline-danger");
        button.classList.add("btn-outline-success");
        button.innerHTML = `<i class="bi bi-power"></i> Encender`;
      }
    });
  });
});
