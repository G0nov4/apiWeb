const express = require('express');
const router = express.Router();

const comentariosController = require('../controllers/Comentarios/comentarios.controller');
const userMiddlewares = require('../middlewares/middlewares')
router.route('/:id/comentarios')
.get(comentariosController.getComentarios)


router.route('/:id/comentarios/crear')
.post(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isCliente,
    comentariosController.createComentario)

router.route('/comentarios/:id')
.delete(comentariosController.deleteComentario)

module.exports = router;