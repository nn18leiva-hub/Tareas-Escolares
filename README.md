# StuPlan - Planificador Estudiantil Inteligente (Proyecto AWOS)

**StuPlan** es una aplicación web premium diseñada para ayudar a los estudiantes a organizar su vida académica de manera eficiente. El proyecto utiliza una arquitectura moderna con un Backend en Node.js y un Frontend con estética Glassmorphism.

## 🚀 Características Principales

### Backend
- **Autenticación Secuencial**: Registro e inicio de sesión con contraseñas encriptadas (BCrypt).
- **Seguridad JWT**: Rutas protegidas mediante JSON Web Tokens.
- **Base de Datos PostgreSQL**: Relaciones completas entre Usuarios, Periodos, Materias, Horarios y Tareas.
- **API RESTful**: Endpoints estructurados para operaciones CRUD completas.

### Frontend
- **Diseño Glassmorphism**: Interfaz moderna, traslúcida y responsiva con soporte para modo oscuro.
- **Dashboard en Tiempo Real**: Estadísticas rápidas de materias activas, tareas pendientes y clases del día.
- **Gestión de Periodos**: (NUEVO) Crea y alterna entre diferentes ciclos escolares (semestres/cuatrimestres).
- **Horario Semanal**: Visualización dinámica de tu carga académica por hora y día.
- **Control de Tareas**: Listado inteligente filtrado por estado (Pendientes, Completadas, Vencidas).

## 🛠️ Stack Tecnológico
- **Frontend**: HTML5, Vanilla CSS (Custom Properties), JavaScript (ES6+), BoxIcons.
- **Backend**: Node.js, Express.js.
- **Base de Datos**: PostgreSQL / `pg`.
- **Seguridad**: JWT (JsonWebToken), BCrypt.js.
- **Herramientas**: Dotenv (variables de entorno), CORS, Nodemon.

## 📦 Instalación y Configuración

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <tu-repo-url>
cd Tareas-Escolares
cd backend
npm install
```

### 2. Configuración de Base de Datos
1. Crea una base de datos en PostgreSQL llamada `stuplan`.
2. Configura el archivo `.env` en la raíz de `backend/` con tus credenciales:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=stuplan
   JWT_SECRET=tu_secreto_super_seguro
   ```
3. Ejecuta el script de inicialización para crear las tablas:
   ```bash
   node setup-db.js
   ```

### 3. Ejecutar el Proyecto
- **Backend**: `npm run dev` (corre en el puerto 3000).
- **Frontend**: Abre `index.html` con un servidor estático (ej. `npx http-server frontend -p 8080`).

## 📄 Documentación y Reportes
Para detalles técnicos profundos y capturas de pantalla de la ejecución, consulta los reportes de "Libreta de AWOS":
- [Reporte del Frontend (Markdown)](./reporte_frontend_awos.md)
- [Reporte del Frontend (PDF)](./reporte_frontend_awos.pdf)

---
*Proyecto desarrollado para la materia de Aplicaciones Web Orientadas a Servicios (AWOS).*
