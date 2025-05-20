import {API_URL} from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonProducto = document.querySelector("#botonActualizarProducto");

  botonProducto.addEventListener("click", async (e) => {
    e.preventDefault();

    const productId = document.querySelector("#editProductId").value;

    const updatedProduct = {
      productName: document.querySelector("#editProductName").value,
      productPrice: parseFloat(document.querySelector("#editProductPrice").value),
      countSeal: parseInt(document.querySelector("#editProductStock").value),
    };
    console.log("Producto: ", updatedProduct);

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
        credentials: "include",
      });

      if (response.status === 200) {
        alert("Producto actualizado exitosamente.");
        const modal = bootstrap.Modal.getInstance(document.querySelector("#editProductModal"));
        modal.hide();
        window.location.reload();
      } else {
        alert("Error al actualizar el producto. Verifica los datos.");
      }
    } catch (error) {
      alert("Error de red. Intenta más tarde.");
    }
  });
});