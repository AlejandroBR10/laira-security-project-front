document.querySelectorAll('#hogar-grid .product-card').forEach((card, idx) => {
    if (idx === 0) {
        card.addEventListener('click', () => {
            window.location.href = './ImgProductos/producto.html';
        });
    }
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