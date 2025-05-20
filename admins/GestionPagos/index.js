import { STATUS } from "../../constants/constants";
import { API_URL } from "/constants/constants.js";

// Asegúrate de tener jsPDF en tu HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

document.addEventListener("DOMContentLoaded", async () => {
  let pagos = [];
  let clientes = [];

  // Referencias a elementos del DOM
  const tablaPagos = document.getElementById("tablaPagos");
  const resumenCliente = document.getElementById("resumenCliente");
  const selectorClientes = document.getElementById("selectorClientes");

  // 1. Obtener clientes y llenar el selector
  try {
    const resClientes = await fetch(`${API_URL}/customers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (resClientes.status === 200) {
      clientes = await resClientes.json();
      if (selectorClientes) {
        selectorClientes.innerHTML = `<option value="">Selecciona un cliente</option>`;
        clientes.forEach(cliente => {
          selectorClientes.innerHTML += `<option value="${cliente.customerId}">${cliente.customerName} ${cliente.customerLastName}</option>`;
        });
        // Evento para mostrar pagos al seleccionar desde el selector
        selectorClientes.addEventListener("change", () => {
          const clienteId = selectorClientes.value;
          mostrarResumenCliente(clienteId);
          mostrarPagos(clienteId);
        });
      }
    } else {
      alert("Error al obtener los clientes.");
    }
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    alert("Error de red al obtener clientes.");
  }

  // 2. Obtener todos los pagos
  try {
    const resPagos = await fetch(`${API_URL}/payments`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (resPagos.status === 200) {
      pagos = await resPagos.json();
    } else {
      alert("Error al obtener los pagos.");
    }
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    alert("Error de red al obtener pagos.");
  }

  // Mostrar resumen del cliente
  function mostrarResumenCliente(clienteId) {
    if (!clienteId) {
      resumenCliente.innerHTML = "";
      return;
    }
    const cliente = clientes.find(c => c.customerId == clienteId);
    if (!cliente) {
      resumenCliente.innerHTML = "";
      return;
    }
    resumenCliente.innerHTML = `
      <div class="alert alert-primary d-flex align-items-center gap-3" role="alert">
        <i class="bi bi-person-circle fs-3"></i>
        <div>
          <div><strong>${cliente.customerName} ${cliente.customerLastName}</strong></div>
          <div class="small text-muted">${cliente.customerEmail || ""}</div>
        </div>
      </div>
    `;
  }

  // Mostrar pagos del cliente
  function mostrarPagos(clienteId) {
    let pagosFiltrados = pagos.filter(p => p.customer && p.customer.customerId == clienteId);

    if (pagosFiltrados.length === 0) {
      tablaPagos.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            <i class="bi bi-exclamation-circle me-2"></i>
            No se encontraron pagos para este cliente.
          </td>
        </tr>
      `;
      return;
    }

    tablaPagos.innerHTML = pagosFiltrados.map((pago, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <div class="fw-bold">${pago.customer ? pago.customer.customerName + " " + pago.customer.customerLastName : "-"}</div>
          <div class="small text-muted">${pago.customer ? pago.customer.customerEmail : ""}</div>
        </td>
        <td>${pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : "-"}</td>
        <td>${pago.amount ? `$${Number(pago.amount).toLocaleString('es-MX', {minimumFractionDigits:2})}` : "-"}</td>
        <td>
          <span class="badge rounded-pill px-3 py-2 fs-6
            ${pago.status === STATUS.COMPLETED ? 'bg-success' : pago.status === STATUS.PENDING ? 'bg-warning text-dark' : pago.status === STATUS.FAILED ? 'bg-danger' : 'bg-secondary'}">
            ${pago.status}
          </span>
        </td>
        <td>${pago.description || "-"}</td>
        <td>
          <button class="btn btn-outline-secondary btn-sm" onclick="generarFactura('${pago.paymentId}')">
            <i class="bi bi-file-earmark-pdf"></i> Factura
          </button>
        </td>
      </tr>
    `).join("");
  }

  // Exponer la función para el botón de factura
  window.generarFactura = function(paymentId) {
    const pago = pagos.find(p => p.paymentId === paymentId);
    if (!pago) return alert("Pago no encontrado");

  
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    //doc.text("Factura Electrónica", 70, 20);
    doc.text("LAIRA-SECURITY", 70, 20);
    doc.setFontSize(12);
    doc.text(`Folio: ${pago.paymentId}`, 14, 35);
    doc.text(`Cliente: ${pago.customer.customerName} ${pago.customer.customerLastName}`, 14, 45);
    doc.text(`Correo: ${pago.customer.customerEmail}`, 14, 52);
    doc.text(`Fecha: ${pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : "-"}`, 14, 59);
    doc.text(`Descripción: ${pago.description || "-"}`, 14, 66);
    doc.text(`Monto: $${Number(pago.amount).toLocaleString('es-MX', {minimumFractionDigits:2})}`, 14, 73);
    doc.text(`Estado: ${pago.status}`, 14, 80);

    doc.setFontSize(10);
    doc.text("Este documento es una simulación de factura electrónica.", 14, 100);

    // Abrir el PDF en una nueva ventana
    window.open(doc.output("bloburl"), "_blank");
  };
});