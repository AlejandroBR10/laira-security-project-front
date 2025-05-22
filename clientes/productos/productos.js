// Función para aplicar el efecto hover a las tarjetas de producto
function applyHoverEffect(selector) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'scale(1.1)';
            card.style.transition = 'transform 0.3s ease, border-color 0.3s ease';
            card.style.borderColor = '#005DAA';
        });
        card.addEventListener('mouseout', () => {
            card.style.transform = 'scale(1)';
            card.style.borderColor = '#ddd';
        });
    });
}

document.querySelectorAll('#hogar-grid .product-card').forEach((card, idx) => {
    if (idx === 0) {
        card.addEventListener('click', () => {
            window.location.href = './ImgProductos/producto.html';
        });
    }
});

applyHoverEffect('#hogar-grid .product-card');
applyHoverEffect('#empresas-grid .product-card');
applyHoverEffect('#negocio-grid .product-card');




// cargar JSON
function cargarProductos(rutaJson, contenedorId, categoria) {
    fetch(rutaJson)
        .then(response => response.json())
        .then(productos => {
            const container = document.getElementById(contenedorId);
            productos.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                card.innerHTML = `
                    <img src="ImgProductos/${producto.imagenes[0]}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <div class="precio">$${producto.precio.toFixed(2)}</div>
                    <button class="btn-comprar" onclick="verProducto(${producto.id}, '${categoria}')">Ver más</button>
                `;
                container.appendChild(card);
            });
        });
}

cargarProductos('./hogar.json', 'hogar-grid', 'hogar');
cargarProductos('./empresas.json', 'empresas-grid', 'empresas');
cargarProductos('./negocio.json', 'negocio-grid', 'negocio');

// "Ver Producto"
function verProducto(id, categoria) {
    
    window.location.href = `./ImgProductos/producto.html?id=${id}&categoria=${categoria}`;
}

