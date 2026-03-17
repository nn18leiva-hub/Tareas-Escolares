# Libreta de AWOS - Reporte del Frontend

Este reporte detalla la implementación del frontend del proyecto de **Planificador Estudiantil (StuPlan)**, utilizando una estética moderna de **Glassmorphism** y una arquitectura modular en JavaScript.

---

## 1. Estructura del Proyecto Frontend
La carpeta `frontend/` se organiza de la siguiente manera:
```
frontend/
├── index.html       # Estructura base y contenedores
├── style.css        # Diseño, temas y animaciones
├── api.js           # Utilidades de conexión con el Backend
├── components.js    # Lógica de renderizado dinámico
└── app.js           # Controladores de eventos e inicialización
```

---

## 2. Interfaz de Usuario (HTML)
El archivo `index.html` define la estructura de la aplicación, incluyendo el sistema de navegación lateral (sidebar), las secciones de contenido y los modales para agregar datos.

### `frontend/index.html`
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StuPlan - Planificador Estudiantil</title>
    <link rel="stylesheet" href="style.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <!-- Capa de Autenticación -->
    <div id="authOverlay" class="auth-overlay active">
        <!-- Login/Register Forms here -->
    </div>

    <div class="app-container" id="appContainer" style="display: none;">
        <aside class="sidebar">
            <!-- Sidebar Navigation -->
        </aside>
        <main class="main-content">
            <header class="top-header">
                <h1 id="page-title">Inicio</h1>
            </header>
            <div class="content-wrapper">
                <section id="dashboard" class="view-section active">...</section>
                <section id="subjects" class="view-section">...</section>
                <section id="schedule" class="view-section">...</section>
                <section id="homework" class="view-section">...</section>
            </div>
        </main>
    </div>
    
    <script src="api.js"></script>
    <script src="components.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

---

## 3. Estilo y Diseño (CSS)
Se implementó un diseño **Glassmorphism** premium con soporte para modo oscuro, utilizando variables CSS para una fácil personalización.

### `frontend/style.css` (Extracto del sistema de diseño)
```css
:root {
    --primary: #1e90ff;
    --glass: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.glass-panel {
    background: var(--glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}
```

---

## 4. Conexión con el API (JavaScript)
El archivo `api.js` centraliza todas las peticiones al backend, manejando la autenticación mediante tokens JWT.

### `frontend/api.js`
```javascript
const API_URL = 'http://localhost:3000/api';

const API = {
    token: localStorage.getItem('stuplan_token'),

    async request(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(`${API_URL}${endpoint}`, options);
        return await res.json();
    },

    login: async (correo, password) => { /* POST /auth/login */ },
    getTareas: async () => { return API.request('/tareas'); },
    // ... otros métodos para materias, horarios y periodos
};
```

---

## 5. Renderizado de Componentes
`components.js` se encarga de transformar los datos del API en elementos visuales dinámicos para el Dashboard, el Horario y la lista de Tareas.

### `frontend/components.js`
```javascript
const Renderer = {
    renderDashboard: function() {
        // Actualiza estadísticas y widgets de inicio
    },
    renderSchedule: function() {
        // Genera la tabla de horario semanal dinámicamente
    },
    renderHomeworks: function() {
        // Lista las tareas filtrando por estado (pendientes/completadas)
    }
};
```

---

## 6. Capturas de Pantalla de la Ejecución

A continuación se muestran las capturas de pantalla de los diferentes apartados de la aplicación en funcionamiento:

````carousel
![Pantalla de Inicio de Sesión](file:///C:/Users/User/.gemini/antigravity/brain/1dcfe14f-a975-48ec-bd27-fb341cc81119/login_screen_1773715263004.png)
<!-- slide -->
![Pantalla de Registro](file:///C:/Users/User/.gemini/antigravity/brain/1dcfe14f-a975-48ec-bd27-fb341cc81119/register_screen_1773715271190.png)
<!-- slide -->
![Dashboard (Inicio)](file:///C:/Users/User/.gemini/antigravity/brain/1dcfe14f-a975-48ec-bd27-fb341cc81119/inicio_dashboard_1773715297156.png)
<!-- slide -->
![Sección de Materias](file:///C:/Users/User/.gemini/antigravity/brain/1dcfe14f-a975-48ec-bd27-fb341cc81119/materias_section_1773715313111.png)
<!-- slide -->
![Sección de Horario](file:///C:/Users/User/.gemini/antigravity/brain/1dcfe14f-a975-48ec-bd27-fb341cc81119/horario_section_1773715322233.png)
<!-- slide -->
![Sección de Tareas](file:///C:/Users/User/.gemini/antigravity/brain/1dcfe14f-a975-48ec-bd27-fb341cc81119/tareas_section_1773715340832.png)
<!-- slide -->
![Modal para Añadir Tarea](file:///C:/Users/User/.gemini/antigravity/brain/1dcfe14f-a975-48ec-bd27-fb341cc81119/add_task_modal_1773715350042.png)
````

---

## 7. Instrucciones para Ejecución Local
1.  Asegurarse de que el Backend esté corriendo en el puerto 3000.
2.  Abrir el archivo `index.html` directamente en el navegador o utilizar un servidor estático:
    ```bash
    npx serve frontend
    ```
3.  Registrar un usuario para comenzar a gestionar el planificador escolar.
