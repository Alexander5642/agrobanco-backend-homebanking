const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactoController');

router.post('/', controller.crearContacto);
router.get('/', controller.obtenerContactos);

module.exports = router;
