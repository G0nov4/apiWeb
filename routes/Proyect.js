const express = require('express');
const router = express.Router();

const userMiddlewares = require('../middlewares/middlewares');
const proyectControllers = require('../controllers/Proyecto/proyect.controller');
const SerProdControllers = require('../controllers/Proyecto/Servicio_Producto/SerProd.controller');
const beneficienciaControllers = require('../controllers/Proyecto/Beneficiencia/Beneficiencia.controller');
const artculControllers = require('../controllers/Proyecto/Artistico_Cultural/ArtCul.controller');
const upload = require('../middlewares/storage')

// http://localhost:3010/api/patrocinadores
router.route('/proyectos')
.get(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    proyectControllers.getProyectos);


router.route('/proyectos/validos')
.get(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    proyectControllers.getProyectosValidados);


router.route('/proyectos/no-validos')
.get(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    proyectControllers.getProyectosNoValidados);




router.route('/proyectos/crear')
.post(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    upload.single('logotipo'),
    proyectControllers.createProyecto);

router.route('/proyectos/crear/serprod')
.post(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    SerProdControllers.createProyectSerProd);

router.route('/proyectos/crear/beneficiencia')
.post(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,  
    beneficienciaControllers.createProyectBeneficiencia);

    router.route('/proyectos/crear/artcul')
.post(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    artculControllers.createProyectArtCul);



router.route('/proyecto/:id')
.get(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    proyectControllers.getProyecto)
.put(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    proyectControllers.updateProyecto)
.delete(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    proyectControllers.deleteProyecto);



router.route('/proyecto/:id/serprod')
.get(
    
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    SerProdControllers.getSerProd);

router.route('/proyecto/:id/beneficiencia')
.get(

    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    beneficienciaControllers.getBeneficiencia)

router.route('/proyecto/:id/artcul')
.get(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isGerente,
    artculControllers.getArtCul)

router.route('/proyecto/validate/:id')
.put(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    proyectControllers.validateProyect)


module.exports = router;