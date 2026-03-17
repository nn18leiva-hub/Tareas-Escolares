/* API Utility functions to connect with the backend */
const API_URL = 'http://localhost:3000/api';

const API = {
    // --- Auth ---
    token: localStorage.getItem('stuplan_token'),
    
    setToken(token) {
        this.token = token;
        localStorage.setItem('stuplan_token', token);
    },
    
    logout() {
        this.token = null;
        localStorage.removeItem('stuplan_token');
    },

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    },

    async request(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: this.getHeaders()
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);
            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Unauthorized
                    API.logout();
                    window.location.reload();
                }
                throw new Error(data.message || data.msg || 'API Error');
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            alert(`Error: ${error.message}`);
            throw error;
        }
    },

    // --- Authentication ---
    async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Error de inicio de sesión');
        this.setToken(data.token);
        // Save user name so we can render it
        if(data.usuario && data.usuario.nombre) {
            localStorage.setItem('stuplan_username', data.usuario.nombre);
        }
        return data; 
    },

    async register(name, email, password) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: name, correo: email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Error de registro');
        return data;
    },

    // --- Periodos ---
    async getPeriodos() { return this.request('/periodos'); },
    async createPeriodo(data) { return this.request('/periodos', 'POST', data); },

    // --- Materias ---
    async getMaterias() { return this.request('/materias'); },
    async createMateria(data) { return this.request('/materias', 'POST', data); },
    async updateMateria(id, data) { return this.request(`/materias/${id}`, 'PUT', data); },
    async deleteMateria(id) { return this.request(`/materias/${id}`, 'DELETE'); },

    // --- Horarios ---
    async getHorarios() { return this.request('/horarios'); },
    async createHorario(data) { return this.request('/horarios', 'POST', data); },
    async updateHorario(id, data) { return this.request(`/horarios/${id}`, 'PUT', data); },
    async deleteHorario(id) { return this.request(`/horarios/${id}`, 'DELETE'); },

    // --- Tareas ---
    async getTareas() { return this.request('/tareas'); },
    async getTareasPendientes() { return this.request('/tareas/estado/pendientes'); },
    async getTareasCompletadas() { return this.request('/tareas/estado/completadas'); },
    async createTarea(data) { return this.request('/tareas', 'POST', data); },
    async updateTarea(id, data) { return this.request(`/tareas/${id}`, 'PUT', data); },
    async toggleTarea(id) { return this.request(`/tareas/${id}/completar`, 'PATCH'); },
    async deleteTarea(id) { return this.request(`/tareas/${id}`, 'DELETE'); }
};
