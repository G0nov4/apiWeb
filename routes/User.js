const express = require("express");
const router = express.Router();

const userController = require('../controllers/Usuarios/user.controller');
const userMiddlewares = require('../middlewares/middlewares');


// Listar usuarios CLIENTE
router.route('/users/cliente').
get(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    userController.listUsersClient)

// ELiminar Usuario CLIENTE
router.route('/users/cliente/:id')
.delete(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    userController.deleteUser)

// Listar usuarios GERENCIALES
router.route('/users/gerencial').
get(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    userController.listUsersGerencial)

// Crear usuarios Gerenciales
router.route('/users/gerencial/crear')
.post(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    userController.createUserGerencial)

// OPpciones de usuarios GERENCIALES
router.route('/users/gerencial/:id')
.get(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    userController.getGerencial)
.put(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    userController.updateGerencial)
.delete(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    userController.deleteGerencial)

// REGISTER
router.route('/registro')
.post(
    userMiddlewares.validarRegistro,
    userController.createUserCliente
)

// LOGIN
router.route('/ingreso')
.post(userController.Ingreso)


module.exports = router;