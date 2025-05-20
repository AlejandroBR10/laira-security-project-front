import {API_URL} from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonProducto = document.querySelector("#botonEliminarProducto");

  botonProducto.addEventListener("click", async (e) => {
    e.preventDefault();

    const productId = document.querySelector("#deleteProductId").value;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.status === 200) {
        alert("Producto eliminado exitosamente.");
        const modal = bootstrap.Modal.getInstance(document.querySelector("#deleteProductModal"));
        modal.hide();
        window.location.reload();
      } else {
        alert("Error al eliminar el producto. Verifica los datos.");
      }
    } catch (error) {
      alert("Error de red. Intenta más tarde.");
    }
  });
});