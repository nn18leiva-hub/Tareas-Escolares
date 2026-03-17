// Component Rendering Engine

const COLORS = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#9b59b6', '#ff6b81'];

const Renderer = {
    // Utility to get subject details based on id
    getSubject: function(id_materia) {
        const sub = state.subjects.find(s => s.id_materia == id_materia);
        if(!sub) return { nombre: 'Desconocida', color_hex: '#636e72', profesor: '' };
        // Assign deterministic color based on id if backend didn't save it
        if(!sub.color_hex) sub.color_hex = COLORS[sub.id_materia % COLORS.length];
        return sub;
    },

    // Render Dashboard
    renderDashboard: function() {
        // Update Stats
        document.getElementById('stat-subjects').textContent = state.subjects.length;
        
        const pendingHw = state.homeworks.filter(h => h.estado !== 'completada').length;
        document.getElementById('stat-homeworks').textContent = pendingHw;

        // Today's classes
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const todayName = days[new Date().getDay()];
        const todaysClasses = state.schedule.filter(s => s.dia_semana === todayName);
        document.getElementById('stat-classes').textContent = todaysClasses.length;

        // Upcoming Homework Widget
        const upcomingContainer = document.getElementById('upcoming-homework-list');
        const upcoming = state.homeworks
            .filter(h => h.estado !== 'completada')
            .sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega))
            .slice(0, 4);

        if (upcoming.length === 0) {
            upcomingContainer.innerHTML = '<p class="empty-state">No hay tareas próximas. ¡Excelente trabajo!</p>';
        } else {
            let html = '<div class="list-layout">';
            upcoming.forEach(hw => {
                const sub = this.getSubject(hw.id_materia);
                const isLate = hw.estado === 'vencida' || new Date(hw.fecha_entrega) < new Date(new Date().setHours(0,0,0,0));
                html += `
                    <div class="homework-item glass-panel" style="padding: 10px; margin-bottom: 8px;">
                        <div class="hw-content">
                            <div class="hw-title" style="font-size: 14px;">${hw.titulo}</div>
                            <div class="hw-meta">
                                <span class="hw-tag" style="background: ${sub.color_hex}; padding: 2px 6px; font-size: 10px;">${sub.nombre}</span>
                                <span style="color: ${isLate ? 'var(--danger)' : 'var(--text-muted)'}">
                                    <i class='bx bx-calendar'></i> ${formatDate(hw.fecha_entrega)}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            upcomingContainer.innerHTML = html;
        }

        // Today's Schedule Widget
        const todayContainer = document.getElementById('today-schedule-list');
        if (todaysClasses.length === 0) {
            todayContainer.innerHTML = '<p class="empty-state">No hay clases programadas para hoy.</p>';
        } else {
            let html = '<div class="list-layout">';
            todaysClasses.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)).forEach(c => {
                 const sub = this.getSubject(c.id_materia);
                 html += `
                    <div class="homework-item glass-panel" style="padding: 10px; margin-bottom: 8px; border-left: 4px solid ${sub.color_hex}">
                        <div class="hw-content">
                            <div class="hw-title" style="font-size: 15px;">${sub.nombre}</div>
                            <div class="hw-meta">
                                <span><i class='bx bx-time-five'></i> ${formatTime(c.hora_inicio)} - ${formatTime(c.hora_fin)}</span>
                            </div>
                        </div>
                    </div>
                 `;
            });
            html += '</div>';
            todayContainer.innerHTML = html;
        }
    },

    // Render Subjects
    renderSubjects: function() {
        const container = document.getElementById('subjects-container');
        if (state.subjects.length === 0) {
            container.innerHTML = `
                <div class="empty-container">
                    <i class='bx bx-book-add'></i>
                    <p>Aún no has añadido ninguna materia.</p>
                </div>`;
            return;
        }

        let html = '';
        state.subjects.forEach(sub => {
            html += `
                <div class="subject-card glass-panel" style="--card-color: ${sub.color_hex}">
                    <div class="subject-actions">
                        <button class="action-btn edit" onclick="editSubject(${sub.id_materia})"><i class='bx bx-edit'></i></button>
                        <button class="action-btn delete" onclick="deleteSubject(${sub.id_materia})"><i class='bx bx-trash'></i></button>
                    </div>
                    <div class="subject-title">${sub.nombre}</div>
                    <div class="subject-teacher">
                        <i class='bx bx-user'></i> ${sub.profesor || 'Sin profesor asignado'}
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    // Render Homework
    renderHomeworks: function() {
        const container = document.getElementById('homework-container');
        const filter = window.currentHomeworkFilter || 'all';
        
        let filtered = state.homeworks;
        if (filter === 'pending') filtered = state.homeworks.filter(h => h.estado !== 'completada');
        if (filter === 'completed') filtered = state.homeworks.filter(h => h.estado === 'completada');

        // Sort by due date
        filtered.sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega));

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-container">
                    <i class='bx bx-task-x'></i>
                    <p>No se encontraron tareas.</p>
                </div>`;
            return;
        }

        let html = '';
        filtered.forEach(hw => {
            const sub = this.getSubject(hw.id_materia);
            const isCompleted = hw.estado === 'completada';
            const isLate = !isCompleted && new Date(hw.fecha_entrega) < new Date(new Date().setHours(0,0,0,0));
            
            html += `
                <div class="homework-item glass-panel ${isCompleted ? 'hw-item-completed' : ''}">
                    <div class="hw-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleHomework(${hw.id_tarea})">
                        <i class='bx bx-check'></i>
                    </div>
                    <div class="hw-content">
                        <div class="hw-title">${hw.titulo}</div>
                        <div class="hw-meta">
                            <span class="hw-tag" style="background: ${sub.color_hex}">${sub.nombre}</span>
                            <span style="color: ${isLate ? 'var(--danger)' : 'inherit'}">
                                <i class='bx bx-calendar'></i> ${formatDate(hw.fecha_entrega)} ${isLate ? '(Vencida)' : ''}
                            </span>
                        </div>
                        ${hw.descripcion ? `<div style="font-size: 12px; color: var(--text-muted); margin-top: 5px;">${hw.descripcion}</div>` : ''}
                    </div>
                    <div class="subject-actions" style="opacity: 1; position: static;">
                        <button class="action-btn edit" onclick="editHomework(${hw.id_tarea})" style="margin-right: 5px;">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteHomework(${hw.id_tarea})">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    // Render Schedule
    renderSchedule: function() {
        const tbody = document.getElementById('schedule-body');
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        
        // Find unique start times
        const times = [...new Set(state.schedule.map(s => s.hora_inicio.substring(0, 5)))].sort();
        
        if (times.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No hay clases programadas. ¡Añade un periodo!</td></tr>`;
            return;
        }

        let html = '';
        times.forEach(time => {
            html += `<tr><td class="time-col">${formatTime(time)}</td>`;
            
            days.forEach(day => {
                const classes = state.schedule.filter(s => s.hora_inicio.substring(0, 5) === time && s.dia_semana === day);
                html += `<td>`;
                if(classes.length > 0) {
                    classes.forEach(c => {
                        const sub = this.getSubject(c.id_materia);
                        html += `
                            <div class="schedule-cell" style="background: ${sub.color_hex}">
                                <button class="delete-period" onclick="deleteScheduleEntry(${c.id_horario})"><i class='bx bx-x'></i></button>
                                <div class="schedule-subject">${sub.nombre}</div>
                                <div class="schedule-room">${formatTime(c.hora_inicio)} - ${formatTime(c.hora_fin)}</div>
                            </div>
                        `;
                    });
                }
                html += `</td>`;
            });
            html += `</tr>`;
        });
        tbody.innerHTML = html;
    },

    // Render Periods
    renderPeriods: function() {
        const container = document.getElementById('periods-container');
        if (!state.periods || state.periods.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay periodos. Añade uno para organizar tus materias.</p>';
            return;
        }

        let html = '';
        state.periods.forEach(p => {
            const id = p.id_periodo || p.id;
            const isActive = state.activePeriodId == id;
            html += `
                <div class="subject-card glass-panel ${isActive ? 'active-period' : ''}" style="--card-color: ${isActive ? 'var(--primary)' : '#636e72'}">
                    <div class="subject-actions">
                        <button class="action-btn delete" onclick="deletePeriodoActual(${id})"><i class='bx bx-trash'></i></button>
                    </div>
                    <div class="subject-title">${p.nombre}</div>
                    <div class="subject-teacher">
                        <i class='bx bx-calendar'></i> ${formatDate(p.fecha_inicio)} - ${formatDate(p.fecha_fin)}
                    </div>
                    <button class="primary-btn full-width" style="margin-top: 15px; font-size: 12px; border: none; background: ${isActive ? 'var(--primary)' : '#636e72'}" 
                            onclick="setActivePeriod(${id})" ${isActive ? 'disabled' : ''}>
                        ${isActive ? 'Seleccionado' : 'Activar Periodo'}
                    </button>
                </div>
            `;
        });
        container.innerHTML = html;
    }
};

// CSS for Active Period
const style = document.createElement('style');
style.textContent = `
    .active-period { border: 2px solid var(--primary) !important; transform: scale(1.02); }
`;
document.head.appendChild(style);

// Utilities
function formatDate(dateStr) {
    if(!dateStr) return '';
    const d = new Date(dateStr);
    const dLocal = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    return dLocal.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr) {
    if(!timeStr) return '';
    let [hours, minutes] = timeStr.split(':');
    let ampm = 'AM';
    hours = parseInt(hours);
    if(hours >= 12) {
        ampm = 'PM';
        if(hours > 12) hours -= 12;
    }
    if(hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
}
