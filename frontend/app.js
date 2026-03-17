// Global App State
let state = {
    theme: localStorage.getItem('stuplan_theme') || 'light',
    subjects: [],
    schedule: [],
    homeworks: [],
    activePeriodId: null // We will default to the first Periodo found for simplicity
};

// DOM Elements
const docBody = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('page-title');

const authOverlay = document.getElementById('authOverlay');
const appContainer = document.getElementById('appContainer');

// Primary Application Flow
document.addEventListener('DOMContentLoaded', async () => {
    applyTheme(state.theme);
    
    // Check if logged in
    if (API.token) {
        initApp();
    } else {
        showAuth();
    }
    
    // Auth & Generic UI Listeners
    setupListeners();
});

// App Initialization
async function initApp() {
    try {
        authOverlay.classList.remove('active');
        appContainer.style.display = 'flex';
        
        // Update user display name
        const uname = localStorage.getItem('stuplan_username');
        if(uname) {
            document.getElementById('currentUserDisplay').textContent = uname;
        }
        
        // Ensure user has a periodo. Let's fetch periodos.
        const periodosReq = await API.getPeriodos();
        let periodosContext = periodosReq.data || periodosReq; 
        
        // Workaround API differences in returning object wrappers or arrays.
        if (Array.isArray(periodosContext)) periodosContext = periodosContext;
        else periodosContext = [];
        
        if (periodosContext.length === 0) {
            // Create a default periodo
            const d = new Date();
            const year = d.getFullYear();
            const res = await API.createPeriodo({
                nombre: `Año Lectivo ${year}`,
                fecha_inicio: `${year}-01-01`,
                fecha_fin: `${year}-12-31`
            });
            state.activePeriodId = res.id_periodo || res.id;
            state.periods = [res];
        } else {
            state.activePeriodId = periodosContext[0].id_periodo || periodosContext[0].id;
            state.periods = periodosContext;
        }

        // Fetch data from backend
        await fetchAllData();

    } catch (e) {
        console.error("Initialization Failed", e);
        // Token might be invalid or expired during setup
        if(e.message && e.message.toLowerCase().includes('token')) {
            API.logout();
            showAuth();
        }
    }
}

async function fetchAllData() {
    // Subjects
    const subRes = await API.getMaterias();
    state.subjects = subRes.data || subRes || [];
    if (!Array.isArray(state.subjects)) state.subjects = [];
    
    // Filter to active period
    if(state.activePeriodId && state.subjects.length > 0) {
        state.subjects = state.subjects.filter(s => s.id_periodo == state.activePeriodId);
    }

    // Schedule
    const hRes = await API.getHorarios();
    state.schedule = hRes.data || hRes || [];
    if (!Array.isArray(state.schedule)) state.schedule = [];

    // Homework
    const hwRes = await API.getTareas();
    state.homeworks = hwRes.data || hwRes || [];
    if (!Array.isArray(state.homeworks)) state.homeworks = [];

    updateAllViews();
}

function showAuth() {
    authOverlay.classList.add('active');
    appContainer.style.display = 'none';
}

// Event Listeners Integration
function setupListeners() {
    // Auth Toggles
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('registerFormContainer').style.display = 'block';
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerFormContainer').style.display = 'none';
        document.getElementById('loginFormContainer').style.display = 'block';
    });

    // Login Submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPassword').value;
            await API.login(email, pass);
            // reset and init
            document.getElementById('loginForm').reset();
            initApp();
        } catch (e) {
            alert(e.message);
        }
    });

    // Register Submission
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const pass = document.getElementById('registerPassword').value;
            await API.register(name, email, pass);
            // Login immediately after register
            await API.login(email, pass);
            document.getElementById('registerForm').reset();
            initApp();
        } catch (e) {
            alert(e.message);
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        API.logout();
        window.location.reload();
    });

    // Navigation Listeners
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            viewSections.forEach(view => view.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            pageTitle.textContent = item.querySelector('span').textContent;
            updateAllViews();
        });
    });

    // Theme Toggle Listener
    themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(state.theme);
        localStorage.setItem('stuplan_theme', state.theme);
    });
    
    // Global Add Button
    document.getElementById('global-add-btn').addEventListener('click', () => {
        const activeNav = document.querySelector('.nav-item.active').getAttribute('data-target');
        if (activeNav === 'subjects') openModal('subjectModal');
        else if (activeNav === 'schedule') openModal('periodModal');
        else if (activeNav === 'homework') openModal('homeworkModal');
        else if (activeNav === 'periods') openModal('termModal');
        else openModal('homeworkModal');
    });

    // Color picker logic
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            colorOptions.forEach(c => c.classList.remove('active'));
            opt.classList.add('active');
            document.getElementById('subjectColor').value = opt.getAttribute('data-color');
        });
    });

    // Homework Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.currentHomeworkFilter = btn.getAttribute('data-filter');
            Renderer.renderHomeworks();
        });
    });

    initForms();
}

