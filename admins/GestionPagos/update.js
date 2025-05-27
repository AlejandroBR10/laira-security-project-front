import { API_URL } from "/constants/constants.js";

// Función para obtener los datos del formulario y hacer la petición POST para agregar un pago
export async function agregarPagoDesdeModalUpdate(formAgregarPago,customerId) {
  //const customerId = formAgregarPago.querySelector('[name="customerId"]').value;
  console.log("idcliente:",customerId);
  const paymentId = formAgregarPago.querySelector('[name="paymentId"]').value;
  console.log("PAYMENTID",paymentId);
  const amount = formAgregarPago.querySelector('[name="amount"]').value;
  const description = formAgregarPago.querySelector('[name="description"]').value;
  const status = formAgregarPago.querySelector('[name="status"]').value;

  

   const newPayment = {
      amount : Number(amount),
      description,
      status,
      customerId
    };

  const res = await fetch(`${API_URL}/payments/${paymentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPayment),
    credentials : "include"
  });



  if (res.status === 200) {
    console.log( await res.json());
    
          window.location.href = "/admins/GestionPagos/index.html";

  }


}