import { API_URL } from "/constants/constants.js";

// Función para obtener los datos del formulario y hacer la petición POST para agregar un pago
export async function eliminarPago(paymentId) {
 
  console.log("PAYMENTID",paymentId);

  

  const res = await fetch(`${API_URL}/payments/${paymentId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials : "include"
  });


  if (res.status === 200) {
    alert("Pago eliminado exitosamente.");
        window.location.href = "/admins/GestionPagos/index.html";
  }


}