import {API_URL} from "/constants/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonProducto = document.querySelector("#botonAgregarProducto");

  botonProducto.addEventListener("click", async (e) => {
    e.preventDefault();

    const newProduct = {
      productName: document.querySelector("#newProductName").value,
      productPrice: parseFloat(document.querySelector("#newProductPrice").value),
      countSeal: parseInt(document.querySelector("#newProductStock").value),
    };
    console.log("Producto: ", newProduct);

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
        credentials: "include",
      });

      if (response.status === 201) {
        alert("Producto agregado exitosamente.");
        const modal = bootstrap.Modal.getInstance(document.querySelector("#addProductModal"));
        modal.hide();
        window.location.reload();
      } else {
        alert("Error al agregar el producto. Verifica los datos.");
      }
    } catch (error) {
      alert("Error de red. Intenta más tarde.");
    }
  });
});