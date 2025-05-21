// Mostrar/ocultar icono de usuario o botón de iniciar sesión según la cookie auth_for_security
(function() {
    function getCookie(name) {
        return document.cookie
            .split(';')
            .map(c => c.trim())
            .find(c => c.startsWith(name + '='))
            ?.split('=')[1];
    }
    const userDropdown = document.getElementById('userDropdown');
    const loginBtn = document.getElementById('loginBtn');

    if (getCookie('auth_for_security')) {
        // Mostrar icono usuario, ocultar botón login
        if (userDropdown) userDropdown.style.display = '';
        if (loginBtn) loginBtn.style.display = 'none';
    } else {
        // Ocultar icono usuario, mostrar botón login
        if (userDropdown) userDropdown.style.display = 'none';
        if (loginBtn) loginBtn.style.display = '';
    }
})();