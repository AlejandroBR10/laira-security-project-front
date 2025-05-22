import { API_URL } from "/constants/constants.js";

// Función para obtener los datos del formulario y hacer la petición POST para agregar un pago
export async function agregarPagoDesdeModalUpdate(formAgregarPago) {
  const customerId = formAgregarPago.querySelector('[name="customerId"]').value;
  console.log(customerId);
  const amount = formAgregarPago.querySelector('[name="amount"]').value;
  const description = formAgregarPago.querySelector('[name="description"]').value;
  const status = formAgregarPago.querySelector('[name="status"]').value;

  const data = {
    amount: Number(amount),
    description,
    status
  };

   const newPayment = {
      amount : Number(amount),
      description,
      status,
      customerId 
    };

  const res = await fetch(`${API_URL}/payments`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(newPayment)
  });

  if (res.status === 201) {
    console.log( await res.json());
    alert("Cliente agregado exitosamente.");
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarPago"));
        modal.hide(); 
        window.location.href = "/admins/GestionPagos/index.html";

  }


}