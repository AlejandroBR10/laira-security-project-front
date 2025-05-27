// Mostrar/ocultar icono de usuario o botón de iniciar sesión según la cookie auth_for_security

import { API_URL } from "./constants/constants";
// Obtiene los datos del usuario autenticado usando la cookie
async function obtenerDatosUsuario() {
    try {
        const res = await fetch(`${API_URL}/auth/token`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) return null;
        const data = await res.json();
        // Ajusta los nombres de las propiedades según tu backend
        return {
            correo: data.user?.userEmail || data.email || null,
            rol : data.user?.userRoles || data.userRoles || null,
        };
    } catch (error) {
        console.error("Error al validar sesión:", error);
        alert("Error de red al obtener datos de usuario. Intenta más tarde.");
        return null;
    }
}

// Obtiene los datos del cliente por correo
async function valoresCliente(clienteEmail) {
    try {
        const res = await fetch(`${API_URL}/customers/email/${encodeURIComponent(clienteEmail)}`, {
            method: 'GET',
            credentials: 'include',
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) {
            console.warn(`Cliente no encontrado. Status: ${res.status}`);
            return null;
        }
        const text = await res.text();
        if (!text) {
            // Respuesta vacía
            return null;
        }
        const data = JSON.parse(text);
        return {
            nombre: `${data.customerName} ${data.customerLastName || ""}`.trim(),
            correo: data.customerEmail,
            telefono : data.customerPhoneNumber,
        };
    } catch (error) {
        console.error("Error al obtener datos del cliente:", error);
        alert("Error de red al obtener datos del cliente. Intenta más tarde.");
        return null;
    }
}

// Evento para mostrar datos en el modal al hacer clic en "Mi cuenta"
document.getElementById('btnMiCuenta')?.addEventListener('click', async function () {
    // 1. Obtén el usuario autenticado
    const usuario = await obtenerDatosUsuario();

     document.getElementById("rol").textContent = usuario.rol;
    if (!usuario || !usuario.correo) {
        document.getElementById('nombreUsuario').textContent = "";
        document.getElementById('correoUsuario').textContent = "";
        return;
    }

    // 2. Busca los datos del cliente por correo
    const datos = await valoresCliente(usuario.correo);
    console.log(datos);
    if (!datos) {
        document.getElementById('nombreUsuario').textContent = "";
        document.getElementById('correoUsuario').textContent = usuario.correo;
        document.getElementById("telefonoUsuario").textContent = "Aun no agregas tu numero telefonico";
        return;
    }

    // 3. Muestra los datos en el modal
    document.getElementById('nombreUsuario').textContent = datos.nombre;
    document.getElementById('correoUsuario').textContent = datos.correo;
    document.getElementById("telefonoUsuario").textContent = datos.telefono ? datos.telefono :  "Aun no agregas tu numero telefonico";



});


