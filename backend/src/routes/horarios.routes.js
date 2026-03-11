/*
http://localhost:3000/api/horarios                 metodo: POST nuevo horario
http://localhost:3000/api/horarios/materia/id      metodo: GET consultar materia
http://localhost:3000/api/horarios                 metodo: GET consultar los horarios
http://localhost:3000/api/horarios/id              metodo: PUT actualizar horario
http://localhost:3000/api/horarios/id              metodo: DELETE borrar horario con id
*/

const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/horarios.controller');
// crear un nuevo horario
router.post('/', verificarToken, controller.crearHorario);
//consultar el horario de una materia 
router.get('/materia/:id_materia', verificarToken, controller.obtenerHorariosPorMateria);
// obtener el horario completo
router.get('/', verificarToken, controller.obtenerHorarioCompleto);
router.put('/:id', verificarToken, controller.actualizarHorario);
router.delete('/:id', verificarToken, controller.eliminarHorario);

module.exports = router;
