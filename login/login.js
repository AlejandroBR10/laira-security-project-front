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

    if(adminCheckbox.checked == true){
      obtenerRol();
      return;
    }

    console.log(authData); 

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
        
        window.location.href = "/dashboard.html";
      } else {
        alert("Credenciales incorrectas o error en el servidor.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error de red. Intenta más tarde.");
    }
  });
});


async function obtenerRol(){
  let data = []
try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      
      if (response.status === 200) {
        data = await response.json();
        if(data.user.userRoles.includes("Admin")){
          alert("Bienvenido al Panel de Administrador!");
          window.location.href = "/admins/Clientes/index.html";
        }
        
     
      } else {
        alert("Me parece que no eres administrador, ingresa como cliente o registrate");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error de red. Intenta más tarde.");
    }
}
