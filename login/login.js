import { API_URL } from "/constants/constants";
import { ROLES } from "/constants/constants";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
    const adminCheckbox = document.querySelector("#adminCheck"); // Referencia al checkbox

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let authData = {
      userEmail: formData.get("email"),
      userPassword: formData.get("password"),

    };

   login(authData,adminCheckbox);

  });
});


async function obtenerRol() {
  try {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // importante para enviar cookie HttpOnly
    });

    if (response.status == 200) {
      const data = await response.json();
      //console.log('Datos usuario:', data);

      // data.user.userRoles debe ser un array con roles
      if (data.user.userRoles.includes("Admin")) {
        alert("Bienvenido al Panel de Administrador!");
        window.location.href = "/admins/Clientes/index.html";
      } else {
        alert("No eres administrador, no tienes acceso a esta página.");
        window.location.href = "/login/login.html"; // o la página que quieras
      }
    } else {
      alert("No estás autorizado. Por favor, inicia sesión.");
      //  window.location.href = "/login.html";
    }
  } catch (error) {
    console.error("Error al validar sesión:", error);
    alert("Error de red. Intenta más tarde.");
  }
}

async function login(authData,botonValidar){
  try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
        credentials: "include", 
      });

      if (response.status === 201) {
        if(botonValidar.checked == true){
      obtenerRol();
      return;
    }
        window.location.href = "/index.html";
      } else {
        alert("Credenciales incorrectas o error en el servidor.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error de red. Intenta más tarde.");
    }
  }