const API_URL = "http://127.0.0.1:4000";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let authData = {
      userEmail: formData.get("email"),
      userPassword: formData.get("password"),
    };

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
