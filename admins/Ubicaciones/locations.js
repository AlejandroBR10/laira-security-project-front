import { API_URL } from "../../constants/constants";
import { agregarUbicacion } from "./add";
import { editarUbicacion } from "./update";
import { eliminarUbicacion } from "./delete"; // Asegúrate de tener esta función

let map = L.map('map').setView([20.631929958644648, -100.4113234764623], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch(`${API_URL}/locations`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: "include"
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(locations => {
    const select = document.getElementById('user-select');
    const btnEditar = document.getElementById('btnEditarUbicacion');
    const btnEliminar = document.getElementById('btnEliminarUbicacion');

    locations.forEach(location => {
      // Crear opciones para el selector
      const option = document.createElement('option');
      option.value = location.locationId;
      option.textContent = `${location.locationName}`;
      select.appendChild(option);

      // Convertir las coordenadas a números
      const lat = parseFloat(location.locationLatLng[0]);
      const lng = parseFloat(location.locationLatLng[1]);

      // Agregar marcador al mapa
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`<b>${location.locationName}</b><br>${location.locationAddress}`);
    });

    // Manejar el cambio en el selector
    select.addEventListener('change', (e) => {
      const selectedId = parseInt(e.target.value);
      const location = locations.find(loc => loc.locationId === selectedId);

      // Habilita o deshabilita el botón de editar según selección
      if (btnEditar) {
        if (location) {
          btnEditar.removeAttribute('disabled');
          // Carga los datos en el modal de editar
          console.log("UBIII",location.locationId);
          document.getElementById('editarUbicacionId').value = location.locationId;
          document.getElementById('nombreUbicacionEditar').value = location.locationName;
          document.getElementById('direccionUbicacionEditar').value = location.locationAddress;
          document.getElementById('coordenadasUbicacionEditar').value = `${parseFloat(location.locationLatLng[0]).toFixed(6)}, ${parseFloat(location.locationLatLng[1]).toFixed(6)}`;
          const formEditarUbicacion = document.getElementById('formEditarUbicacion');

        } else {
          btnEditar.setAttribute('disabled', 'disabled');
          document.getElementById('editarUbicacionId').value = '';
          document.getElementById('nombreUbicacionEditar').value = '';
          document.getElementById('direccionUbicacionEditar').value = '';
          document.getElementById('coordenadasUbicacionEditar').value = '';
        }

    
      }

      // Habilita o deshabilita el botón de eliminar según selección
      if (btnEliminar) {
        if (location) {
          btnEliminar.removeAttribute('disabled');
          // Carga el id en el modal de eliminar
          document.getElementById('eliminarUbicacionId').value = location.locationId;
          console.log("Id",location.locationId);
        } else {
          btnEliminar.setAttribute('disabled', 'disabled');
          document.getElementById('eliminarUbicacionId').value = '';
        }
      }

      if (location) {
        const lat = parseFloat(location.locationLatLng[0]);
        const lng = parseFloat(location.locationLatLng[1]);
        map.setView([lat, lng], 15);
      } else {
        map.setView([20.6767, -100.3288], 6); // Vista predeterminada
      }
    });
  })
  .catch(err => {
    console.error('Error cargando ubicaciones:', err);
  });

let mapAgregar, markerAgregar, selectedLatLng;

document.getElementById('modalMapaAgregar').addEventListener('shown.bs.modal', function () {
  if (!mapAgregar) {
    mapAgregar = L.map('mapAgregarUbicacion').setView([20.580138, -100.402174], 13); // CDMX por defecto
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapAgregar);

    mapAgregar.on('click', function (e) {
      selectedLatLng = e.latlng;
      if (markerAgregar) {
        markerAgregar.setLatLng(e.latlng);
          
      } else {
        markerAgregar = L.marker(e.latlng).addTo(mapAgregar);
      }
    });
  }
  setTimeout(() => { mapAgregar.invalidateSize(); }, 200);
});

// Botón para seleccionar coordenadas y cerrar modal
document.getElementById('btnSeleccionarCoordenadas').addEventListener('click', function () {
  if (selectedLatLng) {
    document.getElementById('coordenadasUbicacionAgregar').value = `${selectedLatLng.lat.toFixed(6)}, ${selectedLatLng.lng.toFixed(6)}`;
    // Cierra solo el modal del mapa
    bootstrap.Modal.getInstance(document.getElementById('modalMapaAgregar')).hide();
  }
});

// --- AGREGAR UBICACIÓN ---
const formAgregarUbicacion = document.getElementById('formAgregarUbicacion');
if (formAgregarUbicacion) {
  formAgregarUbicacion.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
      await agregarUbicacion(formAgregarUbicacion);
    } catch (err) {
      alert(err.message);
    }
  });
}

// --- EDITAR UBICACIÓN ---
const formEditarUbicacion = document.getElementById('formEditarUbicacion');
if (formEditarUbicacion) {
  formEditarUbicacion.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
      await editarUbicacion(formEditarUbicacion);
    } catch (err) {
      alert(err.message);
    }
  });
}

// --- ELIMINAR UBICACIÓN ---
const formEliminarUbicacion = document.getElementById('formEliminarUbicacion');
if (formEliminarUbicacion) {
  formEliminarUbicacion.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
      await eliminarUbicacion(formEliminarUbicacion);
    } catch (err) {
      alert(err.message);
    }
  });
}

// --- MAPA PARA SELECCIONAR COORDENADAS EN EDITAR UBICACIÓN ---
let mapEditar, markerEditar, selectedLatLngEditar;

document.getElementById('modalMapaEditar').addEventListener('shown.bs.modal', function () {
  // Obtener coordenadas actuales del input (si existen)
  const inputCoords = document.getElementById('coordenadasUbicacionEditar').value;
  let lat = 19.4326, lng = -99.1332; // CDMX por defecto
  if (inputCoords && inputCoords.includes(',')) {
    const [latStr, lngStr] = inputCoords.split(',').map(s => s.trim());
    lat = parseFloat(latStr);
    lng = parseFloat(lngStr);
  }

  if (!mapEditar) {
    mapEditar = L.map('mapEditarUbicacion').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapEditar);

    mapEditar.on('click', function (e) {
      selectedLatLngEditar = e.latlng;
      if (markerEditar) {
        markerEditar.setLatLng(e.latlng);
      } else {
        markerEditar = L.marker(e.latlng).addTo(mapEditar);
      }
    });
  } else {
    mapEditar.setView([lat, lng], 13);
    if (markerEditar) {
      markerEditar.setLatLng([lat, lng]);
    } else {
      markerEditar = L.marker([lat, lng]).addTo(mapEditar);
    }
  }
  // Siempre muestra el pin en la ubicación actual al abrir el modal
  selectedLatLngEditar = { lat, lng };
  setTimeout(() => { mapEditar.invalidateSize(); }, 200);
});

// Botón para seleccionar coordenadas y cerrar modal de editar
document.getElementById('btnSeleccionarCoordenadasEditar').addEventListener('click', function () {
  if (selectedLatLngEditar) {
    document.getElementById('coordenadasUbicacionEditar').value = `${selectedLatLngEditar.lat.toFixed(6)}, ${selectedLatLngEditar.lng.toFixed(6)}`;
    // Cierra solo el modal del mapa de editar
    bootstrap.Modal.getInstance(document.getElementById('modalMapaEditar')).hide();
  }
});



