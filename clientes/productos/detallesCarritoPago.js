// Actualiza el contador del carrito
function actualizarCarritoCantidad() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    document.getElementById('carritoCantidad').textContent = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
}

// Renderiza los productos del carrito en el modal
function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('carritoProductos');
    const vacio = document.getElementById('carritoVacio');
    contenedor.innerHTML = '';
    if (carrito.length === 0) {
        vacio.style.display = '';
        return;
    }
    vacio.style.display = 'none';
    carrito.forEach((prod, idx) => {
        const card = document.createElement('div');
        card.className = "d-flex align-items-center border rounded-3 mb-3 p-2 shadow-sm";
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" style="width:60px;height:60px;object-fit:contain;" class="me-3 rounded">
            <div class="flex-grow-1">
                <div class="fw-bold">${prod.nombre}</div>
                <div class="text-muted small">${prod.categoria}</div>
                <div class="text-primary fw-bold">$${prod.precio} x ${prod.cantidad}</div>
            </div>
            <button class="btn btn-sm btn-outline-danger ms-2" title="Eliminar" onclick="eliminarDelCarrito(${idx})">
                <i class="bi bi-trash"></i>
            </button>
        `;
        contenedor.appendChild(card);
    });
}

// Elimina un producto del carrito por índice
function eliminarDelCarrito(idx) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(idx, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoCantidad();
    renderizarCarrito();
}

// Al abrir el modal, renderiza el carrito
document.getElementById('modalCarrito').addEventListener('show.bs.modal', renderizarCarrito);

// Actualiza el contador al cargar la página
actualizarCarritoCantidad();

// Si ya tienes la función agregarAlCarrito, solo llama a actualizarCarritoCantidad() al final:
window.agregarAlCarrito = function() {
    // ...tu lógica para agregar producto...
    // (Asegúrate de tener la función como window.agregarAlCarrito para que sea global)
    // Después de guardar en localStorage:
    actualizarCarritoCantidad();
    alert("Producto agregado al carrito.");
}

// Comprar todo (puedes personalizar la lógica)
document.getElementById('btnComprarTodo').addEventListener('click', function() {
    window.location.href = "carritoDetalles.html";    
    //localStorage.removeItem('carrito');
   // actualizarCarritoCantidad();
    //renderizarCarrito();
});