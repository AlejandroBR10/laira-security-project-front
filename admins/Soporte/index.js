import { API_URL } from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  let mensajes = [];

  try {
    const response = await fetch(`${API_URL}/support`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 200) {
      mensajes = await response.json();
      renderMensajes(mensajes);
    } else {
      alert("Error al obtener los mensajes.");
    }
  } catch (error) {
    alert("Error de red. Intenta más tarde.");
  }
});

function renderMensajes(mensajes) {
  const tableBody = document.querySelector("#tablaMensajes");
  tableBody.innerHTML = "";

  mensajes.forEach((mensaje, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${mensaje.supportId}</td>
        <td>${mensaje.supportFullName}</td>
        <td>${mensaje.supportPhoneNumber}</td>
        <td>${mensaje.supportEmail}</td>
        <td>${mensaje.supportMessage}</td>
        <td class="text-end">
          <div class="d-flex justify-content-center">
            <button class="btn btn-sm btn-danger" onclick="deleteMessage('${mensaje.supportId}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
    window.deleteProduct = deleteMessage;
  });
}

function deleteMessage(supportId) {
  document.querySelector("#deleteSupportId").value = supportId;
  const deleteModal = new bootstrap.Modal(document.querySelector("#deleteMessageModal"));
  deleteModal.show();
}