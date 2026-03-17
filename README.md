# tareas escolares
## realizado con servicios (APIs)
### usando como backend : node.js, express, dotenv
** Description** : este proyecto, es un proyecto universitario para practicar la creacion de APIs usando la tecnologia de Node.js, y express
**Fecha**: 09-feb-2026
**Autor** Nelson Leiva
*Universidad Politecnica de Bacalar*

---

## Frontend Frontend (Cliente)
Se ha integrado una interfaz de usuario interactiva y responsiva, diseñada con el estilo estético **"Glassmorphism"** (efecto cristal) usando múltiples tonos de azul y ventanas flotantes.

### Tecnologías Frontend
- **HTML5**: Estructura semántica de la página.
- **CSS3 (Vanilla)**:
  - Flexbox & CSS Grid para el diseño de la estructura (Floating Layout).
  - Variables CSS para paletas de colores y modo Claro/Oscuro dinámico.
  - Propiedad de desenfoque (`backdrop-filter: blur`) e iluminación en bordes para el diseño cristalizado.
  - Transiciones y animaciones personalizadas (figuras dinámicas de fondo).
- **JavaScript (Vanilla JS)**: 
  - Manejo de DOM avanzado para mostrar los modales interactivos y renderizado dinámico.
  - Implementación de `Fetch API` para conectar con el servidor backend.
  - Gestión de estado del lado del cliente (`localStorage` para JWT y estado temporal).
- **Iconos**: Boxicons (`bx bxs-*`).

### Funcionalidades del Cliente (Frontend)
1. **Autenticación Frontend**: Flujo integrado de Login y Registro de usuarios implementando **JSON Web Tokens (JWT)**.
2. **Dashboard Dinámico**: Panel de Control con contadores y visualización rápida del Horario y próximas Tareas.
3. **Módulo de Materias**: Creación, lectura, edición y eliminación de materias que persisten directamente en la base de datos PostgreSQL.
4. **Módulo de Horario**: Cuadrícula interactiva que cruza Días de la semana contra Horas para agendar clases.
5. **Módulo de Tareas**: Panel interactivo de To-Do list, permitiendo tachar como completadas o pendientes las tareas.
6. **Tema Oscuro/Claro**: Adaptabilidad instantánea de diseño para bajas condiciones de luz, todo gestionado desde la UI con botón interactivo.
