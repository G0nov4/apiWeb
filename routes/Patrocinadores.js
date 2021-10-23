const express = require('express');
const router = express.Router();

const patrocinadoresController = require('../controllers/Patrocinadores/Patrocinadores');
const userMiddlewares = require('../middlewares/middlewares');
const upload = require('../middlewares/storage');



router.route('/patrocinadores')
.get(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    patrocinadoresController.getAllPatroncinadores);

router.route('/patrocinadores/crear')
.post(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    upload.single('logotipo'),
    patrocinadoresController.createPatrocinador)

router.route('/patrocinadores/:id')
.get(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    patrocinadoresController.getPatroncinador)
.put(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    upload.single('logotipo'),
    patrocinadoresController.updatePatrocinador)
.delete(userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    patrocinadoresController.deletePatrocinador)



module.exports = router;