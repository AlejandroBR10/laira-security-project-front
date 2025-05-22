# 🔒 LAIRA-SECURITY — Plataforma Integral de Gestión para Empresas de Seguridad

![LAIRA Logo](/img/logo.png)

> **LAIRA-SECURITY** es una plataforma web moderna y centralizada diseñada para empresas de seguridad electrónica. Facilita la gestión de clientes, equipos, grabaciones, facturación y ventas en línea, todo desde una interfaz segura, escalable y fácil de usar.

---

## 🚀 Características Principales

- 📦 **Gestión de inventario** de equipos de seguridad
- 👥 **Registro y control de clientes** y ubicaciones de instalación
- 📹 **Acceso a grabaciones** por usuario/cliente
- 🔐 **Control de usuarios y roles personalizados**
- 💳 **Facturación electrónica y pagos en línea** (Stripe/PayPal)
- 🛒 **Tienda virtual** con carrito de compras
- 🏢 **Portal institucional** con catálogo, contacto y comentarios

---

## 🛠️ Tecnologías Utilizadas

| Backend            | Frontend             | Base de Datos  | Seguridad        | Otros            |
|-------------------|----------------------|----------------|------------------|------------------|
| Node.js / NestJS  | Vite + Bootstrap 5   | PostgreSQL     | JWT / OAuth 2.0  | Docker / Docker Compose |
| TypeScript        | HTML5 / CSS3         | Prisma ORM     | HTTPS / AES-256  | Stripe / PayPal Integrations |

---

## 📸 Vista Previa

<!-- Agrega aquí tus capturas de pantalla -->
![Dashboard](/img/imagenClientesDashboardPrincipal.png)
![Inventario](/img/imagenInventarioAdmins.png)

---

## ⚙️ Instalación Local

### 🔽 Clonar el proyecto
```bash
git clone https://github.com/TuUsuario/laira-security.git
cd laira-security
```

### 🧩 Instalar dependencias
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 🚀 Ejecutar en modo desarrollo
#### Backend
```bash
cd backend
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

---

## 🐳 Despliegue con Docker (Recomendado)

```bash
docker-compose up -d
```

Esto levantará la API, base de datos y frontend en contenedores aislados.

---

## 🔐 Usuario Inicial

- Usuario: `admin@laira.com`
- Contraseña: `Admin123` *(cámbiala en el primer inicio de sesión)*

---

## 📄 Documentación

Consulta el [Manual de Usuario](docs/MANUAL_USUARIO.pdf) para más detalles sobre instalación, configuración y uso.

---

## 🧑‍💻 Equipo de Desarrollo

- Alejandro Balderas Ramírez
- Alan Eduardo Barrera
- Ian Germán Buzzo
- Roberto Ayala
- Luis Ángel Antonio Franco

---

## 🤝 Contribuciones

¿Quieres mejorar esta plataforma? ¡Estás invitado a colaborar!
1. Haz un fork
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios
4. Haz un pull request

---

## 📬 Contacto

📧 **Correo:** soporte@laira-security.com  
🌐 **Sitio Web:** [www.laira-security.com](https://www.laira-security.com) *(en construcción)*  
📍 Querétaro, México

---

## 🛡️ LAIRA-SECURITY

> “Tu seguridad, nuestro compromiso.”