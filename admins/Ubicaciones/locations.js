const API_URL = 'http://localhost:4000/locations'; 
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ4YW5AZ21haWwuY29tIiwidXNlclBhc3N3b3JkIjoiJDJiJDA1JHRocjRyQmpXWk1xT1VoOXlqcEphQmV0cHZhczBQdEV5TGNTdmxRQmVrbWRieHR3bHRRSWtpIiwidXNlclJvbGVzIjpbIkFkbWluIl0sImlhdCI6MTc0Nzc1Mzg0OCwiZXhwIjoxNzQ4MzU4NjQ4fQ.3SGFviu89G8bm25S8gI3cnaAhBnjkluxtmZedP2ieQ8'; // Reemplaza con tu token de autenticación

let map = L.map('map').setView([20.631929958644648, -100.4113234764623], 6); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch(API_URL, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${TOKEN}`, // Agregar el token en el encabezado
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(locations => {
    const select = document.getElementById('user-select'); // Cambiado a user-select

    locations.forEach(location => {
      // Crear opciones para el selector
      const option = document.createElement('option');
      option.value = location.locationId; // Este es el valor interno
      option.textContent = `${location.locationId} - ${location.locationName}`; // Mostrar locationId y locationName
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
