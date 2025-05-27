import { STATUS } from "/constants/constants.js";
import { API_URL } from "/constants/constants.js";
import { agregarPagoDesdeModal } from "./add.js";
import { agregarPagoDesdeModalUpdate } from "./update.js";
import { eliminarPago } from "./delete.js";
// Asegúrate de tener jsPDF en tu HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

document.addEventListener("DOMContentLoaded", async () => {
  let pagos = [];
  let clientes = [];

  // Referencias a elementos del DOM
  let clienteId;
  const tablaPagos = document.getElementById("tablaPagos");
  const resumenCliente = document.getElementById("resumenCliente");
  const selectorClientes = document.getElementById("selectorClientes");
  const formAgregarPago = document.getElementById("formAgregarPago");
  const formActualizarPago = document.getElementById("formEditarPago");
  const formEliminarPago = document.getElementById("formEliminarPago");
  const inputCustomerIdAgregar = formAgregarPago.querySelector('[name="customerId"]');
  const inputPaymentIdActualizar = formActualizarPago.querySelector('[name="paymentId"]');

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
           clienteId = selectorClientes.value;
          console.log("CLINETE:",  clienteId);
          mostrarResumenCliente(clienteId);
          mostrarPagos(clienteId);
          if (inputCustomerIdAgregar) inputCustomerIdAgregar.value = clienteId;
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
      // Deshabilita el botón de editar pago si no hay pagos
      document.getElementById("btnEditarPago")?.setAttribute("disabled", "disabled");
      return;
    }

    tablaPagos.innerHTML = pagosFiltrados.map((pago, idx) => `
      <tr class="fila-pago" data-payment-id="${pago.paymentId}">
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

    // Evento para seleccionar fila y activar botones de editar y eliminar pago
    document.querySelectorAll(".fila-pago").forEach(row => {
      row.addEventListener("click", function () {
        // Remueve selección previa
        document.querySelectorAll(".fila-pago").forEach(r => r.classList.remove("table-active"));
        this.classList.add("table-active");

        const paymentId = this.getAttribute("data-payment-id");
        inputCustomerIdAgregar.value = paymentId;

        // Habilita el botón de editar pago
        const btnEditar = document.getElementById("btnEditarPago");
        if (btnEditar) {
          btnEditar.removeAttribute("disabled");
          btnEditar.onclick = () => {
            // Carga los datos del pago en el modal de editar
            cargarDatosPagoEnModal(paymentId);
            // Muestra el modal de editar pago
            const modalEditar = window.bootstrap?.Modal.getOrCreateInstance(document.getElementById("modalEditarPago"));
            modalEditar?.show();
          };
        }

        // Habilita el botón de eliminar pago
        const btnEliminar = document.getElementById("btnEliminarPago");
        if (btnEliminar) {
          btnEliminar.removeAttribute("disabled");
          btnEliminar.onclick = () => {
            // Puedes cargar el id en un input hidden del modal si lo necesitas
            document.querySelector("#formEliminarPago [name='paymentId']").value = paymentId;
            console.log(paymentId);
            
            const modalEliminar = window.bootstrap?.Modal.getOrCreateInstance(document.getElementById("modalEliminarPago"));
            modalEliminar?.show();
            formEliminarPago.addEventListener("submit", async (e) => {
    e.preventDefault();
    try{
      await eliminarPago(paymentId);
    }catch(err){
      alert(err.message);
    }
  });
          };
        }
      });
    });

    // Deshabilita los botones si no hay selección
    document.getElementById("btnEditarPago")?.setAttribute("disabled", "disabled");
    document.getElementById("btnEliminarPago")?.setAttribute("disabled", "disabled");
  }

  // Función para cargar los datos del pago seleccionado en el modal de editar
  function cargarDatosPagoEnModal(paymentId) {
    const pago = pagos.find(p => p.paymentId === paymentId);
    if (!pago) return;
    const formEditar = document.getElementById("formEditarPago");
    if (!formEditar) return;
    formEditar.querySelector('[name="paymentId"]').value = pago.paymentId;
    formEditar.querySelector('[name="amount"]').value = pago.amount;
    formEditar.querySelector('[name="description"]').value = pago.description || "";
    formEditar.querySelector('[name="status"]').value = pago.status;
    formEditar.querySelector('[name="customerId"]').value = pago.customerId;
    console.log("ggggg",clienteId);

     formActualizarPago.addEventListener("submit", async (e) => {
    e.preventDefault();
    try{
      await agregarPagoDesdeModalUpdate(formActualizarPago,clienteId);
    }catch(err){
      alert(err.message);
    }
  });

   
  }

  // Exponer la función para el botón de factura
  window.generarFactura = async function(paymentId) {
    const pago = pagos.find(p => p.paymentId === paymentId);
    if (!pago) return alert("Pago no encontrado");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Paleta formal y minimalista
    const azul = "#1A2238";
    const celeste = "#9DAAF2";
    const grisClaro = "#F4F6FB";
    const grisOscuro = "#22223B";
    const grisMedio = "#6c757d";

    // --- Encabezado formal ---
    doc.setFillColor(26, 34, 56); // azul
    doc.rect(0, 0, 210, 38, "F");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("LAIRA SECURITY", 14, 18); // Título empresa
    doc.setFontSize(13);
    doc.setTextColor(157, 170, 242);
    doc.text("Factura Electrónica", 14, 30);
    doc.setFontSize(10);
    doc.setTextColor(200, 210, 255);
    doc.text(`Emitida: ${new Date().toLocaleDateString()}`, 200, 16, { align: "right" });

    // --- Datos del Cliente (más espacio y alineación) ---
    doc.setFillColor(244, 246, 251); // grisClaro
    doc.roundedRect(10, 44, 190, 34, 3, 3, "F");
    doc.setFontSize(12);
    doc.setTextColor(azul);
    doc.text("Datos del Cliente", 14, 54);

    doc.setFontSize(11);
    doc.setTextColor(grisOscuro);
    doc.text("Nombre:", 14, 62);
    doc.setTextColor(azul);
    doc.text(`${pago.customer.customerName} ${pago.customer.customerLastName}`, 38, 62);

    doc.setTextColor(grisOscuro);
    doc.text("Correo:", 14, 69);
    doc.setTextColor(azul);
    doc.text(`${pago.customer.customerEmail}`, 38, 69);

    doc.setTextColor(grisOscuro);
    doc.text("Folio:", 14, 76);
    doc.setTextColor(azul);
    doc.text(`${pago.paymentId}`, 38, 76);

    // --- Detalle del Pago (más espacio y separación) ---
    doc.setFillColor(244, 246, 251);
    doc.roundedRect(10, 84, 190, 36, 3, 3, "F");
    doc.setFontSize(12);
    doc.setTextColor(azul);
    doc.text("Detalle del Pago", 14, 94);

    doc.setFontSize(11);
    doc.setTextColor(grisOscuro);
    doc.text("Fecha:", 14, 102);
    doc.setTextColor(azul);
    doc.text(`${pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : "-"}`, 38, 102);

    doc.setTextColor(grisOscuro);
    doc.text("Descripción:", 14, 109);
    doc.setTextColor(azul);
    doc.text(`${pago.description || "-"}`, 38, 109);

    // --- Monto y Estado (alineados y con espacio) ---
    doc.setFontSize(12);
    doc.setTextColor(grisOscuro);
    doc.text("Monto:", 14, 122);
    doc.setFontSize(16);
    doc.setTextColor(azul);
    doc.text(`${pago.amount ? `$${Number(pago.amount).toLocaleString('es-MX', {minimumFractionDigits:2})}` : "-"}`, 38, 122);

    doc.setFontSize(13);
    doc.setTextColor(grisOscuro);
    let estadoTxt = pago.status;
    if (pago.status === STATUS.COMPLETED) {
      estadoTxt = "Pagado";
    } else if (pago.status === STATUS.PENDING) {
      estadoTxt = "Pendiente";
    } else if (pago.status === STATUS.FAILED) {
      estadoTxt = "Fallido";
    }
    doc.text("Estado:", 120, 122);
    doc.setFontSize(13);
    doc.setTextColor(azul);
    doc.text(estadoTxt, 140, 122);

    // --- Pie de página formal ---
    doc.setDrawColor(157, 170, 242);
    doc.setLineWidth(0.5);
    doc.line(10, 145, 200, 145);
    doc.setFontSize(9);
    doc.setTextColor(157, 170, 242);
    doc.text("Este documento es una simulación de factura electrónica. LAIRA SECURITY © 2025", 105, 152, { align: "center" });

    // Abrir el PDF en una nueva ventana
    window.open(doc.output("bloburl"), "_blank");
  };

  // Al abrir el modal de agregar pago, poner el cliente seleccionado por default
  document.getElementById("modalAgregarPago")?.addEventListener("show.bs.modal", () => {
    if (inputCustomerIdAgregar) inputCustomerIdAgregar.value = selectorClientes.value;
  });

 

  formAgregarPago.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await agregarPagoDesdeModal(formAgregarPago);
      // Cierra el modal y recarga la tabla, etc.
    } catch (err) {
      alert(err.message);
    }
  });
});





