import { API_URL } from "../constants/constants";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let authDataCustomer = {
      customerName: formData.get("name"),
      customerLastName: formData.get("lastName"),
      customerPhoneNumber : formData.get("phoneNumber"),
      customerEmail: formData.get("email")
    };

    let authData = {
        userEmail: formData.get("email"),
       userPassword: formData.get("password")
      };

      const confirmPassword = formData.get("confirmPassword");
         if (authData.userPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden. Por favor, ingrésalas nuevamente.");
      // Limpiar los campos de contraseña
      loginForm.querySelector('[name="password"]').value = "";
      loginForm.querySelector('[name="confirmPassword"]').value = "";
      loginForm.querySelector('[name="password"]').focus();
      return;
    }

    console.log(authData); 

    try {
      const responseCustomers = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authDataCustomer),
        credentials: "include", 
      });

      const responseAuth = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
        credentials: "include", 
      });

      if (responseCustomers.status === 201 && responseAuth.status === 201) {
        console.log("Registro correcto");
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
