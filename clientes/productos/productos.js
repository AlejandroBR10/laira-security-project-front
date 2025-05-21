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

// producto.html
window.cambiarImagen = function(src, el) {
    var imgPrincipal = document.getElementById('img-principal');
    if (imgPrincipal) {
        imgPrincipal.src = src;
        document.querySelectorAll('.galeria-miniaturas img').forEach(img => img.classList.remove('selected'));
        el.classList.add('selected');
    }
};

document.querySelectorAll('.galeria-miniaturas img').forEach(img => {
    img.addEventListener('mouseenter', function() {
        window.cambiarImagen(this.getAttribute('onclick').match(/'(.*?)'/)[1], this);
    });
});

// Función para cargar y renderizar productos desde un archivo JSON
function cargarProductos(rutaJson, contenedorId, titulo) {
    fetch(rutaJson)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(productos => {
            const container = document.getElementById(contenedorId);

            productos.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                card.innerHTML = `
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <div class="precio">$${producto.precio.toFixed(2)}</div>
                    <button class="btn-comprar" onclick="verProducto(${producto.id})">Ver más</button>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error(`Error al cargar los productos de ${titulo}:`, error));
}

// Cargar productos de las tres categorías
cargarProductos('./hogar.json', 'hogar-grid', 'Productos para el Hogar');
cargarProductos('./empresas.json', 'empresas-grid', 'Productos para Empresas');
cargarProductos('./negocio.json', 'negocio-grid', 'Productos para Negocios');

// Función para manejar el clic en "Ver Producto"
function verProducto(id) {
    // Redirige a producto.html con el ID del producto como parámetro en la URL
    window.location.href = `./ImgProductos/producto.html?id=${id}`;
}

// Función para obtener el parámetro "id" de la URL
function obtenerParametroURL(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Función para cargar los datos del producto
function cargarProducto() {
    const idProducto = obtenerParametroURL('id'); // Obtiene el ID del producto de la URL

    if (!idProducto) {
        console.error('No se proporcionó un ID de producto en la URL.');
        return;
    }

    // Cargar el archivo JSON correspondiente
    fetch('../hogar.json') // Cambia a la ruta del archivo JSON correspondiente
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(productos => {
            // Buscar el producto por su ID
            const producto = productos.find(p => p.id === parseInt(idProducto));

            if (!producto) {
                console.error('Producto no encontrado.');
                return;
            }

            // Actualizar la imagen principal
            document.getElementById('img-principal').src = producto.imagenes[0];

            // Actualizar la galería de miniaturas
            const galeria = document.getElementById('galeria-miniaturas');
            producto.imagenes.forEach((imagen, index) => {
                const img = document.createElement('img');
                img.src = imagen;
                img.alt = `Miniatura ${index + 1}`;
                img.classList.add(index === 0 ? 'selected' : '');
                img.onclick = () => cambiarImagen(imagen, img);
                galeria.appendChild(img);
            });

            // Actualizar el nombre, precio y descripción
            document.getElementById('nombre-producto').textContent = producto.nombre;
            document.getElementById('precio-producto').textContent = `$${producto.precio.toFixed(2)}`;
            document.getElementById('descripcion-producto').textContent = producto.descripcion;
        })
        .catch(error => console.error('Error al cargar el producto:', error));
}

// Función para cambiar la imagen principal
function cambiarImagen(src, el) {
    document.getElementById('img-principal').src = src;
    document.querySelectorAll('.galeria-miniaturas img').forEach(img => img.classList.remove('selected'));
    el.classList.add('selected');
}


cargarProducto();