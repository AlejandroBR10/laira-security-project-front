import { API_URL } from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  let productos = [];

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 200) {
      productos = await response.json();
      renderProductos(productos);
    } else {
      alert("Error al obtener los productos.");
    }
  } catch (error) {
    alert("Error de red. Intenta más tarde.");
  }

  document.querySelector(".btn-outline-primary").addEventListener("click", () => {
    const id = document.querySelector("#productId").value.trim();
    const name = document.querySelector("#productName").value.trim().toLowerCase();
    const price = document.querySelector("#productPrice").value.trim();

    const filtered = productos.filter((p) => {
      const matchesId = id ? p.productId?.toString().includes(id) : true;
      const matchesName = name ? p.productName?.toLowerCase().includes(name) : true;
      const matchesPrice = price ? p.productPrice?.toString().includes(price) : true;
      return matchesId && matchesName && matchesPrice;
    });

    renderProductos(filtered);
  });
});

function renderProductos(productos) {
  const tableBody = document.querySelector("#tablaProductos");
  tableBody.innerHTML = "";

  productos.forEach((producto, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${producto.productId}</td>
        <td>${producto.productName}</td>
        <td>${producto.productPrice}</td>
        <td>${producto.countSeal}</td>
        <td class="text-end">
          <div class="d-flex justify-content-center">
            <button class="btn btn-sm btn-primary me-2"
              onclick="openEditModal('${producto.productId}', '${producto.productName}', '${producto.productPrice}', '${producto.countSeal}')">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${producto.productId}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
    window.openEditModal = openEditModal;
    window.deleteProduct = deleteProduct;
  });
}

function openEditModal(productId, productName, productPrice, countSeal) {
  document.querySelector("#editProductId").value = productId;
  document.querySelector("#editProductName").value = productName;
  document.querySelector("#editProductPrice").value = productPrice;
  document.querySelector("#editProductStock").value = countSeal;

  const editModal = new bootstrap.Modal(document.querySelector("#editProductModal"));
  editModal.show();
}

function deleteProduct(productId) {
  document.querySelector("#deleteProductId").value = productId;
  const deleteModal = new bootstrap.Modal(document.querySelector("#deleteProductModal"));
  deleteModal.show();
}