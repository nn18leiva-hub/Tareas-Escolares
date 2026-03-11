const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/tareas.controller');
/*
http://localhost:3000/api/tareas  metodo: POST nueva tarea
http://localhost:3000/api/tareas  metodo: GET listar todas las tareas
http://localhost:3000/api/tareas/id metodo: GET listar 1 tarea
http://localhost:3000/api/tareas/id metodo:PUT actualizar tarea
http://localhost:3000/api/tareas/id/completar metodo: PATCH cambiar estado
*/

//crear una nueva tarea
router.post('/', verificarToken, controller.crearTarea);
//consultar todas las tareas
router.get('/', verificarToken, controller.obtenerTodasLasTareas);
//consultar una tarea segun su id
router.get('/:id', verificarToken, controller.obtenerTareaPorId);
//actualizar un tarea
router.put('/:id', verificarToken, controller.actualizarTarea);
//marcar como completada una tarea
router.patch('/:id/completar', verificarToken, controller.marcarComoCompletada);

router.delete('/:id', verificarToken, controller.eliminarTarea);



router.get('/estado/pendientes', verificarToken, controller.tareasPendientes);
router.get('/estado/vencidas', verificarToken, controller.tareasVencidas);
router.get('/estado/completadas', verificarToken, controller.tareasCompletadas);


module.exports = router;

