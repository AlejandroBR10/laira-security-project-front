
import { API_URL } from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  let clientes = []; 

  try {
    // Realiza la solicitud GET a la API
    console.log("Realizando la petición GET...");
    const response = await fetch(`${API_URL}/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    if (response.status === 200) {
      clientes = await response.json(); 
      console.log(clientes); 

      renderClientes(clientes); 
    } else {
      alert("Error al obtener los clientes. Verifica tu conexión o permisos.");
    }
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    alert("Error de red. Intenta más tarde.");
  }

 
  document.querySelector(".btn-outline-primary").addEventListener("click", () => {
    const id = document.querySelector("#id").value.trim();
    let name = document.querySelector("#name").value.trim().toLowerCase();
    const email = document.querySelector("#email").value.trim().toLowerCase();

   
    const filteredClientes = clientes.filter((cliente) => {
      const matchesId = id ? cliente.customerId.toString().includes(id) : true;
      const matchesName = name
        ? `${cliente.customerName} ${cliente.customerLastName}`.toLowerCase().includes(name)
        : true;
      const matchesEmail = email ? cliente.customerEmail.toLowerCase().includes(email) : true;

      return matchesId && matchesName && matchesEmail;
    });
    if (filteredClientes.length === 0) {
    const tableBody = document.querySelector("#tablaClientes");
    tableBody.innerHTML = `
     <tr>
  <td colspan="6" class="text-center">
    <div class="py-4 text-muted">
      <i class="bi bi-exclamation-circle-fill me-2"></i>
      No se encontraron registros.
    </div>
  </td>
</tr>

    `;
    return;
  }
 

    renderClientes(filteredClientes); 
  });
});


function renderClientes(clientes) {
  const tableBody = document.querySelector("#tablaClientes");

  tableBody.innerHTML = ""; 

  clientes.forEach((cliente, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${cliente.customerId}</td>
        <td>${cliente.customerName} ${cliente.customerLastName}</td>
        <td>${cliente.customerPhoneNumber}</td>
        <td>${cliente.customerEmail}</td>
        <td class="text-end">
          <div class="d-flex justify-content-center">
            <button class="btn btn-sm btn-primary me-2"
              onclick="openEditModal('${cliente.customerId}', '${cliente.customerName}', '${cliente.customerLastName}', '${cliente.customerPhoneNumber}', '${cliente.customerEmail}')">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteClient('${cliente.customerId}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
    window.openEditModal = openEditModal;
      window.deleteClient = deleteClient;
  });
}


function openEditModal(customerId, customerName, customerLastName, customerPhoneNumber, customerEmail) {
  document.querySelector("#editClientId").value = customerId;
  document.querySelector("#editClientName").value = customerName;
  document.querySelector("#editClientLastName").value = customerLastName;
  document.querySelector("#editClientPhone").value = customerPhoneNumber;
  document.querySelector("#editClientEmail").value = customerEmail;

  const editModal = new bootstrap.Modal(document.querySelector("#editClientModal"));
  editModal.show();
}


function deleteClient(customerId) {
  document.querySelector("#deleteClientId").value = customerId;

  const deleteModal = new bootstrap.Modal(document.querySelector("#deleteClientModal"));
  deleteModal.show();
}