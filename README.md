# 🌉 Bridge Solutions S.A.S.

## Plataforma Web Profesional

**Bridge Solutions S.A.S.** es una empresa especializada en **avalúos, valoración financiera, consultoría empresarial e importaciones**, que ofrece soluciones técnicas y estratégicas para la gestión de activos y la toma de decisiones, bajo estándares nacionales e internacionales.

## 🧱 Misión

Ofrecer servicios integrales que generen confianza, precisión y respaldo técnico para la toma de decisiones estratégicas, impulsando el crecimiento y la estabilidad patrimonial de personas y organizaciones.

## 🎯 Visión

Para 2030, ser líderes en Colombia y Latinoamérica en avalúos, valoración financiera y consultoría empresarial, reconocidos por excelencia técnica, innovación y solidez profesional.

---

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express.js**
- **MySQL** con **mysql2**
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas
- **Multer** para carga de archivos

### Frontend
- **React.js** con React Router
- **Axios** para peticiones HTTP
- Diseño responsive con CSS personalizado

---

## ⚙️ Instalación

### Requisitos Previos
- Node.js v16+
- MySQL Server
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/jbarahona31/Bridge-Solutions-S.A.S..git
cd Bridge-Solutions-S.A.S.
```

### 2. Configurar el Backend
```bash
cd backend
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales de MySQL
```

### 3. Configurar el Frontend
```bash
cd frontend
npm install
```

### 4. Iniciar la aplicación

#### Backend (Puerto 3000)
```bash
cd backend
npm run dev
```

#### Frontend (Puerto 3001)
```bash
cd frontend
npm start
```

---

## 🔐 Roles de Usuario

### Usuario
- Registrarse e iniciar sesión
- Crear y gestionar cotizaciones
- Subir documentos a sus cotizaciones
- Ver estado de solicitudes en su panel

### Administrador
- Acceso al panel de administración
- Ver todas las cotizaciones
- Filtrar por estado, fecha, usuario
- Validar o rechazar solicitudes
- Dejar observaciones
- Exportar datos (CSV)

---

## 📁 Estructura del Proyecto

```
Bridge-Solutions-S.A.S./
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración y conexión BD
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middleware/      # Autenticación y validación
│   │   ├── models/          # Modelos de datos
│   │   └── routes/          # Rutas de la API
│   ├── uploads/             # Archivos subidos
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/       # Componentes del panel admin
│   │   │   ├── auth/        # Login y registro
│   │   │   ├── common/      # Navbar, rutas protegidas
│   │   │   └── user/        # Panel de usuario
│   │   ├── context/         # AuthContext
│   │   ├── services/        # Servicios API
│   │   └── styles/          # Estilos globales
│   └── package.json
│
└── README.md
```

---

## 🎨 Identidad Visual

| Elemento | Color | Hex |
|----------|-------|-----|
| Azul corporativo | Confianza | #1C2D5A |
| Dorado acento | Éxito | #C9A94A |
| Blanco fondo | Claridad | #FFFFFF |
| Gris claro | Neutral | #F2F2F2 |
| Negro texto | Legible | #333333 |

### Tipografía
- **Montserrat** para títulos
- **Open Sans** para texto general

---

## 📝 Variables de Entorno

### Backend (.env)
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cf_consultores

JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRE=24h
```

---

## 📊 Base de Datos

### Tabla `usuarios`
- `id` - INT, Primary Key, Auto Increment
- `nombre_completo` - VARCHAR(255)
- `email` - VARCHAR(255), UNIQUE
- `usuario` - VARCHAR(100), UNIQUE
- `contraseña_hash` - VARCHAR(255)
- `rol` - ENUM('usuario', 'administrador', 'cliente', 'colaborador'), DEFAULT 'cliente'
- `fecha_registro` - TIMESTAMP

### Tabla `cotizaciones`
- `id` - INT, Primary Key, Auto Increment
- `usuario_id` - INT, Foreign Key
- `servicio` - VARCHAR(255)
- `descripcion` - TEXT
- `estado` - ENUM('pendiente', 'en_revision', 'aprobada', 'rechazada')
- `observacion_admin` - TEXT
- `fecha_creacion` - TIMESTAMP
- `fecha_actualizacion` - TIMESTAMP

### Tabla `documentos`
- `id` - INT, Primary Key, Auto Increment
- `cotizacion_id` - INT, Foreign Key
- `usuario_id` - INT, Foreign Key
- `archivo_url` - VARCHAR(500)
- `tipo` - VARCHAR(100)
- `fecha_subida` - TIMESTAMP

---

## 🔒 Seguridad

- Autenticación con JWT
- Middleware para proteger rutas según rol
- Contraseñas cifradas con bcrypt
- Validación de sesión y expiración
- Helmet para headers de seguridad
- CORS configurado

---

## 🧪 Pruebas API con Postman

### Registro
**POST** `http://localhost:3000/api/auth/register`
```json
{
  "nombre_completo": "Carlos Pérez",
  "email": "carlos@cliente.com",
  "usuario": "carlosp",
  "contraseña": "123456"
}
```

### Login
**POST** `http://localhost:3000/api/auth/login`
```json
{
  "email": "carlos@cliente.com",
  "contraseña": "123456"
}
```

---

## 📞 Contacto

**Bridge Solutions S.A.S.**  
Soluciones técnicas y estratégicas para la gestión de activos

---

## 📄 Licencia

ISC License

© 2024 Bridge Solutions S.A.S. Todos los derechos reservados.