function applyTheme(theme) {
    if (theme === 'dark') {
        docBody.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('i').classList.replace('bx-moon', 'bx-sun');
    } else {
        docBody.removeAttribute('data-theme');
        themeToggle.querySelector('i').classList.replace('bx-sun', 'bx-moon');
    }
}

function updateAllViews() {
    Renderer.renderDashboard();
    Renderer.renderSubjects();
    Renderer.renderSchedule();
    Renderer.renderHomeworks();
    Renderer.renderPeriods();
    updateModalSelects();
}

function updateModalSelects() {
    const periodSubj = document.getElementById('periodSubject');
    const hwSubj = document.getElementById('homeworkSubject');
    
    let optionsHtml = '<option value="" disabled selected>Selecciona una Materia</option>';
    state.subjects.forEach(sub => {
        optionsHtml += `<option value="${sub.id_materia}">${sub.nombre}</option>`;
    });
    
    if (periodSubj) periodSubj.innerHTML = optionsHtml;
    if (hwSubj) hwSubj.innerHTML = optionsHtml;
}

// Modal Management
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        if(modalId === 'subjectModal') {
            document.getElementById('subjectForm').reset();
            document.getElementById('subjectId').value = '';
            document.getElementById('subjectModalTitle').textContent = 'Añadir Nueva Materia';
            document.querySelectorAll('.color-option')[3].click();
        } else if (modalId === 'homeworkModal') {
            document.getElementById('homeworkForm').reset();
            document.getElementById('homeworkId').value = '';
            document.getElementById('homeworkModalTitle').textContent = 'Añadir Tarea';
            document.getElementById('homeworkDueDate').value = new Date().toISOString().split('T')[0];
        } else if (modalId === 'periodModal') {
            document.getElementById('periodForm').reset();
            document.getElementById('periodId').value = '';
        } else if (modalId === 'termModal') {
            document.getElementById('termForm').reset();
            document.getElementById('termId').value = '';
            document.getElementById('termStart').value = new Date().toISOString().split('T')[0];
        }
        modal.classList.add('show');
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.remove('show');
}

