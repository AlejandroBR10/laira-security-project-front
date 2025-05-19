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