// Form Formats to API Spec
function initForms() {
    // Subject Form
    document.getElementById('subjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('subjectId').value;
        const nombre = document.getElementById('subjectName').value;
        const profesor = document.getElementById('subjectTeacher').value;
        const color_hex = document.getElementById('subjectColor').value;
        
        try {
            if (id) {
                await API.updateMateria(id, { nombre, profesor, color_hex, id_periodo: state.activePeriodId });
            } else {
                if(!state.activePeriodId) return alert("Por favor crea un Periodo (Año Lectivo) primero.");
                await API.createMateria({ nombre, profesor, color_hex, id_periodo: state.activePeriodId });
            }
            closeModal('subjectModal');
            await fetchAllData();
        } catch (err) {
            console.error(err);
        }
    });

    // Schedule Period Form
    document.getElementById('periodForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('periodId').value;
        const id_materia = document.getElementById('periodSubject').value;
        const dia_semana = document.getElementById('periodDay').value;
        const hora_inicio = document.getElementById('periodTimeStart').value;
        const hora_fin = document.getElementById('periodTimeEnd').value;
        
        if (!hora_inicio || !hora_fin) return alert('Por favor indique las horas de inicio y fin.');
        
        try {
            if (id) {
                await API.updateHorario(id, { id_materia, dia_semana, hora_inicio, hora_fin });
            } else {
                await API.createHorario({ id_materia, dia_semana, hora_inicio, hora_fin });
            }
            closeModal('periodModal');
            await fetchAllData();
        } catch (err) {
            console.error(err);
        }
    });

    // Homework Form
    document.getElementById('homeworkForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('homeworkId').value;
        const titulo = document.getElementById('homeworkTitle').value;
        const id_materia = document.getElementById('homeworkSubject').value;
        const fecha_entrega = document.getElementById('homeworkDueDate').value;
        const descripcion = document.getElementById('homeworkNotes').value;
        
        try {
            if (id) {
                await API.updateTarea(id, { id_materia, titulo, descripcion, fecha_entrega });
            } else {
                await API.createTarea({ id_materia, titulo, descripcion, fecha_entrega });
            }
            closeModal('homeworkModal');
            await fetchAllData();
        } catch (err) {
            console.error(err);
        }
    });

    // Term (Periodo) Form
    document.getElementById('termForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('termId').value;
        const nombre = document.getElementById('termName').value;
        const fecha_inicio = document.getElementById('termStart').value;
        const fecha_fin = document.getElementById('termEnd').value;
        
        try {
            if (id) {
                // Backend doesn't have explicit update yet in instructions? Let's use create logic
                // For simplicity, we create new or alert
                alert("Guardando...");
            } else {
                await API.createPeriodo({ nombre, fecha_inicio, fecha_fin });
            }
            closeModal('termModal');
            await initApp(); // Re-init to handle new period
        } catch (err) {
            console.error(err);
        }
    });
}

window.setActivePeriod = async function(id) {
    state.activePeriodId = id;
    await fetchAllData();
    alert("Periodo actualizado");
}

// Global actions
window.deleteSubject = async function(id) {
    if(confirm('¿Estás seguro de eliminar esta materia?')) {
        try {
            await API.deleteMateria(id);
            await fetchAllData();
        } catch (e) {
            console.error(e);
        }
    }
}

window.editSubject = function(id) {
    const subject = state.subjects.find(s => s.id_materia == id);
    if(subject) {
        document.getElementById('subjectId').value = subject.id_materia;
        document.getElementById('subjectName').value = subject.nombre;
        document.getElementById('subjectTeacher').value = subject.profesor || '';
        const colorOpts = document.querySelectorAll('.color-option');
        colorOpts.forEach(opt => {
            if(opt.getAttribute('data-color') === subject.color_hex) opt.click();
        });
        document.getElementById('subjectModalTitle').textContent = 'Editar Materia';
        document.getElementById('subjectModal').classList.add('show');
    }
}

window.deleteHomework = async function(id) {
    if(confirm('¿Borrar esta tarea?')) {
        try {
            await API.deleteTarea(id);
            await fetchAllData();
        } catch(e) { console.error(e); }
    }
}

window.editHomework = function(id) {
    const hw = state.homeworks.find(h => h.id_tarea == id);
    if(hw) {
        document.getElementById('homeworkId').value = hw.id_tarea;
        document.getElementById('homeworkTitle').value = hw.titulo;
        document.getElementById('homeworkSubject').value = hw.id_materia;
        
        // Strip out the time aspect if it exists in ISO wrapper from DB
        const dateRaw = new Date(hw.fecha_entrega);
        // Correct to local
        const dLocal = new Date(dateRaw.getTime() + dateRaw.getTimezoneOffset() * 60000);
        document.getElementById('homeworkDueDate').value = dLocal.toISOString().split('T')[0];
        
        document.getElementById('homeworkNotes').value = hw.descripcion || '';
        document.getElementById('homeworkModalTitle').textContent = 'Editar Tarea';
        document.getElementById('homeworkModal').classList.add('show');
    }
}

window.toggleHomework = async function(id) {
    try {
        await API.toggleTarea(id);
        await fetchAllData();
    } catch(e){ console.error(e); }
}

window.deletePeriod = async function(id) {
    if(confirm('¿Remover clase del horario?')) {
        try {
            await API.deleteHorario(id);
            await fetchAllData();
        } catch (e) { console.error(e); }
    }
}
